//set up server
//import necessary packages

const express = require('express');
const app = express();

const dataURL = '../data/product_pricing/complete_pricing.csv';
const fs = require('fs');
const complete_csv = fs.readFileSync(dataURL).toString();

const tf = require('@tensorflow/tfjs');
const use = require('@tensorflow-models/universal-sentence-encoder');

const pg = require('pg')
const pgvector = require('pgvector/pg')
const {Client} = pg;

//honestly just for me to remember each store's addresses
const locToAddress = {
    'harristeeter': ['975 Emmet St N'],
    'kroger': ['1152 Emmet St N', '1904 Emmet St N'],
    'traderjoes': ['2025 Bond St']
}

const store_dict = ['kroger', 'harristeeter', 'traderjoes']

let data = [];
let embeddings = [];
let model;


//set up database, data
async function database_setup() {
    console.log('Loading model...')
    model = await loadModel()
    console.log('Successfully loaded model')

    let client = new Client({
        user: 'postgres',
        password: '01B3nya30',
        port: '5432'
    })
    await client.connect();
    console.log('Connected to database')

    console.log(`Retrieving table...`)
    let temp = await client.query(`select * from product_pricing order by item_id asc`);
    let table = temp.rows
    //table[i] = {item_id: __, item_store: __, ...}
    for(let i = 0; i < table.length; i++){
        console.log(i, table[i].item_id, table[i].item_name)
        data.push(table[i])
        embeddings.push(JSON.parse(table[i].item_embedding))
    }

    console.log("Successfully loaded data:", data.length, embeddings.length)
    console.log(embeddings[0])
    await client.end();
}



//filter by store selection, default to automation
function store_filter(stores, tempData){
    if(stores.filter((store) => store).length === 0){
        console.log("stores is null", stores.filter((store) => store))
        return tempData
    }

    var temp = []
    for(let i = 0; i < stores.length; i++){
        if(stores[i]){
            temp.push(tempData.filter((item) => item.item_store === store_dict[i]))
        }
    }
    return temp.flat()
}

//load NLP model
async function loadModel(){
    await tf.ready();
    let tempModel = await use.load()
    return tempModel;
}

//compare two vector embeddings
function cosine_similarity(sentence_a, sentence_b){
    let dot_product = tf.sum(tf.mul(sentence_a,sentence_b)).dataSync()[0];
    let mag_a = tf.sqrt(tf.sum(tf.square(sentence_a))).dataSync()[0]
    let mag_b = tf.sqrt(tf.sum(tf.square(sentence_b))).dataSync()[0]
    return dot_product / (mag_a * mag_b)
}

// 1. embed user input
// 2. extract data from product_pricing.db
// 3. create and sort list of cosine similarities, tracking the index of each entry
// 4. filter out top 50-100 cosine similarities, then top 25 in lowest prices
async function search_filter(input, embedding_list, tempData, numResults){
    console.log("data first val", tempData.length, embedding_list.length)
    console.log('search input', input)

    let embed_comparison = []
    let input_embedding = await model.embed(input)

    //let test_embedding = await model.embed('Simple TruthÂ® All Natural Boneless Skinless Fresh Chicken Breast')
    //console.log("server", test_embedding.arraySync()[0])
    //console.log("chicken breast", input_embedding.arraySync()[0])

    console.log(tempData.length)
    for(let i = 0; i < tempData.length - 1; i++){
        csim = cosine_similarity(input_embedding, embedding_list[tempData[i].item_id - 1])
        if(tempData[i].item_name.toLowerCase().indexOf(input) >= 0){
            csim += 0.9
        }
        embed_comparison.push([csim, tempData[i].item_id]) 
    }

    embed_comparison = embed_comparison.sort((a, b) => a[0] - b[0])
    embed_comparison.reverse()

    let temp = embed_comparison.filter(item => item[0] >= 0.5).slice(0, numResults)

    let result = []
    for(let j = 0; j < numResults; j++){
        result.push(data[temp[j][1] - 1]) //embeddings load in item_id i + 1 at index i -- everything is shifted over by one
        console.log(temp[j][0], tempData[temp[j][1]].item_name)
    }
    console.log("best match", embed_comparison[0])
    console.log('full list', temp)

    return result;

    /*console.log(lines[0][2])
        temp = keywords.trim().split(',')
        let inventory_similarities = []
        for(let i = 0; i < temp.length; i++){
            inventory_similarities = 
            lines = lines.filter((item) => item[2] && item[2].toLowerCase().includes(temp[i]))
        }*/
}



//process all the data from post request
async function process_data(kroger, harristeeter, traderjoes, keywords=null) {
    var res = []
    var tempRes = []
    console.log("data!!", data.length)
    
    let lines = await store_filter([kroger, harristeeter, traderjoes], data)
    console.log(lines.length)

    if(keywords){
        lines = await search_filter(keywords, embeddings, lines, 7)
        console.log('filter', lines.length)
    }

    for(let i = 0; i < lines.length; i++){
        let temp = lines[i]
        let obj = {
            'store' : temp.item_store,
            'name' : temp.item_name,
            'price' : temp.item_price,
            'perUnit' : temp.item_perunit
        }
        if(obj.name !== 'item'){
            tempRes.push(obj)
        }
    }

    tempRes.sort((a, b) => Number(a.price) - Number(b.price))
    res = {
        'title': 'Top results',
        'items': tempRes
    }
    console.log('wait for me you bitch!')
    return res
}



app.get('/api', async (req, res) => {
    console.log(req.headers)

    let results = await process_data(req.headers.kroger === 'true', req.headers.harristeeter === 'true', req.headers.traderjoes === 'true', req.headers.keywords)
    
    console.log(results)
    res.json({'data': [results]})
    console.log(`Data has been sent!`)
    /*new Promise((resolve, reject) => {
        process_data(req.headers.kroger === 'true', req.headers.harristeeter === 'true', req.headers.traderjoes === 'true', req.headers.keywords)
        .then((result) => {
        console.log(`Data has been sent!`)

        res.json({'data': result});
    })})*/
});

app.listen(5000, () => {
    console.log(`Server listening on port 5000`)

    console.log(`Warning: Make sure all csv and database entries are cleaned for unexpected white space, new lines, and characters`)
    database_setup();
});