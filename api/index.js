const router = require("express").Router()

router.get('/', (req, res) => {
    // Extract Parameters
    res.json({msg:"This is the router API."})
})

router.post('/test-result', (req, res) => {

    const email = req.body.email || null
    const podId = req.body.podId || null

    // write to db.

    res.json({msg: 'OK', email, podId})
})

module.exports = router;