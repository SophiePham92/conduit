const {Router} = require("express");
const {createUser, loginUser, getUserByEmail, updateUser} = require("../databaseClient");
const { gatewayCheck } = require("../services/apiGateway")

const router = Router();

router.post("/login", async (req,res) => {
    try {
        const {email, password: pPassword} = req.body;
        const loginUserInput = {email, password: pPassword}
        const loginRes = await loginUser(loginUserInput);
        const {password, ...userDataReturned} = loginRes.rows[0];
        res.json({
            message: "login successfully!",
            data: {
                user: userDataReturned
            }
        })
    } catch(err){
        res.status(400).json({
            code: err.code,
            message: err.detail
        })
    }  
})

router.post("/", async (req,res) => {
    try {
        const {email, password: pPassword, username} = req.body;
        const newUserInput = {email, password: pPassword, username}
        const newUserRes = await createUser(newUserInput);
        const {password, ...userDataReturned} = newUserRes.rows[0]
        res.json({
            message: "new user created!",
            data: {
                user: userDataReturned
            }
        })
    } catch(err){
        res.status(400).json({
            code: err.code,
            message: err.detail
        })
    }
    
})

router.get(
    "/me", 
    gatewayCheck("user-required"),
    async (req,res) => {
        const {email} = req.user
        const myUserRes = await getUserByEmail(email);
        const {password, ...myUserDataReturned} = myUserRes.rows[0];
        res.json({
            message: "My data!",
            data: {
                user: myUserDataReturned
            }
        })
    }
)

router.put(
    "/me",
    gatewayCheck("user-required"),
    async (req,res) => {
        try {
            const {userId} = req.user;
            const {email, username, password: pPassword, image, bio} = req.body;
            const updateUserInput = {email, username, password: pPassword, image, bio};
            const updateUserRes = await updateUser(userId, updateUserInput);
            const {password, ...updateUserDataReturned} = updateUserRes.rows[0];
            res.json({
                message: "Update my data!",
                data: {
                    user: updateUserDataReturned
                }
            })
        } catch(err){
            console.log({err})
            res.status(400).json({
                code: err.code,
                message: err.detail
            })
        }
    }
)

module.exports = router;