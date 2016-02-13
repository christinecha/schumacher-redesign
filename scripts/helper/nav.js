"use strict"

// API urls
let navDepartments = [
  {departmentName: 'Fabrics', departmentNameFormatted: 'fabric'},
  {departmentName: 'Wallcoverings', departmentNameFormatted: 'wallpaper'},
  {departmentName: 'Trim', departmentNameFormatted: 'trim'},
  {departmentName: 'Furniture', departmentNameFormatted: 'furniture'}
]

let navFilterCategories = [
  { categoryFormatted: "Color",
    category: "ColorFamily",
    url: "https://www.fschumacher.com/api/v1/GetColorFamilyFilter"
  },
  { categoryFormatted: "Style",
    category: "Style",
    url: "https://www.fschumacher.com/api/v1/GetStyleFilter"
  },
  { categoryFormatted: "Type",
    category: "Type",
    url: "https://www.fschumacher.com/api/v1/GetTypeFilter"
  }
]

// populate navigation dropdowns
function dropdownOptions(departmentName, departmentNameFormatted, category, categoryFormatted, url) {
  requirejs(["../scripts/data.js"], function() {
    let dropdowns = data.navigation_options[departmentName][category]
    if (!dropdowns) {
      dropdowns = []
    }

    var $dropdownColumn = $('<div>').addClass('dropdownColumn')
    var $heading = $('<h4>').addClass('category').html(categoryFormatted)
    $dropdownColumn = $dropdownColumn.append($heading)
    let dropdownCount = 0

    for (let i = 0; i < dropdowns.length; i++) {
      if (dropdownCount < 8) {
        var $option = $('<li>')
          .html(dropdowns[i])
          .attr('data-product', departmentName)
          .attr('data-filter', category)
          .attr('data-option', dropdowns[i])
        $dropdownColumn = $dropdownColumn.append($option)
        dropdownCount += 1
      }
    }
    if (dropdownCount > 0) {
      $('.dropdown.' + departmentNameFormatted).prepend($dropdownColumn)
    }
  })
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
  if ($(this).attr('data-department')) {
    var department = $(this).attr('data-department')
  } else {
    var department = $(this).attr('id').replace('-', '');
  }
  location.href = "catalog.html?product=" + department;
})
