let db = require('../util/db');


exports.getCategories = () => {
    let sql = `SELECT * FROM category`
    return db.execute(sql);
 }

 exports.createPost = async data => {
    let sql = `Insert into post (user_id, category_id, heading, details) values (
        ${data.user_id},
        ${data.category_id}, 
        '${data.heading}', 
        '${data.details}'
    );
    `;
    let sql2 = `
    UPDATE user SET 
        postcount = postcount + 1
        WHERE
            id = ${data.user_id}
        ;
    
    `;
    await db.execute(sql);
    return db.execute(sql2);
 }
 
 exports.getUserPosts = user_id => {
    let sql = `SELECT p.id, p.user_id, p.category_id, p.heading, p.details,
    p.senddate, p.replycount, u.imageurl
    FROM post as p
    JOIN user as u on p.user_id = u.id
    WHERE p.user_id = ${user_id}
    ORDER BY senddate ASC`;

    return db.execute(sql);
}

 exports.getLatestPosts = state => {
     let sql = `SELECT p.id, p.user_id, p.category_id, p.heading, p.details,
     p.senddate, p.replycount, u.imageurl
     FROM post as p
     JOIN user as u on p.user_id = u.id
     WHERE p.user_id <> ${state.user_id}
     ORDER BY senddate DESC
     LIMIT 50`;
     return db.execute(sql);
 }

 exports.search = searchData => {
     let sql = `SELECT p.id, p.user_id, p.category_id, p.heading, p.details,
     p.senddate, p.replycount, u.imageurl
     FROM post as p
     JOIN user as u on p.user_id = u.id
     WHERE p.user_id <> ${searchData.user_id} ${searchData.query ? ` AND p.heading LIKE '%${searchData.query}%' `: ``} 
     ${searchData.category ? ` AND p.category_id = ${searchData.category}` : ``}
     ORDER BY senddate DESC
     LIMIT 30
     `;
    return db.execute(sql);
 }

exports.getReplies = post_id => {
    let sql = `SELECT pr.details, u.imageurl, pr.user_id, pr.id, pr.post_id
     FROM postreply as pr
     JOIN user as u on pr.user_id = u.id
     WHERE pr.post_id = ${post_id}
     ORDER BY senddate ASC`;
     return db.execute(sql);
}


 exports.addReply = async data => {
    let sql = `Insert into postreply (user_id, post_id, details) values (
        ${data.user_id},
        ${data.post_id}, 
        '${data.details}'
    );
    `;
    let sql2 = `
    UPDATE post SET 
        replycount = replycount + 1
        WHERE
            id = ${data.post_id}
        ;
    
    `;
    await db.execute(sql);
    return db.execute(sql2);
 }








 /**********************
 * FOR SEEDING DATABASE
 **********************/
 exports.seedPosts = posts => {
    let values = ``
    for(let i = 0; i < posts.length; i++){
        let post = posts[i];
        values += `
        (
            '${post.user_id}',
            '${post.category_id}',
            '${post.heading}',
            '${post.details}'
        )${i == posts.length - 1 ? ";":","}
        `
    }
    let sql = `Insert into post (user_id, category_id, heading, details) values
       ${values}
   `;
   return db.execute(sql);
 }
