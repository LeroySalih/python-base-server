const router = require("express").Router()
var db = require("../database.js")
var multer = require('multer')
var fs = require('fs')

var storage = multer.diskStorage({
    destination: (req, file, cb) => { 
        const path = `uploads/${req.body.email}/${req.body.podId}/${req.body.label}/${Date.now()}`
        fs.mkdirSync(path, { recursive: true })
        cb(null, path) 
    },

    filename : (req, file, cb) => {
        cb(null, file.originalname)
    }

    

 });
var upload = multer({storage: storage})
//var upload = multer({destination: 'public/uploads'})

router.get('/', (req, res) => {
    // Extract Parameters
    res.json({msg:"This is the router API."})
})

router.post('/test-result', upload.single('code'), (req, res) => {

    const email = req.body.email || null
    const podId = req.body.podId || null
    const results = req.body.results || null

    console.log(`Writing out: ${email} ${podId}`)
    console.log(results)
    console.log('File Attached')
    console.log(req.file)

    // write to db.
    const filePath= 'testFilePath';

    db.addTestResult(email, podId, results, filePath)
        .then((result) => res.json({msg: 'OK', email, podId, results, filePath}))
        .catch((error) => console.log(error.message))
    
})

module.exports = router;