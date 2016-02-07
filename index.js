"use strict"

$(() => {

  let ref = new Firebase("https://schumacher.firebaseio.com/")

  // create JQUERY object skeletons
  let $slide = $('<div>')
    .css('display', 'inline-block')
    .css('border', '2px solid white')
  let $image = $('<div>')
    .css('background-size', 'cover')
    .css('width', '300px')
    .css('height', '150px')
    .css('vertical-align', 'top')
    .append('<span class="delete">X</span>')
  let $arrows = $('<div>')
    .addClass('arrowsContainer')
    .css('text-align', 'center')
    .append('<i class="back arrow fa fa-arrow-circle-o-left"></i>')
    .append('&nbsp;&nbsp;&nbsp;')
    .append('<i class="forward arrow fa fa-arrow-circle-o-right"></i>')
  let $linkUrlInput = $('<input>')
    .attr('type', 'text')
    .addClass('linkUrlInput')
    .css('width', '60%')
    .css('display', 'inline-block')
  let $linkUrlButton = $('<button>')
    .css('width', '35%')
    .css('padding', '10px')
    .css('float', 'right')
    .html('update link')
  let $linkUrlForm = $('<form>')
    .addClass('linkUrlForm')

  // load data from Firebase
  const loadData = () => {

    ref.child("home").once("value", (snapshot) => {
      let homepageData = snapshot.val()

      if (homepageData.slideshow) {
        $('.slideshow').empty()

        homepageData.slideshow.forEach((slide, i) => {
          let $slideClone = $slide.clone()
          let $imageClone = $image.clone()
            .css('background-image', 'url(' + slide.image + ')')
            .attr('data-index', i)
          let $arrowsClone = $arrows.clone().attr('data-index', i)
          let $linkUrlFormClone = $linkUrlForm.clone()
            .append($linkUrlInput.clone().val(slide.link))
            .append('<i class="check fa fa-check-circle-o"></i>')
            .append($linkUrlButton.clone().attr('data-index', i))

          $slideClone.append($imageClone, $arrowsClone, $linkUrlFormClone)
          $('.slideshow').append($slideClone)
        })
      }

      if (homepageData.rows) {
        $('.home-dynamic').empty()

        homepageData.rows.forEach((row, i) => {
          if (row.images) {
            let columnWidth = 12 / row.images.length
            let $row = $('<div>')
              .css('margin', '15px 0')
              .css('padding', '15px')
              .css('background-color', '#f1f1f2')
              .attr('data-rowindex', i)

            let $sectionTitleContainer = $('<form>')
              .addClass('sectionTitleForm')
              .attr('data-rowindex', i)
            let $sectionTitle = $('<input>')
              .attr('type', 'text')
              .addClass('sectionTitleInput')
              .css('width', '65%')
              .css('display', 'inline-block')
              .val(row.title)
            let $updateButton = $('<button>')
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

            row.images.forEach((image, j) => {
              let $slideClone = $slide.clone()
                .attr('data-rowindex', i)
                .attr('data-index', j)
              let $imageClone = $image.clone()
                .css('background-image', 'url(' + image.image + ')')
                .attr('data-rowindex', i)
                .attr('data-index', j)
              let $arrowsClone = $arrows.clone()
                .attr('data-rowindex', i)
                .attr('data-index', j)
              let $linkUrlFormClone = $linkUrlForm.clone()
                .attr('data-rowindex', i)
                .attr('data-index', j)
                .append($linkUrlInput.clone().val(image.link))
                .append('<i class="check fa fa-check-circle-o"></i>')
                .append($linkUrlButton.clone())

              $slideClone.append($imageClone, $arrowsClone, $linkUrlFormClone)
              $row.append($slideClone)
            })

            let $imageRowForm = $('<form>')
              .attr('data-rowIndex', i)
              .addClass('imageRowForm')
              .append('<input type="text" class="imageURL" style="width: 40%; display: inline-block;" />')
              .append('<button style="padding: 10px; margin-left: 10px;">add image to row</button>')

            $row.append('<br><br>', $imageRowForm)

            $('.home-dynamic').append($row)
          }
        })
      }
    })
  }

  const repositionImage = (array, id, move) => {
    console.log(array)
    let imageArray = array.slice()
    let originalSlide = imageArray[id]
    imageArray.splice(id, 1)
    imageArray.splice(id + move, 0, originalSlide)

    return imageArray
  }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// onload events

  loadData()

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// slideshow update

  $('.slideshow').on('click', '.back', function() {
    let slideNum = parseInt($(this).parent().attr('data-index'))

    if (slideNum > 0) {
      ref.child("home").child("slideshow").once("value", (snapshot) => {
        let newArray = repositionImage(snapshot.val(), slideNum, -1)

        ref.child("home").update({
          slideshow: newArray
        }, loadData())
      })
    }
  })

  $('.slideshow').on('click', '.forward', function() {
    let slideNum = parseInt($(this).parent().attr('data-index'))

    ref.child("home").child("slideshow").once("value", (snapshot) => {
      if (slideNum < snapshot.val().length - 1) {
        let newArray = repositionImage(snapshot.val(), slideNum, 1)

        ref.child("home").update({
          slideshow: newArray
        }, loadData())
      }
    })
  })

  $('.slideshow').on('click', '.delete', function() {
    let slideNum = parseInt($(this).parent().attr('data-index'))
    ref.child("home").child("slideshow").child(slideNum).remove(loadData())
  })

  $('.slideshow').on('keydown', '.linkUrlInput', function(e) {
    $(this).siblings('.check').remove()
  })

  $('.slideshow').on('submit', '.linkUrlForm', function(e) {
    e.preventDefault()
    let slideNum = parseInt($(this).attr('data-index'))
    let imageURL = $(this).children('.linkUrlInput').val()

    ref.child("home").child("slideshow").child(slideNum).update({
      link: imageURL
    }, loadData())
  })

  $('#slideshowForm').submit(function(e) {
    e.preventDefault()
    let imageURL = $('#slideshowForm--imageURL').val()
    if (imageURL.indexOf('http') < 0) {
      imageURL = 'http://' + imageURL
    }

    ref.child("home").child("slideshow").once("value", (snapshot) => {
      let newArray = snapshot.val().slice()
      newArray.push(imageURL)

      ref.child("home").update({
        slideshow: newArray
      }, loadData())
    })
  })

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// row update

$('.home-dynamic').on('submit', '.sectionTitleForm', function(e) {
  e.preventDefault()
  let rowId = $(this).attr('data-rowindex')
  let rowTitle = $(this).children('.sectionTitleInput').val()

  ref.child("home").child("rows").child(rowId).update({
    title: rowTitle
  }, loadData())
})

$('.home-dynamic').on('submit', '.imageRowForm', function(e) {
  e.preventDefault()
  let rowId = $(this).attr('data-rowindex')
  let imageURL = $(this).children('.imageURL').val()

  ref.child("home").child("rows").child(rowId).once("value", (snapshot) => {
    let newArray = snapshot.val().images.slice()
    newArray.push({
      image: imageURL,
    })

    ref.child("home").child("rows").child(rowId).update({
      images: newArray
    }, loadData())
  })
})

$('.home-dynamic').on('click', '.delete', function() {
  let rowNum = parseInt($(this).parent().attr('data-rowindex'))
  let slideNum = parseInt($(this).parent().attr('data-index'))
  console.log(rowNum, slideNum)
  ref.child("home").child("rows").child(rowNum).child("images").child(slideNum).remove(loadData())
})

$('.home-dynamic').on('click', '.back', function() {
  let rowNum = parseInt($(this).parent().attr('data-rowindex'))
  let slideNum = parseInt($(this).parent().attr('data-index'))
  console.log(rowNum, slideNum)

  if (slideNum > 0) {
    ref.child("home").child("rows").child(rowNum).child("images").once("value", (snapshot) => {
      let newArray = repositionImage(snapshot.val(), slideNum, -1)

      ref.child("home").child("rows").child(rowNum).update({
        images: newArray
      }, loadData())
    })
  }
})

$('.home-dynamic').on('click', '.forward', function() {
  let rowNum = parseInt($(this).parent().attr('data-rowindex'))
  let slideNum = parseInt($(this).parent().attr('data-index'))

  ref.child("home").child("rows").child(rowNum).child("images").once("value", (snapshot) => {
    if (slideNum < snapshot.val().length - 1) {
      let newArray = repositionImage(snapshot.val(), slideNum, 1)

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
  let rowNum = parseInt($(this).attr('data-rowindex'))
  let slideNum = parseInt($(this).attr('data-index'))

  let imageURL = $(this).children('.linkUrlInput').val()
  ref.child("home").child("rows").child(rowNum).child("images").child(slideNum).update({
    link: imageURL
  }, loadData())
})






})
