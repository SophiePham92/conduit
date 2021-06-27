const userRoutes = require("./users.route");
const profileRoutes = require("./profiles.route")

module.exports = app => {
    app.use("/api/users", userRoutes);
    app.use("/api/profiles", profileRoutes);
}