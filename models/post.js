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

 exports.getLatestPosts = state => {
     let sql = `SELECT p.id, p.user_id, p.category_id, p.heading, p.details,
     p.senddate, p.replycount, u.imageurl
     FROM post as p
     JOIN user as u on p.user_id = u.id
     WHERE p.user_id <> ${state.user_id}
     ORDER BY senddate DESC
     LIMIT 5`;

     return db.execute(sql);
 }
