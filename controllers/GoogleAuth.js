var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const passport = require("passport")
const DBconnection = require("../DBconnection")
const {hashPassword,comparePassword} = require("../controllers/hashpass")
const jwt = require('jsonwebtoken')

passport.use(new GoogleStrategy({
    clientID:     process.env.client_id,
    clientSecret: process.env.client_secret,
    callbackURL: "/auth/google/callback",
    passReqToCallback   : true
  },
  async function(request, accessToken, refreshToken, profile, done) {
     try {
      const {email,displayName : name,id} = profile;
      const user = 'SELECT email FROM users where email = ?'
      const query = 'INSERT INTO users (name, email,password_hash,verification_token,is_verified,tokan_expire_date,last_login) VALUES (?, ?, ?, ?,?,?,?)';

      const password = email.substring(6, email.length) + name.substring(0, 5) + id.substring(0, 4);

      const hashedPassword = await hashPassword(password)
      const tokan_expire_date = Date.now() + 24 * 60 * 60 * 1000;
      const now = new Date();

      const formatCurrentDate = (date) => {
          return date.toISOString().replace('T', ' ').slice(0, 19);
      };
      DBconnection.query(user, [email],(err,result)=>{
        if(err){
          console.log(err)
        }
        if(result){
          if(!result[0]){
            DBconnection.query(query, [name, email,hashedPassword,null,true,tokan_expire_date,formatCurrentDate(now)], (err, results) => {
              if (err) {
                  console.error('Error inserting data: ', err);
                  // return res.status(500).send('Error inserting data');
              }
              if(results){
                //  res.status(201).send('user created successfully')
              }
             });
          } 
        }
     
        const jwtToken =  jwt.sign(
          { _id : id,},
         process.env.JWT_SECRET_KEY,
          {expiresIn : '1d'}
        )

       return done(null,{jwtToken})
       
      })
     } catch (error) {
      console.log(error)
     }

    }
));


