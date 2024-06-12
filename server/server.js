const express = require('express');
const app = express();

const dataURL = '../data/product_pricing/complete_pricing.csv';
const fs = require('fs');
const complete_csv = fs.readFileSync(dataURL).toString();

const tf = require('@tensorflow/tfjs');
const use = require('@tensorflow-models/universal-sentence-encoder');
const sqlite3 = require('sqlite3').verbose();

const locToAddress = {
    'harristeeter': ['975 Emmet St N'],
    'kroger': ['1152 Emmet St N', '1904 Emmet St N'],
    'traderjoes': ['2025 Bond St']
}

async function loadModel(){
    await tf.ready();
    const model = await use.load()
    return model;
}

function cosine_similarity(sentence_a, sentence_b){
    dot_product = tf.sum(tf.mul(sentence_a,sentence_b));
    console.log(dot_product)
    mag_a = tf.sqrt(tf.sum(tf.square(sentence_a)))
    mag_b = tf.sqrt(tf.sum(tf.square(sentence_b)))
    return dot_product / mag_a * mag_b
}





//set up database as soon as the server's set up
let db;
let embeddings = [], data = [];

async function process_data(kroger, harristeeter, traderjoes, keywords=null) {

    let lines = data;
    var res = []
    var tempRes = []
    console.log(data[0])
    
    if(kroger || harristeeter || traderjoes){
        var temp = []
        if(kroger){
            temp.push(lines.filter((item) => item.store === "kroger"))
        }
        if(harristeeter){
            temp.push(lines.filter((item) => item.store === "harristeeter"))
        }
        if(traderjoes){
            temp.push(lines.filter((item) => item.store === "traderjoes"))
        }
        lines = temp.flat()
    }
    if(keywords){
        // 1. embed user input
        // 2. extract data from product_pricing.db
        // 3. create and sort list of cosine similarities, tracking the index of each entry
        // 4. filter out top 50-100 cosine similarities, then top 25 in lowest prices
        let model = await loadModel();

        let embed_comparison = []
        let input_embedding = await model.embed(keywords)
        for(let i = 0; i < lines.length; i++){
            embed_comparison.push([cosine_similarity(input_embedding, embeddings[i]), lines[i].id])
        }

        embed_comparison = embed_comparison.sort((a, b) => a[0] - b[0])
        let temp = []
        for(let j = 0; j < embed_comparison.length; j++){
            temp.push(lines[embed_comparison[j][1]])
        }

        lines = temp.slice(0, 20);

        /*console.log(lines[0][2])
        temp = keywords.trim().split(',')
        let inventory_similarities = []
        for(let i = 0; i < temp.length; i++){
            inventory_similarities = 
            lines = lines.filter((item) => item[2] && item[2].toLowerCase().includes(temp[i]))
        }*/
        console.log('filter' + lines.length)
    }

    for(let i = 0; i < lines.length; i++){
        console.log(lines[i].name, lines[i].id)
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
    res = [{
        'title': 'Top results',
        'items': tempRes
    }]
    return res
}

app.get('/api', (req, res) => {
    console.log(req.headers)
    let complete_product_pricing = process_data(req.headers.kroger === 'true', req.headers.harristeeter === 'true', 
                                                req.headers.traderjoes === 'true', req.headers.keywords)
    res.json({'data': complete_product_pricing});
});

app.listen(5000, () => {
    console.log(`Server listening on port 5000`)
    db = new sqlite3.Database('../data/product_pricing.db', (err) => {
        if(err){
            throw err;
        }
        console.log("Successfully connected to database");
    });
    
    let sql = 'SELECT id, store, location, name, embedding, price FROM product_pricing';
    db.all(sql, [], (err, rows) => {
        if(err){
            throw err;
        }
        console.log(rows.length)
        rows.forEach((row) => {
            let embedVector = JSON.parse(row.embedding)
            embeddings.push(embedVector)
            data.push(row)
        })
    
    });
});