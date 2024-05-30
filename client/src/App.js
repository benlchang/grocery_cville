import React, {useState, useEffect} from 'react';

function App () {
  const [resList, setResList] = useState([]);

  useEffect(() => {
    fetch('/api', {
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
      */

      
    })
  }, [])


  return (
    <div>
      {resList.map(obj => {
        return (
          <>
            <b>{obj.name}</b>
            <ul>
              <li>{obj.store}</li>
              <li>{obj.address}</li>
              <li>${obj.price}</li>
            </ul>
          </>
        )
      })}
    </div>
  )
}

export default App;