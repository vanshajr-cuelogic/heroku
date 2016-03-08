var global_profile_info;
var map;
var infowindow;
var pyrmont;
var position_viewport;
var array_name = new Array();


function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}

function performSearch() {
    var request = {
        //bounds: map.getBounds(),
        keyword: 'best view'
    };
}

function callback(results, status) {
    if (status !== google.maps.places.PlacesServiceStatus.OK) {
        console.error(status);
        return;
    }
    for (var i = 0, result; result = results[i]; i++) {
        addMarker(result);
    }
}

function hide_content() {
    $(".overlay").hide();
    $(".profile_details_popup").hide();
    $("#resturant-input").hide();
    $("#back_to_main").hide();
    $(".weather-forecast").hide();
    $("#back_btn").hide();
    $(".mail_popup").hide();
    $(".facebook_img").hide();
}


function facebook_api(){
     window.fbAsyncInit = function() {
      FB.init({
        appId      : '591248257694566',
        xfbml      : true,
        cookie     : true,  // enable cookies to allow the server to access 
                          // the session
        version    : 'v2.5'
      });

     FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
          console.log("Logged In..!!")
          testAPI();
          $(".facebook_img").show();
        }
        else {
          FB.login();
        }
      });
    };
    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) { console.log("asdsdsa: "+id)}  //return;
       js = d.createElement(s); js.id = id;
       js.src = "//connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));
  }

function testAPI() {
    //http://www.loginradius.com/engineering/using-facebook-graph-api-after-login/
    FB.api('/me/picture','Get', function(response) {
      console.log(response.data.url);
      $("#facebook_profile img").attr('src',response.data.url);
    });
    FB.api('/me?fields=id,name,about,age_range,bio,birthday,email', function(response) {
      //console.log(response);
      $("#facebook_profile").attr('href','https://www.facebook.com/'+response.id);
    });
    // FB.api('/me/albums',function(response){
    //  // console.log(response)
    // })
  }


function view_start_analytics(param1){
    var background = {
                type: 'linearGradient',
                x0: 0,
                y0: 0,
                x1: 0,
                y1: 1,
                colorStops: [{ offset: 0, color: 'transparent' },
                             { offset: 1, color: 'transparent' }]
            };

                $('#jqChart').jqChart({
                title: { text: 'Weather Forecast' },
                legend: { title: 'Weather' },
                border: { strokeStyle: 'transparent' },
                background: background,
                animation: { duration: 1 },
                shadows: {
                    enabled: true
                },
                series: [
                    {
                        type: 'pie',
                        fillStyles: ['#418CF0', '#FCB441', '#E0400A', '#056492', '#BFBFBF', '#1A3B69', '#FFE382'],
                        labels: {
                            // stringFormat: '%.1f%%',
                            stringFormat: 'degree',
                            valueType: 'percentage',
                            font: '15px sans-serif',
                            fillStyle: 'white'
                        },
                        explodedRadius: 10,
                        explodedSlices: [5],
                        // data: [['United States', 65], ['United Kingdom', 58], ['Germany', 30],
                        //        ['India', 60], ['Russia', 65], ['China', 75]]
                        data: param1

                    }
                ]
            });
}


