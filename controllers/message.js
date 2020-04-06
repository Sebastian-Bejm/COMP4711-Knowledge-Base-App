let userModel = require('../models/user');
let postModel = require('../models/post');
let messageModel = require('../models/message');
const postController = require('./post');
var nodemailer = require('nodemailer');

exports.getNewMessage = (req,res,next) => {
    res.render('newMessage', {newMessageCSS: true, user: req.session.user, userProfile: req.session.userProfile});
}

exports.sendMessage = (req,res,next) => {
    let message = {
        subject: req.body.subject,
        details: req.body.details,
        sender_id: req.session.user.id,
        receiver_id: req.params.id
    }
    messageModel.sendMessage(message).then(resp=>{
        var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'knowledgebaseapp@gmail.com',
            pass: 'kbapp1234'
        }
        });

        var mailOptions = {
            from: 'knowledgebaseapp@gmail.com',
            to: req.session.userProfile.email,
            subject: 'From Knowledgebase app! - '+req.body.subject,
            text: req.body.details
        };

        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
        });
        res.redirect("/user/"+req.session.userProfile.id);
    }).catch(err=>{
        console.log(err,"err sending message");
    })
}