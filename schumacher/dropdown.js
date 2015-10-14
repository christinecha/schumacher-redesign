$(document).ready(function(){

  $('.dropdown').hide();

  $('.main-nav').children('li').hover(function(){
    $(this).addClass('selected');
    var dropdownId = $(this).attr('id');
    dropdownClass = '.' + dropdownId;
    var menuOffset = $('.main-nav').offset();
    var selectorOffset = $(this).offset();
    var dropdownOffset = selectorOffset.left - menuOffset.left;
    $(dropdownClass).css('margin-left', dropdownOffset);
    console.log(dropdownClass, selectorOffset.left, menuOffset.left, $(dropdownClass).css('margin-left'));
    $(dropdownClass).show();
    $(dropdownClass).hover(function(){
      $('#' + dropdownId).addClass('selected');
      $(this).show();
    }, function(){
      $('#' + dropdownId).removeClass('selected');
      $(this).hide();
    });
  }, function(){
    $('.dropdown').hide();
    $(this).removeClass('selected');
  });





});
