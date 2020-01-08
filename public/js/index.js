var $exampleText = $("#example-text");
var $exampleDescription = $("#example-description");
var $submitBtn = $("#submit");
var $exampleList = $("#example-list");

// The API object contains methods for each kind of request we'll make
var API = {
  saveExample: function (example) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/examples",
      data: JSON.stringify(example)
    });
  },
  getExamples: function () {
    return $.ajax({
      url: "api/examples",
      type: "GET"
    });
  },
  deleteExample: function (id) {
    return $.ajax({
      url: "api/examples/" + id,
      type: "DELETE"
    });
  }
};

// refreshExamples gets new examples from the db and repopulates the list
var refreshExamples = function () {
  API.getExamples().then(function (data) {
    var $examples = data.map(function (example) {
      var $a = $("<a>")
        .text(example.text)
        .attr("href", "/example/" + example.id);

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": example.id
        })
        .append($a);

      var $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("ｘ");

      $li.append($button);

      return $li;
    });

    $exampleList.empty();
    $exampleList.append($examples);
  });
};

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleFormSubmit = function (event) {
  event.preventDefault();

  var example = {
    text: $exampleText.val().trim(),
    description: $exampleDescription.val().trim()
  };

  if (!(example.text && example.description)) {
    alert("You must enter an example text and description!");
    return;
  }

  API.saveExample(example).then(function () {
    refreshExamples();
  });

  $exampleText.val("");
  $exampleDescription.val("");
};

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
var handleDeleteBtnClick = function () {
  var idToDelete = $(this)
    .parent()
    .attr("data-id");

  API.deleteExample(idToDelete).then(function () {
    refreshExamples();
  });
};

// Add event listeners to the submit and delete buttons
$submitBtn.on("click", handleFormSubmit);
$exampleList.on("click", ".delete", handleDeleteBtnClick);


//Function to handle the movie search
function handleSearch(e) {
  e.preventDefault();

  var search = $("#search-val").val();

  $.ajax({
    method: "POST",
    url: "/search/movie",
    data: { search: search },
    success: function (data) {
      //Display results in html
      console.log(data);
    }
  });
}
//Movie Search Form Event Listener
$("#search-form").on("submit", handleSearch);


//Gets Movie Data when clicking movie poster from backend
$(".popular").on("click", ".movie", function (e) {
  e.preventDefault();

  var id = $(this).data("id");

  $.ajax({
    method: "GET",
    url: "/movie/" + id,
    data: { id: id },
    success: function (data) {
      console.log(data);

      $("#popular-modal .modal-title").html(data.title);

      var genres = [];
      data.genres.forEach(function (genre) {
        genres.push(genre.name);
      });

      var movieHtml = `
        <img src="https://image.tmdb.org/t/p/original${data.backdrop_path}"/ class="d-block img-fluid">
        <p class="mt-2">${data.overview}</p>

        <p class="my-2"><a href="${data.homepage}" target="_blank">Movie Homepage</a></p>

        <p class="my-2">Released Date: ${data.release_date}</p>
        <p class="my-2">Rating: ${data.vote_average}</p>
        <p class="my-2">Minutes: ${data.runtime}</p>
        <p class="my-2">Genres: ${genres.join()}</p>
      `;

      $("#popular-modal .modal-body").html(movieHtml);

      $("#popular-modal-btn").trigger("click");
    }
  })
});

//Create User account handle

$("#createAccountForm").on("submit", function (e) {
  e.preventDefault();

  var account = {
    username: $("#createUsername").val(),
    email: $("#createEmail").val(),
    password: $("#createPassword").val()
  }

  $.ajax({
    method: "POST",
    url: "/account/create",
    data: account,
    success: function (data) {

      if (data.success) {
        window.location.href = "/account";
      }
    }
  })

});

$("#loginAccountForm").on("submit", function (e) {
  e.preventDefault();

  var account = {
    email: $("#loginEmail").val(),
    password: $("#loginPassword").val()
  }

  $.ajax({
    method: "POST",
    url: "/account/login",
    data: account,
    success: function (data) {
      if (data.success) {
        window.location.href = "/account";
      } else {
        console.log("login failed");
      }
    }
  })

});

$(".mood-btn").on("click", function () {

  var btnText = $(this).text();

  $.ajax({
    type: "GET",
    url: "/mood/" + btnText,
    success: function (data) {
      console.log(data);

      $(".popular").empty();
      data.results.forEach(function (result) {

        var moodHtml = `<div class="card">
      <img src="https://image.tmdb.org/t/p/original${result.backdrop_path}" class="card-img-top" alt="...">
      <div class="card-body">
          <h5 class="card-title">${result.title}</h5>
          <p class="card-text">Rating: ${result.vote_average}</p>
          <button class="btn btn-info movie" data-id=${result.id}>View Details</button>
          </div>
      </div>`;

        $(".popular").append(moodHtml);

      });

      //html for mood cards

    }
  })
})