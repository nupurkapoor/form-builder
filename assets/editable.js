
(function () {

  var qnIndex;
  var lang = 'en';

  $('.language-select').val("en"); //set default language to be english

  $(document).on( 'change', '.language-select', function(){
      lang = $(this).val();
      $('.language-hidden').val(lang);
      $('#selected_action_column').html('');
      buildData();
      updateQuestionIndex();
  });

  // escape content for possible back slashes
  function esc_quot(text){
    return text.replace("\"", "\\\"");
  }

  function makeDraggable() {
    $(".selectorField").draggable({ helper: "clone",stack: "div",cursor: "move", cancel: null  });
  }

  function disableDraggable() {
    $('.droppedFields').draggable( 'disable' );
  }

  function makeDroppedFieldsDraggable () {
    $( ".droppedFields" ).sortable({
      cancel: null, // Cancel the default events on the controls
      connectWith: ".droppedFields",
      start: function (event, ui) {
        currentSortId = ui.helper[0].id;
        $('#' + currentSortId).css('background-color','#ccffcc');  //highlight the question being dragged/sorted
      },
      stop: function (event, ui) {
        $('#' + currentSortId).css('background-color',''); //release styling 
      }
    });
  }

  $( document ).ready(function() {
    //tabbify content
    $('ul.tabs').each(function(){
      // For each set of tabs, keep track of which tab is active and it's associated content
      var $active, $content, $links = $(this).find('a');

      // If the location.hash matches one of the links, use that as the active tab.
      // If no match is found, use the first link as the initial active tab.
      $active = $($links.filter('[href="'+location.hash+'"]')[0] || $links[0]);
      $active.addClass('active');
      $content = $($active.attr('href'));

      // Hide the remaining content
      $links.not($active).each(function () {
        $($(this).attr('href')).hide();
      });

      // Bind the click event handler
      $(this).on('click', 'a', function(e){
        // Make the old tab inactive.
        $active.removeClass('active');
        $content.hide();

        // Update the variables with the new link and content
        $active = $(this);
        $content = $($(this).attr('href'));

        $active.addClass('active');
        $content.show();

        e.preventDefault();
      });
    });
  });
  
  if(typeof(console)=='undefined' || console==null) { console={}; console.log=function(){}} //defining console if not already

})();
 

