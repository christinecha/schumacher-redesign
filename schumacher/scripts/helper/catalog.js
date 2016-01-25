"use strict"

requirejs(["../scripts/helper/parse_url.js"], function() {
  let url_params = parseUrl()

  requirejs(["../scripts/helper/api_calls.js"], function() {

    let selected_product = 'All Products'
    let selected_filters = {}; // this object will contain all the selected filters for search

    if (url_params.product && $('#' + url_params.product)) {
      $('#' + url_params.product).addClass('selected-force')
      selected_product = url_params.product
      if (url_params.filter && url_params.option) {
        selected_filters[url_params.filter] = url_params.option
      }
    }

    $('.main-category-title').html(selected_product)
    displaySelectedFilters(selected_filters)


    function getFilterDropdowns(departmentName, category, categoryFormatted, url) {
      let $caret = $('<span>').html('&#9660;').addClass('caret');
      let $checkbox = $('<input>').attr('type', 'checkbox').addClass('checkbox').addClass('submitSearch')
      let $filterTitle = $('<div>')
        .addClass('filter-title')
        .addClass('dropdown-selector')
        .html(categoryFormatted)
        .attr('id', categoryFormatted)
      let $dropdown = $('<div>')
        .addClass('dropdown')
        .addClass(categoryFormatted)
      let $applyButton = $('<button>')
        .addClass('dropdownButton')
        .addClass('submitSearch')
        .css('width', '100%')
        .html('APPLY')

      if (category == "Extrawide" || category == "WC_Available") {
        $filterTitle.attr('id', category).append($checkbox)
        $('.filter-options .secondary').append($filterTitle)
      } else if (category == "Price") {
        $filterTitle.attr('id', category).append($caret)
        $('.filter-options .secondary').append($filterTitle)
        let $sliderHandle = $('<div>').addClass('slider-handle')
        let $pricingSlider = $('<div>').addClass('pricing-slider').append($sliderHandle)
        let $priceDisplay = $('<div>').addClass('price-display').html('No Limit')
        $dropdown.append($pricingSlider, $priceDisplay, $applyButton)
        $('.filter-dropdowns').append($dropdown)
      } else {
        getData({ Department: departmentName }, url, function(dropdowns) {
          $filterTitle.addClass('dropdown-selector').append($caret)
          $('.filter-options .primary').append($filterTitle);

          var $dropdownColumns = [];
          var $dropdownColumn = $('<div>').addClass('dropdownColumn');

          for (let i = 0; i < dropdowns.length; i++) {
            if (dropdowns[i].DepartmentName == departmentName) {
              // create JQuery list element with the option
              var $option = $('<li>')
                .html(dropdowns[i][category])
                .attr('data-filter', category)
                .attr('data-option', dropdowns[i][category].replace(/,/g, ''));

              // if the filter category is color, we need to add thumbnails
              if (category == 'ColorFamily') {
                var $colorThumb = $('<div>')
                  .addClass('color--thumbnail')
                  .css('background-image', '../assetscolor_thumbnails' + dropdowns[i][category] + '.png');
                $option = $option.prepend($colorThumb);
              }

              // if the filter category is type, we also need to add them to the side-bar filters
              if (category == 'Type') {
                $('.sub-category.type').append($option.clone())
              }

              // if the filter category has more than 8 options, we need to split it into columns
              if ($dropdownColumn.children('li').length >= 8) {
                $dropdownColumns.unshift($dropdownColumn);
                $dropdownColumn = $('<div>').addClass('dropdownColumn');
              }

              // add the option to the filter column
              $dropdownColumn.append($option);
            }
          }
          // add dropdown Columns to the dropdown div
          $dropdownColumns.unshift($dropdownColumn);
          for (var i in $dropdownColumns) {
            $dropdown.prepend($dropdownColumns[i]);
          };

          $dropdown.append($applyButton)

          $('.filter-dropdowns').append($dropdown)
        })
      }
    }

    // 4 - function get Products with search query //////////////////////////////////////////////////////////////////////////////////////////
    function getProducts(pageNumber) {
      pageNumber = !pageNumber ? 1 : pageNumber
      let query = {
        Department: selected_product,
        Rows_per_page: 9,
        Page_number: pageNumber
      }
      for (var filter in selected_filters) {
        query[filter] = selected_filters[filter]
      }

      getData(query, "//104.130.216.8/v8.1/api/Product/GetProducts", function(data) {
        $('.product-list').empty()
        $('.pagination').empty()
        let products = data.GetProducts
        let productCount = data.Count
        let pageCount = Math.ceil(data.Count / 9)
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

    // trigger getProducts on different events
    $(document).on('click', '.submitSearch', function() {
      if ($(this).attr('type') == 'checkbox') {
        let filter = $(this).parent().attr('id')
        if (!selected_filters[filter] || selected_filters[filter] == false) {
          selected_filters[filter] = true
        } else {
          selected_filters[filter] = false
        }
      }
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

    // manipulate pricing slider
    let priceSliderActivated = false
    let priceCaption = 'NO LIMIT'
    let scaleMax = 300
    if (selected_product == "Furniture") {
      scaleMax = 4000
    }
    $('.filter-dropdowns').on('mousedown', '.pricing-slider', function(e){
      priceSliderActivated = true
      let originalX = $(this).offset().left
      $('.filter-dropdowns').on('mousemove', '.dropdown.Price', function(e){
        if (priceSliderActivated == true) {
          let newX = e.pageX - originalX
          if (newX >=185) {
            newX = 185
            delete selected_filters.PriceTo
            priceCaption = 'NO LIMIT'
          } else {
            let scale = scaleMax / 185
            let max = Math.ceil((newX * scale) / 10) * 10
            selected_filters.PriceTo = max
            priceCaption = '$0 - $' + max
          }
          $(this).children('.slider-handle').css('margin-left', newX + 'px')
          $('.price-display').html(priceCaption)
        }
      }.bind(this))
    })

    $(document).on('mouseup', function(e){
      priceSliderActivated = false
    })

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
      displaySelectedFilters(selected_filters)
    });

    // remove selected filter by clicking on it
    $('.selected-filters').on('click', '.selected-filter', function() {
      var filter = $(this).attr('data-filter');
      var option = $(this).attr('data-option');

      let filterOptions = selected_filters[filter].split(',')
      for (var i = 0; i < filterOptions.length; i++) {
        if (filterOptions[i] == option) {
          $(this).removeClass('selected')
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
