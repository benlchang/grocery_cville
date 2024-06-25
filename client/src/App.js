import React, {useState, useEffect} from 'react';
import Hero from './components/Hero';
import Searcher from './components/Searcher';
import './index.css';
/*await fetch('/api', {
      method: 'GET',
      headers: {
        address: '1152 Emmet St N',
        keywords: 'chicken breast',
        brand: 'perdue'
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      
      setResList(data.data);
      /* PLAN COMPONENTS!

      ShoppingList
      - parameter: JSON data 
      - returns: a list of item entries with the store name as a subheader

      ItemInput
      - parameter: boolean to tell if this should build a list or search one item
      - returns: a dynamic input field that takes an item and can either add it to a running list via 'add' button and then submit the entire list with a 'submit' button, or just the 'submit' button
                searches all available stores but can filter based on selection
      

      
              })*/

              
function App () {
  return <>
    <Hero />
    <Searcher />
  </>
}

export default App;