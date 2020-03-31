let userModel = require('../models/user');



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
            req.session.cookie.maxAge = 600000; 
            res.redirect(301, "/register")
        })
    });
}

exports.getRegister = (req,res,next)=>{
    res.render('registerDetails', {homeCSS: true});
}
exports.getUserHome = (req,res,next)=>{
    res.render('usersHome', {homeCSS: true, user: req.session.user });
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
            req.session.cookie.maxAge = 600000; 
            res.redirect(301, "/user/"+req.session.user.id)
        }).catch(err=>{
            console.log("error fetching user...", err);
        })
}