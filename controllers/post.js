let postModel = require('../models/post');


exports.createPost = (req,res,next) => {
    let newPost = {
        user_id: req.session.user.id,
        category_id: parseInt(req.body.category),
        heading: req.body.heading.replace(/\r?\n|\r|'/gm, "").trim(),
        details: req.body.details.replace(/\r?\n|\r|'/gm, "").trim()
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
        query: req.query.searchQuery.replace(/\r?\n|\r|'/gm, "").trim(),
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
        details: req.body.details.replace(/\r?\n|\r|'/gm, "").trim()
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













/**********************
 * FOR SEEDING DATABASE
 **********************/
exports.seedPosts = (req,res,next) => {
    let newPosts = generatePosts();
    postModel.seedPosts(newPosts).then(resp=>{
        console.log("Successfully seeded db posts!")
    }).catch(err=>{
        console.log(err);
    })
    res.redirect("/");           
}

const generatePosts = () => {
    let categories = [1,11,21,31,41];
    let userIds = [181,191,201,211,221,231,241,251,261,271];
    let posts = [];
    for(let i = 0; i < 30; i++){
        posts.push({
            user_id: userIds[Math.floor(Math.random()*10)],
            category_id: categories[Math.floor(Math.random()*5)],
            heading: "Proin interdum viverra dui eget tempus",
            details: "Sed scelerisque, ante quis sodales sagittis, tellus nibh scelerisque nulla, sit amet consequat urna nisl nec arcu. Nam vestibulum purus sollicitudin risus bibendum porta. Nullam sollicitudin ante augue, dignissim tincidunt erat finibus eu. In cursus nisl lacus, cursus aliquet metus ultrices eget."
        })
    }
    return posts;
}