const {client} = require("./init.db")


function createTags(articleId, tagList = []){
    const tagItems = tagList.map(name => {
        return `('${name}', ${articleId})`
    })
    const tagInsertionString = tagItems.join(",")
    return client.query(`
        INSERT INTO tags
        VALUES ${tagInsertionString}
        ON CONFLICT DO NOTHING
        RETURNING *
    `)
}

function getTags(){
    return client.query(`
        SELECT distinct(name) FROM tags
    `)
}


module.exports = {
    createTags,
    getTags
}