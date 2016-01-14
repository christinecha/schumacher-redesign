// this array will contain the search query.
var selected_filters = [];

// get first search param from url
var product = window.location.href.slice(window.location.href.indexOf('?') + 1)
$('.dropdown-selector#' + product).addClass('selected-force')

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

  // check if already added to query
  function alreadyAdded() {
    for (var i = 0; i < selected_filters.length; i++) {
      if (selected_filters[i].filter == filter && selected_filters[i].option == option) {
        return true
      }
    }
    return false
  }

  if (alreadyAdded() == true) {
    selected_filters.splice(index, 1)
  } else {
    selected_filters.push({
      filter: filter,
      option: option
    })
  }

  displaySelectedFilters(selected_filters)
});

// remove selected filter by clicking on it
$('.selected-filters').on('click', '.selected-filter', function() {
  var filter = $(this).attr('data-filter');
  var option = $(this).attr('data-option');
  for (var i = 0; i < selected_filters.length; i++) {
    if (selected_filters[i].filter == filter && selected_filters[i].option == option) {
      selected_filters.splice(i, 1)
    }
  }
  displaySelectedFilters(selected_filters)
});

// display selected filters + filter titles
function displaySelectedFilters(selected_filters) {
  $('.selected-filter').remove();
  $('.filter-title').removeClass('in-use');
  for (var i = 0; i < selected_filters.length; i++) {
    var $selected_filter = $('<div>')
      .addClass('selected-filter')
      .html(selected_filters[i].option)
      .attr('data-filter', selected_filters[i].filter)
      .attr('data-option', selected_filters[i].option)
      .append('<span class="remove">x</span>');
    $('.selected-filters').append($selected_filter);
    $('.filter-title #' + selected_filters[i].filter).addClass('in-use');
  };
}



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
