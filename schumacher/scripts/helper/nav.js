"use strict"

// API urls
let navDepartments = [
  {departmentName: 'Fabrics', departmentNameFormatted: 'fabric'},
  {departmentName: 'Wallpaper', departmentNameFormatted: 'wallpaper'},
  {departmentName: 'Trim', departmentNameFormatted: 'trim'},
  {departmentName: 'Furniture', departmentNameFormatted: 'furniture'}
]

let navFilterCategories = [
  { categoryFormatted: "Color",
    category: "ColorFamily",
    url: "//104.130.216.8/v8.1/api/Filter/GetColorFamilyFilter"
  },
  { categoryFormatted: "Style",
    category: "Style",
    url: "//104.130.216.8/v8.1/api/Filter/GetStyleFilter"
  },
  { categoryFormatted: "Type",
    category: "Type",
    url: "//104.130.216.8/v8.1/api/Filter/GetTypeFilter"
  }
]


$(function() {

  // populate navigation dropdowns
  function dropdownOptions(departmentName, departmentNameFormatted, category, categoryFormatted, url) {
    $.post(
      url,
      { Department: departmentName },
      function(dropdowns, status) {
        // console.log(dropdowns)

        var $dropdownColumn = $('<div>').addClass('dropdownColumn')
        var $heading = $('<h4>').addClass('category').html(categoryFormatted)
        $dropdownColumn = $dropdownColumn.append($heading)
        let dropdownCount = 0

        for (let i = 0; i < dropdowns.length; i++) {
          if (dropdownCount < 8 && dropdowns[i].DepartmentName == departmentName) {
            var $option = $('<li>')
              .html(dropdowns[i][category])
              .attr('data-product', departmentName)
              .attr('data-filter', category)
              .attr('data-option', dropdowns[i][category])
            $dropdownColumn = $dropdownColumn.append($option)
            dropdownCount += 1
          }
        }
        if (dropdownCount > 0) {
          $('.dropdown.' + departmentNameFormatted).prepend($dropdownColumn)
        }
      }
    )
  }

  $.each(navDepartments, function() {
    for (let i = 0; i < navFilterCategories.length; i++) {
      // console.log('getting ', navFilterCategories[i].category, ' of ', this.departmentName)
      dropdownOptions(
        this.departmentName,
        this.departmentNameFormatted,
        navFilterCategories[i].category,
        navFilterCategories[i].categoryFormatted,
        navFilterCategories[i].url
      )
    }
  })

  // direct to catalog with correct query
  $('.navigation').on('click', '.dropdownColumn li', function() {
    var product = $(this).attr('data-product');
    var filter = $(this).attr('data-filter');
    var option = $(this).attr('data-option');
    location.href = "catalog.html?product=" + product + "&filter=" + filter + "&option=" + option;
  });

  // direct to catalog with correct query
  $('.navigation').on('click', 'li.catalog-link', function() {
    console.log('clicked')
    var product = $(this).attr('id').replace('-', '');
    location.href = "catalog.html?product=" + product;
  });



});
