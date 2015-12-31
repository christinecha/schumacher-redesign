$(function() {

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

          for (var i = data[option].length; i >= 0; i--) {
            var $option = $('<li>').html(data[option][i]);
            $dropdownColumn = $dropdownColumn.append($option);
          };
          $('.dropdown.' + dropdown_category).prepend($dropdownColumn);
        }
      };
    });
  }).fail(function(err, message) {
    console.log('err: ', message);
  });

});
