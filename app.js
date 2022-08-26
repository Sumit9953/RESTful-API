const express = require("express")
const bodyparser = require("body-parser")
const mongoose = require("mongoose")
const ejs = require("ejs")

const app = express();
app.use(bodyparser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB2");

const wikischema = {
    title: String,
    content: String
}

const Article = mongoose.model("article", wikischema);

app.route("/articles")

    .get(function (req, res) {
        Article.find({}, function (err, Foundarticle) {
            if (!err) {
                res.send(Foundarticle);
            }
        })
    })

    .post(function (req, res) {
        const Newarticle = new Article({
            title: req.body.title,
            content: req.body.content
        })
        Newarticle.save(function (err) {
            if (!err) {
                res.send("successfully added")
            } else {
                console.log(err);
            }
        });
    })

    .delete(function (req, res) {
        Article.deleteMany({}, function (err) {
            if (!err) {
                res.send("successfully Deleted");
            } else {
                res.send(err);
            }
        })
    });

//-------------------RESTful API for particular-----------------------//
app.route("/articles/:articleTitle")
    .get(function (req, res) {
        Article.findOne({ title: req.params.articleTitle }, function (err, foundArticle) {
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("No articles matching that title was found !");
            }
        });
    })
    .put(function (req, res) {
        Article.updateOne(
            { title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            function (err) {
                if (!err) {
                    console.log("successfully updated");
                } else {
                    console.log(err);
                }
            }
        )
    })
    .patch(function (req, res) {
        Article.updateOne(
            { title: req.params.articleTitle },
            { $set: req.body },
            function (err) {
                if (!err) {
                    res.send("successfully updated");
                } else {
                    res.send(err)
                }
            }
        )
    })
    .delete(function (req, res) {
        Article.deleteOne(
            { title: req.params.articleTitle },
            function (err) {
                if (!err) {
                    res.send("successfully Deleted")
                } else {
                    res.send(err);
                }
            }
        )
    });


app.listen(3000, function () {
    console.log("server started on port 3000");
});