"use strict"

function getData(request, url, fn) {
  $.post(
    url,
    request,
    function(data, status) {
      fn(data)
    }
  )
}

function catalogFilters() {
  return [
    { categoryFormatted: "Type", category: "Type", url: "//104.130.216.8/v8.1/api/Filter/GetTypeFilter"},
    { categoryFormatted: "Color", category: "ColorFamily", url: "//104.130.216.8/v8.1/api/Filter/GetColorFamilyFilter"},
    { categoryFormatted: "Style", category: "Style", url: "//104.130.216.8/v8.1/api/Filter/GetStyleFilter"},
    { categoryFormatted: "Application", category: "EndUse", url: "//104.130.216.8/v8.1/api/Filter/GetEndUseFilter"},
    { categoryFormatted: "Scale", category: "Scale", url: "//104.130.216.8/v8.1/api/Filter/GetScaleFilter"},
    { categoryFormatted: "Content", category: "Content", url: "//104.130.216.8/v8.1/api/Filter/GetContentFilter"},
    { categoryFormatted: "Abrasion", category: "Abrasion", url: "//104.130.216.8/v8.1/api/Filter/GetAbrasionFilter"},
    { categoryFormatted: "Extra Wide", category: "Extrawide", onlyShowFor: "Fabrics"},
    { categoryFormatted: "Matching WP", category: "WC_Available", onlyShowFor: "Fabrics"},
    { categoryFormatted: "Matching Fabric", category: "FAB_Available", onlyShowFor: "Wallpaper"},
    { categoryFormatted: "Price", category: "Price"}
  ]
}

// function getProduct(sku) {
//   $('.quickshop-modal').empty()
//   console.log(sku)
//   $.post(
//     "//104.130.216.8/v8.1/api/Product/GetProduct",
//     { ItemSku: sku },
//     function(data, status) {
