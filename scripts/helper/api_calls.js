"use strict"

function getData(request, url) {
  return new Promise(function(resolve, reject) {
    $.post(
      url,
      request,
      function(data, status) {
        resolve(data)
      }
    )
  })
}

function catalogFilters() {
  return [
    { categoryFormatted: "Color", category: "ColorFamily", url: "https://www.fschumacher.com/api/v1/GetColorFamilyFilter"},
    { categoryFormatted: "Motif", category: "Motif", url: "https://www.fschumacher.com/api/v1/GetMotifFilter"},
    { categoryFormatted: "Type", category: "Type", url: "https://www.fschumacher.com/api/v1/GetTypeFilter"},
    { categoryFormatted: "Scale", category: "Scale", url: "https://www.fschumacher.com/api/v1/GetScaleFilter"},
    { categoryFormatted: "Style", category: "Style", url: "https://www.fschumacher.com/api/v1/GetStyleFilter"},
    { categoryFormatted: "Price", category: "Price"},
    { categoryFormatted: "Application", category: "EndUse", url: "https://www.fschumacher.com/api/v1/GetEndUseFilter"},
    { categoryFormatted: "Content", category: "Content", url: "https://www.fschumacher.com/api/v1/GetContentFilter"},
    { categoryFormatted: "Abrasion", category: "Abrasion", url: "https://www.fschumacher.com/api/v1/GetAbrasionFilter"},
    { categoryFormatted: "Extra Wide", category: "Extrawide", onlyShowFor: "Fabrics"}
  ]
}

function getFavorites(userId, pageNumber, fn) {

  return new Promise(function(resolve, reject) {
    var rowsPerPage = 30

    if (pageNumber == 'all') {
      rowsPerPage = 500
      pageNumber = 1
    }

    $('.loading').show()

    if (userId) {
      getData(
        {UserId: userId, Rows_Per_Page: rowsPerPage, Page: pageNumber},
        "https://www.fschumacher.com/api/v1/GetFavorites"
      ).then(function(data) {
        console.log(pageNumber)
        resolve(data, pageNumber)
      })
    } else {
      resolve(false)
    }

  })
}

function getSearchResults(userId, pageNumber, searchString, fn) {
  return new Promise(function(resolve, reject) {
    $('.loading').show()

    getData(
      {UserId: userId, SearchString: searchString, Rows_Per_Page: 30, Page_Number: pageNumber},
      "https://www.fschumacher.com/api/v1/SearchProducts"
    ).then(function(data) {
      console.log(pageNumber)
      resolve(data, pageNumber)
    })
  })
}
