const {getUserByEmail} = require("../databaseClient/index")

function gatewayCheck(userRoleArray){
    const [role, required] =  userRoleArray.split("-");   
    return async (req,res,next) => {
        const userEmail = req.get('Authorization');
        const myUserDataRes = await getUserByEmail(userEmail);        
        if(required && !myUserDataRes.rows[0]) return res.status(401).json({
            message: "Unauthorized!"
        })
        if(myUserDataRes.rows[0]){
            const {password, user_id, ...myUserDataReturned} = myUserDataRes.rows[0];
            req.user = {...myUserDataReturned, userId: user_id};
        }
        next()
    }
}

module.exports = {
    gatewayCheck
}