import React, {useState} from 'react';

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
        console.log(data.data)
        })
    }
    
    return (
        <>
            <div className='search'>
                <div className='storeList'>
                    <div className='storeSelection'>
                        Kroger? <input type='checkbox' onChange={() => setKrogerQuery(!krogerQuery)}></input>
                    </div>
                    <div className='storeSelection'>
                        Harris Teeter? <input type='checkbox' onChange={() => setHTQuery(!htQuery)}></input>
                    </div>
                    <div className='storeSelection'>
                        Trader Joe's? <input type='checkbox' onChange={() => setTJQuery(!tjQuery)}></input>
                    </div>
                </div>
                <input className='searchbar' type='text' onChange={e => setKeywordsQuery(e.target.value)}></input>
                <button className='searchButton' onClick={search}>Submit</button>
            </div>
            <div className='searchResults'>
                {resList.map((obj) => (
                    <div key={obj.name.concat(obj.price)}>
                        <b>{obj.name}</b>
                        <ul>
                        <li>{obj.store}</li>
                        <li>{obj.address}</li>
                        <li>${obj.price}</li>
                        </ul>
                    </div>
                    )
                )}
            </div>
        </>
    )
}

    