import React, {useState} from 'react';
import Hero from './Hero';

export default function Searcher () {
    const [resList, setResList] = useState([]);
    const [keywordsQuery, setKeywordsQuery] = useState('');

    const [krogerQuery, setKrogerQuery] = useState(false);
    const [htQuery, setHTQuery] = useState(false);
    const [tjQuery, setTJQuery] = useState(false);

    const search = async () => {
        console.log(krogerQuery, htQuery, tjQuery)
        await fetch('/api', {
        method: 'GET',
        headers: {
            kroger: String(krogerQuery),
            harristeeter: String(htQuery),
            traderjoes: String(tjQuery),
            keywords: keywordsQuery.trim().split(' ')
        }
        })
        .then(response => response.json())
        .then(data => {
            setResList(data.data)
        })
    }
    
    return (
        <>
            <Hero data={resList}/>
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

    