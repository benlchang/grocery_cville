//populate a database with csv file info
const completeURL = '../data/product_pricing/complete_pricing.csv';
const fs = require('fs');

//const complete_csv = fs.readFileSync(completeURL).toString().split('\n');
//const startID = 2447;


const tf = require('@tensorflow/tfjs');
const use = require('@tensorflow-models/universal-sentence-encoder');

const pg = require('pg');
const pgvector = require('pgvector/pg');
const {Client} = pg;

async function processData(){
    console.log('Entering your data into Postgres')
    await runEverything()
}

async function runEverything() {
    const import_csv = fs.readFileSync('../data/product_pricing/import.csv').toString().split('\n');
    const client = new Client({
        user: 'postgres',
        password: '01B3nya30',
        port: '5432'
    });

    await client.connect();
    console.log('Client connected...');
    
    /*only necessary to rebuild extension and tables from scratch
    
    await client.query(`CREATE EXTENSION IF NOT EXISTS vector`)
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

    let startID = await client.query('SELECT MAX(item_id) FROM product_pricing')
    console.log('max', startID.rows[0].max)

    await tf.ready()
    let model = await use.load();
    console.log('Model loaded...')
    let nameEncodings = []

    for(let i = 1; i < import_csv.length - 1; i++){
        let line = import_csv[i].split(',')
        let itemName = line[2];
        let itemPrice = line[3], itemPricePer = line[4]
        itemName = itemName.replace('Â', '');
        itemName = itemName.replace('â', '');
        itemName = itemName.replace('„', '');
        itemName = itemName.replace('¢', '');

        let temp = await model.embed(itemName)
        let newName = await temp.array()
        await client.query(`INSERT INTO product_pricing (item_id, item_store, item_name, item_embedding, item_price, item_perunit) 
                            VALUES ($1, $2, $3, $4, $5, $6)`, [i + startID.rows[0].max, line[0], itemName, pgvector.toSql(newName[0]), itemPrice, itemPricePer])
        console.log('Embedded', i)
    }

    await client.end()
    return nameEncodings
}


//let nameEncodings = runEverything();
//processData();

processData();