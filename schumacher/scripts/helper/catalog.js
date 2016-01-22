"use strict"

// table of contents
// 1 - API urls array for dropdowns
// 2 - create initial search query from url params
// 3 - dropdownOptions(): populate dropdowns with API data
// 4 - function get Products with search query
// 5 - trigger dropdownOptions()

// 1 - API urls //////////////////////////////////////////////////////////////////////////////////////////
let dropdownFilters = [
  { categoryFormatted: "Type", category: "Type", url: "//104.130.216.8/v8.1/api/Filter/GetTypeFilter"},
  { categoryFormatted: "Color", category: "ColorFamily", url: "//104.130.216.8/v8.1/api/Filter/GetColorFamilyFilter"},
  { categoryFormatted: "Style", category: "Style", url: "//104.130.216.8/v8.1/api/Filter/GetStyleFilter"},
  { categoryFormatted: "Application", category: "EndUse", url: "//104.130.216.8/v8.1/api/Filter/GetEndUseFilter"},
  { categoryFormatted: "Scale", category: "Scale", url: "//104.130.216.8/v8.1/api/Filter/GetScaleFilter"},
  { categoryFormatted: "Content", category: "Content", url: "//104.130.216.8/v8.1/api/Filter/GetContentFilter"},
  { categoryFormatted: "Abrasion", category: "Abrasion", url: "//104.130.216.8/v8.1/api/Filter/GetAbrasionFilter"}
]

// 2 - initial search query from url params //////////////////////////////////////////////////////////////////////////////////////////
var selected_product = 'All Products'
var selected_filters = {}; // this object will contain all the selected filters for search

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
      selected_filters[filter] = option
    }
  }
}
$('.main-category-title').html(selected_product)
displaySelectedFilters(selected_filters)

