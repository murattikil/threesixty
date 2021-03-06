var ThreeSixty = (function (window) {
    'use strict';

    return function (container, options) {
        var self = this;
        var index = 0;

        var loopTimeoutId = null;
        var looping = false;
        var dragOrigin = false;
        var loop = function (reversed) {
            reversed ? self.prev() : self.next();

            loopTimeoutId = window.setTimeout(function () {
                loop(reversed);
            }, options.speed);
        };

        options.width = options.width || 300;
        options.height = options.height || 300;
        options.count = options.count || 0;
        options.perRow = options.perRow || 0;
        options.speed = options.speed || 100;
        options.dragTolerance = options.dragTolerance || 10;
        options.swipeTolerance = options.dragTolerance || 10;
        options.draggable = options.draggable || true;
        options.swipeable = options.draggable || true;
        options.keys = options.keys || true;
        options.prev = options.prev || false;
        options.next = options.next || false;
        options.inverted = options.inverted || false;

        container.style.width = options.width + 'px';
        container.style.height = options.height + 'px';
        container.style.backgroundImage = 'url("' + options.image + '")';
        container.style.backgroundPosition = '0 0';

        if (options.draggable) {
            container.addEventListener('mousedown', function (e) {
                dragOrigin = e.pageX;
            });

            document.addEventListener('mouseup', function () {
                dragOrigin = false;
            });

            document.addEventListener('mousemove', function (e) {
                if (dragOrigin && Math.abs(dragOrigin - e.pageX) > options.dragTolerance) {
                    self.stop();
                    dragOrigin > e.pageX ? self.prev() : self.next();
                    dragOrigin = e.pageX;
                }
            });
        }

        if (options.swipeable) {
            container.addEventListener('touchstart', function (e) {
                dragOrigin = e.touches[0].clientX;
            });

            container.addEventListener('touchend', function () {
                dragOrigin = false;
            });

            document.addEventListener('touchmove', function (e) {
                if (dragOrigin && Math.abs(dragOrigin - e.touches[0].clientX) > options.swipeTolerance) {
                    self.stop();
                    dragOrigin > e.touches[0].clientX ? self.prev() : self.next();
                    dragOrigin = e.touches[0].clientX;
                }
            });
        }

        if (options.keys) {
            document.addEventListener('keydown', function (e) {
                if ([37, 39].includes(e.keyCode)) {
                    self.play(37 === e.keyCode);
                }
            });

            document.addEventListener('keyup', function (e) {
                if ([37, 39].includes(e.keyCode)) {
                    self.stop();
                }
            });
        }

        if (options.prev) {
            options.prev.addEventListener('mousedown', function (e) {
                e.preventDefault();
                self.play(true);
            });

            options.prev.addEventListener('mouseup', function (e) {
                e.preventDefault();
                self.stop();
            });

            options.prev.addEventListener('touchstart', function (e) {
                e.preventDefault();
                self.prev();
            });
        }

        if (options.next) {
            options.next.addEventListener('mousedown', function (e) {
                e.preventDefault();
                self.play();
            });

            options.next.addEventListener('mouseup', function (e) {
                e.preventDefault();
                self.stop();
            });

            options.next.addEventListener('touchstart', function (e) {
                e.preventDefault();
                self.next();
            });
        }

        self.next = function () {
            self.goTo(options.inverted ? index + 1 : index - 1);
            self.update();
        };

        self.prev = function () {
            self.goTo(options.inverted ? index - 1 : index + 1);
            self.update();
        };

        self.goTo = function (newIndex) {
            newIndex = newIndex > options.count - 1 ? 0 : newIndex;
            index = newIndex < 0 ? options.count - 1 : newIndex;

            self.update();
        };

        self.update = function () {
            container.style.backgroundPositionX = -(index % options.perRow) * options.width + 'px';
            container.style.backgroundPositionY = -Math.floor(index / options.perRow) * options.height + 'px';
        };

        self.play = function (reversed) {
            if (looping) {
                return;
            }

            loop(reversed);
            looping = true;
        };

        self.stop = function () {
            if (!looping) {
                return;
            }

            window.clearTimeout(loopTimeoutId);
            looping = false;
        };
    };
} (window));
