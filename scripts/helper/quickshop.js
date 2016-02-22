"use strict"

var product_props = [
  "Horizontal_Repeat",
  "Match",
  "Vertical_Repeat",
  "Content",
  "Item_Width",
  "Performance"
]

function getProduct(sku, favoritesById) {
  $('.quickshop-modal').empty()
  console.log(sku)
  $.post(
    "https://www.fschumacher.com/api/v1/GetProduct",
    { ItemSku: sku },
    function(data, status) {
      var productInfo = data.Description
      console.log(productInfo)
      var $productPreview = $('<div>').addClass('product-preview')
      var $productThumb = $('<div>').addClass('product-thumb').css('background-image', `url('${productInfo.Item_Image_URL_400}')`)
      var $productInfo = $('<div>').addClass('product-info')

      var $productName = $('<div>').addClass('product-name').html(productInfo.Item_Name)
      var $favorite = $('<img>')
        .addClass('favorite')
        .attr('src', '../assets/favorite-icon.svg')
        .attr('data-ItemSku', productInfo.ItemSku)
      if (favoritesById.indexOf(productInfo.ItemSku) >= 0) {
        $favorite = $favorite.attr('src', '../assets/favorite-icon_favorited.svg')
      }
      var $exitQuickshop = $('<div>').addClass('exit-quickshop').html('X')
      $productName.append($favorite, $exitQuickshop)

      var $productType = $('<div>').addClass('product-type').html(productInfo.Department)
      var $productSku = $('<span>').addClass('product-sku').html(productInfo.ItemSku)
      var $productColor = $('<span>').addClass('product-color').html('COLOR: ' + productInfo.Item_Color)
      var $productPrice = $('<div>').addClass('product-price').html(productInfo.Selling_Price_USD)
      var $productProps = $('<div>').addClass('product-props')

      for (var i = 0; i < product_props.length; i++) {
        var key = product_props[i]
        var value = productInfo[key]
        if (value) {
          var $productProp = $('<div>').addClass('product-prop')
          var $productPropKey = $('<div>').addClass('product-prop-key').html(product_props[i].replace(/_/g, ' '))
          var $productPropValue = $('<div>').addClass('product-prop-value').html(productInfo[product_props[i]].replace(/_/g, ' '))
          $productProp.append($productPropKey, $productPropValue)
          $productProps.append($productProp)
        }
      }

      var $productShopForm = $('<div>').addClass('product-shop')
      var $quantity = $('<input>').addClass('product-shop--quantity').attr('type', 'number').attr('min', 1).attr('step', 1).val(1)
      var $units = $('<span>').addClass('units').html(productInfo.UnitOfMeasure)
      var $orderTypes = $('<select>')
                          .addClass('product-shop--ordertypes')
                          .append($('<option>').html('Product Order'))
                          .append($('<option>').html('Reserve'))
                          .append($('<option>').html('Reserve with Cfa'))
                          .append($('<option>').html('Memo'))
      var $addToBag = $('<button>').addClass('addToBag').addClass('dropdownButton').html('ADD TO SHOPPING BAG')

      $productShopForm.append($quantity, $units, $orderTypes, $addToBag)

      $productInfo.append(
        $productName,
        $productColor,
        '<br>',
        $productSku,
        '<br><br>',
        $productProps,
        $productPrice,
        '<br>',
        $productShopForm
      )
      $productPreview.append($productThumb)
      $('.quickshop-modal').append($productPreview, $productInfo)

      $('.quickshop-overlay').show()
      $('body').css('overflow', 'hidden')
    }
  )
}

$('.quickshop-overlay').on('change', '.product-shop--ordertypes', function(e) {
  console.log($('.product-shop--ordertypes').val())
  if ($('.product-shop--ordertypes').val() == 'Memo') {
    $('<span class="temp-units">UNITS</span>').insertAfter('.units')
    $('.product-shop .units').hide()
  } else {
    $('.product-shop .temp-units').remove()
    $('.product-shop .units').show()
  }
})

$('.quickshop-overlay').on('click', '.exit-quickshop', function() {
  $('.quickshop-overlay').hide()
  $('body').css('overflow', 'auto')
})
