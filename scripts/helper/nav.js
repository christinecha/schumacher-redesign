"use strict"

//// authorization
var currentUserId = 115593 // global variable for currentUserId
var session
console.log('currentUserId: ', currentUserId)

function validated() {
  // some login validation function
  return true
}

if (session) {
  // set currentUserId to session's login Id
}

if (currentUserId && validated(currentUserId)) {
  $('.logged-in').show()
  $('.logged-out').hide()
} else {
  $('.logged-in').hide()
  $('.logged-out').show()
}

$('.signInForm').on('submit', function() {
  // create session with login info
})

// API urls
var navDepartments = [
  {departmentName: 'Fabrics', departmentNameFormatted: 'Fabrics'},
  {departmentName: 'Wallcoverings', departmentNameFormatted: 'Wallcoverings'},
  {departmentName: 'Trim', departmentNameFormatted: 'Trim'},
  {departmentName: 'Furniture', departmentNameFormatted: 'Furniture'}
]

var navFilterCategories = [
  { categoryFormatted: "Style",
    category: "Style",
    url: "https://www.fschumacher.com/api/v1/GetStyleFilter"
  },
  { categoryFormatted: "Color",
    category: "ColorFamily",
    url: "https://www.fschumacher.com/api/v1/GetColorFamilyFilter"
  },
  { categoryFormatted: "Type",
    category: "Type",
    url: "https://www.fschumacher.com/api/v1/GetTypeFilter"
  }
]

// helper function for dropdown titles
function capitalized(string) {
  var wordsArray = string.split(' ')
  for (var i = 0; i < wordsArray.length; i++) {
    var stringArray = wordsArray[i].split('')
    stringArray.splice(0, 1, stringArray[0].toUpperCase())
    wordsArray.splice(i, 1, stringArray.join(''))
  }
  return wordsArray.join(' ')
}

// populate navigation dropdowns
function dropdownOptions(departmentName, departmentNameFormatted, category, categoryFormatted, url) {
  requirejs(["../scripts/data.js"], function() {
    var dropdowns = data.navigation_options[departmentName][category]

    if (!dropdowns) {
      dropdowns = []
    }

    var $dropdownColumn = $('<div>').addClass('dropdownColumn')
    var $heading = $('<h4>').addClass('category').html(categoryFormatted)
    $dropdownColumn = $dropdownColumn.append($heading)
    var dropdownCount = 0

    for (var i = 0; i < dropdowns.length; i++) {
      if (dropdownCount < 8) {
        // console.log(capitalized(dropdowns[i]))
        var $option = $('<li>')
          .html(capitalized(dropdowns[i]))
          .attr('data-product', departmentName)
          .attr('data-filter', capitalized(category))
          .attr('data-option', capitalized(dropdowns[i]))
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
  for (var i = 0; i < navFilterCategories.length; i++) {
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

// direct to catalog with correct query: general Department catalogs
$('.navigation').on('click', 'li.catalog-link', function() {
  console.log('clicked')
  if ($(this).attr('data-department')) {
    var department = $(this).attr('data-department')
  } else {
    var department = $(this).attr('id').replace('-', '');
  }
  location.href = "catalog.html?product=" + department;
})

//search by keyword
$('.navigation').on('submit', '.searchByKeyword', function(e) {
  e.preventDefault()

  var keywords = $(this).children('.search').val()

  location.href = "collection.html?collection=Search&query=" + keywords
})
