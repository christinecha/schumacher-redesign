"use strict"

let currentUserId = 1
// check if product page is selected
let collectionQuery = window.location.href.indexOf('?collection=')
let collectionName = 'ALL PRODUCTS'
let collection
if (collectionQuery >= 0) {
  collection = window.location.href.slice(collectionQuery + 12)
  collectionName = collection.replace(/%20/g, ' ')
}

if (collection == 'favorites') {
  collectionName = 'My Favorites'
  getProducts('UserId', 1, "//104.130.216.8/v8.1/api/Favorite/GetFavorites")
} else if (collection.length > 0) {
  getProducts('Collection', collectionName, "//104.130.216.8/v8.1/api/Product/GetProducts")
} else {
  // do nothing
}

$('.main-category-title').html(collectionName)

function getProducts(key, value, url) {
  $('.product-list').empty()
  let query = {}
  query[key] = value
  console.log(query)
  $.post(
    url,
    query,
    function(data, status) {
      let products = data.GetProducts
      let departments = []
      $('.numOfResults').html(products.length)
      for (let i = 0; i < products.length; i++) {
        // for (let i = 0; i < departments.length; i++) {
        //   if (departments[i] == products[i].Department) {
        //     // do nothing
        //   } else {
        //     departments.push(products[i].Department)
        //   }
        // }
        // console.log(departments)
        let $productPreview = $('<div>').addClass('product-preview large-4 columns')
        let $productThumb = $('<div>').addClass('product-thumb').css('background-image', `url('${products[i].Item_Image_URL_400}')`)
        let $favorite = $('<img>').addClass('favorite').attr('src', '../assets/favorite-icon.svg')
        let $productInfo = $('<div>').addClass('product-info')
        let $quickshop = $('<div>').addClass('quickshop').html('QUICKSHOP')
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
    }
  )
}

// if you click a side filter, the page refreshes with the new query string
$('.sub-category').on('click', 'li', function() {
  var filter = $(this).attr('data-filter');
  var option = $(this).attr('data-option');
  location.href = "catalog.html?product=" + selected_product + "&filter=" + filter + "&option=" + option;
});

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
