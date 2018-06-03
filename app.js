// ================== Global Variables ============================================
var expressSanitizer = require("express-sanitizer"),
    methodOverride   = require("method-override"),
    bodyParser       = require("body-parser"),
    exphbs           = require("express-handlebars"),
    mongoose         = require("mongoose"),
    mongojs          = require("mongojs");
    request          = require("request"),
    cheerio          = require("cheerio"),
    express          = require("express"),
    app              = express();

// sets port for Heroku or Local Host
const PORT = process.env.PORT || 3000;
// sets mongoDB for Heroku or defaults to local
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// ================== APP CONFIG ============================================
    // connects to mongo Database for app
mongoose.connect(MONGODB_URI);
    // sets handlebars as our default view engine
app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

    // required express code to use the public folder for client CSS and JS
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
    // Sanitizes input html code in input box to prevent malicious scripts
app.use(expressSanitizer());
    // allows for RESTful api "put" and "delete" URL overrides
app.use(methodOverride("_method"));

// ================== API ROUTES ============================================

app.get("/", function (req, res) {
    res.redirect("/jobs");
});

app.get("/jobs", function (req, res) {
    res.render("index");
});

// ================== APP START ============================================

// APP Startup Log
app.listen(PORT, function () {
    console.log("Listening on PORT: " + PORT);
});
