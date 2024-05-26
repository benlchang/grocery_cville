const client_id = 'benlchanggrocerylistgenerator-1da20a96997deee9384ef68922de4091426039652201572792'
const client_secret = 'pLZLIYMSwV9PMwRNjXL7pWzPjnVLFKvkjXTPUR4O'

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

const id_to_location = {
    '02900359': 'kroger',
    '09700177': 'harristeeter',
    '02900239': 'kroger',
    '09700132': 'harristeeter',
    '09700332': 'harristeeter',
    '02900334': 'kroger'
}

console.log(id_to_location['02900359']);
const loc_kroger_barracks = '02900359';
const loc_harristeeter_barracks = '09700177';
const loc_kroger_hydraulic = '02900239';
const loc_harristeeter_hollymead = '09700132';
const loc_harristeeter_blueridge = '09700332';
const loc_kroger_riohill = '02900334';

var searchTerm = 'protein shake'
let productURL = `https://api.kroger.com/v1/products?filter.limit=50&filter.term=${searchTerm}&filter.locationId=${loc_kroger_barracks}`;

const inventory = []

fetch(tokenURL, {
    method: "POST",
    headers: headers,
    body: tokenBody
})
.then(response => response.json())
.then(data => {
    console.log(data)
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
    console.log(data.data.length)
    for(let i = 0; i < data.data.length; i++){
        if(data.data[i].items[0].price != null){
            inventory.push(['kroger', '1159 Emmet St N', data.data[i].description, data.data[i].items[0].price.regular])
        }
    }
    console.log(inventory)
    
    const fs = require('fs');

    let existingData = []
    try{
        existingData = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
    } catch (err) {
        console.log('File empty or not found')
    }

    let allData = existingData.concat(inventory)
    var serializedArray = JSON.stringify(allData);
    fs.writeFileSync('data.json', serializedArray);
})
.catch(error => {
    console.error('Error: ', error);
})

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