// 3 - populate dropdowns with API data //////////////////////////////////////////////////////////////////////////////////////////
function dropdownOptions(departmentName, category, categoryFormatted, url) {
  $.post(
    url,
    { Department: departmentName },
    function(dropdowns, status) {

      var $caret = $('<span>').html('&#9660;').addClass('caret');
      var $filterTitle = $('<div>')
        .addClass('filter-title')
        .addClass('dropdown-selector')
        .attr('id', categoryFormatted)
        .html(categoryFormatted)
        .append($caret);
      $('.filter-options').append($filterTitle);

      var $dropdown = $('<div>')
        .addClass('dropdown')
        .addClass(categoryFormatted);
      var $dropdownColumns = [];
      var $dropdownColumn = $('<div>').addClass('dropdownColumn');

      for (let i = 0; i < dropdowns.length; i++) {
        if (dropdowns[i].DepartmentName == departmentName) {
          // create JQuery list element with the option
          var $option = $('<li>')
            .html(dropdowns[i][category])
            .attr('data-filter', category)
            .attr('data-option', dropdowns[i][category].replace(/,/g, ''));

          // if the filter category is color, we need to add thumbnails
          if (category == 'ColorFamily') {
            var $colorThumb = $('<div>')
              .addClass('color--thumbnail')
              .css('background-image', '../assetscolor_thumbnails' + dropdowns[i][category] + '.png');
            $option = $option.prepend($colorThumb);
          }

          // if the filter category is type, we also need to add them to the side-bar filters
          if (category == 'Type') {
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
      }
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
        .addClass('submitSearch')
        .css('width', '100%')
        .html('APPLY');
      $dropdown.append($applyButton)

      $('.filter-dropdowns').append($dropdown)
    }
  )
}

// 4 - function get Products with search query //////////////////////////////////////////////////////////////////////////////////////////
function getProducts() {
  $('.product-list').empty()
  let query = {
    Department: selected_product,
    Rows_per_page: 9,
    Page_number: 1
  }
  for (filter in selected_filters) {
    query[filter] = selected_filters[filter]
  }
  $.post(
    "//104.130.216.8/v8.1/api/Product/GetProducts",
    query,
    function(data, status) {
      let products = data.GetProducts
      console.log(products)
      $('.numOfResults').html(products.length)
      for (let i = 0; i < products.length; i++) {
        let $productPreview = $('<div>').addClass('product-preview large-4 columns')
        let $productThumb = $('<div>').addClass('product-thumb').css('background-image', `url('${products[i].Item_Image_URL_400}')`)
        let $favorite = $('<img>').addClass('favorite').attr('src', '../assets/favorite-icon.svg')
        let $productInfo = $('<div>').addClass('product-info')
        let $quickshop = $('<div>').addClass('quickshop').html('QUICKSHOP').attr('data-sku', products[i].ItemSku)
        let $productType = $('<div>').addClass('product-type').html(products[i].Department)
        let $productName = $('<div>').addClass('product-name').html(products[i].Item_Name)
        let $productId = $('<div>').addClass('product-id')
        let $productSku = $('<span>').addClass('product-sku').html(products[i].ItemSku)
        let $productColor = $('<span>').addClass('product-color').html(products[i].Item_Color)
        let $productPrice = $('<div>').addClass('product-price').html(products[i].Selling_Price_USD)
        $productId.append($productColor, ' ', $productSku)
        $productInfo.append($quickshop, $productType, $productName, $productId, $productPrice)
        $productPreview.append($productThumb, $favorite, $productInfo)
        $('.product-list').append($productPreview)
      }
      makeSquareThumbnails()
    }
  )
}
getProducts()

// 5 - trigger dropdownOptions() //////////////////////////////////////////////////////////////////////////////////////////
$.each(dropdownFilters, function() {
  console.log('getting ', this.category)
  dropdownOptions(
    selected_product,
    this.category,
    this.categoryFormatted,
    this.url
  )
})

// 6 - trigger getProducts(query) //////////////////////////////////////////////////////////////////////////////////////////
$(document).on('click', '.submitSearch', function() {
  getProducts()
})

// if you click a side filter, the page refreshes with the new query string
$('.sub-category').on('click', 'li', function() {
  var filter = $(this).attr('data-filter');
  var option = $(this).attr('data-option');
  location.href = "catalog.html?product=" + selected_product + "&filter=" + filter + "&option=" + option;
});

// add/remove filter options to selected_filters array
$('.filter-dropdowns').on('click', 'li', function(){
  var filter = $(this).attr('data-filter');
  var option = $(this).attr('data-option');

  // check if already added to query
  if (selected_filters[filter]) {
    let filterOptions = selected_filters[filter].split(',')
    for (var i = 0; i < filterOptions.length; i++) {
      if (filterOptions[i] == option) {
        $(this).removeClass('selected')
        filterOptions.splice(i, 1)
        if (filterOptions.length <= 0) {
          delete selected_filters[filter]
        } else {
          selected_filters[filter] = filterOptions.join(',')
        }
        displaySelectedFilters(selected_filters)
        return false
      }
    }
    $(this).addClass('selected')
    filterOptions.push(option)
    selected_filters[filter] = filterOptions.join(',')
  } else {
    $(this).addClass('selected')
    selected_filters[filter] = option
  }
  displaySelectedFilters(selected_filters)
});

// remove selected filter by clicking on it
$('.selected-filters').on('click', '.selected-filter', function() {
  var filter = $(this).attr('data-filter');
  var option = $(this).attr('data-option');

  let filterOptions = selected_filters[filter].split(',')
  for (var i = 0; i < filterOptions.length; i++) {
    if (filterOptions[i] == option) {
      $(this).removeClass('selected')
      filterOptions.splice(i, 1)
      if (filterOptions.lenght > 0) {
        selected_filters[filter] = filterOptions.join(',')
      } else {
        delete selected_filters[filter]
      }
    }
  }
  displaySelectedFilters(selected_filters)
});

// display selected filters + filter titles
function displaySelectedFilters(selected_filters) {
  $('.selected-filter').remove();
  $('.filter-title').removeClass('in-use');

  for (filter in selected_filters) {
    let filterOptions = selected_filters[filter].split(',')

    for (var i = 0; i < filterOptions.length; i++) {
      var $selected_filter = $('<div>')
        .addClass('selected-filter')
        .html(filterOptions[i])
        .attr('data-filter', filter)
        .attr('data-option', filterOptions[i])
        .append('<span class="remove">x</span>');
      $('.selected-filters').append($selected_filter);
      $('.filter-title #' + filter).addClass('in-use');
    }
  }
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
})

// make sure product thumbnails are square, even on window resize.
function makeSquareThumbnails() {
  let thumbnailWidth = $('.product-thumb').css('width')
  $('.product-thumb').css('height', thumbnailWidth)
}

$(window).on('resize', function() {
  makeSquareThumbnails()
})
