"use strict"

let ref = new Firebase("https://schumacher.firebaseio.com/")

ref.child("home").once("value", (snapshot) => {
  let homepageData = snapshot.val()

  if (homepageData.slideshow) {
    console.log('getting slideshow')

    homepageData.slideshow.forEach((slide, i) => {
      let $slide = $('<img>')
        .attr('src', slide.image)
        .attr('width', '100%')
      $('.slideshow').append($slide)
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
    homepageData.rows.forEach((row, i) => {
      console.log('getting rows')

      if (row.title) {
        let $sectionTitle = $('<div>')
          .addClass('row section-titleContainer')
          .append('<div class="section-title">' + row.title + '</div>')
        $('.home-dynamic').append($sectionTitle)
      }

      if (row.images) {
        let columnWidth = 12 / row.images.length
        console.log(columnWidth)
        let $row = $('<div>')
          .addClass('row')

        row.images.forEach((image, j) => {
          let $imageContainer = $('<div>')
            .addClass('medium-' + columnWidth + ' large-' + columnWidth + ' columns homepage-tile')
          let $image = $('<img>')
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

    homepageData.featuredProducts.forEach((product, i) => {
      let $productThumb = $('<div>')
        .addClass('featured-product--thumb')
        .css('background-image', 'url(' + product.image + ')')
      let $productInfo = $('<div>')
        .addClass('featured-product--info')
        .append('<div class="featured-product--name">' + product.name + '</div>')
        .append('<div class="featured-product--sku">' + product.sku + '</div>')
      let $productContainer = $('<a>')
        .addClass('featured-product')
        .attr('href', '/item/' + product.sku)
        .append($productThumb, $productInfo)
      $('.pinboard').append($productContainer)
    })

    movePinboard()
  }
})

function movePinboard() {
  let $sectionTitle = $('<div>')
    .addClass('row section-titleContainer')
    .append('<div class="section-title">Featured Products</div>')
    
  let $pinboard = $('.pinboard-container').detach()
  console.log('hi', $('.home-dynamic').children('.row'))
  $('.home-dynamic .row').eq(7).before($pinboard)
  $('.pinboard-container').before($sectionTitle)
}
