$('.navigation').load('nav.html', function() {
  
  var dropdownPosition = function(_this, dropdownClass){
    var menuOffset = $('.header').offset();
    var selectorOffset = $(_this).offset();
    var dropdownWidth = $(dropdownClass).css('width');
    var selectorWidth = $(_this).css('width');
    var dropdownOffset = selectorOffset.left - menuOffset.left;
    // if the selector is too far to the right (dropdown will open beyond window)
    if ((dropdownOffset + parseInt(dropdownWidth)) >= $('.header').width()) {
      //position to the right instead
      dropdownOffset-= parseInt(dropdownWidth);
      dropdownOffset+= parseInt(selectorWidth);
    };
    $(dropdownClass).css('margin-left', dropdownOffset);
  };

  var showDropdown = function(_this, dropdownId){
    $('#' + dropdownId).addClass('selected');
    $(_this).show();
  };

  var hideDropdown = function(_this, dropdownId){
    $('#' + dropdownId).removeClass('selected');
    $(_this).hide();
  };

  $('.main-nav').children('li').hover(function(){
    $(this).addClass('selected');
    var dropdownId = $(this).attr('id');
    dropdownClass = '.' + dropdownId;
    $(dropdownClass).show();
    dropdownPosition(this, dropdownClass);
    $(dropdownClass).hover(function(){
      showDropdown(this, dropdownId);
    }, function(){
      hideDropdown(this, dropdownId);
    });
  }, function(){
    $('.dropdown').hide();
    $(this).removeClass('selected');
  });

  $('.top-nav').children('li').hover(function(){
    if ($(this).attr('id') == null){
      //do nothing
    } else {
      $(this).addClass('selected');
      var dropdownId = $(this).attr('id');
      dropdownClass = '.' + dropdownId;
      $(dropdownClass).show();
      dropdownPosition(this, dropdownClass);
      $(dropdownClass).hover(function(){
        showDropdown(this, dropdownId);
      }, function(){
        hideDropdown(this, dropdownId);
      });
    };
  }, function(){
    $('.dropdown').hide();
    $(this).removeClass('selected');
  });

});
