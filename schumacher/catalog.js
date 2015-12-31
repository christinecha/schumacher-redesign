var thumbnailWidth = $('.product-thumb').css('width');
$('.product-thumb').css('height', thumbnailWidth);

$('.catalog .dropdown li').on('click', function(){
  var filter = $(this).parent().parent('.dropdown');
  var filterId = filter.attr('data-dropdownId');
  $(this).toggleClass('selected');

  if (filter.find('.selected').length > 0) {
    $('#' + filterId).addClass('filter-selected');
    console.log('selected', filterId);
  } else {
    $('#' + filterId).removeClass('filter-selected');
    console.log('deselected', filterId);
  };
});
