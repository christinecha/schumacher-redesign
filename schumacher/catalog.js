// this array will contain the search query.
var selected_filters = [];

//populate filter dropdowns (replace with API)
$.get("data.json", function(data) {
  $.each(data.filter_options, function(filter_category, data) { // for each filter category
    var $dropdownColumns = [];
    var $dropdownColumn = $('<div>').addClass('dropdownColumn');

    for (var option in data) { // for each filter option
      if (data.hasOwnProperty(option)) { // if the option exists
        // create JQuery list element with the option
        var $option = $('<li>')
          .html(data[option])
          .attr('data-filter', filter_category)
          .attr('data-option', data[option]);
        // if the filter category is color, we need to add thumbnails
        if ((filter_category == 'color') || (filter_category == 'color_advanced')) {
          var $colorThumb = $('<div>')
            .addClass('color--thumbnail')
            .css('background-image', 'assets/color_thumbnails' + option + '.png');
          $option = $option.prepend($colorThumb);
        }
        // if the filter category has more than 8 options, we need to split it into columns
        if ($dropdownColumn.children('li').length >= 8) {
          $dropdownColumns.unshift($dropdownColumn);
          $dropdownColumn = $('<div>').addClass('dropdownColumn');
        }
        // add the option to the filter column
        $dropdownColumn.append($option);
      }
    };

    // if the dropdown is only one column, then add it to the array manually
    if ($dropdownColumns.length <= 0) {
      $dropdownColumns = [$dropdownColumn];
    } else {
      $dropdownColumns.unshift($dropdownColumn);
    }

    for (var i in $dropdownColumns) {
      $('.filter-dropdowns .' + filter_category).prepend($dropdownColumns[i]);
    };
  });
  // add "show more options" to the color filter
  var $toggleColors = $('<li>').addClass('toggleColors').html('more options >>');
  $('.filter-dropdowns .color').children('.dropdownColumn:eq(1)').append($toggleColors);

}).fail(function(err, message) {
  console.log('err: ', message);
});

//toggle additional color options
$('.filter-dropdowns').on('click', '.toggleColors', function() {
  $('.color_advanced').toggle();
  if ($('.color_advanced').is(':visible')) {
    $(this).html('less options <<');
  } else {
    $(this).html('more options >>');
  }
});

var thumbnailWidth = $('.product-thumb').css('width');
$('.product-thumb').css('height', thumbnailWidth);

// mark filter options as selected/unselected
$('.filter-dropdowns').on('click', 'li', function(){
  var filter = $(this).attr('data-filter');
  var option = $(this).attr('data-option');
  $(this).toggleClass('selected');

  var index = selected_filters.indexOf(option);

  // collect selected filter options and push to search query.
  if ($(this).hasClass('selected') === true) {
    selected_filters.push(option);
  } else { // or remove the deselected one
    selected_filters.splice(index, 1);
  };

  // mark the filter-titles active / inactive
  if ($('.filter-dropdowns .' + filter).find('.selected').length > 0) {
    $('#' + filter).addClass('in-use');
  } else {
    $('#' + filter).removeClass('in-use');
  };

  // display selected filter_options above
  $('.selected-filter').remove();
  for (index in selected_filters) {
    var $selected_filter = $('<div>')
      .addClass('selected-filter')
      .html(selected_filters[index])
      .attr('data-option', selected_filters[index])
      .append('<span class="remove">x</span>');
    $('.selected-filters').append($selected_filter);
  };
});

// remove selected filter by clicking on it
$('.selected-filters').on('click', '.selected-filter', function() {
  var option = $(this).attr('option');
  $('.filter-dropdowns li[data-option="' + option +'"]').click();
});

// toggle collapse side filters
$('.sub-category-title').on('click', function() {
  $(this).siblings('li').toggle();
  $(this).toggleClass('collapsed');

  if ($(this).hasClass('collapsed') == true) {
    $(this).children('.caret').html('&#9654;');
  } else {
    $(this).children('.caret').html('&#9660;');
  }
});
