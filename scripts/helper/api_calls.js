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
    { categoryFormatted: "Type", category: "Type", url: "https://www.fschumacher.com/api/v1/GetTypeFilter"},
    { categoryFormatted: "Motif", category: "Motif", url: "https://www.fschumacher.com/api/v1/GetMotifFilter"},
    { categoryFormatted: "Color", category: "ColorFamily", url: "https://www.fschumacher.com/api/v1/GetColorFamilyFilter"},
    { categoryFormatted: "Style", category: "Style", url: "https://www.fschumacher.com/api/v1/GetStyleFilter"},
    { categoryFormatted: "Application", category: "EndUse", url: "https://www.fschumacher.com/api/v1/GetEndUseFilter"},
    { categoryFormatted: "Scale", category: "Scale", url: "https://www.fschumacher.com/api/v1/GetScaleFilter"},
    { categoryFormatted: "Content", category: "Content", url: "https://www.fschumacher.com/api/v1/GetContentFilter"},
    { categoryFormatted: "Abrasion", category: "Abrasion", url: "https://www.fschumacher.com/api/v1/GetAbrasionFilter"},
    { categoryFormatted: "Extra Wide", category: "Extrawide", onlyShowFor: "Fabrics"},
    { categoryFormatted: "Matching WP", category: "WC_Available", onlyShowFor: "Fabrics"},
    { categoryFormatted: "Matching Fabric", category: "FAB_Available", onlyShowFor: "Wallpaper"},
    { categoryFormatted: "Price", category: "Price"}
  ]
}

function getFavorites(userId, fn) {
  getData(
    {UserId: userId},
    "https://www.fschumacher.com/api/v1/GetFavorites",
    function(data) {
      fn(data)
    }
  )
}
