"use strict"

$(function() {

  var ref = new Firebase("https://schumacher.firebaseio.com/")

  // load data from Firebase
  function loadData() {

    ref.child("home").once("value", function(snapshot) {
      var homepageData = snapshot.val()

      if (homepageData.promo) {
        $('.promoInputs').remove()

        let $promo = $('<input>')
          .attr('id', 'promoText')
          .attr('type', 'text')
          .val(homepageData.promo.text)
        let $promoLink = $('<input>')
          .attr('id', 'promoLink')
          .attr('type', 'text')
          .val(homepageData.promo.link)

        let $promoInputs = $('<div>')
          .addClass('promoInputs')
          .append(
            $promo,
            '<i class="check fa fa-check-circle-o"></i>',
            '<br/>',
            $promoLink,
            '<i class="check fa fa-check-circle-o"></i>',
            '<br/>'
          )

        $('.promo').prepend($promoInputs)
      }

      if (homepageData.slideshow) {
        $('.slideshow').empty()

        homepageData.slideshow.forEach(function(slide, i) {
          var $slideClone = $slide.clone()
          var $imageClone = $image.clone()
            .css('background-image', 'url(' + slide.image + ')')
            .attr('data-index', i)
          var $arrowsClone = $arrows.clone().attr('data-index', i)
          var $linkUrlFormClone = $linkUrlForm.clone()
            .attr('data-index', i)
            .append($linkUrlInput.clone().val(slide.link))
            .append('<i class="check fa fa-check-circle-o"></i>')
            .append($linkUrlButton.clone().attr('data-index', i))

          $slideClone.append($imageClone, $arrowsClone, $linkUrlFormClone)
          $('.slideshow').append($slideClone)
        })
      }

      if (homepageData.rows) {
        $('.home-dynamic').empty()

        homepageData.rows.forEach(function(row, i) {
          if (row.images) {
            var columnWidth = 12 / row.images.length
            var $row = $('<div>')
              .css('margin', '15px 0')
              .css('padding', '15px')
              .css('background-color', '#f1f1f2')
              .attr('data-rowindex', i)

            var $sectionTitleContainer = $('<form>')
              .addClass('sectionTitleForm')
              .attr('data-rowindex', i)
            var $sectionTitle = $('<input>')
              .attr('type', 'text')
              .addClass('sectionTitleInput')
              .css('width', '65%')
              .css('display', 'inline-block')
              .val(row.title)
            var $updateButton = $('<button>')
              .html('update title')
              .css('width', '30%')
              .css('padding', '10px')
              .css('float', 'right')
            $sectionTitleContainer.append(
              $sectionTitle,
              '<i class="check fa fa-check-circle-o"></i>',
              $updateButton
            )
            $row.append($sectionTitleContainer, '<br>')

            row.images.forEach(function(image, j) {
              var $slideClone = $slide.clone()
                .attr('data-rowindex', i)
                .attr('data-index', j)
              var $imageClone = $image.clone()
                .css('background-image', 'url(' + image.image + ')')
                .attr('data-rowindex', i)
                .attr('data-index', j)
              var $arrowsClone = $arrows.clone()
                .attr('data-rowindex', i)
                .attr('data-index', j)
              var $linkUrlFormClone = $linkUrlForm.clone()
                .attr('data-rowindex', i)
                .attr('data-index', j)
                .append($linkUrlInput.clone().val(image.link))
                .append('<i class="check fa fa-check-circle-o"></i>')
                .append($linkUrlButton.clone())

              $slideClone.append($imageClone, $arrowsClone, $linkUrlFormClone)
              $row.append($slideClone)
            })

            var $imageRowForm = $('<form>')
              .attr('data-rowIndex', i)
              .addClass('imageRowForm')
              .append('<input type="text" class="imageURL" style="width: 40%; display: inline-block;" />')
              .append('<button style="padding: 10px; margin-left: 10px;">add image to row</button>')

            $row.append('<br><br>', $imageRowForm)

            $('.home-dynamic').append($row)
          }
        })
      }

      if (homepageData.featuredProducts) {
        $('.pinboard').empty()

        homepageData.featuredProducts.forEach(function(product, i) {
          var $arrowsClone = $arrows.clone()
            .attr('data-index', i)
          var $productThumb = $('<div>')
            .addClass('featured-product--thumb')
            .css('background-image', 'url(' + product.image + ')')
          var $productInfo = $('<form>')
            .append($arrowsClone)
            .addClass('featured-product--info')
            .attr('data-index', i)
            .append('<div class="featured-product--name">' + product.name + '</div>')
            .append('<input class="featured-product--sku" value="' + product.sku + '" />')
            .append($linkUrlButton.clone())
          var $productContainer = $('<div>')
            .addClass('featured-product')
            .append($productThumb, $productInfo)
          $('.pinboard').append($productContainer)
        })
      }
    })
  }

  function repositionImage(array, id, move) {
    // console.log(array)
    var imageArray = array.slice()
    var originalSlide = imageArray[id]
    imageArray.splice(id, 1)
    imageArray.splice(id + move, 0, originalSlide)

    return imageArray
  }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// onload events

  loadData()

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// promo update

$('.promo').on('keydown', 'input', function(e) {
  $(this).siblings('.check').remove()
})

$('.promo').on('submit', function(e) {
  e.preventDefault()
  var promoText = $(this).find('#promoText').val()
  var promoLink = $(this).find('#promoLink').val()

  ref.child("home").child("promo").update({
    text: promoText,
    link: promoLink
  }, loadData())
})

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// slideshow update

  $('.slideshow').on('click', '.back', function() {
    var slideNum = parseInt($(this).parent().attr('data-index'))

    if (slideNum > 0) {
      ref.child("home").child("slideshow").once("value", function(snapshot) {
        var newArray = repositionImage(snapshot.val(), slideNum, -1)

        ref.child("home").update({
          slideshow: newArray
        }, loadData())
      })
    }
  })

  $('.slideshow').on('click', '.forward', function() {
    var slideNum = parseInt($(this).parent().attr('data-index'))

    ref.child("home").child("slideshow").once("value", function(snapshot) {
      if (slideNum < snapshot.val().length - 1) {
        var newArray = repositionImage(snapshot.val(), slideNum, 1)

        ref.child("home").update({
          slideshow: newArray
        }, loadData())
      }
    })
  })

  $('.slideshow').on('click', '.delete', function() {
    var slideNum = parseInt($(this).parent().attr('data-index'))
    ref.child("home").child("slideshow").child(slideNum).remove(loadData())
  })

  $('.slideshow').on('keydown', '.linkUrlInput', function(e) {
    $(this).siblings('.check').remove()
  })

  $('.slideshow').on('submit', '.linkUrlForm', function(e) {
    e.preventDefault()
    var slideNum = parseInt($(this).attr('data-index'))
    var imageURL = $(this).children('.linkUrlInput').val()

    ref.child("home").child("slideshow").child(slideNum).update({
      link: imageURL
    }, loadData())
  })

  $('#slideshowForm').submit(function(e) {
    e.preventDefault()
    var imageURL = $('#slideshowForm--imageURL').val()
    if (imageURL.indexOf('http') < 0) {
      imageURL = 'http://' + imageURL
    }

    ref.child("home").child("slideshow").once("value", function(snapshot) {
      var newArray = snapshot.val().slice()
      newArray.push({
        image: imageURL
      })

      ref.child("home").update({
        slideshow: newArray
      }, loadData())
    })
  })

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// row update

$('.home-dynamic').on('submit', '.sectionTitleForm', function(e) {
  e.preventDefault()
  var rowId = $(this).attr('data-rowindex')
  var rowTitle = $(this).children('.sectionTitleInput').val()

  ref.child("home").child("rows").child(rowId).update({
    title: rowTitle
  }, loadData())
})

$('.home-dynamic').on('submit', '.imageRowForm', function(e) {
  e.preventDefault()
  var rowId = $(this).attr('data-rowindex')
  var imageURL = $(this).children('.imageURL').val()

  ref.child("home").child("rows").child(rowId).once("value", function(snapshot) {
    var newArray = snapshot.val().images.slice()
    newArray.push({
      image: imageURL,
    })

    ref.child("home").child("rows").child(rowId).update({
      images: newArray
    }, loadData())
  })
})

$('.home-dynamic').on('click', '.delete', function() {
  var rowNum = parseInt($(this).parent().attr('data-rowindex'))
  var slideNum = parseInt($(this).parent().attr('data-index'))
  // console.log(rowNum, slideNum)
  ref.child("home").child("rows").child(rowNum).child("images").child(slideNum).remove(loadData())
})

$('.home-dynamic').on('click', '.back', function() {
  var rowNum = parseInt($(this).parent().attr('data-rowindex'))
  var slideNum = parseInt($(this).parent().attr('data-index'))
  console.log(rowNum, slideNum)

  if (slideNum > 0) {
    ref.child("home").child("rows").child(rowNum).child("images").once("value", function(snapshot) {
      var newArray = repositionImage(snapshot.val(), slideNum, -1)

      ref.child("home").child("rows").child(rowNum).update({
        images: newArray
      }, loadData())
    })
  }
})

$('.home-dynamic').on('click', '.forward', function() {
  var rowNum = parseInt($(this).parent().attr('data-rowindex'))
  var slideNum = parseInt($(this).parent().attr('data-index'))

  ref.child("home").child("rows").child(rowNum).child("images").once("value", function(snapshot) {
    if (slideNum < snapshot.val().length - 1) {
      var newArray = repositionImage(snapshot.val(), slideNum, 1)

      ref.child("home").child("rows").child(rowNum).update({
        images: newArray
      }, loadData())
    }
  })
})

$('.home-dynamic').on('keydown', 'input', function(e) {
  $(this).siblings('.check').remove()
})

$('.home-dynamic').on('submit', '.linkUrlForm', function(e) {
  e.preventDefault()
  var rowNum = parseInt($(this).attr('data-rowindex'))
  var slideNum = parseInt($(this).attr('data-index'))

  var imageURL = $(this).children('.linkUrlInput').val()
  ref.child("home").child("rows").child(rowNum).child("images").child(slideNum).update({
    link: imageURL
  }, loadData())
})

///////////////////////////////////

function getProductInfo(productSku) {
  return new Promise(function(resolve, reject) {
    $.post(
      "https://www.fschumacher.com/api/v1/GetProduct",
      { ItemSku: productSku },
      function(data, status) {
        resolve(data.Description)
      }
    )
  })
}

$('.pinboard').on('submit', '.featured-product--info', function(e) {
  e.preventDefault()

  var productId = $(this).attr('data-index')
  var productSku = $(this).children('.featured-product--sku').val()

  getProductInfo(productSku).then(function(data) {
    var productName = data.Item_Name
    var productImage = data.Item_Image_URL_400

    ref.child("home").child("featuredProducts").child(productId).update({
      name: productName,
      image: productImage,
      sku: productSku
    }, loadData())

  })
})

$('.pinboard').on('click', '.back', function() {
  var slideNum = parseInt($(this).parent().attr('data-index'))

  if (slideNum > 0) {
    ref.child("home").child("featuredProducts").once("value", function(snapshot) {
      var newArray = repositionImage(snapshot.val(), slideNum, -1)

      ref.child("home").update({
        featuredProducts: newArray
      }, loadData())
    })
  }
})

$('.pinboard').on('click', '.forward', function() {
  var slideNum = parseInt($(this).parent().attr('data-index'))

  ref.child("home").child("featuredProducts").once("value", function(snapshot) {
    if (slideNum < snapshot.val().length - 1) {
      var newArray = repositionImage(snapshot.val(), slideNum, 1)

      ref.child("home").update({
        featuredProducts: newArray
      }, loadData())
    }
  })
})

$('.home-dynamic').on('keydown', 'input', function(e) {
  $(this).siblings('.check').remove()
})

$('.home-dynamic').on('submit', '.linkUrlForm', function(e) {
  e.preventDefault()
  var rowNum = parseInt($(this).attr('data-rowindex'))
  var slideNum = parseInt($(this).attr('data-index'))

  var imageURL = $(this).children('.linkUrlInput').val()
  ref.child("home").child("rows").child(rowNum).child("images").child(slideNum).update({
    link: imageURL
  }, loadData())
})




})
