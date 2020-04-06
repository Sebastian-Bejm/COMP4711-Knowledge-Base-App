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