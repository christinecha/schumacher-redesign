"use strict"

$(() => {

  let ref = new Firebase("https://schumacher.firebaseio.com/")

  ref.child("home").once("value", (snapshot) => {
    let homepageData = snapshot.val()

    if (homepageData.slideshow) {
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

        if (row.title) {
          let $sectionTitle = $('<div>')
            .addClass('row section-title homepage-tile')
            .append('<span>' + row.title + '</span>')
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
  })






})
