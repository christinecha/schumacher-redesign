"use strict"

let currentUserId = '115593'

requirejs(["../scripts/helper/parse_url.js"], function() {
  let url_params = parseUrl()

  requirejs(["../scripts/helper/api_calls.js"], function() {
    requirejs(["../scripts/helper/catalog_helpers.js"], function() {

      let selected_product = 'All Products'
      let selected_collection = 'All Products'
      let favoritesOnly = false
      let selected_filters = { // this object will contain all the selected filters for search
        PriceFrom: 0
      };
      let favoritesById = []

      if (url_params.product && $('#' + url_params.product)) {
        $('#' + url_params.product).addClass('selected-force')
        selected_product = url_params.product
        selected_filters.Department = selected_product
        if (url_params.filter && url_params.option) {
          selected_filters[url_params.filter] = url_params.option
        }
      }

      if (url_params.collection) {
        selected_collection = url_params.collection
        selected_filters.Collection = selected_collection
      }

      if (url_params.path.indexOf('catalog') >= 0) {

        // replace header text with correct catalog name
        if (departmentDictionary[selected_product] && departmentDictionary[selected_product].nameFormatted) {
          $('.main-category-title').html(departmentDictionary[selected_product].nameFormatted)
        } else {
          $('.main-category-title').html(selected_product)
        }

        getProducts() // get products from initial on-load search query
        getSidebarFilters(selected_product) // get sidebar filters of selected product

        $.each(catalogFilters(), function() { // dynamically generate the relevant filter options + dropdowns
          // console.log('getting ', this.category)
          if (!this.onlyShowFor || this.onlyShowFor == selected_product) {
            getCatalogFilters(
              selected_product,
              this.category,
              this.categoryFormatted,
              this.url
            ).then(() => {
              displaySelectedFilters(selected_filters)
            })
          }
        })
      } else if (url_params.path.indexOf('collection') >= 0) {
        $('.main-category-title').html(selected_collection)

        if (url_params.collection == 'favorites') {
          $('.main-category-title').html('My Favorites')
          getFavorites(currentUserId, 1).then((data, pageNumber) => { // load favorites of current user
            createFavoritesArray(data)
            selected_filters.Page_number = pageNumber
            displayProducts(data)
          })

          $('.collection-subtitle').hide()
        } else if (url_params.collection == 'Search') {
          getSearchResults(currentUserId, 1, url_params.query).then((data, pageNumber) => { // load favorites of current user
            selected_filters.Page_number = pageNumber
            displayProducts(data)
          })

          $('.main-category-title').html(url_params.query.replace('%20', ' '))
          $('.collection-subtitle').html('search results >')

        } else { // otherwise it's just a normal collection (treated as a filter + option)
          getProducts()
        }
      }

      function createFavoritesArray(data) {
        favoritesById = [] // re-empty the favorites every time this is called
        if (data.Favorites) {
          for (let i = 0; i < data.Favorites.length; i++) {
            favoritesById.push(data.Favorites[i].ItemSku)
          }
        }
      }

      function displayProducts(data) {
        console.log('fetched: ', data)
        $('.product-list').empty()
        $('.pagination').empty()

        let products = data.GetProducts
        if (data.Favorites) {
          products = data.Favorites
        }

        let productCount = data.Count

        if (productCount <= 0) {
          $('.loading').hide()
          $('.no-results-found').show()
        } else {
          let pageCount = Math.ceil(data.Count / 30)
          let currentPage = parseInt(selected_filters.Page_number)

          $('.resultsCount').show()
          $('.numOfResults').html(productCount)

          requirejs(["../scripts/helper/pagination.js"], function() {
            displayPagination(currentPage, pageCount)
          })

          for (let i = 0; i < products.length; i++) {
            let $productPreview = $('<div>').addClass('product-preview large-4 columns')
            let $productThumb = $('<div>').addClass('product-thumb').css('background-image', `url('${products[i].Item_Image_URL_400}')`)
            let $imgCheck = $('<img>').attr('src', `url('${products[i].Item_Image_URL_400}')`)
            $.ajax({
              url: products[i].Item_Image_URL_400,
              type:'HEAD',
              error: () => {
                $productThumb = $productThumb.css('background-image', 'url(http://schumacher-webassets.s3.amazonaws.com/App%20Catalog2-400/Product-Image-Coming-Soon.jpg)')
              }
            })

            let $favorite = $('<img>')
              .addClass('favorite')
              .attr('data-ItemSku', products[i].ItemSku)
              .attr('src', '../assets/favorite-icon.svg')
              if (favoritesById.indexOf(products[i].ItemSku) >= 0) {
                $favorite = $favorite.attr('src', '../assets/favorite-icon_favorited.svg')
              }
            let $productInfo = $('<div>').addClass('product-info')
            let $quickshop = $('<div>').addClass('quickshop').html('QUICKSHOP').attr('data-sku', products[i].ItemSku)
                if (selected_product == 'Furniture') {
                  $quickshop = $quickshop.css('display', 'none')
                  $favorite = $favorite.css('float', 'none')
                  $productInfo = $productInfo.css('margin-top', '5px')
                }
            let $productType = $('<div>').addClass('product-type').html(products[i].Department)
            let $productName = $('<div>').addClass('product-name').html(products[i].Item_Name)
            let $productId = $('<div>').addClass('product-id')
            let $productSku = $('<span>').addClass('product-sku').html(products[i].ItemSku)
            let $productColor = $('<span>').addClass('product-color').html(products[i].Item_Color)
            let $productPrice = $('<div>').addClass('product-price').html(products[i].Selling_Price_USD)
            $productId.append($productColor, ' ', $productSku)
            $productInfo.append($quickshop, $productType, $productName, $productId, $productPrice)
            $productPreview.append($productThumb, $favorite, $productInfo)
                           .addClass(products[i].Department + '-department')
            $('.product-list').append($productPreview)
          }
          makeSquareThumbnails()
          $('.loading').hide()
          $('.no-results-found').hide()
        }
      }


      function getProducts(pageNumber) {

        getFavorites(currentUserId, 'all').then((data) => {
          createFavoritesArray(data)

          $('.resultsCount').hide()
          $('.loading').show()
          $('.no-results-found').hide()
          $('.product-list').css('opacity', '.5')
          $('.pagination').empty()

          pageNumber = !pageNumber ? 1 : pageNumber
          selected_filters.Page_number = pageNumber

          let query = {
            Rows_per_page: 30,
            Page_number: selected_filters.Page_number
          }
          for (var filter in selected_filters) {
            query[filter] = selected_filters[filter]
          }

          getData(query, "https://www.fschumacher.com/api/v1/GetProducts").then((data, query) => {
            displayProducts(data, query)
            $('.product-list').css('opacity', '1')
          })
        })
      }

      $(document).on('click', '.favorite', function() {
        let ItemSku = $(this).attr('data-ItemSku')
        let favoritesURL = "https://www.fschumacher.com/api/v1/RemoveFromFavorites"
        let favoriteImage = "../assets/favorite-icon.svg"
        if (favoritesById.indexOf(ItemSku) < 0) {
          favoritesURL = "https://www.fschumacher.com/api/v1/AddToFavorites"
          favoriteImage = "../assets/favorite-icon_favorited.svg"
          favoritesById.push(ItemSku)
        } else {
          favoritesById.splice(favoritesById.indexOf(ItemSku), 1)
          console.log(favoritesById)
        }
        console.log(favoritesURL)
        getData(
          {UserId: currentUserId, ItemSku: ItemSku},
          favoritesURL
        ).then((response) => {
          $(this).attr('src', favoriteImage)
        })
      })

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
        $('.filter-options .filter-title').removeClass('selected')
        $(this).parent('.dropdown').hide()
        getProducts()
      })

      $('.pagination').on('click', '.page-number', function() {
        let pageNumber = $(this).attr('data-page')

        if (selected_collection == 'favorites') {
          getFavorites(currentUserId, pageNumber).then((data) => { // load favorites of current user
            createFavoritesArray(data)
            selected_filters.Page_number = pageNumber
            displayProducts(data)
          })
        } else if (selected_collection == 'Search') {
          getSearchResults(currentUserId, pageNumber, url_params.query).then((data) => { // load favorites of current user
            debugger
            selected_filters.Page_number = pageNumber
            displayProducts(data)
          })
        } else {
          getProducts(pageNumber)
        }
      })

      // if you click a side filter, the page refreshes with the new query string
      // $('.sub-category').on('click', 'li', function() {
      //   var filter = $(this).attr('data-filter')
      //   var option = $(this).attr('data-option')
      //   location.href = "catalog.html?product=" + selected_product + "&filter=" + filter + "&option=" + option;
      // });

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

      $('.selected-filters').on('click', '.clear-all-filters', function() {
        location.href = "catalog.html?product=" + selected_product
      })

      // display selected filters + filter titles
      function displaySelectedFilters(selected_filters) {
        $('.selected-filter').remove()
        $('.filter-title').removeClass('in-use')
        $('.caret i').remove()
        $('.clear-all-filters').remove()

        for (var filter in selected_filters) {

          let filterOptions = []

          if (
            selected_filters[filter] &&
            typeof(selected_filters[filter]) == 'string' &&
            selected_filters[filter].length > 0) {
              filterOptions = selected_filters[filter].split(',')
          }

          for (var i = 0; i < filterOptions.length; i++) {
            let doNotShow = ['Department', 'PriceFrom', 'PriceTo', 'Extrawide', 'Page_number', 'Rows_Per_Page']
            if (doNotShow.indexOf(filter) < 0) {
              // console.log('x',filterOptions[i])
              $('.dropdown.' + filter + ' li[data-option="' + filterOptions[i] + '"]').addClass('selected')
              var $selected_filter = $('<div>')
                .addClass('selected-filter')
                .html(filterOptions[i])
                .attr('data-filter', filter)
                .attr('data-option', filterOptions[i])
                .append('<span class="remove">x</span>')
              $('.selected-filters').append($selected_filter)
              $('.filter-title#' + filter).addClass('in-use')
            }
          }
        }

        $('.in-use .caret').each((i, element) => {
          if ($(element).children('i').length < 1) {
            $(element).prepend('<i class="fa fa-check"></i>')
          }
        })

        if ($('.selected-filter').length > 0) {
          let $clearAllButton = $('<div>')
            .addClass('clear-all-filters')
            .html('CLEAR ALL')
          $('.selected-filters').append($clearAllButton)
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
