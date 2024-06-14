//set up server
//import necessary packages

const express = require('express');
const app = express();

const dataURL = '../data/product_pricing/complete_pricing.csv';
const fs = require('fs');
const complete_csv = fs.readFileSync(dataURL).toString();

const tf = require('@tensorflow/tfjs');
const use = require('@tensorflow-models/universal-sentence-encoder');
const sqlite3 = require('sqlite3').verbose();

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
    let tempData = [], tempEmbeddings = [];
    let db = new sqlite3.Database('../data/product_pricing.db', (err) => {
        if(err){
            throw err;
        }
        console.log("Successfully connected to database");
    });

    model = await loadModel();
    
    let sql = 'SELECT id, store, location, name, embedding, price FROM product_pricing';
    db.all(sql, [], (err, rows) => {
        if(err){
            throw err;
        }
        console.log("rows", rows.length)
        rows.forEach(async (row) => {
            let embedVector = JSON.parse(row.embedding)
            tempEmbeddings.push(embedVector)
            if(row.name === 'Heritage Farm Fresh Chicken Leg Quarters'){
                console.log(embedVector, row.id)
            }
            tempData.push(row)
        })
        console.log("tempData", tempData.length)
        data = tempData
        embeddings = tempEmbeddings
    });

    db.close()
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
            temp.push(tempData.filter((item) => item.store === store_dict[i]))
        }
    }
    return temp.flat()
}

//load NLP model
async function loadModel(){
    await tf.ready();
    const model = await use.load()
    return model;
}

//compare two vector embeddings
function cosine_similarity(sentence_a, sentence_b){
    let dot_product = tf.sum(tf.mul(sentence_a,sentence_b)).dataSync()[0];
    let mag_a = tf.sqrt(tf.sum(tf.square(sentence_a))).dataSync()[0]
    let mag_b = tf.sqrt(tf.sum(tf.square(sentence_b))).dataSync()[0]
    return dot_product / (mag_a * mag_b)
}

function new_cosine_similarity(sentence_a, sentence_b){
    let dot_product = 0
    for(let i = 0; i < sentence_a.length; i++){
        dot_product += sentence_a[i] * sentence_b[i]
    }
    return dot_product
}

// 1. embed user input
// 2. extract data from product_pricing.db
// 3. create and sort list of cosine similarities, tracking the index of each entry
// 4. filter out top 50-100 cosine similarities, then top 25 in lowest prices
async function search_filter(input, embedding_list, data, numResults){
    console.log("data first val", data.length, embedding_list.length)
    console.log('search input', input)

    let model = await loadModel()
    let embed_comparison = []
    let input_embedding = await model.embed(input)

    //let test_embedding = await model.embed('Simple TruthÂ® All Natural Boneless Skinless Fresh Chicken Breast')
    let test_embedding = await model.embed('Spaghetti')
    //console.log("server", test_embedding.arraySync()[0])
    //console.log("chicken breast", input_embedding.arraySync()[0])
    console.log(cosine_similarity(input_embedding, test_embedding))

    for(let i = 0; i < data.length; i++){
        csim = cosine_similarity(input_embedding, embedding_list[data[i].id])
        if(data[i].name.toLowerCase().indexOf(input) >= 0){
            csim += 0.7
        }
        embed_comparison.push([csim, data[i].id])
    }

    embed_comparison = embed_comparison.sort((a, b) => a[0] - b[0])
    embed_comparison.reverse()

    let temp = embed_comparison.filter(item => item[0] >= 0.5).slice(0, numResults)

    let result = []
    for(let j = 0; j < numResults; j++){
        result.push(data[temp[j][1]])
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
        lines = await search_filter(keywords, embeddings, lines, 20)
        console.log('filter', lines.length)
    }

    for(let i = 0; i < lines.length; i++){
        let temp = lines[i]
        let obj = {
            'store' : temp.store,
            'address': temp.location,
            'name' : temp.name,
            'price' : temp.price
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
    
    console.log(results.items.length)
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

    database_setup();
});