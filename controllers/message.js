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
        subject: req.body.subject.replace(/\r?\n|\r|'/gm, "").trim(),
        details: req.body.details.replace(/\r?\n|\r|'/gm, "").trim(),
        sender_id: req.session.user.id,
        receiver_id: req.params.id
    }
    messageModel.sendMessage(message).then(resp=>{
        var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'knowledgebasebapp@gmail.com',
            pass: 'kbapp1234'
        }
        });

        var mailOptions = {
            from: 'knowledgebasebapp@gmail.com',
            to: req.session.userProfile.email,
            subject: 'From Knowledgebase app! - '+req.body.subject.replace(/\r?\n|\r|'/gm, "").trim(),
            text: req.body.details.replace(/\r?\n|\r|'/gm, "").trim()
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

exports.getAllMessages = (req,res,next) => {
    messageModel.getAllMessages(req.session.user.id).then(async ([messages, fieldData])=>{
        req.session.messages = messages;
        if(messages.length > 0){
            messages = await Promise.all(messages.map(async message=>{
                let sender = message.sender_id == req.session.user.id;
                let [otherUser, fieldData] = await userModel.getUserForMessage(sender? message.receiver_id:message.sender_id);
                let [replies, metaData] = await messageModel.getMessageReplies(message.id);
                replies = [].concat.apply([], replies);
                return {
                    ...message,
                    replies: replies,//`${JSON.stringify(replies)}`
                    imageurl: otherUser[0].imageurl,
                    firstname: otherUser[0].firstname,
                    lastname: otherUser[0].lastname
                }
            }));
            req.session.activeMessageId = req.session.activeMessageId ? req.session.activeMessageId : messages[0].id;
        } else {
            req.session.activeMessageId = req.session.activeMessageId ? req.session.activeMessageId : null;
        }
        
        res.render('allMessages', {allMessagesCSS: true, user: req.session.user, 
            userData: JSON.stringify(req.session.user), categories: req.session.categories, 
            messages: messages, messagesData: JSON.stringify(messages), activeId: req.session.activeMessageId });
    }).catch(err=>{
        console.log("err fetching messages...", err);
    })
}

exports.addReply = (req,res,next) => {
    let data = {
        user_id: req.params.id,
        message_id: req.params.message_id,
        details: req.body.details.replace(/\r?\n|\r|'/gm, "").trim()
    }
    req.session.activeMessageId = data.message_id;
    messageModel.addReply(data).then(resp=>{
        return res.redirect("back");
     }).catch(err=>{
         console.log(err,"err creating new reply");
     })
}