$(function() {

  // $.ajax({
  //   type: "POST",
  //   dataType: "jsonp",
  //   url: "http://104.130.216.8/api/Product/GetProducts",
  //   success: function(data) {
  //     console.log(data)
  //     if (err) {
  //       console.log(err.message)
  //     }
  //   }
  // }).fail(function(err) {
  //   console.log(err)
  // });

  // populate navigation dropdowns

  // replace with API call
  $.get("data.json", function(data) {
    // for each dropdown
    $.each(data.navigation_options, function(dropdown_category, data) {
      // for each dropdown sub-category
      for (var option in data) {
        if (data.hasOwnProperty(option)) {
          var $dropdownColumn = $('<div>').addClass('dropdownColumn');
          var $heading = $('<h4>').addClass('category').text(option);
          $dropdownColumn = $dropdownColumn.append($heading);

          for (var i = 0; i < data[option].length; i++) {
            var $option = $('<li>')
              .html(data[option][i])
              .attr('data-product', dropdown_category)
              .attr('data-filter', option)
              .attr('data-option', data[option][i]);
            $dropdownColumn = $dropdownColumn.append($option);
          };
          $('.dropdown.' + dropdown_category).prepend($dropdownColumn);
        };
      };
    });
  }).fail(function(err, message) {
    console.log('err: ', message);
  });

  // direct to catalog with correct query
  $('.navigation').on('click', '.dropdownColumn li', function() {
    var product = $(this).attr('data-product');
    var filter = $(this).attr('data-filter');
    var option = $(this).attr('data-option');
    location.href = "catalog.html?product=" + product + "&filter=" + filter + "&option=" + option;
  });

  // direct to catalog with correct query
  $('.navigation').on('click', 'li.catalog-link', function() {
    console.log('clicked')
    var product = $(this).attr('id').replace('-', '');
    location.href = "catalog.html?product=" + product;
  });



});
