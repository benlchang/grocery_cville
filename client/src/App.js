import React, {useState, useEffect} from 'react';
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
  
  const [resList, setResList] = useState([]);
  const [addressQuery, setAddressQuery] = useState('');
  const [keywordsQuery, setKeywordsQuery] = useState('');

  const search = async () => {
    console.log(addressQuery, keywordsQuery)
    await fetch('/api', {
      method: 'GET',
      headers: {
        address: addressQuery,
        keywords: keywordsQuery
      }
    })
    .then(response => response.json())
    .then(data => {

      setResList(data.data)
      console.log(data.data)
    })
  }
  
  return (
    <div>
      Address: <input type='text' onChange={e => setAddressQuery(e.target.value)}></input>
      Keywords: <input type='text' onChange={e => setKeywordsQuery(e.target.value)}></input>
      <button onClick={search}>Submit</button>
      {resList.map((obj) => (
          <>
            <b>{obj.name}</b>
            <ul>
              <li>{obj.store}</li>
              <li>{obj.address}</li>
              <li>${obj.price}</li>
            </ul>
          </>
        )
      )}
      {addressQuery}
    </div>
  )
}

export default App;