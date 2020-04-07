const axios = require('axios');
let userModel = require('../models/user');
let postModel = require('../models/post');
const postController = require('./post');


exports.createUser = (req,res,next) => {
    //NEED TO CHECK BOTH CONFIRM AND PASS MATCH
    let newUser = {
        firstname: req.body.s_fName.replace(/\r?\n|\r/gm, "").trim(),
        lastname: req.body.s_lName.replace(/\r?\n|\r/gm, "").trim(),
        email: req.body.s_email.replace(/\r?\n|\r/gm, "").trim(),
        password: req.body.s_pass.replace(/\r?\n|\r/gm, "").trim()
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
        imageurl: req.body.r_imageURL.replace(/\r?\n|\r/gm, "").trim(),
        about: req.body.r_about.replace(/\r?\n|\r/gm, "").trim(),
        dob: req.body.r_birth.replace(/\r?\n|\r/gm, "").trim(),
        country: req.body.r_country.replace(/\r?\n|\r/gm, "").trim()
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
    //console.log(req.session.latestPostStep)
    req.session.latestPostStep = req.session.latestPostStep ? req.session.latestPostStep : 0;
    let [latestPosts, metaData] = await postController.getLatestPosts({user_id: req.session.user.id, step: req.session.latestPostStep});
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
        return res.render('usersHome', {usersHomeCSS: true, user: req.session.user, userData: JSON.stringify(req.session.user), categories: categories, latestPosts: JSON.stringify(resp), latestPostStep: req.session.latestPostStep });
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

exports.seedUsers = (req,res,next) => {
    axios.get('https://randomuser.me/api/?results=10')
    .then(response => {
        //console.log(response.data.results);
        let newUsers = formatUsers(response.data.results);
        //console.log(newUsers)
        userModel.seedUsers(newUsers).then(resp=>{
            console.log("Successfully seeded db users!")
        }).catch(err=>{
            console.log(err);
        })
        res.redirect("/");
    })
    .catch(error => {
        console.log(error);
    });               
}

const formatUsers = users => {
    return users.map((user,index)=>{
        return {
            firstname: user.name.first,
            lastname: user.name.last,
            email: `test${index}@test.com`,
            password: "test"+index,
            imageurl: user.picture.thumbnail,
            about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec maximus cursus nisl, ut suscipit lorem pellentesque ac. Aenean imperdiet suscipit nunc nec interdum.",
            dob: user.dob.date,
            country: user.location.country,
        }
    });
}