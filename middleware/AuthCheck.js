const joi = require("joi")


const signUpCheckValidation = (req,res,next)=>{
    const recieveSchema = joi.object({
        name : joi.string().min(3).max(50).required(),
        email : joi.string().min(3).max(50).required(),
        password : joi.string().min(4).max(50).required()
    })
  const {error} = recieveSchema.validate(req.body);
  if(error){
    return res.status(400).json({massage : "bad requert",error})
  }
  next() 
}

const signinCheckValidation = (req,res,next)=>{
    const recieveSchema = joi.object({
        email : joi.string().min(3).max(50).required(),
        password : joi.string().min(4).max(50).required()
    })
  const {error} = recieveSchema.validate(req.body);
  if(error){
    return res.status(400).json({massage : "bad requert",error})
  }
  next() 
}


const VerificationToekn = (req,res,next) =>{

      if(!req.body.token || req.body.token.toString().length != 6){
          return res.status(400).json({massage : "bad requert token not valid"})
      }
         
next() 
}

const ResetPassCheckValidation = (req,res,next)=>{
  const recieveSchema = joi.object({
      otp : joi.string().min(3).max(50).required(),
      email : joi.string().min(3).max(50).required(),
      newpassword : joi.string().min(4).max(50).required()
  })
const {error} = recieveSchema.validate(req.body);
if(error){
  return res.status(400).json({massage : "bad requert",error})
}
next() 
}
module.exports = {signUpCheckValidation,signinCheckValidation,VerificationToekn,ResetPassCheckValidation}