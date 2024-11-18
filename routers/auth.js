const express = require('express');
const {hashPassword,comparePassword} = require("../controllers/hashpass")
const router = express.Router();
const DBconnection = require("../DBconnection")
const {signUpCheckValidation,signinCheckValidation,VerificationToekn,ResetPassCheckValidation} = require("../middleware/AuthCheck")
const jwt = require('jsonwebtoken')
const {generateToken} = require("../utils/generateToken")
const {sendverificationMail,sendResetPasswordMail} = require("../controllers/Mail")
const {generateAuthCookie} = require("../utils/generateAuthCookie");
const { session } = require('passport');


router.post('/signup', signUpCheckValidation,async(req, res) => {
    const user = 'SELECT email FROM users where email = ?'
    const query = 'INSERT INTO users (name, email,password_hash,verification_token,is_verified,tokan_expire_date,last_login) VALUES (?, ?, ?, ?,?,?,?)';

    const { name, email,password } = req.body;
    if(!name,!email,!password){
     return res.end('error all fields missing')
    }

    const hashedPassword = await hashPassword(password);

    DBconnection.query(user, [email],(err,result)=>{
     if(err){
       console.log(err)
     }
     if(result){
        // if found the email id in db 
       if(result.length > 0){
        return res.status(500).json({"massage" :'user exits alerdy'})
       }
    //    checking if password hashed or not
       if(!hashedPassword){
         return res.status(500).json({"massage" : "someting wend worgn"})
       }
     const tokan = generateToken()
     const tokan_expire_date = Date.now() + 24 * 60 * 60 * 1000;
     const now = new Date();

     const formatCurrentDate = (date) => {
         return date.toISOString().replace('T', ' ').slice(0, 19);
     };

       DBconnection.query(query, [name, email,hashedPassword,tokan,false,tokan_expire_date,formatCurrentDate(now)], (err, results) => {
         if (err) {
             console.error('Error inserting data: ', err);
             return res.status(500).send('Error inserting data');
         }
         if(results){
            sendverificationMail(email,tokan)
            res.status(201).send('user created successfully')

         }
        });
     }
    })
});




router.post('/verifiyToken', VerificationToekn,async(req, res) => {

  const query = 'SELECT * FROM USERS WHERE verification_token = ? AND email = ?';

  DBconnection.query(query, [req.body.token,req.body.email],async (err,result)=>{
    if(err){
      console.log(err)
    }

    if(result?.length  < 1){
      return res.status(400).send('token is not valid')
   }
 

    if(result){
      const update_query = 'UPDATE USERS SET verification_token = NULL, is_verified = true WHERE email = ?';

        DBconnection.query(update_query, [result[0].email],async (err,resp)=>{
          if(err){
         console.log(err)
          }
        if(resp?.affectedRows == 1){

       return  generateAuthCookie(res,result[0])
  
          // sendverificationMail(result[0].email,tokan)
        }
         })

    }else{
      console.log('vlk')
    }
  })
})

router.post('/signin', signinCheckValidation,async(req, res) => {

    const query = 'SELECT * FROM USERS WHERE email = ?';

    const {email,password} = req.body;

    if(!email,!password){
     return res.end('error all fields missing')
    }

    DBconnection.query(query, [email],async (err,result)=>{
     if(err){
       console.log(err)
     }
     if(result?.length  < 1){
        return res.status(400).send('you are not verifed yet or email of password wrong')
     }
     
     const isValidUser = await comparePassword(password,result[0].password_hash)
     if(!isValidUser){
        return res.status(400).send('you are not verifed yet or email of password wrong')
     }
     if(result){
      if(!result[0].is_verified){
        return res.status(400).send('you are not verifed yet or email of password wrong')
      }
      const jwtToken =  jwt.sign(
        { _id : result[0].id,},
         process.env.JWT_SECRET_KEY,
         {expiresIn : '1d'}
     )
 
         res.cookie("token", jwtToken,{
         httpOnly : true,
         sameSite : "strict",
         masAge : 24 * 60 * 60 * 1000
       })

        return res.status(200).json({
            massage : 'login successfully',
            success : true,
            email : email,
            name : result[0].name
        })
     }
    })
});


router.get('/logout',(req,res)=>{
  res.clearCookie('token')
  res.status(200).json({'massage' : "you have been logout successfully"})
})


router.post('/ResetPassword',(req,res)=>{
  // res.clearCookie('token')

  if(!req.body.email){
   return res.status(400).json({"massage" : 'email not valid'})
  }
  const query = 'SELECT * FROM USERS WHERE email = ?';

  DBconnection.query(query, [req.body.email],async (err,result)=>{
    if(err){
      console.log(err)
    }
    if(result?.length  < 1){
       return res.status(400).send('email is not valid')
    }
    
    if(result){

     if(!result[0].is_verified){
       return res.status(400).send('you are not verifed yet')
     }

     if(result){
      const tokan = generateToken()
      const update_query = 'UPDATE USERS SET reset_token = ? WHERE email = ?';

        DBconnection.query(update_query, [tokan,result[0].email],async (err,resp)=>{
          if(err){
         console.log(err)
          }
        if(resp?.affectedRows == 1){

          sendResetPasswordMail(result[0].email,tokan)
         return  res.status(200).json({'massage' : "you have been reset successfully"})    
          //  sendverificationMail(result[0].email,tokan)
        }
         })
    }
    }
   })

})


router.post('/ResetPasswordTokenVerfiy',ResetPassCheckValidation,(req,res)=>{

  const {email,otp,newpassword} = req.body;

  if(!email){
   return res.status(400).json({"massage" : 'email not valid'})
  }
  const query = 'SELECT * FROM USERS WHERE email = ? AND reset_token = ?';

  DBconnection.query(query, [email,otp],async (err,result)=>{
    if(err){
      console.log(err)
    }
    if(result?.length  < 1){
       return res.status(400).send('not a vaild user')
    }
    
    if(result){

     if(!result[0].is_verified){
       return res.status(400).send('you are not verifed yet')
     }

     if(result){
      const hashedPassword = await hashPassword(newpassword);
      const update_query = 'UPDATE USERS SET reset_token = ?, password_hash = ? WHERE email = ? AND reset_token = ?';

        DBconnection.query(update_query, [null,hashedPassword,email,otp],async (err,resp)=>{
          if(err){
         console.log(err)
          }
        if(resp?.affectedRows == 1){
         return  res.status(200).json({'massage' : "password successfully"})    
        }
         })
    }
    }
   })

})
module.exports = router;
  