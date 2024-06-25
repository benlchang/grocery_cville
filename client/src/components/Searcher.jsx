import React, {useState, useEffect} from 'react';
import Hero from './Hero';
import Loading from './Loading';

export default function Searcher () {
    const [isLoading, setIsLoading] = useState(false);

    const [resList, setResList] = useState([]);

    const [filters, setFilters] = useState({
        kroger: true,
        harristeeter: true,
        traderjoes: true,
        keywords: null
    })

    const prettifyStore = {
        'kroger': 'Kroger',
        'harristeeter': 'Harris Teeter',
        'traderjoes': `Trader Joe's`,
        'All Results': 'All Results'
    }

    async function search () {
        setIsLoading(true);
        try{
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
                setIsLoading(false);
            })
        }
        catch(error) {
            console.log(error)
            setResList([])
            setIsLoading(false)
        }
    }

    useEffect(() => {
        function handleEnter(e) {
            if(e.key === 'Enter' && filters.keywords){
                search()
            }
        }

        document.addEventListener('keydown', handleEnter, false);

        return () => document.removeEventListener('keydown', handleEnter, false);
    })
    
    return (
        <>
            {isLoading && <Loading />}
            {!isLoading && (resList.length > 0 ? resList.map((store) => (
                <>
                    <h2><u>{prettifyStore[store[0]]}</u></h2>
                    {store[1].map(item => (
                        <div key={item.name} style={{animationDelay: `calc(.25s)`}} className='item'>
                            {item.store !== store[0] && <li>{prettifyStore[item.store]}</li>}
                            {item.name} ${item.price}
                        </div>
                    ))}
                </>
            )) : 
            (<div>
                No results returned :/
            </div>))}
            <div className='search'>
                <div className='storeList'>
                    <div className='storeSelection' 
                        style={filters.kroger ? {backgroundColor: '#595', color: '#ccc'} : {backgroundColor: '#637363', color: '#aaa'}} 
                        onClick={() => setFilters({...filters, kroger: !filters.kroger})}>
                            Kroger
                    </div>
                    <div className='storeSelection' 
                        style={filters.harristeeter ? {backgroundColor: '#595', color: '#ccc'} : {backgroundColor: '#637363', color: '#aaa'}} 
                        onClick={() => setFilters({...filters, harristeeter: !filters.harristeeter})}>
                            Harris Teeter
                    </div>
                    <div className='storeSelection' 
                        style={filters.traderjoes ? {backgroundColor: '#595', color: '#ccc'} : {backgroundColor: '#637363', color: '#aaa'}} 
                        onClick={() => setFilters({...filters, traderjoes: !filters.traderjoes})}>
                            Trader Joe's
                    </div>
                </div>
                <div className='searchContainer'>
                    <input className='searchbar' type='text' placeholder='e.g. peaches,ice cream,graham crackers' onChange={e => setFilters({...filters, keywords: e.target.value})}></input>
                    <button className='searchButton' 
                        disabled={!filters.keywords} 
                        style={{transition: 'background-color .4s ease-out, border-color .4s ease-out', borderColor: filters.keywords && '#aaa', backgroundColor: filters.keywords ? '#595' : '#637363'}}
                        onClick={search}>→</button>
                </div>
                <i style={{paddingTop: '8px', fontSize: '14px'}}>Format lists with only commas separating items, e.g. "chicken breast,cherries,..."</i>
            </div>
        </>
    )
}

    