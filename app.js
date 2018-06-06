// ================== Global Variables ============================================
const expressSanitizer = require("express-sanitizer"),
      methodOverride   = require("method-override"),
      bodyParser       = require("body-parser"),
      exphbs           = require("express-handlebars"),
      mongoose         = require("mongoose"),
      mongojs          = require("mongojs");
      request          = require("request"),
      cheerio          = require("cheerio"),
      express          = require("express"),
      app              = express();

// models

var Posting = require("./models/JobPosting");
var Note = require("./models/Note");
var scrapeJS = require("./controller/scrape");

// sets port for Heroku or Local Host
const PORT = process.env.PORT || 3000;
// sets mongoDB for Heroku or defaults to local
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/ksl_jobs_db";

// ================== APP CONFIG ============================================
    // connects to mongo Database for app
mongoose.Promise = Promise;
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

// INDEX Route redirect
app.get("/", function (req, res) {
    res.redirect("/jobs");
});

// GET - INDEX Route
app.get("/jobs", function (req, res) {
    Posting.find({}, null, {
        sort: {
            created: -1
        }
    }, function (err, data) {
        if (err) {
            console.log("You encountered this error: " + err);
        } else {
            res.render("index", {
                postings: data
            });
        }
    });
});
// GET - SAVED POSTS page Route
app.get("/jobs/saved", function (req, res) {
    Posting.find({isSaved:true}, null, {
        sort: {
            created: -1
        }
    }, function (err, data) {
        if (err) {
            console.log("You encountered this error: " + err);
        } else {
            res.render("saved", {
                postings: data
            });
        }
    });
});

// GET - SCRAPE Full Stack Dev Route
app.get("/jobs/new/fullStackDev", function (req,res) {  
    var fullStackDev = "https://www.ksl.com/jobs/search/miles/0/keywords/full%20stack%20developer/page/1";
    scrapeJS.scrape(fullStackDev);
    res.redirect("/jobs");
})
// GET - SCRAPE Full Stack Dev Route
app.get("/jobs/new/frontEndDev", function (req,res) {  
    var frontEndDev = "https://www.ksl.com/jobs/search/miles/0/keywords/front%20end%20developer/page/1";
    scrapeJS.scrape(frontEndDev);
    res.redirect("/jobs");
})
// GET - SCRAPE Full Stack Dev Route
app.get("/jobs/new/backEndDev", function (req,res) {  
    var backEndDev = "https://www.ksl.com/jobs/search/miles/0/keywords/back%20end%20developer/page/1";
    scrapeJS.scrape(backEndDev);
    res.redirect("/jobs");
})
// GET - SCRAPE Full Stack Dev Route
app.get("/jobs/new/webDev", function (req,res) {  
    var webDev = "https://www.ksl.com/jobs/search/miles/0/keywords/web%20developer/page/1";
    scrapeJS.scrape(webDev);
    res.redirect("/jobs");
})
// GET - SCRAPE Full Stack Dev Route
app.get("/jobs/new/uIuXDev", function (req,res) {  
    // var uIuXDev = "https://www.ksl.com/jobs/search/miles/0/keywords/UI%2FUX%20developer/page/1";
    var uIuXDev = "https://www.ksl.com/jobs/search/miles/0/keywords/UI%20UX%20developer/page/1";
    scrapeJS.scrape(uIuXDev);
    res.redirect("/jobs");
})
// GET - Route that grabs specific document
app.get("/jobs/:id", function (req,res) {
        Posting.findOne({_id: req.params.id})
        .populate("note")
        .then(function (dbJob) {
                res.send(dbJob);
           })
        .catch(function (err) {
               res.send(err);
        });
     
    
})

// UPDATE - save job posting
app.get("/jobs/save/:id", function (req, res) {
    Posting.findById(req.params.id, function (err, data) {
    if (err) {
        console.log("You encountered this error: " + err);
    } else {
        data.set({isSaved: true});
        data.save(function (err, updatedData) {
            if (err) {
                console.log(err);
            } else {
                res.redirect("/jobs"); 
            }
        })
        
    }
    });
});

app.post("/jobs/note/:id", function (req,res) {
    Note.create(req.body)
        .then(function (dbNote) {
            return Posting.findOneAndUpdate({
                _id: req.params.id
            }, {
                note: dbNote._id
            }, {
                new: true
            });
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

// DELETE - save job posting
app.get("/jobs/delete/:id", function (req, res) {
    Posting.deleteOne({
            _id: req.params.id
        }, function (err, data) {
            if (err) {
                console.log("You encountered this error: " + err);
            } else {
                // res.redirect("/jobs");
                res.redirect('back');
            }
        });
});



// ================== APP START ============================================

// APP Startup Log
app.listen(PORT, function () {
    console.log("Listening on PORT: " + PORT);
});
