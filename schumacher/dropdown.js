$('.footer').load('footer.html', function() {

})

$('.navigation').load('nav.html', function() {
  var productQuery = window.location.href.indexOf('?product=')
  var filterQuery = window.location.href.indexOf('&filter=')
  if (productQuery >= 0) {
    if (filterQuery < productQuery) {
      var product = window.location.href.slice(productQuery + 9)
    } else {
      var product = window.location.href.slice(productQuery + 9, filterQuery)
    }
    if ($('#' + product)) {
      $('#' + product).addClass('selected-force')
    }
  }

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

  $(document).on('mouseenter', '.dropdown-selector', function(){
    $(this).addClass('selected');
    var dropdownId = $(this).attr('id');
    dropdownClass = '.dropdowns .' + dropdownId;
    $(dropdownClass).show();
    dropdownPosition(this, dropdownClass);
  }).on('mouseleave', '.dropdown-selector', function(){
    var dropdownId = $(this).attr('id');
    $('.dropdown').hide();
    $(this).removeClass('selected');
  });

  $(document).on('mouseover', '.dropdown', function(){
    var dropdownId = $(this).attr('')
    $('.dropdown').hide();
    showDropdown(this, dropdownId);
  }).on('mouseleave', '.dropdown', function(){
    var dropdownId = $(this).attr('')
    $('.dropdown').hide();
    hideDropdown(this, dropdownId);
  });


});

$('.navigation .dropdown-selector').click()
