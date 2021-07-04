const {client} = require("./init.db")

async function createArticle({slug, title, body, description, authorId}){
    return client.query(
        `INSERT INTO articles(slug, title, body, description, author_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [slug, title, body, description, authorId] 
    );
}

async function getArticleBySlug(slug, authorId){
    return client.query(
        `SELECT *
        FROM articles
        LEFT JOIN users
            ON user_id = author_id
        WHERE slug = $1`,
        [slug] 
    );
}

async function deleteArticleBySlug(slug, myId){
    return client.query(
        `DELETE FROM articles
        WHERE slug = $1 AND author_id = $2
        RETURNING *`,
        [slug, myId] 
    );
}

async function updateArticleBySlug(articleSlug, {slug, title, body, description}){
    const updateItems = []
    if(title) updateItems.push(`
        title = '${title}',
        slug = '${slug}'
    `)
    if(body) updateItems.push(`body = '${body}'`);
    if(description) updateItems.push(`description = '${description}'`);
    const updateString = updateItems.join(",");
    console.log('meo', {updateString})
    return client.query(
        `UPDATE articles
        SET ${updateString}
        WHERE slug = $1
        RETURNING *`,
        [articleSlug] 
    );
}

async function getArticles({myId, author, favorited, limit = 20, offset = 0, isFeed}){
    const whereConditions = [];
    if(author) whereConditions.push(`author.username = '${author}'`);
    if(favorited) whereConditions.push(`
        article_id IN (
            SELECT article_id 
            FROM article_favorites
            LEFT JOIN users as favorited_users
                ON article_favorites.user_id = favorited_users.user_id
            WHERE favorited_users.username = '${favorited}'
        )
    `)
    if(isFeed) whereConditions.push(`
        article_id IN (
            SELECT article_id 
            FROM articles
            INNER JOIN follows
                ON author_id = followed_id
            WHERE follower_id = ${myId}
        )
    `);
    const whereClause = whereConditions.length ? "WHERE " + whereConditions.join(" AND ") : "";
    return client.query(
        `select 
            article_id,
            slug,
            title,
            body,
            description,
            created_at,
            updated_at,
            (
                select 1::boolean from article_favorites
                where article_favorites.user_id = $1 
                    AND article_favorites.article_id = articles.article_id
            ) as "favorited",
            (
                select count(*)::int from article_favorites 
                where article_favorites.article_id = articles.article_id
            ) as "favoritesCount",
            (
                select 1::boolean from follows
                where follows.followed_id = author_id
                    AND follows.follower_id = $1
            ) as "author.following",
            username as "author.username",
            bio as "author.bio",
            image as "author.image"                                                     
        from articles
        left join users as author
            on author_id = author.user_id
        ${whereClause}
        order by created_at desc
        limit $2
        offset $3`,
        [myId, limit, offset] 
    );
}


module.exports = {
    createArticle,
    getArticleBySlug,
    getArticles,
    updateArticleBySlug,
    deleteArticleBySlug
}