/* Ready Function */
$(document).ready(function() {
    hide_content();
    $("#back_to_main, #back_btn").click(function(){
            window.location.reload();
        });

     $(".close, #close, .overlay").on('click',function() {
            hide_content();
            $("#forecast_data li").remove();
        });

    $("#profile_details").click(function() {
        $(".overlay").show();
        $(".profile_details_popup").show();
    });

    $('#resturant-input').on('change', function() {
        initMap(this.value);
        $("aside").show();
    });

    $("#lines").click(function(){
        $(".nav-option li").click(function(){
            $(".nav-option").css('display','none');
        });
        $(".nav-option").slideToggle( "slow", function() {
            display:'block'
        });
        $("#back_btn").show();
    });

    $("aside").click(function(){
        $('aside').toggleClass('aside_height');
    });

    $("#weather_report").click(function(){
        weather_status();
         $("#weather_status").on('click',function(){
                $(".weather_forecasting").hide();
                 $("#weather_forecast").removeClass('active');
                $(this).addClass('active');
                $(".weather_casting").show();
            });
            $("#weather_forecast").on('click',function(){
                $(".weather_casting").hide();
                $("#weather_status").removeClass('active');
                $(this).addClass('active');
                $(".weather_forecasting").show();
            });
    });    

    function weather_status(){
         var city_name = document.getElementById('pac-input').value;
         var forecast = (document.getElementById('pac-input').value).split(',');

            if(city_name == ''){
                alert("Please Enter The City Name")
            }
            else{
                $(".overlay").show();
                $(".weather-forecast").show();
                $(function() {
              // strings to be used to construct request
              var apiKey = "2dc13940cbd5d31436200ab5ecc5d285";
              var apiKey_forecast = "d6b8f8b0b4ce40dd4818a7426b9a2655";
              var baseURL = "http://api.openweathermap.org/data/2.5/weather?q="+city_name;
              var forecastURL = "http://api.openweathermap.org/data/2.5/forecast/daily?q="+forecast;
             
              // stores latitude and longitude attributes of requested JSON resource
              var latitude, longitude;

              function getLocation() {
                /* gets user's location */
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(success, fail);
                }
              }

              function success(position) {
                /* if browser returns location, displays weather for that location */
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;
                display(constructRequest(latitude, longitude),forecast_contructor());

              }

              function fail() {
                /* runs if user's location is not returned */
                console.log('fail');
              }

              function constructRequest(lat, longi) {
                /* constructs and returns http request based on user's latitude and longitude */
                    return baseURL + "?lat=" + lat + "&lon=" + longi + "&APPID=" + apiKey +"&units=metric&type=accurate";
              }
              function forecast_contructor(){
                    return forecastURL+"&APPID=" + apiKey_forecast+"&mode=JSON&units=metric&units=imperial";; 
              }


              function display(req,req1) {
              //  console.log(req1)
                 $.getJSON(req,
                  function(data) {
                   // console.log(data)
                    $("#city_name").text(city_name);
                    $("#city_humid").text(data.main.humidity);
                    $("#city_temp").text(data.main.temp);
                    $('#city_status').text(data.weather[0].description);
                    $('#weather_img').attr('src',"http://openweathermap.org/img/w/"+data.weather[0].icon+".png");
                  }
                );

                $.getJSON(req1,
                  function(data1) {
                  // console.log(data1);
                    for(i=0;i<=data1.list.length;i++){
                        unix_timestamp = data1.list[i].dt;
                      //  console.log(unix_timestamp);
                        var date = new Date(unix_timestamp*1000);
                       // console.log(date.toString());
                        var hours = date.getHours();
                        var minutes = "0" + date.getMinutes();
                        var seconds = "0" + date.getSeconds();
                        var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
                     //   console.log(formattedTime);
                         // alert(data1.list[i].humidity);
                        
                        $("#forecast_data").append("<li><span>"+date.toString()+"</span><h1><img src='http://openweathermap.org/img/w/"+data1.list[i].weather[0].icon+".png'></h1><span class='humidity'>Humidity : "+data1.list[i].humidity+"%</span> <span class='max-temp'>Max. Temperature : "+data1.list[i].temp.max+"%</span> <span class='min-temp'>Min. Temperature : "+data1.list[i].temp.min+"%</span> <span class='weather-description'>Status : "+data1.list[i].weather[0].description+"</span> </li>")
                       array_name.push(data1.list[i].temp.max);
                       view_start_analytics(array_name)
                    }
                  }
                );
              }
 
              getLocation();
            });
        }
      
    }
    /* GMAIL */ 
    $("#check_mail").click(function(){
       console.log("loadGmailApi() will give the mail access and appendMessageRow() will inbox mail");
       $(".overlay").show();
       $(".mail_popup").show();
    });

    $("#location_access").on('click',function() {
        $("#resturant-input").show();
        $("#back_to_main").show();
    });

    for (var i = 0; i < place_search_type.length; i++) {
        $("#resturant-input").append("<option id='type_'" + i + ">" + place_search_type[i] + "</option>");
    }
});

function onSignInCallback(resp) {
    hide_content();
    loadGmailApi();
    facebook_api();
    gapi.client.load('plus', 'v1', function() {
        var request = gapi.client.plus.people.get({
            'userId': 'me'
        });

        request.execute(function(resp) {
            global_profile_info = resp
          //console.log(global_profile_info)
          //console.log('Retrieved profile for:' + resp.displayName);
            $("#user_name, #name").text(resp.displayName);
            $("#user_name, #name").text(resp.displayName);
            $("#user_name").attr('href', resp.url);
            $("#user_profile").show();
            $("#user_profile").attr('src', resp.image.url);
            $("#place_name").attr('src', resp.image.url);
            var url = resp.image.url.split('?');
            $("#img_profile").attr('src', url[0]);
            $("#profile_id").text(resp.id);
            $("#profile_id").attr('value',resp.id)
            $("#gender").text(resp.gender);
            $("#email").text(resp.emails[0].value);
            $("#place_name").show();
        });
          });
       $("#pac-input").focus();
      }

      function loadGmailApi() {
        gapi.client.load('gmail', 'v1', listLabels);
      }

      function list_label(){
         var request = gapi.client.gmail.users.labels.list({
          'userId': 'me'
        });

        request.execute(function(resp) {
          for(i=0;i<=resp.labels.length;i++){
            $("#label_list").append("<option class='label-list'>"+resp.labels[i].name+"</option>")
          }
        });
      }

      function listLabels() {
        list_label();

      
          var str='INBOX'; 
          $("#label_list").change(function(){
             $("mail_container li").remove();
               $( "#label_list option:selected" ).each(function() {
                 str = $( this ).text();
                 //console.log("sds:"+str);
                 });
                 // var request = gapi.client.gmail.users.messages.list({
                 //    'userId': 'me',
                 //    'id':str
                 //    // 'maxResults': 10
                 //  });
                 //   request.execute(function(resp) {
                 //    // console.log(resp.messages)
                 //     $.each(resp.messages, function() {
                 //      var messageRequest = gapi.client.gmail.users.messages.get({
                 //      'userId': 'me',
                 //      'id': this.id
                 //    });
                 //     messageRequest.execute(appendMessageRow);
                 //    });
                 //  });
                
            });
            var request = gapi.client.gmail.users.messages.list({
                'userId': 'me',
                'id':str
                // 'maxResults': 10
              });
               request.execute(function(resp) {
                 $.each(resp.messages, function() {
                  var messageRequest = gapi.client.gmail.users.messages.get({
                  'userId': 'me',
                  'id': this.id,
                  'format': 'metadata'
                });
                 messageRequest.execute(appendMessageRow);
                });
              });
      }

      function appendMessageRow(message) {
        // console.log(message)
        $("#mail_container").append("<li class='mail-list'>"+message.snippet+"</li>")
      }

