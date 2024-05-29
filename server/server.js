const express = require('express');
const app = express();

app.get('/api', (req, res) => {
    res.send("Hello from pyERN stack!");
});

app.listen(5000, () => {
    console.log(`Server listening on port 5000`)
});