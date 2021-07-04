const {client} = require("./init.db")


function favoriteArticleBySlug(slug, myId){
    return client.query(`
        INSERT INTO article_favorites
        VALUES (
            (SELECT article_id FROM articles WHERE slug = $1),
            $2
        )
        ON CONFLICT DO NOTHING
        RETURNING *
    `, [slug, myId])
}

function deleteFavoriteArticleBySlug(slug, myId){
    return client.query(`
        DELETE FROM article_favorites
        WHERE article_id = (
            SELECT article_id FROM articles WHERE slug = $1
        ) AND user_id = $2
        RETURNING *
    `, [slug, myId])
}

module.exports = {
    favoriteArticleBySlug,
    deleteFavoriteArticleBySlug
}