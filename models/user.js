let db = require('../util/db');



exports.createUser = (data) => {
    let sql = `Insert into user (firstName, lastName, email, password) values ('
        '${data.firstName}',
        '${data.lastName}', 
        '${data.email}', 
        '${data.password}'
    )`;
    return db.execute(sql);
}