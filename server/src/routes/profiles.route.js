const {Router} = require("express");
const { 
    getProfileByUsername,
    followUser,
    unfollowUser
} = require("../databaseClient/profile.db");
const { gatewayCheck } = require("../services/apiGateway")


const router = Router();

router.get(
    "/:username",
    gatewayCheck("user"),
    async(req,res) => {
        const profileName = req.params.username;
        const myId = req.user && req.user.userId;
        const data = await getProfileByUsername(profileName, myId)
        res.json({
            message: "GET profile",
            profile: data.rows[0]
        })
    }
)

router.post(
    "/:username/follow", 
    gatewayCheck("user-required"),
    async (req,res) => {
        const profileName = req.params.username; 
        const myId = req.user.userId;
        const data = await followUser(profileName, myId);
        res.json({
            message: "POST follow",
            profile: data.rows[0]
        });
    }
)

router.delete(
    "/:username/follow", 
    gatewayCheck("user-required"),
    async (req,res) => {
        const profileName = req.params.username; 
        const myId = req.user.userId;
        const data = await unfollowUser(profileName, myId);
        res.json({
            message: "DELETE follow",
            profile: data.rows[0]
        });
    }
)

module.exports = router;