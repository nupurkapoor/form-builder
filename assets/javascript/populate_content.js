
function existingQuestions(iCounter){
    $('.ada-form').each(function() {
        $this = $(this);
        var index = $.inArray($this.attr('id'), formElements);
        if (index == -1) {
            formElements.push($this.attr('id'));
        };
    })
    qnIndex = formElements.length;
}

function loadData(lang) {
    lang = lang;
    function populateIntroData(lang){

      secondaryLang = (lang == 'en' ? 'es' : 'en');

      $.post(dataURL + "intro/get",{
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        "lang": lang
      }, function(result) {
          secondaryLangIntro = false;
          console.log(result.data);
          $.each(result.data, function(iCounter, element, secondaryLangIntro){
              createExistingIntro(element);
          })

          $.post(dataURL + "intro/get",{
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            "lang": secondaryLang
          }, function(result) {
              secondaryLangIntro = true;
              $.each(result.data, function(iCounter, element, secondaryLangIntro){
                  createExistingIntro(element);
              })
          })
      })
    }

    function populateOtherData(lang){

      secondaryLang = (lang == 'en' ? 'es' : 'en');

      $.post(dataURL + "other/get",{
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        "lang": lang
      }, function(result) {
          secondaryLangOther = false;
          $.each(result.data, function(iCounter, element, secondaryLangOther){
              createExistingOther(element);
          })

          $.post(dataURL + "other/get",{
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            "lang": secondaryLang
          }, function(result) {
              secondaryLangOther = true;
              $.each(result.data, function(iCounter, element, secondaryLangOther){
                  createExistingOther(element);
              })
          })
      })
    }

    function populateSurveyData(lang){
      secondaryLang = (lang == 'en' ? 'es' : 'en');
      var primaryQnCount = 0;

      $.post(dataURL +  "survey/get",{
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        "lang": lang
      }, function(result) {
          secondaryLangSurvey = false;
          $.each(result.data, function(iCounter, element, secondaryLangSurvey){
              createExistingQuestion(element, iCounter);
              primaryQnCount++;
          })
          
          $.post(dataURL +  "survey/get",{
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            "lang": secondaryLang
          }, function(result) {
              secondaryLangSurvey = true;
              $.each(result.data, function(iCounter, element, secondaryLangSurvey){
                  createExistingQuestion(element, primaryQnCount);
                  primaryQnCount++;
              });
              // reIndex();
          });
      });
    }

    populateIntroData(lang);
    populateOtherData(lang);
    populateSurveyData(lang);
}

function createExistingIntro (obj) {
  var cls;
  cls = (secondaryLangIntro === true ? 'form-intro.secondary' : 'form-intro');
  $('.' + cls + ' input[name=lang]').val(obj.lang);
  $('.' + cls + ' input[name=title]').val(obj.title);
  $('.' + cls + ' textarea[name=description]').val(obj.description);
}

function createExistingOther (obj) {
  var cls;

  switch(obj.label){
      case "lowrisk":
          cls = (secondaryLangOther === true ? 'low_risk.secondary' : 'low_risk');
          updateContent(obj, cls);
          break;
      case "lowriskcontent":
          cls = (secondaryLangOther === true ? 'low_risk_content.secondary' : 'low_risk_content');
          updateContent(obj, cls);
          break;
      case "highrisk":
          cls = (secondaryLangOther === true ? 'high_risk.secondary' : 'high_risk');
          updateContent(obj, cls);
          break;
      case "sponsor":
          cls = (secondaryLangOther === true ? 'sponsor.secondary' : 'sponsor');
          updateContent(obj, cls);
          break;
  }
  function updateContent (obj, cls) {
    $('.' + cls + ' input[name=lang]').val(obj.lang);
    $('.' + cls + ' input[name=title]').val(obj.title);
    $('.' + cls + ' textarea[name=value]').val(obj.value);
  }
}

