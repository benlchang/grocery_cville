import React, {useState, useEffect} from 'react';
import Hero from './Hero';

export default function Searcher () {
    const [resList, setResList] = useState([]);

    const [filters, setFilters] = useState({
        kroger: false,
        harristeeter: false,
        traderjoes: false,
        keywords: null
    })

    const prettifyStore = {
        'kroger': 'Kroger',
        'harristeeter': 'Harris Teeter',
        'traderjoes': `Trader Joe's`,
        'Top Results': 'Top Results'
    }

    async function search () {
        await fetch('/api', {
            method: 'GET',
            headers: filters
        })
        .then(response => response.json())
        .then(data => {
            let loadIn = Array.from(Object.entries(data.data));
            setResList(loadIn)
            console.log(data.data)
            console.log(loadIn)
        })
    }
    
    return (
        <>
            {resList.map((store) => (
                <>
                    <h2><u>{prettifyStore[store[0]]}</u></h2>
                    {store[1].map(item => (
                        <ul key={item.name}>
                            {item.store !== store[0] && <li>{prettifyStore[item.store]}</li>}
                            <li style={{fontWeight: '400'}}>{item.name}</li>
                            <li>${item.price}</li>
                            {item.length}
                        </ul>
                    ))}
                </>
            ))}
            <div className='search'>
                <div className='storeList'>
                    <div className='storeSelection'>
                        <button style={filters.kroger ? {borderColor: 'black'} : {borderColor: 'white'}} onClick={() => setFilters({...filters, kroger: !filters.kroger})}>Kroger</button>
                    </div>
                    <div className='storeSelection'>
                        <button style={filters.harristeeter ? {borderColor: 'black'} : {borderColor: 'white'}} onClick={() => setFilters({...filters, harristeeter: !filters.harristeeter})}>Harris Teeter</button>
                    </div>
                    <div className='storeSelection'>
                        <button style={filters.traderjoes ? {borderColor: 'black'} : {borderColor: 'white'}} onClick={() => setFilters({...filters, traderjoes: !filters.traderjoes})}>Trader Joe's</button>
                    </div>
                </div>
                <input className='searchbar' type='text' onChange={e => setFilters({...filters, keywords: e.target.value})}></input>
                <button className='searchButton' onClick={search}>Submit</button>
            </div>
        </>
    )
}

    