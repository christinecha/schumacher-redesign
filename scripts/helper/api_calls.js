"use strict"

function getData(request, url) {
  return new Promise((resolve, reject) => {
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

function getFavorites(userId, fn) {
  getData(
    {UserId: userId},
    "https://www.fschumacher.com/api/v1/GetFavorites"
  ).then((data) => {
    fn(data)
  })
}
