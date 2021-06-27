const {Client} = require("pg");
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'conduit',
    password: null,
    port: 5432,
});

async function initDbConnection(){
    await client.connect();
}

initDbConnection()

async function createUser(newUser){
    const {email, password, username} = newUser;
    return client.query(
        'SELECT * FROM sign_up($1, $2, $3, $4, $5)',
        [email, password, username, undefined, undefined] 
    );
}

async function loginUser(userData){
    const {email, password} = userData;
    return client.query(
        'SELECT * FROM log_in($1, $2)',
        [email, password] 
    );
}

async function getUserByEmail(email){
    return client.query(
        `SELECT * FROM users
        WHERE email = $1`,
        [email] 
    );
}

async function updateUser(userId, updateUserData){
    const updateString = Object.entries(updateUserData).reduce((finalString, [key, value]) => {
        if(!value) return finalString;
        return finalString += `${key} = '${value}',`;
    }, "");
    const updateStringTrimComma = updateString.substring(0, updateString.length - 1);
    return client.query(`
        UPDATE users
        SET ${updateStringTrimComma}
        WHERE user_id = $1::int
        RETURNING *;
        `,
        [userId] 
    );
}

module.exports = {
    createUser,
    loginUser,
    getUserByEmail,
    updateUser
}


