"use strict"

function pageNumber(i) {
  return $('<span>')
    .addClass('page-number')
    .html(i)
    .attr('data-page', i)
}

function displayPagination(currentPage, pageCount) {
  console.log('page count: ', pageCount)
  console.log('currentPage: ', currentPage)

  if (!currentPage || typeof currentPage != "number") {
    currentPage = 1
  }

  var $prevArrow = $('<span>')
    .addClass('page-number')
    .html('<<')
    .attr('data-page', currentPage - 1)

  var $nextArrow = $('<span>')
    .addClass('page-number')
    .html('>>')
    .attr('data-page', currentPage + 1)

  if (currentPage == 1) {
    $prevArrow = ''
  } else if (currentPage == pageCount) {
    $nextArrow = ''
  }

  if (pageCount == 1) {
    // do nothing
  } else if (currentPage < 10) {
    $('.pagination').append($prevArrow)
    var max = pageCount
    var lastPageListed = currentPage

    if (pageCount > 10) {
      max = 10
    }

    for (var i = 1; i <= max; i++) {
      var pageNode = pageNumber(i)
      if (i == currentPage) {
        pageNode = pageNode.addClass('selected')
      }
      lastPageListed = i
      $('.pagination').append(pageNode)
    }

    if (lastPageListed == pageCount) {
      // don't do anything
    } else  {
      $('.pagination').append(
        '...',
        pageNumber(pageCount),
        $nextArrow
      )
    }
  } else if (currentPage >= 10 && currentPage <= pageCount - 3) {
    $('.pagination').append(
      $prevArrow,
      pageNumber(1),
      '...',
      pageNumber(currentPage - 1),
      pageNumber(currentPage).addClass('selected'),
      pageNumber(currentPage + 1),
      '...',
      pageNumber(pageCount),
      $nextArrow
    )
  } else {
    $('.pagination').prepend($nextArrow)

    for (var i = 0; i < 10; i++) {
      var pageNode = pageNumber(pageCount - i)
      if (pageCount - i == currentPage) {
        pageNode = pageNode.addClass('selected')
      }
      $('.pagination').prepend(pageNode)
    }

    $('.pagination').prepend('...')
    $('.pagination').prepend(pageNumber(1))
    $('.pagination').prepend($prevArrow)
  }
}
