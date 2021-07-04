const {Router} = require("express");
const { gatewayCheck } = require("../services/apiGateway");
const {
    favoriteArticleBySlug,
    deleteFavoriteArticleBySlug
} = require("../databaseClient")

const router = Router();

router.post(
    "/:slug/favorite",
    gatewayCheck("user-required"),
    async(req,res) => {
        const { slug } = req.params;
        const myId = req.user.userId; 
        const articleData = await favoriteArticleBySlug(slug, myId);
        const article = articleData.rows[0];
        res.json({
            message: "POST article favorite by slug!",
            article
        })
    }
)

router.delete(
    "/:slug/favorite",
    gatewayCheck("user-required"),
    async(req,res) => {
        const { slug } = req.params;
        const myId = req.user.userId; 
        const articleData = await deleteFavoriteArticleBySlug(slug, myId);
        const article = articleData.rows[0];
        res.json({
            message: "DELETE article favorite by slug!",
            article
        })
    }
)

module.exports = router