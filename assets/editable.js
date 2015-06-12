
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

  function addSubQuestion (qType, parentOption) {

    var parentForm = $(parentOption).closest('.ada-form');
    var parentOptionId = $(parentOption).attr('id');
    var parentFormId = $(parentForm).attr('id');
    var toAppend = $('#' + parentFormId ).find('#' + parentOptionId); 
    var subQnID = ''+ $(parentOption).attr('id') + '-subqn';
    var iOptionIdx = $(parentOption).attr('id').replace(/option-/, '');

    var subQnTpl = '<ul class="sub-qn"><li>'+
        '<div class="droppedField select newSubQn dependent-qn" id="'+subQnID+'">'+
        '<input type="text" name="children['+iOptionIdx+'].children[0].title" placeholder="Question Title" class="ctrl-textbox editable">'+
        '<input type="text" name="children['+iOptionIdx+'].children[0].subtitle" placeholder="Question Sub Title" class="ctrl-textbox editable">'+
        '<input type="text" name="children['+iOptionIdx+'].children[0].name" placeholder="Question Name/Keyword" class="ctrl-textbox editable">'+
        '<input type="hidden" name="children['+iOptionIdx+'].children[0].type" value="select">'+
        '<input class="language-hidden" type="hidden" name="children['+iOptionIdx+'].children[0].lang" value="'+lang+'">'+
        '<a href="javascript:void(0);" class="toggle" data-toggle="collapse" data-target="#qn-'+subQnID+'-'+iOptionIdx+'-collapsible"><i class="icon-minus"></i> Toggle</a>'+
        '<div class="sub-ctrl-selectgroup  collapse in" id="qn-'+subQnID+'-'+iOptionIdx+'-collapsible">'+ 
        '<ul class="sub-option-list">'+ 
        '<li id="sub-option-0" class="sub-option-list-item">'+
        '<input type ="checkbox">'+
        '<input class="prop-label" name="children['+iOptionIdx+'].children[0].children[0].label" type="text" value=""  placeholder="Option Label.." class="input-small editable">'+
        '<input type="text" name="children['+iOptionIdx+'].children[0].children[0].value" value="'+ optionValue +'" placeholder="Option Value.." class="input-small editable opt-value">'+
        '<input type="number" class="score" value='+ esc_quot(riskScore) +' name="children['+iOptionIdx+'].children[0].children[0].risk[0].score" placeholder="Risk Score.." class="input-small editable">'+
        '<input type="text" value="'+ riskTitle +'" name="children['+iOptionIdx+'].children[0].children[0].risk[0].title" placeholder="Risk Title.." class="input-small editable">'+
        '<input type="text" value="'+ riskShortContent +'" name="children['+iOptionIdx+'].children[0].children[0].risk[0].short_content" placeholder="Risk Short Content.." class="input-medium editable">'+
        '<br><textarea name="children['+iOptionIdx+'].children[0].children[0].risk[0].content" placeholder="Risk Content.." class="editable" style="width:auto; height:auto"></textarea>'+
        '<a href="javascript:void(0);" class="btn-small btn-danger" id="remove-btn">Remove</a></li></ul></div></div></li></ul>';    

    
    $(toAppend).append(subQnTpl);
    $('.newSubQn input[name=type]').val(subQType);
    $('#' + subQnID).append('<a href="javascript:void(0);" class = "btn" id="edit-btn">Edit</a>');
    $('#' + subQnID).append('<a href="javascript:void(0);" class = "btn btn-primary hide sub-qn-options" id="add-option-btn">Add Options</a>');
    $('#' + subQnID).append('<a href="javascript:void(0);" class = "btn btn-danger" id="remove-btn">Remove</a>');
    $('#' + subQnID).removeClass("newSubQn");
    $('.draggableField').removeClass("droppedField");
    $('.dependent-qn').css('background-color','#e5e5e5');
    $('.sub-qn').css('margin','10px 0 0 40px');
    $('.sub-qn').css('width','980px');
    $('.sub-qn').css('height','auto');
  };
  

  if(typeof(console)=='undefined' || console==null) { console={}; console.log=function(){}} //defining console if not already

})();
 

