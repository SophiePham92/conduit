const {
    client, 
    initDbConnection
} = require("./init.db")
const {
    createUser,
    loginUser,
    getUserByEmail,
    updateUser
} = require("./user.db");
const { 
    getProfileByUsername,
    followUser,
    unfollowUser
} = require("./profile.db"); 

const {
    createArticle,
    getArticleBySlug,
    getArticles,
    updateArticleBySlug,
    deleteArticleBySlug
} = require("./article.db");

const {
    favoriteArticleBySlug,
    deleteFavoriteArticleBySlug
} = require("./article-favorites.db")

initDbConnection();

module.exports = {
    client,
    initDbConnection,
    createUser,
    loginUser,
    getUserByEmail,
    updateUser,
    getProfileByUsername,
    followUser,
    unfollowUser,
    createArticle,
    getArticleBySlug,
    getArticles,
    updateArticleBySlug,
    deleteArticleBySlug,
    favoriteArticleBySlug,
    deleteFavoriteArticleBySlug
}


