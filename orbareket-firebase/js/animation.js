$(document).ready(function(){
  console.log('working');

  // HIDE ITEMS ON LOAD
  $("#announcement").hide();
  $("#bioExpanded").hide();
  $("#bioCollapse").hide();
  $("#window-mask").hide();
  $("#pause-player").hide();
  $(".fa-pause").hide();

  // HOVER HEADER IMAGE

  $("#homepage-image").hover(function(){
  	$("#homepage-image").attr("src", "assets/Silhouette2.png");
    console.log("hovered");
  }, function() {
    $("#homepage-image").attr("src", "assets/Silhouette1.png");
  }
  );

  // HEADER SCROLL + RESIZING

  var imageHeight = parseInt($('#homepage-image').css('height')),
      stopHeight=80,
      marginHeight = parseInt($('#homepage-image').css('margin-top')),
      stopMargin=marginHeight/5,
      spacerHeight = parseInt($('#header-spacer').css('height')),
      startLeft = parseInt($('#rollingbass').css('left'));

  $(window).scroll(function(e) {
      var windowScroll = $(window).scrollTop(),
          newMargin = marginHeight - (windowScroll/5),
          newHeight = imageHeight - windowScroll,
          newSpacerHeight = spacerHeight - windowScroll;
      // console.log(windowScroll);

      if(newHeight>=stopHeight){
          $('#homepage-image').css("height", newHeight);
          $('#homepage-image').css("margin-top", newMargin);
          $('#homepage-image').css("margin-bottom", newMargin);
          $('#header-spacer').css("height", newSpacerHeight);
      }
      else{
          $('#homepage-image').css("height", stopHeight);
          $('#homepage-image').css("margin-top", stopMargin);
          $('#homepage-image').css("margin-bottom", stopMargin);
      }

      var newLeft = startLeft + (windowScroll*1.25);
      // console.log(newLeft);
      if (newLeft <= ($(window).width()-100)){
  	    $("#rollingbass").css('left', newLeft);
  	} else {
  	    $("#rollingbass").css('left', ($(window).width()-100));
  	}
  });

  // BIO EXPAND AND COLLAPSE

  $("#bioExpand").click(function(){
  	$(this).hide();
  	$("#bioCollapse").show();
  	$("#bioExpanded").show();
  	}
  );

  $("#bioCollapse").click(function(){
  	$(this).hide();
  	$("#bioExpand").show();
  	$("#bioExpanded").hide();
  	}
  );

  //AUDIO PLAYER
  //UNIVERSAL PAUSE

  function pauseMusic() {
    $('#audio1').get(0).pause();
    $('#audio2').get(0).pause();
  	$('#window-mask').fadeOut(500);
  	$('#pause-player').fadeOut(500);
  	$('.musicslideshow').css('z-index','');
  	$('.fa-play').show();
  	$('.fa-pause').hide();
  }

  function toggleControls() {
  	$('.fa-play').toggle();
  	$('.fa-pause').toggle();
  }

  $('#window-mask').click(pauseMusic);
  $('.fa-pause').click(pauseMusic);

  //PLAY SONG 1: JENGA
  $('.song1 i.fa-play').click(function() {
  	pauseMusic();
  	toggleControls();
  	console.log('complete');
  	$('#audio1').get(0).play();
  	$('#window-mask').fadeIn(500);
  	$('#pause-player').fadeIn(500);
  	$('.musicslideshow').css('z-index','40');
  });

  //PLAY SONG 2: RACOON
  $('.play2').click(function() {
  	pauseMusic();
  	$('#audio2').get(0).play();
  	$('#window-mask').fadeIn(500);
  	$('#pause-player').fadeIn(500);
  	$('.musicslideshow').css('z-index','40');
  });


});



  // ANIMATING SCROLL TO ANCHOR

  // var $root = $('html, body');
  // $('.anchor-link').click(function() {
  //     var href = $.attr(this, 'href');
  //     $root.animate({
  //         scrollTop: $(href).offset().top
  //     }, 500, function () {
  //         window.location.hash = href;
  //     });
  //     return false;
  // });
