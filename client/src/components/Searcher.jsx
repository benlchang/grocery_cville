import React, {useState, useEffect} from 'react';
import Hero from './Hero';

export default function Searcher () {
    const [resList, setResList] = useState([]);
    const [keywordsQuery, setKeywordsQuery] = useState('');

    const [krogerQuery, setKrogerQuery] = useState(false);
    const [htQuery, setHTQuery] = useState(false);
    const [tjQuery, setTJQuery] = useState(false);

    async function search () {
        console.log(krogerQuery, htQuery, tjQuery)
        await fetch('/api', {
            method: 'GET',
            headers: {
                kroger: String(krogerQuery),
                harristeeter: String(htQuery),
                traderjoes: String(tjQuery),
                keywords: keywordsQuery
            }
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
                                <div className='store'>{obj.store}</div>
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
                        <button style={krogerQuery ? {borderColor: 'black'} : {borderColor: 'white'}} onClick={() => setKrogerQuery(!krogerQuery)}>Kroger</button>
                    </div>
                    <div className='storeSelection'>
                        <button style={htQuery ? {borderColor: 'black'} : {borderColor: 'white'}} onClick={() => setHTQuery(!htQuery)}>Harris Teeter</button>
                    </div>
                    <div className='storeSelection'>
                        <button style={tjQuery ? {borderColor: 'black'} : {borderColor: 'white'}} onClick={() => setTJQuery(!tjQuery)}>Trader Joe's</button>
                    </div>
                </div>
                <input className='searchbar' type='text' onChange={e => setKeywordsQuery(e.target.value)}></input>
                <button className='searchButton' onClick={search}>Submit</button>
            </div>
        </>
    )
}

    