/******************EMAIL*************/

/**
 * Sets up an API call after the Google API client loads.
 */
function apiClientLoaded() {
    gapi.client.plus.people.get({
        userId: 'me'
    }).execute(handleEmailResponse);
}

function handleEmailResponse(resp) {
    var primaryEmail;
    for (var i = 0; i < resp.emails.length; i++) {
        if (resp.emails[i].type === 'account') {
            primaryEmail = resp.emails[i].value
        };
    }
    document.getElementById('responseContainer').value = 'Primary email: ' +
        primaryEmail + '\n\nFull Response:\n' + JSON.stringify(resp);
}

function initMap(place_search) {
    pyrmont = position_viewport;
    map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        zoom: 15
    });
    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: pyrmont,
        radius: 500,
        types: [place_search]
    }, callback);
}

function callback(results, status) {
    if(results == ''){
       var confirm_result =  confirm("No data found..!! Do You want to Search Again");
           if (confirm_result == true) {
                window.location.reload();
            } else {
               window.location.reload();
            }
    }
   // console.log("Result : "+ results)
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
            $("#Location_name").append("<li id=detail_" + i + "><span class='location-name'>" + results[i].name + "</span><br/><span class='location-address'>" + results[i].vicinity + "</span></li>");
        }
    }
}

function createMarker(place) {
    /*Type of Search */
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'mouseover', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}
google.maps.event.addDomListener(window, 'load', initialize);



function initAutocomplete() {
    $("#place_name").hide();
    var width_ele = $( window ).width();
    var height_ele = $( window ).height();
    var map_height = height_ele-52;
    $("#map").css('height',map_height);
    $("aside").css('height',map_height);

    $("#user_profile").hide();
    setInterval(function() {
        var dt = new Date();
        var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
        $("#current_time").text(time);
    }, 100);

    var map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: -33.866,
            lng: 151.196
        },
        streetViewControl: true,
        zoom: 15,
        styles: [{
            stylers: [{
                visibility: 'simplified'
            }]
        }, {
            elementType: 'labels',
            stylers: [{
                visibility: 'on'
            }]
        }]
    });

    // var service = new google.maps.places.PlacesService(map);

    var infoWindow = new google.maps.InfoWindow({
        map: map
    });

    map.addListener('idle', performSearch);
    // HTML5 geolocation.

    var lat;
    var long;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            infoWindow.setPosition(pos);
            lat = pos.lat;
            long = pos.lng;
            infoWindow.setContent('<img src="#" id="place_name"/>');


            var url = "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + long + "&sensor=false";
            $.get(url).success(function(data) {
                var loc1 = data.results[0];
                var county, city;
                $.each(loc1, function(k1, v1) {
                    if (k1 == "address_components") {
                        for (var i = 0; i < v1.length; i++) {
                            for (k2 in v1[i]) {
                                if (k2 == "types") {
                                    var types = v1[i][k2];
                                    if (types[0] == "sublocality_level_1") {
                                        county = v1[i].long_name;
                                    }
                                    if (types[0] == "locality") {
                                        city = v1[i].long_name;
                                    }
                                }
                            }
                        }
                    }
                });
                $('#city').html(city);
            });

        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    var rest_input = document.getElementById('resturant-input');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(rest_input);


    var markers = [];

    var infowindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
        map: map
    });
    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });


    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var service = new google.maps.places.PlacesService(map);

        var bounds = new google.maps.LatLngBounds();
        var placesList = document.getElementById('places');

        places.forEach(function(place) {
            autocomplete.addListener('place_changed', function() {

                infowindow.close();
                var place = autocomplete.getPlace();
                if (!place.geometry) {
                    return;
                }

                if (place.geometry.viewport) {
                    map.fitBounds(place.geometry.viewport);
                } else {
                    map.setZoom(15);
                }

                // Set the position of the marker using the place ID and location.
                marker.setPlace({
                    placeId: place.name,
                    location: place.geometry.location
                });
                marker.setVisible(true);
                infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
                    place.formatted_address);
                infowindow.open(map, marker);
                position_viewport = place.geometry.location;
            });
        });
        map.fitBounds(bounds);
    });
}
