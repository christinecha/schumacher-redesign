"use strict"

var ref = new Firebase("https://schumacher.firebaseio.com/")

ref.child("home").once("value", function(snapshot) {
  var homepageData = snapshot.val()

  if (homepageData.slideshow) {
    console.log('getting slideshow')

    homepageData.slideshow.forEach(function(slide, i) {
      var $slide = $('<img>')
        .attr('src', slide.image)
        .attr('width', '100%')

      var $slideContainer = $('<a>')
        .attr('href', slide.link)
        .append($slide)

      $('.slideshow').append($slideContainer)
    })

    $('.slideshow').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      autoplay: true,
      autoplaySpeed: 6000
    })
  }

  if (homepageData.rows) {
    homepageData.rows.forEach(function(row, i) {
      console.log('getting rows')

      if (row.title) {
        var $sectionTitle = $('<div>')
          .addClass('row section-titleContainer')
          .append('<div class="section-title">' + row.title + '</div>')
        $('.home-dynamic').append($sectionTitle)
      }

      if (row.images) {
        var columnWidth = 12 / row.images.length
        console.log(columnWidth)
        var $row = $('<div>')
          .addClass('row')

        row.images.forEach(function(image, j) {
          var $imageContainer = $('<div>')
            .addClass('medium-' + columnWidth + ' large-' + columnWidth + ' columns homepage-tile')
          var $image = $('<img>')
            .attr('src', image.image)
            .attr('width', '100%')

          $imageContainer.append($image)
          $row.append($imageContainer)
        })

        $('.home-dynamic').append($row)
      }
    })
  }

  if (homepageData.featuredProducts) {

    homepageData.featuredProducts.forEach(function(product, i) {
      var $productThumb = $('<div>')
        .addClass('featured-product--thumb')
        .css('background-image', 'url(' + product.image + ')')
      var $productInfo = $('<div>')
        .addClass('featured-product--info')
        .append('<div class="featured-product--name">' + product.name + '</div>')
        .append('<div class="featured-product--sku">' + product.sku + '</div>')
      var $productContainer = $('<a>')
        .addClass('featured-product')
        .attr('href', '/item/' + product.sku)
        .append($productThumb, $productInfo)
      $('.pinboard').append($productContainer)
    })

    movePinboard()
  }
})

function movePinboard() {
  var $sectionTitle = $('<div>')
    .addClass('row section-titleContainer')
    .append('<div class="section-title">Featured Products</div>')

  var $pinboard = $('.pinboard-container').detach()
  console.log('hi', $('.home-dynamic').children('.row'))
  $('.home-dynamic .row').eq(7).before($pinboard)
  $('.pinboard-container').before($sectionTitle)
}
