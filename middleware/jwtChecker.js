const jwt = require("jsonwebtoken")


const validateJWTtoken = (req,res,next)=>{
      const token = req.cookies.token
      if(!token){
        return res.status(403).json({massage : 'token not valid or available'})
      }
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        res.user = decoded
        next()
      } catch (error) {
        return res.status(403).json({massage : "token expire or wrogn"})
      }
}
module.exports = {validateJWTtoken}