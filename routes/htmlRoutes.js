var db = require("../models");
var axios = require("axios");

module.exports = function (app) {
  // Load index page
  app.get("/", function (req, res) {
    db.Example.findAll({}).then(function (dbExamples) {
      res.render("index", {
        msg: "Welcome!",
        examples: dbExamples
      });
    });
  });

  // Load example page and pass in an example by id
  app.get("/example/:id", function (req, res) {
    db.Example.findOne({ where: { id: req.params.id } }).then(function (
      dbExample
    ) {
      res.render("example", {
        example: dbExample
      });
    });
  });

  app.get("/popular", function (req, res) {
    axios
      .get("https://api.themoviedb.org/3/movie/popular", {
        params: {
          api_key: process.env.APIKEY,
        }
      })
      .then(function (response) {
        res.render("popular", {
          data: response.data.results
        });
      })
      .catch(function (err) {
        console.log(err);
      });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });
};
