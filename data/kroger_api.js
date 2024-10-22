//Interact with Kroger API
//Retrieve store location ID based on a reference location
//Retrieve product and pricing data based on item input

//setup request for API token
//TOKEN DIES AFTER 30 MINUTES
const tokenURL = 'https://api.kroger.com/v1/connect/oauth2/token'
const tokenBody = 'grant_type=client_credentials&scope=product.compact'
const creds_64= btoa(client_id + ':' + client_secret)
const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    "Authorization": "Basic " + creds_64
}

let token = '';

//location ID's have been logged
//if you ever need different locations, use zip code and add to promise chain

const locations = {
    'kroger_barracks' : ['kroger', '02900359', '1152 Emmet St N'],
    'harristeeter_barracks' : ['harristeeter', '09700177', '975 Emmet St N'],
    'kroger_hydraulic' : ['kroger', '02900239', '1904 Emmet St N'],
    'harristeeter_': 'harristeeter',
    '09700332': 'harristeeter',
    '02900334': 'kroger'
}

const abbrevToUnit = {
    'lb': 'pound',
    'ct': 'unit',
    'pk': 'pack',
    'oz': 'ounce'
}

const loc_kroger_barracks = '02900359';
const loc_harristeeter_barracks = '09700177';
const loc_kroger_hydraulic = '02900239';
const loc_harristeeter_hollymead = '09700132';
const loc_harristeeter_blueridge = '09700332';
const loc_kroger_riohill = '02900334';

var searchLocation = 'harristeeter_barracks';
//var searchTermList = ['chicken', 'cherries', 'protein bars', 'peanut butter', 'milk', 'beef', 'peaches']  //20 items
var searchTermList = ['eggs', 'sweet potato', 'potatos', 'green onion', 'rice', 'apple', 'garlic', 'onion', 'carrot', 'cabbage', 'pork belly']   //10 items
//var searchTermList = ['peanut butter', 'milk', 'beef', 'peaches']  //20 items

for(let i = 0; i < searchTermList.length; i++){    
    let productURL = `https://api.kroger.com/v1/products?filter.limit=10&filter.term=${searchTermList[i]}&filter.locationId=${locations[searchLocation][1]}`;
    let inventory = []

    fetch(tokenURL, {
        method: "POST",
        headers: headers,
        body: tokenBody
    })
    .then(response => response.json())
    .then(data => {
        //console.log(data)
        token = data.access_token;
        
        const productHeader = {
            "Accept" : "application/json",
            "Authorization" : `Bearer ${token}`
        }

        console.log(productURL);

        return fetch(productURL, {
            method: "GET",
            headers: productHeader
        })
    })
    .then(response => response.json())
    .then(data => {
        for(let i = 0; i < data.data.length; i++){
            let item = data.data[i].items[0]
            if(item.price != null){
                let sellingInfo = item.size.split(' ')
                let totalPrice = item.price.regular
                let pricePerUnit = `$${String((parseFloat(totalPrice) / parseFloat(sellingInfo[0])).toFixed(2))} / ${abbrevToUnit[sellingInfo[1].slice(0,2)]}`
                let obj = [locations[searchLocation][0], locations[searchLocation][2], data.data[i].description, totalPrice, pricePerUnit]
                inventory.push(obj)
                //kroger barracks: 1152 Emmet St N
            }
        }
        console.log("INVENTORY", inventory)
        
        //write to local CSV files
        const fs = require('fs');

        //add to data.json instead of replacing all
        let existingData = []
        try{
            existingData = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
            console.log(existingData)
        } catch (err) {
            console.log('File empty or not found')
        }

        console.log(inventory.length)
        let allData = existingData.concat([...inventory])
        
        var serializedArray = JSON.stringify(allData);
        
        //var serializedArray = JSON.stringify(inventory)
        fs.writeFileSync('data.json', serializedArray);
    })
    .catch(error => {
        console.error('Error: ', error);
    })
}

/*
uses API token to retrieve location id (Charlottesville)
* mile limit is 10 by default

.then(data => {
    console.log(data);
    token = data.access_token;
    
    const locationURL = 'https://api.kroger.com/v1/locations?filter.zipCode.near=22904&filter.limit=10'
    const locationHeaders = {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
    }
    console.log(locationHeaders.Authorization)
    return fetch(locationURL, {
        method: "GET",
        headers: locationHeaders
    })
})
.then(response => response.json())
.then(data => {
    console.log(data)
})
*/