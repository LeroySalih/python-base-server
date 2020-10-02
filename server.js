const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('<html><body><b>Hello</b> World from me!</body></html>')
})

app.get('/register/:userId',(req, res) => {

    console.log('Received a register request')
    res.json({status:"ok"})
})

app.listen(port, ()=> {
    console.log(`Example app listening at http://localhost:${port}`)
})