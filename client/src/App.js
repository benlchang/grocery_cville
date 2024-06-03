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
    <div>
      <div>
        Store: 
          <div>
            Kroger? <input type='checkbox' onChange={() => setKrogerQuery(!krogerQuery)}></input>
          </div>
          <div>
            Harris Teeter? <input type='checkbox' onChange={() => setHTQuery(!htQuery)}></input>
          </div>
          <div>
            Trader Joe's? <input type='checkbox' onChange={() => setTJQuery(!tjQuery)}></input>
          </div>
      </div>
      Keywords: <input type='text' onChange={e => setKeywordsQuery(e.target.value)}></input>
      <button onClick={search}>Submit</button>
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
      {String(krogerQuery)}
      {String(htQuery)}
      {String(tjQuery)}
    </div>
  )
}

export default App;