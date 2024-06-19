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
        'traderjoes': `Trader Joe's`
    }

    async function search () {
        await fetch('/api', {
            method: 'GET',
            headers: filters
        })
        .then(response => response.json())
        .then(data => {
            setResList(data.data)
            console.log(resList.length)
        })
    }
    
    return (
        <>
            {resList.length > 0 ? (<div className='searchResults'>
                {resList.map((store) => (
                    <>
                        <h1 key={store.title}>{store.title}</h1>
                        {store.items.slice(0, 7).map((obj) => (
                            <div className='itemEntry' key={obj.name.concat(obj.price)}>
                                <div className='store'>{prettifyStore[obj.store]}</div>
                                <div className='name'>{obj.name}</div>
                                <div className='price'>${Number(obj.price).toFixed(2)} ({obj.perUnit})</div>
                            </div>
                        ))}
                    </>
                    )
                )}
            </div>) :
            (<div className='hero'>
                <div className='homepage-logo'>
                    Forager
                </div>
                <div className='homepage-subheader'>
                    Find the best prices for the groceries you need
                </div>
            </div>)}
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

    