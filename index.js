"use strict"

$(() => {

  let ref = new Firebase("https://schumacher.firebaseio.com/")

  const loadData = () => {

    ref.child("home").once("value", (snapshot) => {
      let homepageData = snapshot.val()

      if (homepageData.slideshow) {
        $('.slideshow').empty()

        homepageData.slideshow.forEach((slide, i) => {
          let index = homepageData.slideshow.indexOf(slide)
          let $slide = $('<div>')
            .css('display', 'inline-block')
          let $image = $('<div>')
            .css('background-image', 'url(' + slide.image + ')')
            .css('background-size', 'cover')
            .css('width', '300px')
            .css('height', '150px')
            .css('border', '2px solid white')
            .css('vertical-align', 'top')
            .attr('data-index', i)
            .append('<span class="delete">X</span>')
          let $arrows = $('<div>')
            .attr('data-index', i)
            .css('text-align', 'center')
            .append('<span class="back"><</span>')
            .append('&nbsp;&nbsp;&nbsp;')
            .append('<span class="forward">></span>')

          let $linkUrlInput = $('<input>')
            .attr('type', 'text')
            .addClass('linkUrlInput')
            .css('width', '60%')
            .css('display', 'inline-block')
            .val(slide.link)
          let $linkUrlButton = $('<button>')
            .css('width', '35%')
            .css('padding', '10px')
            .css('float', 'right')
            .html('update link')
          let $linkUrlForm = $('<form>')
            .attr('data-index', i)
            .addClass('linkUrlForm')
            .append($linkUrlInput, $linkUrlButton)

          $slide.append($image, $arrows, $linkUrlForm)
          $('.slideshow').append($slide)
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
            $sectionTitleContainer.append($sectionTitle, $updateButton)
            $row.append($sectionTitleContainer)

            row.images.forEach((imageURL, j) => {
              let $imageContainer = $('<div>')
                .css('display', 'inline-block')
              let $image = $('<div>')
                .attr('data-index', j)
                .append('<span class="delete">X</span>')
                .css('background-image', 'url(' + imageURL.image + ')')
                .css('background-size', 'cover')
                .css('width', '300px')
                .css('height', '350px')
                .css('margin', '0 2.5px')
              let $arrows = $('<div>')
                .attr('data-rowindex', i)
                .attr('data-index', j)
                .css('text-align', 'center')
                .append('<span class="back"><</span>')
                .append('&nbsp;&nbsp;&nbsp;')
                .append('<span class="forward">></span>')

              let $linkUrlInput = $('<input>')
                .attr('type', 'text')
                .css('width', '60%')
                .css('display', 'inline-block')
                .val(imageURL.link)
              let $linkUrlButton = $('<button>')
                .css('width', '35%')
                .css('padding', '10px')
                .css('float', 'right')
                .html('update link')
              let $linkUrlForm = $('<form>')
                .addClass('linkUrlForm')
                .attr('data-rowindex', i)
                .attr('data-index', j)
                .append($linkUrlInput, $linkUrlButton)

              $imageContainer.append($image, $linkUrlForm, $arrows)
              $row.append($imageContainer)
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

  $('.slideshow').on('submit', '.linkUrlForm', function(e) {
    e.preventDefault()
    let slideNum = parseInt($(this).attr('data-index'))
    let imageURL = $(this).children('.linkUrlInput').val()
    if (imageURL.indexOf('http') < 0) {
      imageURL = 'http://' + imageURL
    }
    ref.child("home").child("slideshow").child(slideNum).update({
      link: imageURL
    })
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
  })
})

$('.home-dynamic').on('submit', '.imageRowForm', function(e) {
  e.preventDefault()
  let rowId = $(this).attr('data-rowindex')
  let imageURL = $(this).children('.imageURL').val()
  if (imageURL.indexOf('http') < 0) {
    imageURL = 'http://' + imageURL
  }

  ref.child("home").child("rows").child(rowId).once("value", (snapshot) => {
    let newArray = snapshot.val().images.slice()
    newArray.push(imageURL)

    ref.child("home").child("rows").child(rowId).update({
      images: newArray
    }, loadData())
  })
})

$('.home-dynamic').on('click', '.delete', function() {
  let rowNum = parseInt($(this).parent().parent().attr('data-rowindex'))
  let slideNum = parseInt($(this).parent().attr('data-index'))
  ref.child("home").child("rows").child(rowNum).child("images").child(slideNum).remove(loadData())
})

$('.home-dynamic').on('click', '.back', function() {
  let rowNum = parseInt($(this).parent().attr('data-rowindex'))
  let slideNum = parseInt($(this).parent().attr('data-index'))

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







})
