"use strict"

requirejs(["../scripts/helper/parse_url.js"], function() {
  let url_params = parseUrl()

  requirejs(["../scripts/helper/api_calls.js"], function() {
    requirejs(["../scripts/helper/catalog_helpers.js"], function() {

      let selected_product = 'All Products'
      let selected_collection = 'All Products'
      let selected_filters = {
        PriceFrom: 0
      }; // this object will contain all the selected filters for search

      if (url_params.product && $('#' + url_params.product)) {
        $('#' + url_params.product).addClass('selected-force')
        selected_product = url_params.product
        if (url_params.filter && url_params.option) {
          selected_filters[url_params.filter] = url_params.option
        }
      } else if (url_params.collection) {
        selected_collection = url_params.collection
        selected_filters['collection'] = selected_collection
      }

      if (url_params.path.indexOf('catalog') >= 0) {
        $('.main-category-title').html(selected_product)
        displaySelectedFilters(selected_filters)
        getProducts()
        $.each(catalogFilters(), function() {
          console.log('getting ', this.category)
          if (!this.onlyShowFor || this.onlyShowFor == selected_product) {
            getFilterDropdowns(
              selected_product,
              this.category,
              this.categoryFormatted,
              this.url
            )
          }
        })
      } else if (url_params.path.indexOf('collection') >= 0) {
        $('.main-category-title').html(selected_product)
        displaySelectedFilters(selected_filters)
        getProducts()
      }


      function getProducts(pageNumber) {
        $('.product-list').html('<br>loading results...')

        pageNumber = !pageNumber ? 1 : pageNumber
        let query = {
          Department: selected_product,
          Rows_per_page: 30,
          Page_number: pageNumber
        }
        for (var filter in selected_filters) {
          query[filter] = selected_filters[filter]
        }

        getData(query, "//104.130.216.8/v10/api/Product/GetProducts", function(data) {
          $('.product-list').empty()
          $('.pagination').empty()
          let products = data.GetProducts
          let productCount = data.Count
          let pageCount = Math.ceil(data.Count / 30)
          let currentPage = parseInt(query.Page_number)

          $('.numOfResults').html(productCount)

          for (let i = 0; i < 10; i++) {
            let pageNumber = i + currentPage
            if (pageNumber <= pageCount) {
              let $pageNumber = $('<span>')
                                  .addClass('page-number')
                                  .html(pageNumber)
                                  .attr('data-page', pageNumber)
              if (i == 0) {
                $pageNumber.addClass('selected')
              }
              $('.pagination').append($pageNumber)
            }
          }

          if (currentPage > 1) {
            let $prevArrow = $('<span>')
                              .addClass('page-number')
                              .html('<<')
                              .attr('data-page', currentPage - 1)
            $('.pagination').prepend($prevArrow)
          }

          if (pageCount > currentPage + 10) {
            let $nextArrow = $('<span>')
                              .addClass('page-number')
                              .html('>>')
                              .attr('data-page', currentPage + 10)
            $('.pagination').append($nextArrow)
          }

          for (let i = 0; i < products.length; i++) {
            let $productPreview = $('<div>').addClass('product-preview large-4 columns')
            let $productThumb = $('<div>').addClass('product-thumb').css('background-image', `url('${products[i].Item_Image_URL_400}')`)
            let $favorite = $('<img>').addClass('favorite').attr('src', '../assets/favorite-icon.svg')
            let $productInfo = $('<div>').addClass('product-info')
            let $quickshop = $('<div>').addClass('quickshop').html('QUICKSHOP').attr('data-sku', products[i].ItemSku)
            let $productType = $('<div>').addClass('product-type').html(products[i].Department)
            let $productName = $('<div>').addClass('product-name').html(products[i].Item_Name)
            let $productId = $('<div>').addClass('product-id')
            let $productSku = $('<span>').addClass('product-sku').html(products[i].ItemSku)
            let $productColor = $('<span>').addClass('product-color').html(products[i].Item_Color)
            let $productPrice = $('<div>').addClass('product-price').html(products[i].Selling_Price_USD)
            $productId.append($productColor, ' ', $productSku)
            $productInfo.append($quickshop, $productType, $productName, $productId, $productPrice)
            $productPreview.append($productThumb, $favorite, $productInfo)
            $('.product-list').append($productPreview)
          }
          makeSquareThumbnails()
        })
      }

      // trigger getProducts on different events
      $(document).on('click', '.submitSearch', function() {
        displaySelectedFilters(selected_filters)
        if ($(this).attr('type') == 'checkbox') {
          let filter = $(this).parent().attr('id')
          if (!selected_filters[filter] || selected_filters[filter] == false) {
            selected_filters[filter] = true
          } else {
            selected_filters[filter] = false
          }
        }
        $(this).parent('.dropdown').hide()
        getProducts()
      })

      $('.pagination').on('click', '.page-number', function() {
        let pageNumber = $(this).attr('data-page')
        getProducts(pageNumber)
      })

      // if you click a side filter, the page refreshes with the new query string
      $('.sub-category').on('click', 'li', function() {
        var filter = $(this).attr('data-filter');
        var option = $(this).attr('data-option');
        location.href = "catalog.html?product=" + selected_product + "&filter=" + filter + "&option=" + option;
      });

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // manipulate pricing slider
      let priceSliderActivated = false
      let priceCaption = 'NO LIMIT'
      let scaleMax = 300
      let increment = 10
      if (selected_product == "Furniture") {
        scaleMax = 4000
        increment = 100
      }

      $('.filter-dropdowns').on('mousedown', '.slider-handle', function(e){
        priceSliderActivated = $(this).attr('data-type')
        let originalX = $(this).parent('.pricing-slider').offset().left
        $('.filter-dropdowns').on('mousemove', '.dropdown.Price', function(e){
          if (priceSliderActivated) {
            let newX = e.pageX - originalX
            let scale = scaleMax / 185
            let price = Math.ceil((newX * scale) / increment) * increment

            if (newX <= 0) {
              newX = 0
              price = 0
            } else if (newX >= 185) {
              newX = 185
              price = scaleMax
              delete selected_filters.PriceTo
            }

            if (priceSliderActivated == 'min') {
              let minMax = parseInt($('.slider-handle-max').css('margin-left')) - increment
              if (newX >= minMax) {
                newX = minMax
                price = Math.ceil((newX * scale) / increment) * increment
              }
              selected_filters.PriceFrom = price
              $('.slider-handle-min').css('margin-left', newX + 'px')
            } else if (priceSliderActivated == 'max') {
              let maxMin = parseInt($('.slider-handle-min').css('margin-left')) + increment
              if (newX <= maxMin) {
                newX = maxMin
                price = Math.ceil((newX * scale) / increment) * increment
              }
              selected_filters.PriceTo = price
              if (price >= scaleMax) {
                delete selected_filters.PriceTo
              }
              $('.slider-handle-max').css('margin-left', newX + 'px')
            }

            console.log(selected_filters.PriceFrom, selected_filters.PriceTo)

            if (!selected_filters.PriceTo || selected_filters.PriceTo >= scaleMax) {
              priceCaption = '$' + selected_filters.PriceFrom + ' - $300+'
            } else {
              priceCaption = '$' + selected_filters.PriceFrom + ' - $' + selected_filters.PriceTo
            }
            $('.price-display').html(priceCaption)
          }
        }.bind(this))
      })

      $(document).on('mouseup', function(e){
        priceSliderActivated = false
      })

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      // add/remove filter options to selected_filters array
      $('.filter-dropdowns').on('click', 'li', function(){
        var filter = $(this).attr('data-filter');
        var option = $(this).attr('data-option');

        // check if already added to query
        if (selected_filters[filter]) {
          let filterOptions = selected_filters[filter].split(',')
          for (var i = 0; i < filterOptions.length; i++) {
            if (filterOptions[i] == option) {
              $(this).removeClass('selected')
              filterOptions.splice(i, 1)
              if (filterOptions.length <= 0) {
                delete selected_filters[filter]
              } else {
                selected_filters[filter] = filterOptions.join(',')
              }
              displaySelectedFilters(selected_filters)
              return false
            }
          }
          $(this).addClass('selected')
          filterOptions.push(option)
          selected_filters[filter] = filterOptions.join(',')
        } else {
          $(this).addClass('selected')
          selected_filters[filter] = option
        }
      });

      // remove selected filter by clicking on it
      $('.selected-filters').on('click', '.selected-filter', function() {
        var filter = $(this).attr('data-filter');
        var option = $(this).attr('data-option');

        let filterOptions = selected_filters[filter].split(',')
        for (var i = 0; i < filterOptions.length; i++) {
          if (filterOptions[i] == option) {
            console.log($('.dropdown.' + filter + ' .dropdownColumn li[data-option="' + option + '"]'))
            $('.dropdown.' + filter + ' .dropdownColumn li[data-option="' + option + '"]').removeClass('selected')
            filterOptions.splice(i, 1)
            if (filterOptions.length > 0) {
              selected_filters[filter] = filterOptions.join(',')
            } else {
              delete selected_filters[filter]
            }
          }
        }
        displaySelectedFilters(selected_filters)
        getProducts()
      });

      // display selected filters + filter titles
      function displaySelectedFilters(selected_filters) {
        $('.selected-filter').remove();
        $('.filter-title').removeClass('in-use');

        for (var filter in selected_filters) {

          let filterOptions = []

          if (
            selected_filters[filter] &&
            typeof(selected_filters[filter]) == 'string' &&
            selected_filters[filter].length > 0) {
             filterOptions = selected_filters[filter].split(',')
          }

          for (var i = 0; i < filterOptions.length; i++) {
            var $selected_filter = $('<div>')
              .addClass('selected-filter')
              .html(filterOptions[i])
              .attr('data-filter', filter)
              .attr('data-option', filterOptions[i])
              .append('<span class="remove">x</span>');
            $('.selected-filters').append($selected_filter);
            $('.filter-title #' + filter).addClass('in-use');
          }
        }
      }

      // toggle collapse side filters
      $('.sub-category-title').on('click', function() {
        $(this).siblings('li').toggle();
        $(this).toggleClass('collapsed');

        if ($(this).hasClass('collapsed') == true) {
          $(this).children('.caret').html('&#9654;');
        } else {
          $(this).children('.caret').html('&#9660;');
        }
      })

      // make sure product thumbnails are square, even on window resize.
      function makeSquareThumbnails() {
        let thumbnailWidth = $('.product-thumb').css('width')
        $('.product-thumb').css('height', thumbnailWidth)
      }

      $(window).on('resize', function() {
        makeSquareThumbnails()
      })
    })
  })
})
