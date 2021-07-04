const {client} = require("./init.db")

async function getProfileByUsername(profileName, myId){
    return client.query(
        `SELECT user_id, username, bio, image, 
            case when follower_id is null 
            then false 
            else true 
            end as following
        FROM users
        LEFT JOIN follows 
            ON follower_id = $2 AND followed_id = user_id
        WHERE username = $1`,
        [profileName, myId] 
    );
}

async function followUser(followedUserId, myId){
    return client.query(
        `SELECT * FROM follow_user($1, $2)`,
        [followedUserId, myId] 
    );
}

async function unfollowUser(unfollowedUsername, myId){
    return client.query(
        `SELECT * FROM unfollow_user($1, $2)`,
        [unfollowedUsername, myId] 
    );
}

module.exports = {
    getProfileByUsername,
    followUser,
    unfollowUser
}