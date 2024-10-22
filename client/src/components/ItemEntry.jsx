import React from 'react';
import '../index.css';

export default function ItemEntry({store, name, price}) {
    return (
        <div className='itemEntry'>
            <div className='store'>{store}</div>
            <div className='name'>{name}</div>
            <div className='price'>{price}</div>
        </div>
    )
}