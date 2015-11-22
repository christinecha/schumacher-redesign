$(document).ready(function() {
  // 2. Create a Firebase reference.
  var myShows = new Firebase('https://orbareket.firebaseio.com/shows');

  $('#showSubmit').click(function(e){
    var showDateTime = $('#showDateTime').val();
    var showVenue = $('#showVenue').val();
    var showTitle = $('#showTitle').val();
    var showArtists = $('#showArtists').val();
    var showLink = $('#showLink').val();
    var prefix = 'http://';
    if (showLink.substr(0, prefix.length) !== prefix) {
      showLink = prefix + showLink;
    };

    myShows.push({
      datetime: showDateTime,
      venue: showVenue,
      title: showTitle,
      artists: showArtists,
      link: showLink,
    });
  });

  myShows.on("child_added", function (snapshot) {
    var firebaseValue = snapshot.val();
    displayShow(firebaseValue.datetime, firebaseValue.venue, firebaseValue.title, firebaseValue.artists, firebaseValue.link);
  });


  // ref.child(key).remove();

  function displayShow(datetime, venue, title, artists, link) {
    console.log(datetime);
    var dateObj = new Date(datetime);
    var month = dateObj.getMonth(); //months from 1-12
    var monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    month = monthShortNames[month];
    var day = dateObj.getDate();
    newdate = month + ' ' + day;
    var hours = dateObj.getHours();
    var minutes = dateObj.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    artists = artists.replace(/\r?\n/g, '<br />');

    var $date = $('<h2>').text(newdate).addClass('showDate');
    var $venue = $('<h3>').text(venue).addClass('showVenue');
    var $title = $('<p>').text(title).addClass('showTitle');
    var $time = $('<p>').text(strTime).addClass('showTime');
    var $artists = $('<p>').html(artists).addClass('showArtists');
    var $link = $('<button>').text('RSVP').attr('href', link).addClass('default1');

    var $showInfo = $('<div>').addClass('showInfo').append($date).append($venue).append($title).append($time).append('<br>').append($artists);
    if (link) {
      $showInfo = $showInfo.append($link);
    };
    var $slide = $('<div>').addClass('slide col-sm-3').append($showInfo);

    $('.slideshow').append($slide);
  };




});
