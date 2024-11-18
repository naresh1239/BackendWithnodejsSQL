
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const express = require('express')
const app = express()
const cors = require("cors")
const port = process.env.PORT
const authRoute = require('./routers/auth')
const products = require("./routers/products")
const DBconnection = require("./DBconnection")
const mail = require("./controllers/Mail")
const cookieParser = require('cookie-parser');
const passport = require("passport")
require("./controllers/GoogleAuth")
app.use(express.json());

app.use(cors({  origin: ['http://localhost:3000','http://localhost:5173'], // Replace with your frontend URL
  credentials: true}));


app.use(cookieParser());

app.use("/auth",authRoute)
app.use("/products",products)

app.get('/auth/google',
  passport.authenticate('google', { session : false, scope:
      [ 'email', 'profile' ] }
));

app.get( '/auth/google/callback',
    passport.authenticate( 'google', {
        session : false,
        failureRedirect: 'http://localhost:5173/signin'
}),
function(req,res){
res.cookie("token", req.user.jwtToken,{
  httpOnly : true,
  sameSite : "strict",
  masAge : 24 * 60 * 60 * 1000
})
res.redirect('http://localhost:5173/')

}
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})