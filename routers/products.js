const express = require('express');
const router = express.Router();
const {validateJWTtoken} = require("../middleware/jwtChecker")

router.get("/",validateJWTtoken, (req,res)=>{
     const products = [
        {
            id : 1,
            key : 'toy'
        },
        {
            id : 1,
            key : 'car'
        },
     ];

     res.status(200).send(products)
})

module.exports = router;