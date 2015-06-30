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

  $(document).on( 'change', '.language-select', function(){
      lang = $(this).val();
      $('.language-hidden').val(lang);
      $('#selected_action_column').html('');
      updateQuestionIndex();
  });

  /*$(document).on( 'click', '#download-btn', function(){
    var thisNoon = new Date();
    datehash = CryptoJS.SHA256(thisNoon.setHours(12,0,0,0).toString()).toString();
    downloadReport = "http://adanode.beaconfire.us/risktest/results/get?key=" + datehash + "";
    window.open(downloadReport);
  });*/

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
        '<input class="language-hidden" type="hidden" name="children['+iOptionIdx+'].children[0].lang" value="'+language+'">'+
        '<a href="javascript:void(0);" class="toggle" data-toggle="collapse" data-target="#qn-'+subQnID+'-'+iOptionIdx+'-collapsible"><i class="icon-minus"></i> Toggle</a>'+
        '<div class="sub-ctrl-selectgroup  collapse in" id="qn-'+subQnID+'-'+iOptionIdx+'-collapsible">'+ 
        '<ul class="sub-option-list">'+ 
        '<li id="sub-option-0" class="sub-option-list-item">'+
        '<input type ="checkbox">'+
        '<input class="prop-label" name="children['+iOptionIdx+'].children[0].children[0].label" type="text" value=""  placeholder="Option Label.." class="input-small editable">'+
        '<input type="text" name="children['+iOptionIdx+'].children[0].children[0].value" value="'+ optionValue +'" placeholder="Option Value.." class="input-small editable opt-value">'+
        '<input type="text" value="'+ riskScore +'" name="children['+iOptionIdx+'].children[0].children[0].risk[0].score" placeholder="Risk Score.." class="input-small editable">'+
        '<input type="text" value="'+ riskTitle +'" name="children['+iOptionIdx+'].children[0].children[0].risk[0].title" placeholder="Risk Title.." class="input-small editable">'+
        '<input type="text" value="'+ riskShortContent +'" name="children['+iOptionIdx+'].children[0].children[0].risk[0].short_content" placeholder="Risk Short Content.." class="input-medium editable">'+
        '<br><textarea name="children['+iOptionIdx+'].children[0].children[0].risk[0].content" placeholder="Risk Content.." class="editable" style="width:auto; height:auto"></textarea>'+
        '<a href="javascript:void(0);" class="btn-small btn-danger" id="remove-btn">Remove</a></li></ul></div></div></li></ul>';    

    // debugger;
    
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
  
  $(document).on( 'change', '.language-select', function(){
    language = $(this).val();
      $('.language-hidden').val(language);
  });

  $( document ).ready(function() {
    makeDraggable();
    makeDroppedFieldsDraggable();
    formElements = [];
    language = 'en';
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

    function swapButtons (editBtn) {
      editMode = true;
      addBtn = $(editBtn).siblings('#add-option-btn');
      subBtn = $(editBtn).parent().find('#add-subquestion-btn');
      $('.add-subquestion-btn').each(function(){           
         $('.add-subquestion-btn').addClass('hide');
      });
      if ($(editBtn).html() == "Edit" ) {
        $(editBtn).html("Save");
        $(editBtn).addClass("btn-success");
        $('.droppedFields').sortable( "disable" );
        $(addBtn).removeClass("hide");
        $(subBtn).addClass('hide');
        $(".selectorField").draggable({ disabled: true }); 
      }else{
        editMode = false;
        $('.droppedFields').sortable( "enable" );
        $(".selectorField").draggable({ disabled: false }); 
        $(editBtn).removeClass("btn-success");
        $('.add-subquestion-btn').each(function(){           
           $('.add-subquestion-btn').removeClass('hide');
        });
        
        $(editBtn).html("Edit");
        $(addBtn).addClass('hide');
        $(subBtn).removeClass("hide");
      };
    }

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
              '<ul class="option-list unstyled">'+
              '<div class="ctrl-selectgroup collapse in" id="'+qnID+'-collapsible">'+
              '<li class="option-list-item" id="option-0">'+
              '<input type="checkbox" value="" class="checkbox">'+ 
              '<input class="prop-label input-medium editable" name="children[0].label" type="text" value=""  placeholder="Option Label..">'+
              '<input class="input-medium editable opt-value" type="text" name="children[0].value" value="'+ optionValue +'" placeholder="Option Value..">'+
              '<br><textarea name="children[0].risk[0].content" placeholder="Description.." class="editable form-control" style="height:auto;width:900px"></textarea>'+
              '<a href="javascript:void(0);" class="btn-small btn-danger" id="remove-btn">Remove Option</a></li></ul></div></form>');          
          
          $('.newQn input[name=type]').val(qType); 
          $('#' + qnID).append('<a href="javascript:void(0);" class = "btn" id="edit-btn">Edit Question</a>');
          $('#' + qnID).append('<a href="javascript:void(0);" class = "btn btn-primary hide" id="add-option-btn">Add Options</a>');
          $('#' + qnID).append('<a href="javascript:void(0);" class = "btn btn-danger" id="remove-btn">Remove Question</a>');
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

      //Generate JSON preview of the form
      $('#submit-btn').click(function(){
          $('#ada-form-info').submit();
          $('#ada-form-other').submit();
          $('#ada-form').submit();
      });

      $( "#ada-form-info" ).submit(function( event ) {
          event.preventDefault();
          var outputFormInfo = [];
          
          outputFormInfo.push($(this).serializeObject());
          console.log(JSON.stringify(outputFormInfo));
          
          // $.ajax({
          //   url : "http://adanode.beaconfire.us/risktest/intro/set",
          //   type: "POST",
          //   data : JSON.stringify(outputFormInfo),
          //   dataType: "json",
          //   contentType: "application/json; charset=utf-8",
          //   success: function(data, textStatus, jqXHR){
          //       console.log('Info Post successful!' , data.msg);
          //   },
          //   error: function (jqXHR, textStatus, errorThrown){
          //       console.log('Info Post failed! ' , jqXHR, errorThrown);
          //   }
          // });
      });

      $( "#ada-form-other" ).submit(function( event ) {
          event.preventDefault();
          var outputFormOther = [];
          
          $('.form-other').each(function () {
            outputFormOther.push($(this).serializeObject());
          });

          console.log(JSON.stringify(outputFormOther));
          
          // $.ajax({
          //   url : "http://adanode.beaconfire.us/risktest/other/set",
          //   type: "POST",
          //   data : JSON.stringify(outputFormOther),
          //   dataType: "json",
          //   contentType: "application/json; charset=utf-8",
          //   success: function(data, textStatus, jqXHR){
          //       console.log('Other Post successful!' , data.msg);
          //   },
          //   error: function (jqXHR, textStatus, errorThrown){
          //       console.log('Other Post failed! ' , jqXHR, errorThrown);
          //   }
          // });
      });

      $( "#ada-form" ).submit(function( event ) {
          event.preventDefault();
          var outputFormContent = [];
          
          $('.ada-form').each(function () {
            outputFormContent.push($(this).serializeObject());
          });

          console.log(JSON.stringify(outputFormContent));
          
          // $.ajax({
          //   url : "http://adanode.beaconfire.us/risktest/survey/set",
          //   type: "POST",
          //   data : JSON.stringify(outputFormContent),
          //   dataType: "json",
          //   contentType: "application/json; charset=utf-8",
          //   success: function(data, textStatus, jqXHR){
          //       console.log('Survey Post successful!' , data.msg);
          //   },
          //   error: function (jqXHR, textStatus, errorThrown){
          //       console.log('Survey Post failed! ' , jqXHR, errorThrown);
          //   }
          // });
      });
    
    $(document).on( 'click', '#remove-btn', function(){
      elem = $(this).parent();
      parentForm = $(this).parent().closest('.ada-form');

      console.log('elem:', elem);
      if (window.confirm("Are you sure about this?")) {

        var index= $.inArray($(elem).attr('id'), formElements);
        var newID;
        if (index != -1) {
            formElements.splice(index,1);
        };
        
        if(! $(elem).closest('.dependent-qn').length) {
            elem.prev().remove();
            elem[0].remove();
            /* re-index option list*/
            
            $(parentForm).find('.option-list-item').each(function(index){
              console.log('---------------------------- re-index option list ----------------------------');
              newID = "option-" + (index);
              console.log('newID: ', newID);
              $(this).attr("id","option-" + (index));

              $(this).find("input[name$='label']").attr("name","children["+(index)+"].label");

              $(this).find("input[name$='value']").attr("name","children["+(index)+"].value");
              
              $(this).find("input[name$='score']").attr("name","children["+(index)+"]risk[0].score");

              $(this).find("input[name$='title']").attr("name","children["+(index)+"]risk[0].title");

              $(this).find("input[name$='short_content']").attr("name","children["+(index)+"]risk[0].short_content");

              $(this).find("textarea[name$='content']").attr("name","children["+(index)+"]risk[0].content");
            });
          }else{
          console.log('---------------------------- else condition ----------------------------');
          
          if ($(elem).hasClass('sub-option-list-item')) {
              toRemove = $(elem).closest('li.sub-option-list-item');
              toRemove[0].remove();
              $(parentForm).find('.sub-option-list-item').each(function(index){
                console.log('---------------------------- re-index sub-option-list-item ----------------------------');
                newID = "sub-option-" + (index);
                // console.log('newID: ', newID);
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
          };
          
          
        }

      };
      updateQuestionIndex();
    });

    $(document).on( 'click', '#edit-btn', function(){
      swapButtons($(this));
    });
    //add option
    $(document).on( 'click', '#add-option-btn', function(){
      if (editMode) {
        // disable all add-sub-question links.
        $('.add-subquestion-btn').addClass('hide');
      };
      
      if ($(this).hasClass('sub-qn-options')) {
        
        parentQuestion = $(this).parent();
        parentQuestion = parentQuestion[0];
        parentOption = $(parentQuestion).closest('li[class="option-list-item"]').get(0);
        iParentOptionIdx = $(parentOption).attr('id').replace(/option-/, '');
        iSubOptionIdx = $(parentQuestion).find('.sub-ctrl-selectgroup ul.sub-option-list li > :checkbox').length;
        
        var sOptionItemID = 'sub-option-' + iSubOptionIdx;
        var select = '<li id='+sOptionItemID+' class="sub-option-list-item"><input type ="checkbox"><input class="prop-label" name="children['+iParentOptionIdx+'].children[0].children['+iSubOptionIdx+'].label" type="text" value=""  placeholder="Option Label.." class="input-small editable"><input type="text" name="children['+iParentOptionIdx+'].children[0].children['+iSubOptionIdx+'].value" value="'+ optionValue +'" placeholder="Option Value.." class="input-small editable opt-value"><input type="text" value="'+ riskScore +'" name="children['+iParentOptionIdx+'].children[0].children['+iSubOptionIdx+'].risk[0].score" placeholder="Risk Score.." class="input-small editable"><input type="text" value="'+ riskTitle +'" name="children['+iParentOptionIdx+'].children[0].children['+iSubOptionIdx+'].risk[0].title" placeholder="Risk Title.." class="input-small editable"><input type="text" value="'+ riskShortContent +'" name="children['+iParentOptionIdx+'].children[0].children['+iSubOptionIdx+'].risk[0].short_content" placeholder="Risk Short Content.." class="input-medium editable"><br><textarea name="children['+iParentOptionIdx+'].children[0].children['+iSubOptionIdx+'].risk[0].content" placeholder="Risk Content.." class="editable" style="width:auto; height:auto"></textarea><a href="javascript:void(0);" class="btn-small btn-danger" id="remove-btn">Remove</a></li>';
        $('.sub-ctrl-selectgroup ul.sub-option-list').append(select).before("</li>");
      
      }else{
        
        parentQuestion = $(this).closest('.ada-form');
        parentList = $(this).closest('.ada-form').find('.option-list');
        parentQuestion = $(parentQuestion).get(0);
        iOptionIdx = $(parentQuestion).find('.option-list>li > :checkbox').length +'';
        
        var sOptionItemID = 'option-' + iOptionIdx;
        var select = '<br><li id='+sOptionItemID+' class="option-list-item"><input type ="checkbox"><input class="prop-label" name="children['+iOptionIdx+'].label" type="text" value=""  placeholder="Option Label.." class="input-small editable"><input type="text" name="children['+iOptionIdx+'].value" value="'+ optionValue +'" placeholder="Option Value.." class="input-small editable opt-value"><input type="text" value="'+ riskScore +'" name="children['+iOptionIdx+'].risk[0].score" placeholder="Risk Score.." class="input-small editable"><input type="text" value="'+ riskTitle +'" name="children['+iOptionIdx+'].risk[0].title" placeholder="Risk Title.." class="input-small editable"><input type="text" value="'+ riskShortContent +'" name="children['+iOptionIdx+'].risk[0].short_content" placeholder="Risk Short Content.." class="input-medium editable"><br><textarea name="children['+iOptionIdx+'].risk[0].content" placeholder="Risk Content.." class="editable" style="width:auto; height:auto"></textarea><a href="javascript:void(0);" class="btn-small btn-info add-subquestion-btn hide" id="add-subquestion-btn">Add Sub Question</a><a href="javascript:void(0);" class="btn-small btn-danger" id="remove-btn">Remove</a></li>';      
        $(this).parent().find('ul.option-list').append(select);
      };
    });

    $(document).on( 'click', '.add-subquestion-btn', function(){
      if ($(this).hasClass('disabled')){
        return;
      };
      parentOption = $(this).parent()[0];
      
      $('#dialog').css('display','inline');
      $('#dialog').dialog({
          buttons: {
            "Save": function() {
                  $(this).find(':checked').each(function() {
                  subQType = $( "input:checked" ).val();
                  $('#dialog-text').val($( "input:checked" ).val());
              addSubQuestion(subQType, parentOption); //append dependent/sub question with type of question as parameter.
              }); 
              $('input:checkbox').removeAttr('checked');
              $( this ).dialog( "close" ); //after calling sub-question close the dialog
            },
            Cancel: function() {
                  $( this ).dialog( "close" ); //do nothing, just quit!
            }
          }
      })
    });

    $(document).on( 'click', '.toggle', function (){
      // debugger;
      var i = $(this).find('i');
      switch(i.attr('class')){
        case "icon-minus":
          i.removeClass("icon-minus").addClass("icon-plus");
        break;

        case "icon-plus":
          i.removeClass("icon-plus").addClass("icon-minus");
        break;
      } 
    });
  });

  if(typeof(console)=='undefined' || console==null) { console={}; console.log=function(){}} 
})();
 

