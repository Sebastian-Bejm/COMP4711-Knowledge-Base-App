let postModel = require('../models/post');


exports.createPost = (req,res,next) => {
    let newPost = {
        user_id: req.session.user.id,
        category_id: parseInt(req.body.category),
        heading: req.body.heading,
        details: req.body.details
     }
    postModel.createPost(newPost).then(data=>{
       req.session.user.postcount++;
       res.redirect(301, "/user/"+req.session.user.id)
    }).catch(err=>{
        console.log(err,"err creating new post");
    })
}

exports.getUserPosts = user_id => {
    return postModel.getUserPosts(user_id);
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
            let [replies, metaData] = await postModel.getReplies(post.id);
            replies = [].concat.apply([], replies);
            return {
                ...post,
                replies: replies,
                category: cat.title
            }
        }));
        req.session.results = results;
        req.session.searchData = searchData;
        res.render('searchResults', {searchResultsCSS: true, user: req.session.user, categories: req.session.categories, results: results });
    }).catch(err=>{
        console.log("err fetching search...", err);
    })
}

exports.addReply = (req,res,next) => {
    let data = {
        user_id: req.params.id,
        post_id: req.params.post_id,
        details: req.body.details
    }
    postModel.addReply(data).then(resp=>{
        return res.redirect('back');
     }).catch(err=>{
         console.log(err,"err creating new reply");
     })
}

exports.getCategories = () => {
    return postModel.getCategories();
}

