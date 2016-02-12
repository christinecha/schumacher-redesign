"use strict"

function pageNumber(i) {
  return $('<span>')
    .addClass('page-number')
    .html(i)
    .attr('data-page', i)
}

function displayPagination(currentPage, pageCount) {
  console.log('page count: ', pageCount)

  let $prevArrow = $('<span>')
    .addClass('page-number')
    .html('<<')
    .attr('data-page', currentPage - 1)

  let $nextArrow = $('<span>')
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
    let max = pageCount

    if (pageCount > 10) {
      max = 10
    }

    for (let i = 1; i <= max; i++) {
      let pageNode = pageNumber(i)
      if (i == currentPage) {
        pageNode = pageNode.addClass('selected')
      }
      $('.pagination').append(pageNode)
    }

    $('.pagination').append(
      '...',
      pageNumber(pageCount),
      $nextArrow
    )
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

    for (let i = 0; i < 10; i++) {
      let pageNode = pageNumber(pageCount - i)
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
