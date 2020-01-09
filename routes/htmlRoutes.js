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
  // Load index page
  app.get("/", function (req, res) {
    db.Mood.findAll({}).then(function (dbMoods) {
      res.render("index", {
        msg: "Welcome!",
        moods: dbMoods
      });
    });
  });

  //Load example page and pass in an example by id
  app.get("/mood/:mood", function (req, res) {
    let inputMood = req.params.mood

    db.Mood.findOne({ where: { mood: inputMood } }).then(function (
      data
    ) {
      //console.log(data)
      var genre = data.genre_id.split(",")
      let genreArray = genre.map(id => parseInt(id))
      //console.log("genreArray:", genreArray)
      let query = "https://api.themoviedb.org/3/discover/movie?api_key=" + process.env.APIKEY + "&with_genres=" + genreArray[0]
      //console.log(query)
      axios.get(query)
        .then(function (response) {

          // verify that the movie contain at least all the genre coming for the genreArray
          //let results = response.data.map(movie => movie.)
          res.json(response.data)
        })
    });

  });

  //ACCOUNT ROUTES
  app.get("/account", function (req, res) {
    ssn = req.session;
    // ssn.destroy();
    if (!ssn.username) {
      res.redirect("/account/login");
    } else {
      db.User.findOne({ where: { username: ssn.username } }).then(function (dbUser) {
        res.render("account", {
          user: dbUser
        });
      });

    }
  })

  app.get("/account/login", function (req, res) {
    res.render("loginAccount");
  })

  app.post("/account/login", function (req, res) {
    var response = {};
    db.User.findOne({ where: { email: req.body.email, password: req.body.password } }).then(function (dbUser) {
      ssn = req.session;
      ssn.username = dbUser.get("username");
      response.success = true;
      res.json(response);

    }).catch(function (err) {
      response.success = false;
      res.json(response);
    })
  })

  app.post("/account/create", function (req, res) {
    db.User.create(req.body).then(function (dbUser) {
      ssn = req.session;
      ssn.username = dbUser.get('username');
      var response = { success: true };
      res.json(response);
    })
  })

  app.get("/account/create", function (req, res) {
    res.render("createAccount");
  })

  app.get("/account/logout", function (req, res) {
    ssn = req.session;
    ssn.destroy(function () {
      res.redirect("/");
    })
  })

  app.post("/account", function (req, res) {
    ssn = req.session;
    var response = {};
    db.User.update({ username: req.body.username, email: req.body.email, password: req.body.password }, {
      where: {
        username: ssn.username
      }
    }).then(function () {
      ssn.username = req.body.username;
      response.success = true;
      res.json(response);
    }).catch(function (err) {
      response.success = false;
      res.json(response);
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
        res.render("popular", {
          popular: response.data.results
        });
      })
      .catch(function (err) {
        console.log(err);
      });
  });

  //Gets Latest Movies and Passes data to latest.handlebars
  app.get("/latest", function (req, res) {
    axios
      .get("https://api.themoviedb.org/3/movie/latest", {
        params: {
          api_key: process.env.APIKEY,
        }
      })
      .then(function (response) {

        // console.log(response.data);
        res.render("latest", {
          data: response.data
        });
      })
      .catch(function (err) {
        console.log(err);
      });
  });


  //Gets Genres and Passes data to genre.handlebars
  app.get("/genre", function (req, res) {
    axios
      .get("https://api.themoviedb.org/3/genre/movie/list?", {
        params: {
          api_key: process.env.APIKEY,
        }
      })
      .then(function (response) {

        res.render("genre", {
          genres: response.data.genres
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
