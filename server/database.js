//populate a database with csv file info
const dataURL = '../data/product_pricing/complete_pricing.csv';
const fs = require('fs');

const complete_csv = fs.readFileSync(dataURL).toString().split('\n');


const tf = require('@tensorflow/tfjs');
const use = require('@tensorflow-models/universal-sentence-encoder');

const pg = require('pg');
const pgvector = require('pgvector/pg');
const {Client} = pg;

async function print(){
    console.log('statement')
    await runEverything()
}

async function runEverything() {
    const client = new Client({
        user: 'postgres',
        password: '01B3nya30',
        port: '5432'
    });

    await client.connect();
    console.log('Client connected...');
    
    /*await client.query(`CREATE EXTENSION IF NOT EXISTS vector`)
        .then(() => { console.log('Extension created...')});

    await pgvector.registerType(client)
        .then(() => {console.log('Client registered...')});
    

    
    await client.query(`CREATE TABLE IF NOT EXISTS product_pricing (
        item_id INTEGER PRIMARY KEY,
        item_store VARCHAR(255),
        item_name VARCHAR(255),
        item_embedding vector,
        item_price FLOAT,
        item_perUnit VARCHAR(255)
        `);*/

    await tf.ready()
    let model = await use.load();
    console.log('Model loaded...')
    let nameEncodings = []

    for(let i = 1; i < 2; i++){
        let line = complete_csv[i].split(',')
        let temp = await model.embed(line[2])
        let newName = await temp.array()
        console.log(newName[0])
        await client.query(`INSERT INTO product_pricing (item_id, item_store, item_name, item_embedding, item_price, item_perunit) 
                            VALUES ($1, $2, $3, $4, $5, $6)`, [i, line[0], line[2], `[${newName[0]}]`, line[3], line[4]])
        console.log('Embedded', i)
    }

    await client.end()
    return nameEncodings
}

//let nameEncodings = runEverything();
print();