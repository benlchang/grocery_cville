import React, {useState, useEffect} from 'react';

function App () {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api')
    .then(response => response.text())
    .then(data => {
      console.log(data);
      setMessage(data);
    })
  }, [])
  return (
    <div>
      {message}
    </div>
  )
}

export default App;