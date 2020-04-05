let userModel = require('../models/user');
let postModel = require('../models/post');
const postController = require('./post');

exports.createUser = (req,res,next) => {
    //NEED TO CHECK BOTH CONFIRM AND PASS MATCH
    let newUser = {
        firstname: req.body.s_fName,
        lastname: req.body.s_lName,
        email: req.body.s_email,
        password: req.body.s_pass
     }

    userModel.createUser(newUser).then(data=>{
        userModel.getUserByEmail(newUser.email)
        .then(([rows, fieldData])=>{
            delete newUser.password;
            req.session.user = {
                ...rows[0],
                ...newUser
            }
            req.session.cookie.maxAge = 3600000; 
            res.redirect(301, "/register")
        })
    });
}

exports.getRegister = (req,res,next)=>{
    res.render('registerDetails', {homeCSS: true});
}

/******************* 
* TEST THIS OUT 
*********************/
exports.getUserHome = async (req,res,next) => {
    if(!req.session.user)return res.redirect('/');
    let [categories, fieldData] = await postController.getCategories();
    let [latestPosts, metaData] = await postController.getLatestPosts({user_id: req.session.user.id, step: 0});
    latestPosts = await Promise.all(latestPosts.map(async post=>{
        let cat = categories.find(cat => cat.id == post.category_id);
        let replies = await postModel.getReplies(post.id);
        return {
            ...post,
            replies: replies,
            category: cat.title
        }
    }));
    req.session.categories = categories;
    req.session.latestPosts = {
        step: 0
    };
    res.render('usersHome', {usersHomeCSS: true, user: req.session.user, categories: categories, latestPosts: latestPosts });
}

exports.register = (req, res, next) => {
    let userDetails = {
        id: req.session.user.id,
        imageurl: req.body.r_imageURL,
        about: req.body.r_about,
        dob: req.body.r_birth,
        country: req.body.r_country
    }
    userModel.registerUser(userDetails).then(data=>{
        req.session.user = {
            ...req.session.user,
            ...userDetails
        }
        res.redirect(301, "/user/"+req.session.user.id)
    }).catch(err=>{
        console.log("error registering user...", err);
    })
}

exports.getUser = (req,res,next)=>{
    userModel.getUserByEmail(req.body.l_email)
        .then(([rows, fieldData])=>{
            delete rows[0].password;
            req.session.user = {
                ...rows[0]
            }
            req.session.cookie.maxAge = 3600000; 
            res.redirect(301, "/user/"+req.session.user.id)
        }).catch(err=>{
            console.log("error fetching user...", err);
        })
}

exports.logout = (req, res, next) => {
    req.session.destroy(function(err){
        if(err){
           console.log(err);
        }else{
            res.redirect('/');
        }
     });
}