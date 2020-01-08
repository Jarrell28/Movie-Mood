var db = require("../models");
var axios = require("axios");

module.exports = function (app) {
  // Get all examples
  app.get("/api/examples", function (req, res) {
    db.Example.findAll({}).then(function (dbExamples) {
      res.json(dbExamples);
    });
  });

  // Create a new example
  app.post("/api/examples", function (req, res) {
    db.Example.create(req.body).then(function (dbExample) {
      res.json(dbExample);
    });
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function (req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function (dbExample) {
      res.json(dbExample);
    });
  });

  //Handles the movie search form, gets data and passes it back to front end
  app.post("/search/movie", function (req, res) {
    axios.get("https://api.themoviedb.org/3/search/movie", {
      params: {
        api_key: process.env.APIKEY,
        query: req.body.search
      }
    }).then(function (response) {
      res.json(response.data.results);
    });
  });

  //Gets movie detail from api and passes data back to front end
  app.get("/movie/:id", function (req, res) {
    axios.get("https://api.themoviedb.org/3/movie/" + req.params.id, {
      params: {
        api_key: process.env.APIKEY
      }
    }).then(function (response) {
      res.json(respone.data)
    })
  })
};
