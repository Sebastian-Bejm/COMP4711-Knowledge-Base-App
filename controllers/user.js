let userModel = require('../models/user');



exports.createUser = (req,res,next) => {
   
    //NEED TO CHECK BOTH CONFIRM AND PASS MATCH
    let newUser = {
        firstName: req.body.s_fName,
        lastName: req.body.s_lName,
        email: req.body.s_email,
        password: req.body.s_pass
     }

    userModel.createUser(newUser).then(data=>{
        res.render('registerDetails', {homeCSS: true});
    });
}

// exports.getRegister = (req, res, next) => {
//     res.render('registerDetails', {homeCSS: true});
// }