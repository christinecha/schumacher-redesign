"use strict"

let product_props = [
  "Horizontal_Repeat",
  "Match",
  "Vertical_Repeat",
  "Content",
  "Item_Width",
  "Performance"
]

function getProduct(sku) {
  $('.quickshop-modal').empty()
  console.log(sku)
  $.post(
    "//104.130.216.8/v8.1/api/Product/GetProduct",
    { ItemSku: sku },
    function(data, status) {
      let productInfo = data.Description
      console.log(productInfo)
      let $productPreview = $('<div>').addClass('product-preview')
      let $productThumb = $('<div>').addClass('product-thumb').css('background-image', `url('${productInfo.Item_Image_URL_400}')`)
      let $productInfo = $('<div>').addClass('product-info')

      let $productName = $('<div>').addClass('product-name').html(productInfo.Item_Name)
      let $favorite = $('<img>').addClass('favorite').attr('src', '../assets/favorite-icon.svg')
      let $exitQuickshop = $('<div>').addClass('exit-quickshop').html('X')
      $productName.append($favorite, $exitQuickshop)

      let $productType = $('<div>').addClass('product-type').html(productInfo.Department)
      let $productSku = $('<span>').addClass('product-sku').html(productInfo.ItemSku)
      let $productColor = $('<span>').addClass('product-color').html('COLOR: ' + productInfo.Item_Color)
      let $productPrice = $('<div>').addClass('product-price').html(productInfo.Selling_Price_USD)
      let $productProps = $('<div>').addClass('product-props')

      for (let i = 0; i < product_props.length; i++) {
        let key = product_props[i]
        let value = productInfo[key]
        if (value) {
          let $productProp = $('<div>').addClass('product-prop')
          let $productPropKey = $('<div>').addClass('product-prop-key').html(product_props[i].replace(/_/g, ' '))
          let $productPropValue = $('<div>').addClass('product-prop-value').html(productInfo[product_props[i]].replace(/_/g, ' '))
          $productProp.append($productPropKey, $productPropValue)
          $productProps.append($productProp)
        }
      }

      let $productShopForm = $('<div>').addClass('product-shop')
      let $quantity = $('<input>').addClass('product-shop--quantity').attr('type', 'number').attr('min', 1).attr('step', 1).val(1)
      let $units = $('<span>').html(productInfo.UnitOfMeasure)

      $productShopForm.append(
        $quantity,
        $units
      )

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


$('.catalog').on('click', '.quickshop', function() {
  let sku = $(this).attr('data-sku')
  getProduct(sku)
})

$('.quickshop-overlay').on('click', '.exit-quickshop', function() {
  $('.quickshop-overlay').hide()
  $('body').css('overflow', 'auto')
})
