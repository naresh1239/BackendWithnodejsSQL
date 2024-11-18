// const { MailtrapClient } = require("mailtrap");
// const {template} = require("../utils/TokenVerificationTemplate.js")

// const TOKEN = process.env.MAIL_TOKEN;

// const client = new MailtrapClient({
//   token: TOKEN,
// });

// const sender = {
//   email: "mailtrap@demomailtrap.com",
//   name: "Mailtrap Test",
// };
// // const recipients = [
// //   {
// //     email: "naresh.kumawat159924@gmail.com",
// //   }
// // ];


// const sendverificationMail = (mailId,token)=>{
//     const link = `<a href="http://localhost:5173/verfiy?email=${mailId}&otp=${token}">http://localhost:5173/verfiy</a>`
//     client
//     .send({
//       from: sender,
//       to: [{email : mailId}],
//       subject : 'verification token mail',
//       html: template.replace(/{Link}/g, link),
//       category: "verification token mail",
//     })
//     .then(console.log, console.error)
// }

// const sendResetPasswordMail = (mailId,token)=>{
//   const link = `<a href="http://localhost:5173/ResetPasswordVerfiy?email=${mailId}&otp=${token}">http://localhost:5173/verfiy</a>`
//   client
//   .send({
//     from: sender,
//     to: [{email : mailId}],
//     subject : 'Reset Password token mail',
//     html: template.replace(/{Link}/g, link),
//     category: "verification token mail",
//   })
//   .then(console.log, console.error)
// }

// module.exports = {sendverificationMail,sendResetPasswordMail};


const nodemailer = require('nodemailer');
const {template} = require("../utils/TokenVerificationTemplate.js")
// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    service : 'gmail',
    host: "smtp.ethereal.email",
    port: 465,
    secure: true, // true for port 465, false for other ports
    auth: {
      user: "naresh.kumawat159924@gmail.com",
      pass: "jngi gkiw iofj ucwi",
    },
  });

// Set up email data



const sendverificationMail = (mailId,token)=>{
    const link = `<a href="http://localhost:5173/verfiy?email=${mailId}&otp=${token}">http://localhost:5173/verfiy</a>`
console.log(mailId)
    const mailOptions = {
      from: 'naresh.kumawat159924@gmail.com', // Sender address
      to: mailId,  // List of recipients
      subject: 'Verfication Token Mail', // Subject line
      html: template.replace(/{Link}/g, link) // HTML body
  };
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log('Error occurred:', error);
    }
    console.log('Email sent successfully:', info.response);
});
}

const sendResetPasswordMail = (mailId,token)=>{
  const link = `<a href="http://localhost:5173/ResetPasswordVerfiy?email=${mailId}&otp=${token}">http://localhost:5173/verfiy</a>`

  const mailOptions = {
    from: 'naresh.kumawat159924@gmail.com', // Sender address
    to: mailId,  // List of recipients
    subject: 'Verfication Token Mail', // Subject line
    html: template.replace(/{Link}/g, link) // HTML body
};
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
      return console.log('Error occurred:', error);
  }
  console.log('Email sent successfully:', info.response);
});
}



module.exports = {sendverificationMail,sendResetPasswordMail}