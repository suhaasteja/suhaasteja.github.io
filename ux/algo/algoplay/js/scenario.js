$('div.task-placeholder').hover(
        function() {
            var imgsrc = $(this).children().attr('src').slice(0, -4);
            $(this).children().attr('src', imgsrc+ '-hover.png');
    }, function() {
            var imgsrc = $(this).children().attr('src').slice(0, -10);
            $(this).children().attr('src', imgsrc+ '.png');
    }
);