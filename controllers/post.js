let postModel = require('../models/post');

exports.getCategories = () => {
    return postModel.getCategories();
}


exports.createPost = (req,res,next) => {
    let newPost = {
        user_id: req.session.user.id,
        category_id: parseInt(req.body.category),
        heading: req.body.heading,
        details: req.body.details
     }
    postModel.createPost(newPost).then(data=>{
       console.log(data);
       req.session.user.postcount++;
       res.redirect(301, "/user/"+req.session.user.id)
    }).catch(err=>{
        console.log(err,"err creating new post");
    })
}

exports.getLatestPosts = state => {
    return postModel.getLatestPosts(state);
}

exports.search = (req,res,next) =>{
    let searchData = req.query.searchQuery || req.query.category ? {
        user_id: req.session.user.id,
        query: req.query.searchQuery,
        category: req.query.category
    } : req.session.searchData
    postModel.search(searchData).then(async ([results, fieldData])=>{
        results = await Promise.all(results.map(async post=>{
            let cat = req.session.categories.find(cat => cat.id == post.category_id);
            let replies = await postModel.getReplies(post.id);
            return {
                ...post,
                replies: replies,
                category: cat.title
            }
        }));
        req.session.results = results;
        req.session.searchData = searchData;
        res.render('searchResults', {searchResultsCSS: true, user: req.session.user, results: results });
    }).catch(err=>{
        console.log("err fetching search...", err);
    })
}

// exports.getSearch=(req,res,next)=>{
    
// }


exports.addReply = (req,res,next) => {
    let data = {
        user_id: req.params.id,
        post_id: req.params.post_id,
        details: req.body.details
    }
    postModel.addReply(data).then(resp=>{
        console.log(resp);
        return res.redirect("/search");
     }).catch(err=>{
         console.log(err,"err creating new reply");
     })
}


