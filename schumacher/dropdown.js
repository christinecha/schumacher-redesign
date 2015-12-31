$('.navigation').load('nav.html', function() {

  var dropdownPosition = function(_this, dropdownClass){
    var selectorOffset = $(_this).offset();
    var dropdownWidth = parseInt($(dropdownClass).css('width'));
    var selectorWidth = parseInt($(_this).css('width'));
    var selectorHeight = parseInt($(_this).css('height'));
    var dropdownOffset = {
      left: selectorOffset.left,
      top: selectorOffset.top + selectorHeight,
    }
    // if the selector is too far to the right (that dropdown will open beyond window)
    if ((dropdownOffset.left + dropdownWidth) >= $('.navigation').width()) {
      //position to the right instead
      dropdownOffset.left-= dropdownWidth;
      dropdownOffset.left+= selectorWidth;
    };
    $(dropdownClass).css('left', dropdownOffset.left);
    $(dropdownClass).css('top', dropdownOffset.top);
  };

  var showDropdown = function(_this, dropdownId){
    $('#' + dropdownId).addClass('selected');
    $(_this).show();
  };

  var hideDropdown = function(_this, dropdownId){
    $('#' + dropdownId).removeClass('selected');
    $(_this).hide();
  };

  $('.dropdown-selector').hover(function(){
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

});
