module.exports = (req,res,next) => {
    if(req.body){
        for (var key in req.body) {
            if (req.body.hasOwnProperty(key)) {
                req.body[key] = req.sanitize(req.body[key]);
                if(!req.body[key]){
                    req.body[key] = "";
                }
            }
        }
    }
    next();
}