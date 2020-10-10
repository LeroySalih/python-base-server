const router = require("express").Router()

router.get('/', (req, res) => {
    res.json({msg:"This is the router API."})
})


module.exports = router;