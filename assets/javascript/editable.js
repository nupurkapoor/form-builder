
(function () {

  var qnIndex, lang = 'en';

  $('.language-select').val("en"); //set default language to be english

  $(document).on( 'change', '.language-select', function(){
      lang = $(this).val();
      $('.language-hidden').val(lang);
      $('#selected_action_column').html('');
      updateQuestionIndex();
  });

  // escape content for possible back slashes
  function esc_quot(text){
    return text.replace("\"", "\\\"");
  }

  function updateQuestionIndex () {
    existingQuestions(lang);
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
    console.log('no need to define dataurl again');
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
    
    // Action to take on attempt to drop a new field - creation and placement of new/existing question
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
              '<ul class="option-list ">'+
              '<li id="option-0" class="option-list-item">'+
              '<input type="checkbox" value="" class="checkbox">'+ 
              '<input class="prop-label input-medium editable" name="children[0].label" type="text" value=""  placeholder="Option Label..">'+
              '<input class="input-medium editable opt-value" type="text" name="children[0].value" value="'+ optionValue +'" placeholder="Option Value..">'+
              '<br><textarea name="children[0].risk[0].content" placeholder="Description.." class="editable form-control" style="height:auto;width:900px"></textarea>'+
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
            if (lastIndex !== null) {
                obj = pushArray(obj, prop);
                $.each(indexes, function (i, index) {
                    obj = pushArray(obj, index);
                });
                prop = lastIndex;
            }
            return (val !== null ) ? pushValue(obj, prop, val) : pushObject(obj, prop);
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

    $(document).on( 'click', '#remove-btn', function(){
      elem = $(this).parent();
      parentForm = $(this).parent().closest('.ada-form');

      if (window.confirm("Are you sure about this?")) {

        var index= $.inArray($(elem).attr('id'), formElements);
        var newID;
        if (index != -1) {
            formElements.splice(index,1);
        }
        
        if(! $(elem).closest('.dependent-qn').length) {
            elem.prev().remove();
            elem[0].remove();
            /* re-index option list*/
            
            $(parentForm).find('.option-list-item').each(function(index){
              
              newID = "option-" + (index);
              $(this).attr("id","option-" + (index));

              $(this).find("input[name$='label']").attr("name","children["+(index)+"].label");

              $(this).find("input[name$='value']").attr("name","children["+(index)+"].value");
              
              $(this).find("input[name$='score']").attr("name","children["+(index)+"]risk[0].score");

              $(this).find("input[name$='title']").attr("name","children["+(index)+"]risk[0].title");

              $(this).find("input[name$='short_content']").attr("name","children["+(index)+"]risk[0].short_content");

              $(this).find("textarea[name$='content']").attr("name","children["+(index)+"]risk[0].content");
            });
          }else{
          
          if ($(elem).hasClass('sub-option-list-item')) {
              toRemove = $(elem).closest('li.sub-option-list-item');
              toRemove[0].remove();
              $(parentForm).find('.sub-option-list-item').each(function(index){
                
                newID = "sub-option-" + (index);
                $(this).attr("id","sub-option-" + (index));

                // debugger;
                nameElem = $("#"+newID).find("input[name$='label']").attr("name");

                replceWith = nameElem.replace(/children....label/, "children["+(index)+"].label");

                $("#"+newID).find("input[name$='label']").attr("name",replceWith);

                nameElem = $("#"+newID).find("input[name$='value']").attr("name");

                replceWith = nameElem.replace(/children....value/, "children["+(index)+"].value");

                $("#"+newID).find("input[name$='value']").attr("name",replceWith); 

                nameElem = $("#"+newID).find("input[name$='score']").attr("name");

                replceWith = nameElem.replace(/children....risk....score/, "children["+(index)+"].score");

                $("#"+newID).find("input[name$='score']").attr("name",replceWith); 

                nameElem = $("#"+newID).find("input[name$='title']").attr("title");

                replceWith = nameElem.replace(/children....risk....title/, "children["+(index)+"].title");

                $("#"+newID).find("input[name$='title']").attr("name",replceWith); 

                nameElem = $("#"+newID).find("input[name$='short_content']").attr("short_content");

                replceWith = nameElem.replace(/children....risk....short_content/, "children["+(index)+"].short_content");

                $("#"+newID).find("input[name$='short_content']").attr("name",replceWith); 

                nameElem = $("#"+newID).find("textarea[name$='content']").attr("name");

                replceWith = nameElem.replace(/children....risk....content/, "children["+(index)+"].content");

                $("#"+newID).find("textarea[name$='content']").attr("name",replceWith); 

            });
          } else{
              toRemove = $(elem).closest('.dependent-qn');
          }
        }
      }
      updateQuestionIndex();
    });
    
  });// end of doc ready
  
  if(typeof(console)=='undefined' || console==null) { console={}; console.log=function(){}}; //defining console if not already

})();
 

