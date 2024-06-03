const express = require('express');
const app = express();

const dataURL = '../data/product_pricing/complete_pricing.csv';
const fs = require('fs');
const complete_csv = fs.readFileSync(dataURL).toString();

const locToAddress = {
    'harristeeter': ['975 Emmet St N'],
    'kroger': ['1152 Emmet St N', '1904 Emmet St N'],
    'traderjoes': ['2025 Bond St']
}

function csv_to_json(csv, kroger, harristeeter, traderjoes, keywords=null) {
    let lines = csv.split('\n')
    var res = []

    lines = lines.map((item) => item.split(','))
    
    console.log(lines[0])
    console.log(kroger, harristeeter, traderjoes)
    console.log(typeof(kroger))
    if(kroger || harristeeter || traderjoes){
        var temp = []
        if(kroger){
            temp.push(lines.filter((item) => item[0] === "kroger"))
        }
        if(harristeeter){
            temp.push(lines.filter((item) => item[0] === "harristeeter"))
        }
        if(traderjoes){
            temp.push(lines.filter((item) => item[0] === "traderjoes"))
        }
        lines = temp.flat()
    }
    if(keywords){
        console.log(lines[0][2])
        temp = keywords.trim().split(',')
        for(let i = 0; i < temp.length; i++){
            lines = lines.filter((item) => item[2] && item[2].toLowerCase().includes(temp[i]))
        }
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
    let complete_product_pricing = csv_to_json(complete_csv, req.headers.kroger === 'true', req.headers.harristeeter === 'true', 
                                                req.headers.traderjoes === 'true', req.headers.keywords)
    res.json({'data': complete_product_pricing});
});

app.listen(5000, () => {
    console.log(`Server listening on port 5000`)
});