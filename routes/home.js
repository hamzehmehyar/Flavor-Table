const express = require('express');
const path = require('path');
const router = express.Router();

/*router.get("/", (req, res) => {

    res.sendFile(path.join(__dirname, '../public/flavortable.html'));

});
 
module.exports = router;*/

router.get("/", (req, res) => {

    res.sendFile(path.join(__dirname, '../public/login.html'));

});
 
module.exports = router;



