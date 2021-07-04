const {Router} = require("express")
const {
    getTags
} = require("../databaseClient")
const router = Router();

router.get("/", async (req,res) => {
    const tagData = await getTags();
    const tags = tagData.rows.map(({name}) => name)
    res.json({
        message: "GET tags",
        tags
    })
})

module.exports = router;