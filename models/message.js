let db = require('../util/db');


exports.sendMessage = async data => {
    let sql = `Insert into message (sender_id, receiver_id, subject, details) values (
        ${data.sender_id},
        ${data.receiver_id}, 
        '${data.subject}', 
        '${data.details}'
    );
    `;
    let sql2 = `
    UPDATE user SET 
        messagecount = messagecount + 1
        WHERE
            id = ${data.receiver_id}
        ;
    `;
    await db.execute(sql);
    return db.execute(sql2);
}

exports.getAllMessages = user_id => {
    let sql =  `SELECT * from message
        WHERE sender_id = ${user_id} OR receiver_id = ${user_id}
    `
    return db.execute(sql);
}

exports.getMessageReplies = message_id => {
    let sql = `SELECT mr.details, u.imageurl, mr.user_id, mr.id, mr.message_id
     FROM messagereply as mr
     JOIN user as u on mr.user_id = u.id
     WHERE mr.message_id = ${message_id}
     ORDER BY senddate DESC`;
     return db.execute(sql);
}