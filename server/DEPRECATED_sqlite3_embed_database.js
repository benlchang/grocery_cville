const tf = require('@tensorflow/tfjs');
const use = require('@tensorflow-models/universal-sentence-encoder');
const sqlite3 = require('sqlite3').verbose();



const db = new sqlite3.Database('../data/product_pricing.db', (err) => {
    if(err){
        console.log(`Failed to connect to database`)
        return;
    }
    console.log(`Successfully connected to database`)
})

async function update_embedding(model, names, index){
    let new_embedding = await model.embed(names[index][1])
    await new Promise((resolve, reject) => {
        let to_insert = JSON.stringify(new_embedding.arraySync()[0])
        db.run(`UPDATE product_pricing SET embedding = '${to_insert}' WHERE id = ${names[index][0]}`, [], (err)=>{
            if(err){
                console.log(`Failed to insert embeddings`)
                reject(err)
            }
            resolve();
        })
    })
}

async function retrieve_names() {
    let names = []
    db.all(`SELECT id, name FROM product_pricing`, [], (err, rows) => {
        if(err){
            console.log(`Failed to retrieve name data`)
            return;
        }
        rows.forEach((row) => {
            names.push([row.id, row.name])
        })
    })
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`Names retrieved...`, names.length)
            resolve(names);
        }, 500)
    })
}

async function update_embeddings(model) {
    let names = await retrieve_names()

    console.log(`I didn't wait`, names.length)
    for(let i = 0; i < names.length; i++){
        await update_embedding(model, names, i)
    }

    console.log(`Successfully updated database!`)
}

async function test() {
    await tf.ready()
    let model = await use.load()

    await update_embeddings(model)
    
}

test()