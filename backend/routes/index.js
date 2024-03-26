const { handle_404_requests } = require("../controller/errorRouteController");
const statusRoutes = require("./statusRoutes");
const sampleRoutes = require("./sampleRoutes");


module.exports = (app) => {
    // declaring all the different parent paths to be used in the api
    app.use("/api/v1/status", statusRoutes);
    app.use("/api/v1/samples", sampleRoutes);


    
    // handle unknown routes
    app.use(handle_404_requests);
}