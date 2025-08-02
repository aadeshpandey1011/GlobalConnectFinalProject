const express = require('express')
const app = express()
const port = 4000


require('./connection');
app.get('/', (req, res) => {
  res.send('Hello World!  Get')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})