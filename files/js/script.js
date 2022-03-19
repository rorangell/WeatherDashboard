fiveDayForecast("Rio");
getWeather("Rio");
previousCities();

var cityHistory = [];

function saveToStorage() {
  var city = $(".cityName")
    .val()
    .trim();
  cityHistory.push(city);
  localStorage.setItem("cityHistory", JSON.stringify(cityHistory));
  previousCities();
}

function previousCities() {
  var searchedCities = JSON.parse(localStorage.getItem("cityHistory"));
  if (searchedCities && searchedCities.length > 0) {
    $(".previousCities").empty();
    for (var i = 0; i < searchedCities.length; i++) {
      var htmlSearchedCities = $("<button>").text(searchedCities[i]);
      $(".previousCities").append(htmlSearchedCities);
      htmlSearchedCities.addClass("usedCities btn btn-secondary btn-lg btn-block")
    }
    cityHistory = searchedCities;
    console.log(cityHistory);
  } else {
    cityHistory = [];
  }
}

$(document).on("click", ".usedCities", function(){
  var value= $(this).text()
  $('.dailyForecast').empty()
  console.log(value)
  getWeather(value)
  fiveDayForecast(value)
})

$(".searchBtn").click(function(event) {
  event.preventDefault();
  saveToStorage();
  $(".city").empty();
  $(".temp").empty();
  $(".humidity").empty();
  $(".wind").empty();
  $(".uv").empty();
  var city = $(".cityName")
    .val()
    .trim();
  getWeather(city);
  fiveDayForecast(city);
  $(".badge").empty();
  $(".dailyForecast").empty();
  $(".display-4").text(moment().format("MMM Do YY"));
});


function getWeather(city) {
  var queryUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial&appid=a8902e6d6ae5f8d8bfbe53e78707c643";

  $.ajax({
    url: queryUrl,
    method: "GET"
  }).then(function(response) {
    // console.log (response.name)
    // console.log(response)
    $(".city").text(response.name);
    $(".temp").text("Temperature :" + response.main.temp + " degrees");
    $(".humidity").text("Humidity :" + response.main.humidity + " percent");
    $(".wind").text("Wind :" + response.wind.speed + " mph");
    $(".uv").text("UV index :");
    var latitude = response.coord.lat;
    var longitude = response.coord.lon;

    getUVIndex(latitude, longitude);
  });
}

function fiveDayForecast(city) {
  var fiveDayQueryUrl =
    "http://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&units=imperial&APPID=f97dc0c76838152ccccbda66f22dabd4";

  $.ajax({
    url: fiveDayQueryUrl,
    method: "GET"
  }).then(function(response) {
    console.log(response.list[0]);
    console.log(response);

    for (var i = 0; i < response.list.length; i++) {
      if (response.list[i].dt_txt.indexOf("15:00:00") !== -1) {
        var realTime = response.list[i].dt;
        // date= new Date(realTime *1000 )
        var containerCard = $('<div>').addClass('col-2')
        var initialDiv = $("<div>");
        var dayDiv = $("<div>");
        var currentDay = $("<h5>");
        var humidityP = $("<p>");
        var tempP = $("<p>");
        var icon = $("<img>");
        initialDiv.addClass("card");
        dayDiv.addClass("card-body");
        currentDay.addClass("card-title");
        currentDay.text(moment(realTime, "X").format("MMM Do YY"));
        humidityP.text("Humidity :" + response.list[i].main.humidity + " %");
        tempP.text("Temperature :" + response.list[i].main.temp);
        icon.attr(
          "src",
          "http://openweathermap.org/img/wn/" +
            response.list[i].weather[0].icon +
            ".png"
        );

        dayDiv.append(currentDay, tempP, humidityP, icon);
        initialDiv.append(dayDiv);
        containerCard.append(initialDiv)

        $(".dailyForecast").append(containerCard);
      }
    }
  });
}
