console.log("API ROUTES")
var db = require("../models");
var axios = require("axios");

module.exports = function (app) {

  app.all("/*", function (req, res, next) {
    ssn = req.session;
    if (ssn.username) {
      res.locals.data = {
        loggedIn: true,
        username: ssn.username
      };
    }
    next();
  })

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
      res.json(response.data)
    })
  })

  //Gets Popular Movies and Passes data to popular.handlebars
  app.get("/popular", function (req, res) {
    axios
      .get("https://api.themoviedb.org/3/movie/popular", {
        params: {
          api_key: process.env.APIKEY,
        }
      })
      .then(function (response) {
        var data = response.data.results;
        data.forEach(function (result) {
          var overview = result.overview.substring(0, 80) + "...";
          result.trimmedOverview = overview;
        })

        res.render("popular", {
          popular: data
        });
      })
      .catch(function (err) {
        console.log(err);
      });
  });
};
