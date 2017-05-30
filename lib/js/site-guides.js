(function($, speech) {
    $.fn.speechRecognize = function(whereMap, howMap, goMap) {
        var showThatThing = function(thing) {
            if (Object.keys(whereMap).indexOf(thing) > -1) {
                $(whereMap[thing]).flickerObject();
            }
        };
        var searchThatThing = function(thing) {
            var win = window.open('https://www.google.com.au/search?q=' + thing, '_blank');
            if(win) {
                win.focus();
            }
        };
        var goSomewhere = function(somewhere) {
            if (Object.keys(goMap).indexOf(somewhere) > -1) {
                window.location.href = goMap[somewhere];
            }
        };
        var commands = {
            'where(s)(is) (the)(that) :thing': showThatThing,
            'how (to) :thing': searchThatThing,
            'go (to) :somewhere': goSomewhere
        };
        speech.addCommands(commands);
        speech.start();
    };
    $.fn.flickerObject = function() {
        var self = this;
        self.css('box-shadow', '0 0 60px red');
        setTimeout(function() {
            self.css('box-shadow', '');
            setTimeout(function() {
                self.css('box-shadow', '0 0 60px red');
                setTimeout(function() {
                    self.css('box-shadow', '');
                    setTimeout(function() {
                        self.css('box-shadow', '0 0 60px red');
                        setTimeout(function() {
                            self.css('box-shadow', '');
                        }, 500);
                    }, 500);
                }, 500);
            }, 500);
        }, 500);
    };
} (jQuery, annyang));