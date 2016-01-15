var selected_product = 'All Products'
var selected_filters = []; // this array will contain the search query.

// check if product page is selected
var productQuery = window.location.href.indexOf('?product=')
var filterQuery = window.location.href.indexOf('&filter=')
var optionQuery = window.location.href.indexOf('&option=')
if (window.location.href.indexOf('?') >= 0) {
  if (filterQuery < productQuery) {
    var product = window.location.href.slice(productQuery + 9)
  } else {
    var product = window.location.href.slice(productQuery + 9, filterQuery)
    var filter = window.location.href.slice(filterQuery + 8, optionQuery).replace('%20', ' ')
    var option = window.location.href.slice(optionQuery + 8).replace('%20', ' ')
  }
  if ($('#' + product)) {
    $('#' + product).addClass('selected-force')
    selected_product = product
    if (option) {
      selected_filters.push({
        filter: filter,
        option: option
      })
    }
  }
}
$('.main-category-title').html(selected_product)
displaySelectedFilters(selected_filters)

//populate filter dropdowns (replace with API)
$.get("data.json", function(data) {

  $.each(data.filter_options, function(filter_category, data) { // for each filter category

    // create a filter-title
    var $caret = $('<span>').html('&#9660;').addClass('caret');
    var $filterTitle = $('<div>')
      .addClass('filter-title')
      .addClass('dropdown-selector')
      .attr('id', filter_category)
      .html(filter_category.replace(/-|_/, ' '))
      .append($caret);
    $('.filter-options').append($filterTitle);

    // set up dropdown + dropdown columns
    var $dropdown = $('<div>')
      .addClass('dropdown')
      .addClass(filter_category);
    var $dropdownColumns = [];
    var $dropdownColumn = $('<div>').addClass('dropdownColumn');

    for (var option in data) { // for each filter option
      if (data.hasOwnProperty(option)) {

        // create JQuery list element with the option
        var $option = $('<li>')
          .html(data[option])
          .attr('data-filter', filter_category)
          .attr('data-option', data[option]);

        // if the filter category is color, we need to add thumbnails
        if (filter_category == 'color') {
          var $colorThumb = $('<div>')
            .addClass('color--thumbnail')
            .css('background-image', 'assets/color_thumbnails' + option + '.png');
          $option = $option.prepend($colorThumb);
        }

        // if the filter category is type, we also need to add them to the side-bar filters
        if (filter_category == 'type') {
          console.log('found type')
          $('.sub-category.type').append($option.clone())
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

    // add dropdown Columns to the dropdown div
    if ($dropdownColumns.length <= 0) {
      $dropdownColumns = [$dropdownColumn];
    } else {
      $dropdownColumns.unshift($dropdownColumn);
    }
    for (var i in $dropdownColumns) {
      $dropdown.prepend($dropdownColumns[i]);
    };

    var $applyButton = $('<button>')
      .addClass('dropdownButton')
      .css('width', '100%')
      .html('APPLY');
    $dropdown.append($applyButton)

    $('.filter-dropdowns').append($dropdown)
  });
}).fail(function(err, message) {
  console.log('err: ', message);
});

var thumbnailWidth = $('.product-thumb').css('width');
$('.product-thumb').css('height', thumbnailWidth);

// if you click a side filter, the page refreshes with the new query string
$('.sub-category').on('click', 'li', function() {
  var filter = $(this).attr('data-filter');
  var option = $(this).attr('data-option');
  location.href = "catalog.html?product=" + selected_product + "&filter=" + filter + "&option=" + option;
});

// mark main filter options as selected/unselected
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
    $(this).removeClass('selected')
    selected_filters.splice(index, 1)
  } else {
    $(this).addClass('selected')
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