function createExistingQuestion(obj, iCounter){
    var cls;
    /* create question */
    
    cls = (secondaryLangSurvey === true ? 'ada-form secondary-set' : 'ada-form');

    toAppendID = "selected_action_column";
    var newQn = $("#" + toAppendID).append(
        '<form class="'+cls+'" id="qn-'+iCounter+'">'+
            '<input type="text" name="title" value="'+obj.title+'" class="ctrl-textbox editable"></input>'+
            '<input type="text" name="subtitle" value="'+obj.subtitle+'" class="ctrl-textbox editable"></input>'+
            '<input type="text" name="name" value="'+obj.name+'" class="ctrl-textbox editable">'+
            '<input type="hidden" name="type" value="'+obj.type+'">'+
            '<input class="language-hidden" type="hidden" name="lang" value="'+obj.lang+'">'+
            '<a href="javascript:void(0);" class="toggle" data-toggle="collapse" data-target="#qn-'+iCounter+'-collapsible"><i class="icon-minus"></i> Toggle</a>'+
            '<div class="ctrl-checkboxgroup collapse in" id="qn-'+iCounter+'-collapsible">'+
                '<ul class="option-list"></ul>'+
            '</div>'+
            '<a href="javascript:void(0);" class = "btn" id="edit-btn">Edit</a>'+
            '<a href="javascript:void(0);" class = "btn btn-primary hide" id="add-option-btn">Add Options now</a>'+
            '<a href="javascript:void(0);" class = "btn btn-danger" id="remove-btn">Remove</a>'+
        '</form>'
    );
    

    if(obj.children.length > 0){
         /*  create question's options  */
        iOptCounter = 0;
        
        $.each(obj.children, function(key, option){
          var score         = option.risk ? option.risk[0].score : 0,
              title         = option.risk ? option.risk[0].title : '',
              content       = option.risk ? option.risk[0].content : '',
              short_content = option.risk ? option.risk[0].short_content : '';

          var optionTpl = '<li class="option-list-item" id="option-'+ iOptCounter +'"'+
                  '<input type ="checkbox">'+
                  '<input class="prop-label" name="children['+iOptCounter+'].label" type="text" value="'+option.label+'"  placeholder="Option Label.." class="input-small editable">'+
                  '<input type="text" name="children['+iOptCounter+'].value" value="'+option.value+'" placeholder="Option Value.." class="input-small editable opt-value">'+
                  '<input type="number" class="score" value='+score+' name="children['+iOptCounter+'].risk[0].score" placeholder="Risk Score.." class="input-small editable">'+
                  '<input type="text" value="'+title+'" name="children['+iOptCounter+'].risk[0].title" placeholder="Risk Title.." class="input-small editable">'+
                  '<input type="text" value="'+short_content+'" name="children['+iOptCounter+'].risk[0].short_content" placeholder="Risk Short Content.." class="input-medium editable"><br>'+
                  '<textarea name="children['+iOptCounter+'].risk[0].content" placeholder="Risk Content.." class="editable" style="width:auto; height:auto">'+content+'</textarea>'+
                  '<a href="javascript:void(0);" class="btn-small btn-info add-subquestion-btn" id="add-subquestion-btn">Add Sub Question</a>'+
                  '<a href="javascript:void(0);" class="btn-small btn-danger" id="remove-btn">Remove</a>'+
              '</li>';

          var appendedOption = $('#qn-' + iCounter +' .option-list').append(optionTpl);
          
          if (option.children != undefined) {
              if (option.children.length > 0) {
              /*  if present then create option's subquestion  */
              
              iSubCounter = 0;
              
              $.each(option.children, function (subkey, subvalue) {
                var title  = subvalue.title ? subvalue.title : '',
                    subtitle   = subvalue.subtitle ? subvalue.subtitle : '',
                    name       = subvalue.name ? subvalue.name : '',
                    type       = subvalue.type ? subvalue.type : '',
                    lang       = subvalue.lang ? subvalue.lang : '';
                
                var subQnTpl = '<ul class="sub-qn"><li>'+
                    '<div class="droppedField select newSubQn dependent-qn" id="qn-'+iCounter+'-subqn">'+
                    '<input type="text" value="'+title+'" name="children['+iOptCounter+'].children['+iSubCounter+'].title" placeholder="Question Title" class="ctrl-textbox editable">'+
                    '<input type="text" value="'+subtitle+'" name="children['+iOptCounter+'].children['+iSubCounter+'].subtitle" placeholder="Question Sub Title" class="ctrl-textbox editable">'+
                    '<input type="text" value="'+name+'" name="children['+iOptCounter+'].children['+iSubCounter+'].name" placeholder="Question Name/Keyword" class="ctrl-textbox editable">'+
                    '<input type="hidden" value="'+type+'" name="children['+iOptCounter+'].children['+iSubCounter+'].type" value="select">'+
                    '<input value="'+subvalue.lang+'" class="language-hidden" type="hidden" name="children['+iOptCounter+'].children['+iSubCounter+'].lang">'+
                    '<a href="javascript:void(0);" class="toggle" data-toggle="collapse" data-target="#qn-'+iCounter+'-subqn-'+iOptCounter+'-collapsible"><i class="icon-minus"></i> Toggle</a>'+
                    '<div class="sub-ctrl-selectgroup collapse in" id="qn-'+iCounter+'-subqn-'+iOptCounter+'-collapsible">'+
                    '<ul class="sub-option-list">'+'</ul></div>'+
                    '<a href="javascript:void(0);" class = "btn" id="edit-btn">Edit</a>'+
                    '<a href="javascript:void(0);" class = "btn btn-primary hide sub-qn-options" id="add-option-btn">Add Options</a>'+
                    '<a href="javascript:void(0);" class = "btn btn-danger" id="remove-btn">Remove</a>'+
                    '</div></li></ul>';

                var optList = appendedOption.find('.option-list-item').last();
                var appendedSubQn = optList.append(subQnTpl).before('</li>');
                
                if (subvalue.children.length > 0) {
                  /*  create subquestion's options  */

                  iSubOptCounter = 0;
                  $.each(subvalue.children, function (suboptkey, suboptvalue) {
                    var subscore         = suboptvalue.risk ? suboptvalue.risk[0].score : 0,
                        subtitle         = suboptvalue.risk ? suboptvalue.risk[0].title : '',
                        subcontent       = suboptvalue.risk ? suboptvalue.risk[0].content : '',
                        subshort_content = suboptvalue.risk ? suboptvalue.risk[0].short_content : '';

                    var subQnOptTpl = '<li id="sub-option-'+iSubOptCounter+'" class="sub-option-list-item">'+
                        '<input type ="checkbox">'+
                        '<input class="prop-label" type="text" value="'+ suboptvalue.label +'" name="children['+iOptCounter+'].children['+iSubCounter+'].children['+iSubOptCounter+'].label" placeholder="Option Label.." class="input-small editable">'+
                        '<input type="text" value="'+ suboptvalue.value +'" name="children['+iOptCounter+'].children['+iSubCounter+'].children['+iSubOptCounter+'].value" placeholder="Option Value.." class="input-small editable opt-value">'+
                        '<input type="number" class="score" value='+subscore+' name="children['+iOptCounter+'].children['+iSubCounter+'].children['+iSubOptCounter+'].risk[0].score" placeholder="Risk Score.." class="input-small editable">'+
                        '<input type="text" value="'+ subtitle +'" name="children['+iOptCounter+'].children['+iSubCounter+'].children['+iSubOptCounter+'].risk[0].title" placeholder="Risk Title.." class="input-small editable">'+
                        '<input type="text" value="'+ subshort_content +'" name="children['+iOptCounter+'].children['+iSubCounter+'].children['+iSubOptCounter+'].risk[0].short_content" placeholder="Risk Short Content.." class="input-medium editable">'+
                        '<br><textarea name="children['+iOptCounter+'].children['+iSubCounter+'].children['+iSubOptCounter+'].risk[0].content" placeholder="Risk Content.." class="editable" style="width:auto; height:auto">'+subcontent+'</textarea>'+
                        '<a href="javascript:void(0);" class="btn-small btn-danger" id="remove-btn">Remove</a></li>';
                  
                    var subList = appendedSubQn.find('.sub-option-list').last();
                    var appendedOption = subList.append(subQnOptTpl);
                    iSubOptCounter++; /* counter for subquestion's options */
                  })
                }; 

                $('.dependent-qn').css('background-color','#e5e5e5');
                $('.sub-qn').css('margin','10px 0 0 40px');
                $('.sub-qn').css('width','980px');
                $('.sub-qn').css('height','auto');
              });
            };
          };
          

          iOptCounter++; /* counter for question's options */
        }); 
      }
    if ($("form[id^=qn-]").hasClass('secondary-set')) {
      $('#qn-' + iCounter).hide();
    };
    existingQuestions(iCounter);
}
