import React from 'react';

export default function Hero({data}) {
    return (
        <>
            {data.length > 0 ? (<div className='searchResults'>
                {data.map((store) => (
                    <>
                        <h1 key={store.title}>{store.title}</h1>
                        {store.items.slice(0, 7).map((obj) => (
                            <div className='itemEntry' key={obj.name.concat(obj.price)}>
                                <div className='store'>{obj.store}</div>
                                <div className='name'>{obj.name}</div>
                                <div className='price'>${Number(obj.price).toFixed(2)} ({obj.perunit})</div>
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
        </>
    )
}