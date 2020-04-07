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

exports.getProfile = (req,res,next) =>{
    if(req.params.id == req.session.user.id){
        return this.getUserHome(req,res,next);
    }
    if(req.params.id && req.params.id != "undefined"){
        return this.getUserProfile(req,res,next);
    }
    res.status(404)        // HTTP status 404: NotFound
   .send('Not found');
}

exports.getUserHome = async (req,res,next) => {
    let [categories, fieldData] = await postController.getCategories();
    let [latestPosts, metaData] = await postController.getLatestPosts({user_id: req.session.user.id, step: 0});
    latestPosts = await Promise.all(latestPosts.map(async post =>{
        let cat = categories.find(cat => cat.id == post.category_id);
        let [replies, metaData] = await postModel.getReplies(post.id);
        replies = [].concat.apply([], replies);
        return {
            ...post,
            replies: replies,
            category: cat.title
        }
    })).then(resp=>{
        req.session.categories = categories;
        req.session.latestPosts = {
            step: 0
        };
        return res.render('usersHome', {usersHomeCSS: true, user: req.session.user, categories: categories, latestPosts: resp });
    })
    
}

exports.getCurrentUserPosts = async (req, res, next) => {
    let categories = req.session.categories;
    let [posts, metaData] = await postController.getUserPosts(req.params.id);
    posts = await Promise.all(posts.map(async post =>{
        let cat = categories.find(cat => cat.id == post.category_id);
        let [replies, metaData] = await postModel.getReplies(post.id);
        replies = [].concat.apply([], replies);
        return {
            ...post,
            replies: replies,
            category: cat.title
        }
    }));
    res.render('usersHome', {usersHomeCSS: true, user: req.session.user, categories: categories, userPosts: posts });
}

exports.getUserProfile = async (req,res,next) => {
    let categories = req.session.categories;
    let [userProfile, fieldData] = await userModel.getUserById(req.params.id);
    let [posts, metaData] = await postController.getUserPosts(req.params.id);
    posts = await Promise.all(posts.map(async post =>{
        let cat = categories.find(cat => cat.id == post.category_id);
        let [replies, metaData] = await postModel.getReplies(post.id);
        replies = [].concat.apply([], replies);
        return {
            ...post,
            replies: replies,
            category: cat.title
        }
    }));
    req.session.userProfile = userProfile[0];
    res.render('profile', {profileCSS: true, user: req.session.user, userProfile: userProfile[0], categories: categories, posts: posts });
}

exports.addLike = (req,res,next) => {
    userModel.addLike(req.params.id).then(resp=>{
        return res.redirect('back');
    }).catch(err=>{
        console.log(err,"err adding like");
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