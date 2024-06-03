const express = require('express');
const app = express();

const dataURL = '../data/product_pricing/complete_pricing.csv';
const fs = require('fs');
const complete_csv = fs.readFileSync(dataURL).toString();

function csv_to_json(csv, location=null, filter=null) {
    var lines = csv.split('\n')
    const res = []

    lines = lines.map((item) => item.split(','))
    
    console.log(lines[1])
    if(location){
        lines = lines.filter(item => item[1] && item[1] == (location))
        console.log('location', lines.length)
    }
    if(filter){
        lines = lines.filter((item) => item[2] && item[2].toLowerCase().includes(filter))
        console.log('filter' + lines.length)
    }

    for(let i = 0; i < lines.length; i++){
        let temp = lines[i]
        let obj = {
            'store' : temp[0],
            'address': temp[1],
            'name' : temp[2],
            'price' : temp[3]
        }
        if(obj.name !== 'item'){
            res.push(obj)
        }
    }
    console.log(res)
    return res
}

app.get('/api', (req, res) => {
    console.log(req.headers)
    let complete_product_pricing = csv_to_json(complete_csv, req.headers.address, req.headers.keywords)
    res.json({'data': complete_product_pricing});
});

app.listen(5000, () => {
    console.log(`Server listening on port 5000`)
});