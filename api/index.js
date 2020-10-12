const router = require("express").Router()
var db = require("../database.js")

router.get('/', (req, res) => {
    // Extract Parameters
    res.json({msg:"This is the router API."})
})

router.post('/test-result', (req, res) => {

    const email = req.body.email || null
    const podId = req.body.podId || null

    // write to db.
    db.addTestResult(email, podId, "")
        .then((result) => res.json({msg: 'OK', email, podId}))
        .catch((error) => consol.log(error.message))
    
})

module.exports = router;