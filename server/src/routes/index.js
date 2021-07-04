const userRoutes = require("./users.route");
const profileRoutes = require("./profiles.route");
const articleRoutes = require("./articles.route");
const articleFavoriteRoutes = require("./article-favorites.route")

module.exports = app => {
    app.use("/api/users", userRoutes);
    app.use("/api/profiles", profileRoutes);
    app.use("/api/articles", articleFavoriteRoutes);
    app.use("/api/articles", articleRoutes);
}