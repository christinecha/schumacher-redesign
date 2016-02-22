"use strict"

var departmentDictionary = {
  Fabrics: { nameFormatted: 'Fabric' },
  Wallcoverings: { nameFormatted: 'Wallpaper' },
  Trim: { nameFormatted: 'Trim' },
  Furniture: { nameFormatted: 'Furniture' }
}

function getCatalogFilters(departmentName, category, categoryFormatted, url) {
  return new Promise(function(resolve, reject) {
    var $caret = $('<span>').html('&#9660;').addClass('caret');
    var $checkbox = $('<input>').attr('type', 'checkbox').addClass('checkbox').addClass('submitSearch')
    var $filterTitle = $('<div>')
      .addClass('filter-title')
      .addClass('dropdown-selector')
      .html(categoryFormatted)
      .attr('id', category)
    var $dropdown = $('<div>')
      .addClass('dropdown')
      .addClass(category)
    var $applyButton = $('<button>')
      .addClass('dropdownButton')
      .addClass('submitSearch')
      .css('width', '100%')
      .html('APPLY')

    if (category == "Extrawide" || category == "WC_Available") {
      $filterTitle.attr('id', category).append($checkbox)
      $('.filter-options .secondary').append($filterTitle)
    } else if (category == "Price") {
      $filterTitle.attr('id', category).append($caret)
      $('.filter-options .secondary').append($filterTitle)
      var $sliderHandleMin = $('<div>')
        .addClass('slider-handle')
        .addClass('slider-handle-min')
        .attr('data-type', 'min')
      var $sliderHandleMax = $('<div>')
        .addClass('slider-handle')
        .addClass('slider-handle-max')
        .attr('data-type', 'max')
      var $pricingSlider = $('<div>').addClass('pricing-slider').append($sliderHandleMin, $sliderHandleMax)
      var $priceDisplay = $('<div>').addClass('price-display').html('$0 - $300+')
      if (departmentName == 'Furniture') {
        $priceDisplay = $priceDisplay.html('$0 - $4000+')
      }
      $dropdown.append($pricingSlider, $priceDisplay, $applyButton)
      $('.filter-dropdowns').append($dropdown)
    } else {
      $filterTitle.addClass('dropdown-selector').append($caret)
      $('.filter-options .primary').append($filterTitle)

      getFilterDropdowns(departmentName, category, url, $dropdown, $applyButton).then(function(response) {
        resolve(true)
      })
    }
  })
}

function getFilterDropdowns(departmentName, category, url, $dropdown, $applyButton) {
  return new Promise(function(resolve, reject) {
    getData({ Department: departmentName }, url).then(function(dropdowns) {

      var $dropdownColumns = [];
      var $dropdownColumn = $('<div>').addClass('dropdownColumn');

      for (var i = 0; i < dropdowns.length; i++) {
        if (dropdowns[i].DepartmentName == departmentName) {
          // create JQuery list element with the option
          var $option = $('<li>')
            .html(dropdowns[i][category])
            .attr('data-filter', category)
            .attr('data-option', dropdowns[i][category].replace(/,/g, ''))

          // if the filter category is color, we need to add thumbnails
          // if (category == 'ColorFamily') {
          //   var $colorThumb = $('<div>')
          //     .addClass('color--thumbnail')
          //     .css('background-image', '../assetscolor_thumbnails' + dropdowns[i][category] + '.png')
          //   $option = $option.prepend($colorThumb);
          // }

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
      $dropdownColumns.unshift($dropdownColumn);
      for (var i in $dropdownColumns) {
        $dropdown.prepend($dropdownColumns[i]);
      };

      if ($dropdown.children('.dropdownColumn')[0].childNodes.length > 0) {
        $('#' + category).css('display', 'inline-block')
        $dropdown.append($applyButton)
        $('.filter-dropdowns').append($dropdown)
      } else {
        // don't show
      }

      resolve(true)
    })
  })
}

function getSidebarFilters(department) {
  var sidebarFilters = {
    'Fabrics': [{Collection: 'Perfect Basics'}, {Type: 'Prints'}, {Type: 'Sheers'}, {Motif: 'Animal Skin'}, {EndUse: 'Indoor & Outdoor'}, {Type: 'Velvets'}],
    'Wallcoverings': [{Type: 'Prints'}, {Type: 'Grasscloths'}, {Type: 'Faux Finishes'}, {Motif: 'Animal Skin'}],
    'Trim': [{Type: 'Braids & Tapes'}, {Type: 'Gimps'}, {Type: 'Cords'}, {Type: 'Cut Fringe'}],
    'Furniture': [{Type: 'Antiques'}, {Type: 'Tables'}, {Type: 'Accent Chairs'}]
  }
  sidebarFilters = sidebarFilters[department]

  for (var i = 0; i < sidebarFilters.length; i++) {
    var sidebarCategory = Object.keys(sidebarFilters[i])[0]
    var filteredUrl = window.location.pathname + '?product=' + department + '&filter=' + sidebarCategory + '&option=' + sidebarFilters[i][sidebarCategory]

    var $sidebarOption = $('<li>')
      .html(sidebarFilters[i][sidebarCategory])
      .attr('data-filter', sidebarCategory)
      .attr('data-option', sidebarFilters[i][sidebarCategory].replace(/,/g, ''))
    var $sidebarOptionContainer = $('<a>').attr('href', filteredUrl).append($sidebarOption)
    $('.sub-category.type').append($sidebarOptionContainer)
  }
}
