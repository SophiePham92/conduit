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

module.exports = {
    client,
    initDbConnection
}