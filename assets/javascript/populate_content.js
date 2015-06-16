
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

