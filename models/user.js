let db = require('../util/db');

exports.createUser = (data) => {
    let sql = `Insert into user (firstname, lastname, email, password) values (
        '${data.firstname}',
        '${data.lastname}', 
        '${data.email}', 
        '${data.password}'
    )`;
    return db.execute(sql);
}

exports.registerUser = (data) => {
    let sql = `UPDATE user SET 
        imageurl = '${data.imageurl}', 
        about = '${data.about}', 
        dob = '${data.dob}', 
        country = '${data.country}'
        WHERE
            id = ${data.id}
        ;
    `;
    return db.execute(sql);
}

exports.addLike = id => {
    let sql = `UPDATE user SET 
        likes = likes + 1
        WHERE
            id = ${id}
        ;
    `;
    return db.execute(sql);
}

exports.getUserByEmail = email => {
   let sql = ` SELECT * FROM user
    WHERE email = '${email}'
   `
   return db.execute(sql);
}

exports.getUserById = id => {
    let sql = ` SELECT id, firstname, lastname, email, imageurl, about, country, postcount, likes FROM user
     WHERE id = '${id}'
    `
    return db.execute(sql);
 }

 exports.getUserForMessage = id => {
    let sql = ` SELECT imageurl, firstname, lastname FROM user
    WHERE id = '${id}'
   `
   return db.execute(sql);
 }

 exports.editUser = user => {
    let sql = `UPDATE user SET 
    firstname = '${user.firstname}', 
    lastname = '${user.lastname}', 
    imageurl = '${user.imageurl}', 
    about = '${user.about}', 
    dob = '${user.dob}', 
    country = '${user.country}'
    WHERE
        id = ${user.id}
    ;
`;
return db.execute(sql);
 }










 /**********************
 * FOR SEEDING DATABASE
 **********************/
 exports.seedUsers = users => {
     let values = ``
     for(let i = 0; i < users.length; i++){
         let user = users[i];
         values += `
         (
             '${user.firstname}',
             '${user.lastname}',
             '${user.email}',
             '${user.password}',
             '${user.imageurl}',
             '${user.about}',
             '${user.dob}',
             '${user.country}'
         )${i == users.length - 1 ? ";":","}
         `
     }
     let sql = `Insert into user (firstname, lastname, email, password, imageurl, about, dob, country) values
        ${values}
    `;
    return db.execute(sql);
 }