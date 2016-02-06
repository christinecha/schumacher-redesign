"use strict"

function getFilterDropdowns(departmentName, category, categoryFormatted, url) {
  let $caret = $('<span>').html('&#9660;').addClass('caret');
  let $checkbox = $('<input>').attr('type', 'checkbox').addClass('checkbox').addClass('submitSearch')
  let $filterTitle = $('<div>')
    .addClass('filter-title')
    .addClass('dropdown-selector')
    .html(categoryFormatted)
    .attr('id', category)
  let $dropdown = $('<div>')
    .addClass('dropdown')
    .addClass(category)
  let $applyButton = $('<button>')
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
    let $sliderHandleMin = $('<div>')
      .addClass('slider-handle')
      .addClass('slider-handle-min')
      .attr('data-type', 'min')
    let $sliderHandleMax = $('<div>')
      .addClass('slider-handle')
      .addClass('slider-handle-max')
      .attr('data-type', 'max')
    let $pricingSlider = $('<div>').addClass('pricing-slider').append($sliderHandleMin, $sliderHandleMax)
    let $priceDisplay = $('<div>').addClass('price-display').html('No Limit')
    $dropdown.append($pricingSlider, $priceDisplay, $applyButton)
    $('.filter-dropdowns').append($dropdown)
  } else {
    getData({ Department: departmentName }, url, function(dropdowns) {
      $filterTitle.addClass('dropdown-selector').append($caret)
      $('.filter-options .primary').append($filterTitle);

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
              .css('background-image', '../assetscolor_thumbnails' + dropdowns[i][category] + '.png')
            $option = $option.prepend($colorThumb);
          }

          // if the filter category is type, we also need to add them to the side-bar filters
          if (category == 'Type') {
            let filteredUrl = window.location.pathname + '?product=' + departmentName + '&filter=' + category + '&option=' + dropdowns[i][category]
            let $sideBarOption = $('<a>').attr('href', filteredUrl).append($option.clone())
            $('.sub-category.type').append($sideBarOption)
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
      $dropdownColumns.unshift($dropdownColumn);
      for (var i in $dropdownColumns) {
        $dropdown.prepend($dropdownColumns[i]);
      };

      if ($dropdown.children('.dropdownColumn')[0].childNodes.length <= 0) {
        // $('#' + category).hide()
      } else {
        $dropdown.append($applyButton)
        $('.filter-dropdowns').append($dropdown)
      }
    })
  }
}
