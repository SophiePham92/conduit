const {Router} = require("express");

const router = Router();

router.get("/:username", (req,res) => {
    res.send("GET profile")
})

router.post("/:username/follow", (req,res) => {
    res.send("POST follow")
})

router.delete("/:username/follow", (req,res) => {
    res.send("DELETE follow")
})

module.exports = router;