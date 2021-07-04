const {Router} = require("express");
const slugify = require("slugify");
const { 
    createArticle,
    getArticleBySlug,
    getArticles
} = require("../databaseClient");
const {
    getProfileByUsername
} = require("../databaseClient")
const { gatewayCheck } = require("../services/apiGateway")


const router = Router();

function slugifyArticleTitle(title){
    const randomString = Math.random().toString(36).substr(2, 5);
    return slugify(title + "-" + randomString)
}

router.post(
    "/",
    gatewayCheck("user-required"),
    async(req,res) => {
        const { title, description, body, tagList = [] } = req.body;
        const authorId = req.user.userId;     
        const slug = slugifyArticleTitle(title);
        const data = await createArticle({slug, title, description, body, authorId})
        res.json({
            message: "New article created!",
            article: data.rows[0] 
        })
    }
)

router.get(
    "/feed",
    gatewayCheck("user-required"),
    async(req,res) => {
        const myId = req.user.userId; 
        const articleData = await getArticles({myId, isFeed: true});
        const parsedArticles = parseArticlesResult(articleData.rows)
        res.json({
            message: "GET articles feed!",
            articles: parsedArticles,
            articlesCount: parsedArticles.length
        })
    }
)

router.get(
    "/:slug",
    gatewayCheck("user"),
    async(req,res) => {
        const { slug } = req.params;
        const myId = req.user && req.user.userId; 
        const articleData = await getArticleBySlug(slug, myId);
        const article = articleData.rows[0];
        const authorProfileData = await getProfileByUsername(article.username, myId);
        res.json({
            message: "GET article by slug!",
            article: {
                ...article,
                author: authorProfileData.rows[0]
            } 
        })
    }
)

router.get(
    "/",
    gatewayCheck("user"),
    async(req,res) => {
        const {tag, author, favorited, limit, offset} = req.query
        const myId = req.user && req.user.userId; 
        const articleData = await getArticles({myId, tag, author, favorited, limit, offset});
        const parsedArticles = parseArticlesResult(articleData.rows)
        res.json({
            message: "GET articles!",
            articles: parsedArticles,
            articlesCount: parsedArticles.length
        })
    }
)



function parseArticlesResult(articles){
    return articles.map(article => {
        const authorKeys = ["author.username", "author.bio", "author.following", "author.image"];
        authorKeys.forEach(key => {
            const newKey = key.replace("author.", "")
            article.author = {
                ...(article.author || {}),
                [newKey]: key == "author.following" ? !!(article[key]) : article[key]
            }
            delete article[key];
        })
        article.favorited = !!(article.favorited)
        return article
    })
}

module.exports = router;