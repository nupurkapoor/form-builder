
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

    lang = 'en';
    $('.secondary').hide();
    // dataURL = "http://adanode.beaconfire.us/risktest/";
    console.log('no need to define dataurl again');
    buildData();
    makeDraggable();
    makeDroppedFieldsDraggable();
    formElements = [];
    optionValue = '';
    riskScore = '';
    riskTitle = '';
    riskShortContent = '';
    riskContent = '';
    editMode = false;
    iOptionIdx = 0;
    iSubOptionIdx = 0;
    
    var currentSortId, qType;

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
    
    // Action to take on attempt to drop a new field - creation and placement 
    $( ".droppedFields" ).droppable({
      activeClass: "activeDroppable",
      hoverClass: "hoverDroppable",
      accept: ":not(.ui-sortable-helper)",
      drop: function( event, ui ) {
          updateQuestionIndex();
          qnIndex = parseInt(window.qnIndex);
          iSubOptionIdx = 0;
          var draggable = ui.draggable; 
          
          draggable.addClass("droppedField");
          draggable.addClass("newElement"); 
          draggedElem = $("li[class*='newElement']")[0];
          var qType = $.trim(draggedElem.className.match("ctrl-.*")[0].split(" ")[0].split("-")[1]);
          
          qnID = "qn-"+(qnIndex);
          $(this).append(
              '<form class="ada-form droppedField newQn" id="'+qnID+'">'+
              '<div class="parent-qn">'+
              '<input type="text" name="title" placeholder="Question Title" class="ctrl-textbox editable">'+
              '<input type="text" name="subtitle" placeholder="Question Sub Title" class="ctrl-textbox editable">'+
              '<input type="text" name="name" placeholder="Question Name/Keyword" class="ctrl-textbox editable">'+
              '<input type="hidden" name="type" value="">'+
              '<input class="language-hidden" type="hidden" name="lang" value="'+lang+'">'+
              '<a href="javascript:void(0);" class="toggle" data-toggle="collapse" data-target="#'+qnID+'-collapsible"><i class="icon-minus"></i> Toggle</a>'+
              '<div class="ctrl-selectgroup collapse in" id="'+qnID+'-collapsible">'+
              '<ul class="option-list">'+
              '<li id="option-0" class="option-list-item">'+
              '<input type ="checkbox">'+
              '<input class="prop-label" name="children[0].label" type="text" value=""  placeholder="Option Label.." class="input-small editable">'+
              '<input type="text" name="children[0].value" value="'+ optionValue +'" placeholder="Option Value.." class="input-small editable opt-value">'+
              '<input type="number" class="score" value='+ esc_quot(riskScore) +' name="children[0].risk[0].score" placeholder="Risk Score.." class="input-small editable">'+
              '<input type="text" value="'+ riskTitle +'" name="children[0].risk[0].title" placeholder="Risk Title.." class="input-small editable">'+
              '<input type="text" value="'+ riskShortContent +'" name="children[0].risk[0].short_content" placeholder="Risk Short Content.." class="input-medium editable">'+
              '<br><textarea name="children[0].risk[0].content" placeholder="Risk Content.." class="editable" style="width:auto; height:auto"></textarea>'+
              '<a href="javascript:void(0);" class="btn-small btn-info add-subquestion-btn" id="add-subquestion-btn">Add Sub Question</a>'+
              '<a href="javascript:void(0);" class="btn-small btn-danger" id="remove-btn">Remove</a></li></ul></div></form>');          
          
          $('.newQn input[name=type]').val(qType); 
          $('#' + qnID).append('<a href="javascript:void(0);" class = "btn" id="edit-btn">Edit</a>');
          $('#' + qnID).append('<a href="javascript:void(0);" class = "btn btn-primary hide" id="add-option-btn">Add Options</a>');
          $('#' + qnID).append('<a href="javascript:void(0);" class = "btn btn-danger" id="remove-btn">Remove</a>');
          $('#' + qnID).addClass(qType);
          $('#' + qnID).removeClass("newQn");
          $('.draggableField').removeClass("droppedField");

          draggable.removeClass("newElement");
          updateQuestionIndex();
      }
    });
  
    //Make the droppedFields sortable and connected with other droppedFields containers
    
    $.fn.serializeObject = function() {
        function pushObject(obj, prop) {
            if (!obj[prop]) { obj[prop] = {}; }
            return obj[prop];
        }

        function pushArray(obj, prop) {
            if (!obj[prop]) { obj[prop] = []; }
            return obj[prop];
        }

        function pushValue(obj, prop, val) {
            if (obj[prop] != null) {
                if (!$.isArray(obj[prop])) { obj[prop] = [obj[prop]]; }
                obj[prop].push(val);
            } else {
                obj[prop] = val;
            }
            return obj[prop];
        }
        
        function pushIndexedProp(obj, indexedProp, val) {
            var indexes = splitIndexes(indexedProp),
            // debugger
                prop = indexes.shift(),
                lastIndex = indexes.pop();
            if (lastIndex != null) {
                obj = pushArray(obj, prop);
                $.each(indexes, function (i, index) {
                    obj = pushArray(obj, index);
                });
                prop = lastIndex;
            }
            return (val != null ) ? pushValue(obj, prop, val) : pushObject(obj, prop);
        }

        function splitIndexes(s) {
          // debugger;
            var result = [];
            var start = s.indexOf('[');
            if (start >= 0) {

                result.push(s.substring(0, start));
                while (start >= 0) {
                    var end = s.indexOf(']', start + 1);
                    if (end >= 0) {
                        result.push(parseInt(s.substring(start + 1, end), 10));
                        start = s.indexOf('[', end + 1);
                    } else {
                        start = -1;
                    }
                }
            } else {
                result.push(s);
            }
            return result;
        }

        var result = {};
        $.each(this.serializeArray(), function() {
            var props = this.name.split('.'),
                lastProp = props.pop(),
                obj = result;
            $.each(props, function (i, prop) {
                obj = pushIndexedProp(obj, prop);
            });
            pushIndexedProp(obj, lastProp, this.value || '');
        });
        return result;
    };
    
  });
  
  if(typeof(console)=='undefined' || console==null) { console={}; console.log=function(){}} //defining console if not already

})();
 

