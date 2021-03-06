/*
 * spriteTimer jQuery plugin v1.3.6
 * Copyright (c) 2010 Davor Spasovski
 * October 25, 2010
 * http://www.spasovski.net/code/spritetimer
 * Tested on: jQuery 1.4.2 and jQuery 1.4.3
 *
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */
(function($) {
    
    $.fn.spriteTimer = function(options) {
        var timerElm = this;
        
        var settings = {
            
            //important: the countdown value and height and width of your image sprite
            'seconds': 60, //used for countdown functionality
            'digitWidth': 42, //you want this set to the width of your numbers image sprite
            'digitHeight': 54, //you want this set to the height of your numbers image sprite
            'digitImagePath': '../img/numbers.png', //the path to your numbers picture containing the numbers 9876543210:. [please see the demo pack for the sample image]
            
            //optional settings to control your timer
            'digitElement': 'span', //HTML element to be injected as the digit container [cannot be complex like "span.digit"]
            'separatorElement': 'em', //HTML element to be injected as the separator (":" or ".") [cannot be complex like "span.digit"]
            'startButton': '', //jQuery selector for your start/stop button [the same button is used, example '#startBtn']
            'resetButton': '', //jQuery selector for your reset button [example '#resetBtn']
            
            callback: function(){}, //used for countdown: optional function to call once the timer reaches 0
            
            //optional callbacks in case you want to do run your own functions based on timer events, the current number of seconds is provided as an argument
            stopTimerCallback: function(currentSeconds){}, //optional function to call when the start/stop button is clicked to stop the timer
            startTimerCallback: function(currentSeconds){}, //optional function to call when the start/stop button is clicked to resume the timer
            resetTimerCallback: function(currentSeconds){}, //optional function to call when the reset button is clicked
            everySecondCallback: function(currentSeconds){}, //optional function to call every second (useful if you wish to update your own element with the current time)
            
            //important: do you want to count up or count down?
            'isCountDown': true //otherwise the timer starts at 0 and counts up
        };
        
        if (options) {$.extend(settings, options);}
        
        var timeInterval = null;

        var SpriteTimer = {
            digits: [],
            currentSeconds: settings.seconds,
            reInitialized: false,
            numDigits: 1,
            initialStart: true,
            init: function() {
                var self = this;
                
                if (settings.isCountDown) {self.numDigits = self.getNumberOfDigits(self.currentSeconds);}
                
                if (!self.reInitialized) {
                    self.populateTimer();
                    if (!settings.startButton) {self.initCSS();}
                    self.updateTime(self.currentSeconds);
                } else { //you clicked reset...you bastard!!!
                    if (settings.isCountDown) {
                        clearInterval(timeInterval);
                        self.currentSeconds = settings.seconds;
                        self.updateTime(self.currentSeconds);
                        self.digits = [];
                        self.init();
                    } else {
                        clearInterval(timeInterval);
                        self.currentSeconds = 0;
                        self.initialStart = true;
                        self.reInitialized = false;
                        self.numDigits = 1;
                        self.digits = [];
                        timerElm.empty();
                        self.init();
                    }
                }
                
                if (!settings.isCountDown) {self.currentSeconds = 1;}
                
                if (settings.startButton || settings.resetButton) {
                    self.initCSS();
                    self.bindEvents();
                } else {
                    if (settings.isCountDown) {
                        self.startDownInterval();
                    } else {
                        self.initCSS();
                        self.startUpInterval();
                    }
                }
            },
            startDownInterval: function() {
                var self = this;
                
                timeInterval = setInterval(function() {
                    if (self.currentSeconds < 1) {
                        self.updateTime(self.currentSeconds);
                        clearInterval(timeInterval);
                        settings.callback();
                    } else {
                        self.updateTime(self.currentSeconds);
                        settings.everySecondCallback(self.currentSeconds--);
                    }
                }, 1000);
            },
            startUpInterval: function() {
                var self = this;
                
                timeInterval = setInterval(function() {
                    self.updateTime(self.currentSeconds);
                    self.updateNumDigits(self.isNewDigitNeeded());
                    settings.everySecondCallback(self.currentSeconds);
                    self.currentSeconds++;
                }, 1000);
            },
            isNewDigitNeeded: function() {
                var s = this.currentSeconds;
                if (s == 10 || s == 60 || s == 600 || s == 3600 || s == 36000) {
                    return true;
                }
                return false;
            },
            updateTime: function(seconds) {
                var n = timerElm.find(settings.digitElement).size();
                var i = 0;
                var myVal = 0;
                var self = this;
                self.numDigits = self.getNumberOfDigits(seconds);

                if (self.numDigits == 1) {
                    for (i = 0; i < (n - 1); i++) {
                        self.setDigit(self.digits[i], 0);
                    }
                    self.setDigit(self.digits[n-1], seconds % 10);
                }
                if (self.numDigits == 2) {
                    for (i = 0; i < (n - 2); i++) {
                        self.setDigit(self.digits[i], 0);
                    }
                    self.setDigit(self.digits[n-2], parseInt(String(seconds).charAt(0), 10));
                    self.setDigit(self.digits[n-1], parseInt(String(seconds).charAt(1), 10));
                }
                if (self.numDigits == 3) {
                    if (n == 4) {
                        self.setDigit(self.digits[0], 0);
                    }
                    self.setDigit(self.digits[n-1], Math.floor(seconds % 10));
                    myVal = seconds % 60;
                    if (myVal < 10) {
                        self.setDigit(self.digits[n-2], 0);
                    } else {
                        self.setDigit(self.digits[n-2], parseInt(String(myVal).charAt(0), 10));
                    }
                    self.setDigit(self.digits[n-3], Math.floor(seconds / 60));
                }
                if (self.numDigits == 4) {
                    if (n == 5) {
                        self.setDigit(self.digits[0], 0);
                    }
                    self.setDigit(self.digits[n-1], Math.floor(seconds % 10));
                    myVal = seconds % 60;
                    if (myVal < 10) {
                        self.setDigit(self.digits[n-2], 0);
                    } else {
                        self.setDigit(self.digits[n-2], parseInt(String(myVal).charAt(0), 10));
                    }
                    var numMins = Math.floor(seconds / 60);
                    self.setDigit(self.digits[n-3], parseInt(String(numMins).charAt(1), 10));
                    self.setDigit(self.digits[n-4], parseInt(String(numMins).charAt(0), 10));
                }
                if (self.numDigits == 5) {
                    if (n == 6) {
                        self.setDigit(self.digits[0], 0);
                    }
                    self.setDigit(self.digits[n-1], Math.floor(seconds % 10));
                    myVal = seconds % 60;
                    if (myVal < 10) {
                        self.setDigit(self.digits[n-2], 0);
                    } else {
                        self.setDigit(self.digits[n-2], parseInt(String(myVal).charAt(0), 10));
                    }
                    var numMins = Math.floor(seconds / 60);
                    var numHours = Math.floor(numMins / 60);
                    myVal = numMins % 60;
                    if (myVal > 9) {
                        self.setDigit(self.digits[n-3], parseInt(String(myVal).charAt(1), 10));
                    } else {
                        self.setDigit(self.digits[n-3], parseInt(String(myVal).charAt(0), 10));
                    }
                    if (myVal < 10) {
                        self.setDigit(self.digits[n-4], 0);
                    } else {
                        self.setDigit(self.digits[n-4], parseInt(String(myVal).charAt(0), 10));
                    }
                    self.setDigit(self.digits[n-5], numHours);
                }
                if (self.numDigits == 6) {
                    self.setDigit(self.digits[n-1], Math.floor(seconds % 10));
                    myVal = seconds % 60;
                    if (myVal < 10) {
                        self.setDigit(self.digits[n-2], 0);
                    } else {
                        self.setDigit(self.digits[n-2], parseInt(String(myVal).charAt(0), 10));
                    }
                    var numMins = Math.floor(seconds / 60);
                    var numHours = Math.floor(numMins / 60);
                    myVal = numMins % 60;
                    if (myVal > 9) {
                        self.setDigit(self.digits[n-3], parseInt(String(myVal).charAt(1), 10));
                    } else {
                        self.setDigit(self.digits[n-3], parseInt(String(myVal).charAt(0), 10));
                    }
                    if (myVal < 10) {
                        self.setDigit(self.digits[n-4], 0);
                    } else {
                        self.setDigit(self.digits[n-4], parseInt(String(myVal).charAt(0), 10));
                    }
                    self.setDigit(self.digits[n-5], parseInt(String(numHours).charAt(1), 10));
                    self.setDigit(self.digits[n-6], parseInt(String(numHours).charAt(0), 10));
                }
            },
            initCSS: function(isNewDigit) {
                timerElm.find(settings.digitElement + ', ' + settings.separatorElement).css({
                    'display': 'block',
                    'float': 'left',
                    'height': settings.digitHeight + 'px',
                    'width': settings.digitWidth + 'px',
                    'background-image': 'url(' + settings.digitImagePath + ')',
                    'background-repeat': 'no-repeat' 
                });
                timerElm.find('.colon').css({'background-position': '0 -' + (settings.digitHeight * 10) + 'px'});
                timerElm.find('.period').css({'background-position': '0 -' + (settings.digitHeight * 11) + 'px'});
                if (!settings.isCountDown) {
                    timerElm.find(settings.digitElement).css({'background-position': '0 -' + (settings.digitHeight * 9) + 'px'});
                    if (isNewDigit) {
                        timerElm.find(settings.digitElement + ':first-child').css({'background-position': '0 -' + (settings.digitHeight * 8) + 'px'});
                    }
                }
            },
            setDigit: function(elm, value) {
                var pos = (value === 0) ? 0 - (settings.digitHeight * 9) : 0 - (settings.digitHeight * (10 - value - 1));
                $(elm).css({'background-position': '0 ' + pos + 'px'});
            },
            pauseTimer: function() {
                clearInterval(timeInterval);
                timeInterval = null;
                settings.stopTimerCallback(this.currentSeconds);
            },
            startTimer: function() {
                if (settings.isCountDown) {
                    this.startDownInterval();
                    this.initCSS();
                    this.updateTime(this.currentSeconds);
                } else {
                    this.startUpInterval();
                    this.initCSS();
                    if (this.initialStart) {
                        this.updateTime(0);
                        this.initialStart = false;
                    } else {
                        this.updateTime(this.currentSeconds);
                    }
                }
                settings.startTimerCallback(this.currentSeconds);
            },
            resetTimer: function() {
                this.reInitialized = true;
                clearInterval(timeInterval);
                timeInterval = null;
                this.currentSeconds = settings.seconds;
                this.init();
                settings.resetTimerCallback(this.currentSeconds);
            },
            setStartStop: function(direction) {
                var self = this;
                $(settings.startButton).unbind('click');
                
                if (direction == 'stop') {
                    $(settings.startButton).bind('click', function() {
                        self.pauseTimer();
                        self.setStartStop();
                        if (this.nodeName == 'A') {return false;}
                    });
                } else {
                    $(settings.startButton).bind('click', function() {
                        self.startTimer();
                        self.setStartStop('stop');
                        if (this.nodeName == 'A') {return false;}
                    });
                }
            },
            bindEvents: function() {
                var self = this;
                self.setStartStop();
                
                if (settings.resetButton) {
                    $(settings.resetButton).bind('click', function() {
                        self.resetTimer();
                        if (this.nodeName == 'A') {return false;}
                    });
                }
            },
            destroy: function() {
                clearInterval(timeInterval);
                timerElm.empty();
                if (settings.isCountDown) {
                    this.currentSeconds = settings.seconds;
                } else {
                    this.currentSeconds = 0;
                }
                this.digits = [];
            },
            populateTimer: function() {
                var self = this;
                var toInject = '';
                
                for (var i = 0; i < self.numDigits; i++) {
                    toInject += '<' + settings.digitElement + '></' + settings.digitElement + '>';
                    if (i === 0 && self.numDigits == 3 || i == 1 && self.numDigits == 4) {
                        toInject += '<' + settings.separatorElement + ' class="colon"></' + settings.separatorElement + '>';
                    }
                    if (self.numDigits == 5 && i == 2 || self.numDigits == 5 && i === 0) {
                        toInject += '<' + settings.separatorElement + ' class="colon"></' + settings.separatorElement + '>';
                    }
                    if (self.numDigits == 6 && i == 3 || self.numDigits == 6 && i === 1) {
                        toInject += '<' + settings.separatorElement + ' class="colon"></' + settings.separatorElement + '>';
                    }
                }
                timerElm.append(toInject);
                timerElm.find(settings.digitElement).each(function() {
                    self.digits.push(this);
                });
            },
            updateNumDigits: function(addAnother) {
                var self = this;
                var num = self.getNumberOfDigits(self.currentSeconds);
                
                if (num > self.numDigits || addAnother) {
                    numDigits = num;
                    timerElm.append('<' + settings.digitElement + '></' + settings.digitElement + '>');
                    if (num > 2 && num < 5) {
                        timerElm.find('.colon').remove();
                        $('<' + settings.separatorElement + ' class="colon"></' + settings.separatorElement + '>').insertBefore(timerElm.find('span:nth-child(' + (num - 1) + ')'));
                    }
                    if (num == 5 || num == 6) {
                        timerElm.find('.colon').remove();
                        $('<' + settings.separatorElement + ' class="colon"></' + settings.separatorElement + '>').insertBefore(timerElm.find('span:nth-child(' + (num - 1) + ')'));
                        $('<' + settings.separatorElement + ' class="colon"></' + settings.separatorElement + '>').insertBefore(timerElm.find('span:nth-child(' + (num - 3) + ')'));
                    }
                    
                    self.initCSS(true);
                    timerElm.find(settings.digitElement + ':last-child').each(function() {
                        self.digits.push(this);
                    });
                }
            },
            getNumberOfDigits: function(sec) {
                if (sec < 10) {
                    return 1;
                } else if (sec > 35999) {
                    return 6;
                } else if (sec > 3599) {
                    return 5;
                } else if (sec > 599) {
                    return 4;
                } else if (sec > 59) {
                    return 3;
                } else {
                    return 2;
                }
            }
        }; //end SpriteTimer
                
        return this.each(function() {
            SpriteTimer.init(); //run boy run!!!
            var myself = this;
            
            timerElm.unbind().bind('resetTimer', function() {
                SpriteTimer.destroy();
                SpriteTimer.init();
            }).bind('startTimer', function() {
                SpriteTimer.startTimer();
            }).bind('stopTimer', function() {
                SpriteTimer.pauseTimer();
            });
        });

    };
})(jQuery);

