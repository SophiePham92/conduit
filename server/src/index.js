const express = require("express");
const registerRouteHandlers = require("./routes")
require("./databaseClient")

const app = express();

app.use(express.json())
registerRouteHandlers(app);



app.listen(3000, () => {
    console.log("App is listening on port 3000!")
})
