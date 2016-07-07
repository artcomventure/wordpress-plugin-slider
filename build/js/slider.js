;
(function ( context, definition ) {
    'use strict';

    // AMD module
    if ( typeof define === 'function' && define.amd ) {
        define( 'slider', [], function () {
            return definition();
        } );
    } // CommonJS module
    else if ( typeof module === 'object' && typeof module.exports === 'object' ) {
        module.exports = definition();
    } else {
        window.Slider = definition();
    }
})( this, function ( undefined ) {
    'use strict';

    var document = window.document,
    // default slider settings
    // ... in its expected type
        oDefaultSettings = {
            // slide to begin with
            startSlide: 1,
            // slide animation duration
            duration: 500,
            // loop from end to start and the other way round
            loop: true,
            // show (position)/hide pager
            pager: {
                regexp: new RegExp( '^(top|bottom|none)$' ),
                value: 'bottom'
            },
            // show/hide navigation
            navigation: false,
            // dimension (ratio or exact size)
            dimension: {
                regexp: new RegExp( '^(auto|((\\d+)(px|%)?)(\\s*(:|x)\\s*((\\d+)(px|%)?))?)$' ),
                value: '16:9'
            },
            // number of columns
            columns: {
                regexp: new RegExp( '^\\d+$' ),
                value: 1
            },
            // number of slides to scroll on a slide action
            // should be between 1 and columns (see above)
            // otherwise it's calculated to its min/max possible value
            jump: {
                regexp: new RegExp( '^(columns|\\d+)$' ),
                value: 'columns'
            },
            // show/hide captions
            captions: false,
            // auto slide
            slideshow: {
                regexp: new RegExp( '^(false|\\d+)$' ),
                value: false
            },
            // effect to change
            effect: {
                regexp: new RegExp( '^(slide)$' ),
                value: 'slide'
            },

            // translation
            t9n: {
                previous: 'previous',
                next: 'next',
                slideTo: 'slide to'
            },

            // callbacks
            onInit: function () {
            },
            onBeforeSlide: function () {
            },
            onSlide: function () {
            },
            onSlideComplete: function () {
            }
        },

    // on the fly changeable attributes
        aChangeableAttributes = [
            'duration',
            'effect',
            'loop',
            'pager',
            'navigation',
            'dimension',
            'columns',
            'jump',
            'captions',
            'slideshow'
        ];

    /**
     * Slider methods and helper.
     */
    window.Sliders = {

        /**
         * Wrapper for next slide.
         */
        next: function () {
            return this.slider( 'slide', 'next' );
        },

        /**
         * Wrapper for previous slide.
         */
        prev: function () {
            return this.slider( 'slide', 'prev' );
        },

        /**
         * Slide to action.
         *
         * @param {string|integer} iNb
         */
        slide: function ( iNb ) {
            var oSettings = window.Sliders.settings[this.id],
                $ = oSettings.$;

            if ( oSettings == undefined ) {
                console.error( "Great Scott! No slider settings found :/ Do you know what this means? It means that this damn thing doesn't work at all!" );
                return this;
            }

            // get settings
            var iColumns = this.slider( 'get', 'columns' ),
                iSlides = $.slides.children.length,
                bLoop = this.slider( 'get', 'loop' ),
                iJump = this.slider( 'get', 'jump' );

            if ( iJump == 'columns' || iJump > iColumns ) iJump = iColumns;
            else if ( iJump < 1 ) iJump = 1;
            iJump = parseInt( iJump );

            // define slide (nb) to slide to
            if ( iNb == 'next' ) {
                iNb = oSettings.iCurrentSlide + iJump;

                if ( iNb - iJump >= iSlides - iColumns ) iNb = iSlides - iColumns + 1;
                else if ( iNb - iJump > iSlides - iColumns - iJump ) iNb = iSlides - iColumns;
            }
            else if ( iNb == 'prev' ) {
                iNb = oSettings.iCurrentSlide - iJump;

                if ( iNb + iJump <= 0 ) iNb = -1;
                else if ( iNb + iJump < iJump ) iNb = 0;
            }
            else {
                if ( typeof iNb.target != 'undefined' ) {
                    iNb = parseInt( iNb.target.innerHTML );

                    if ( iNb > iSlides - iColumns ) {
                        iNb = iSlides - iColumns + 1;
                    }
                }
                else iNb = validateType( iNb, 'int' );

                if ( iNb == undefined ) return this;

                iNb--;

                // requested slide is already visible
                if ( $.pager.children[iNb] != undefined && $.pager.children[iNb].className.indexOf( 'active' ) > -1 )
                    iNb = oSettings.iCurrentSlide;
                else if ( iNb > iSlides - iColumns ) iNb = iSlides - iColumns;
            }

            // to loop or not to loop ... that is the question
            if ( iNb < 0 ) iNb = ( bLoop ? iSlides - iColumns : 0 );
            else if ( iNb > iSlides - iColumns ) iNb = ( !bLoop ? iSlides - iColumns : 0 );

            if ( iNb != oSettings.iCurrentSlide ) {
                oSettings.onBeforeSlide.apply( this );

                oSettings.iCurrentSlide = iNb;

                // in this case check for navigation button visibility
                this.slider( 'setLoop' );

                setTimeout( function () {
                    oSettings.onSlideComplete.bind( this );
                }.bind( this ), oSettings.duration );
            }

            // calculate position
            var sTransform = -100 / $.slides.children.length * iNb,
                left = 0;

            if ( $.slides.children.length <= iColumns ) sTransform = 0;
            if ( $.slides.children.length < iColumns ) left = 50 / iColumns * ( iColumns - $.slides.children.length );

            // do the slide
            sTransform = 'translate(' + sTransform + '%,0)';
            $.slides.style.msTransform = sTransform;
            $.slides.style.mozTransform = sTransform;
            $.slides.style.transform = sTransform;
            $.slides.style.left = left + '%';

            // pager
            for ( var k = 0; k < $.pager.children.length; k++ ) {
                if ( k >= iNb && k - iColumns < iNb )
                    Sliders.helper.addClass.call( $.pager.children[k], 'active' );
                else Sliders.helper.removeClass.call( $.pager.children[k], 'active' );
            }

            return this;
        },

        /**
         * Set attribute.
         *
         * @param {string|object} attribute
         * @param {string|boolean|integer} value
         */
        set: function ( attribute, value ) {
            // attribute is object of attributes (shortcut)
            if ( validateType( attribute, 'object' ) ) {
                for ( var property in attribute ) {
                    if ( attribute.hasOwnProperty( property ) ) {
                        this.slider( 'set', property, attribute[property] );
                    }
                }
            }
            // set specific attribute
            else {
                if ( aChangeableAttributes.indexOf( attribute ) < 0 ) return this;

                value = validateType( value, ( oDefaultSettings[attribute].regexp != undefined ? oDefaultSettings[attribute].regexp : oDefaultSettings[attribute] ) );
                if ( value == undefined ) return this;

                // check for specific attribute setter
                if ( typeof Sliders['set' + attribute[0].toUpperCase() + attribute.slice( 1 )] == 'function' ) {
                    return this.slider( 'set' + attribute[0].toUpperCase() + attribute.slice( 1 ), value );
                }

                // ... for all others simply change attribute
                this.setAttribute( 'data-' + attribute, value );
            }

            return this;
        },

        /**
         * Get attribute value (HTML first).
         *
         * @param {string} attribute
         */
        get: function ( attribute ) {
            if ( aChangeableAttributes.indexOf( attribute ) < 0 ) return undefined;

            var oSettings = window.Sliders.settings[this.id];

            return validateType( this.getAttribute( 'data-' + attribute ),
                ( oDefaultSettings[attribute].regexp != undefined ? oDefaultSettings[attribute].regexp : oDefaultSettings[attribute] ),
                ( oSettings[attribute].value != undefined ? oSettings[attribute].value : oSettings[attribute] ) );
        },

        /**
         * Set columns attribute.
         *
         * @param {integer} columns
         */
        setColumns: function ( columns ) {
            if ( !validateType( columns, oDefaultSettings.columns.regexp, false ) ) return this;

            this.setAttribute( 'data-columns', columns );

            // re-calculate dimensions
            var dimension = this.slider( 'get', 'dimension' );
            window.Sliders.setDimension.call( this, ( dimension == 'auto' ? dimension : undefined ) );

            // re-slide to current slide
            window.Sliders.slide.call( this, window.Sliders.settings[this.id].iCurrentSlide + 1 );

            // in this case check for navigation button visibility
            this.slider( 'setLoop' );

            return this;
        },

        /**
         * Set slideshow attribute.
         * ... and action.
         *
         * @param {integer} delay
         */
        setSlideshow: function ( delay ) {
            delay = validateType( delay, oDefaultSettings.slideshow.regexp, this.slider( 'get', 'slideshow' ) );
            this.setAttribute( 'data-slideshow', delay );

            // clear 'old' slideshow
            if ( this.slideshow != undefined ) {
                clearInterval( this.slideshow );
                delete this.slideshow;
            }

            // no slideshow
            if ( !delay ) return;

            // initial call after delay
            // following: delay + duration
            setTimeout( function ( delay, duration ) {
                if ( this.className.indexOf( 'hover' ) === -1 ) this.slider( 'next' );

                this.slideshow = setInterval( function () {
                    if ( this.className.indexOf( 'hover' ) === -1 ) this.slider( 'next' );
                }.bind( this ), parseInt( delay ) + duration );
            }.bind( this, delay, this.slider( 'get', 'duration' ) ), delay );

            return this;
        },

        /**
         * Set loop attribute.
         *
         * @param {boolean} loop
         */
        setLoop: function ( loop ) {
            var oSettings = window.Sliders.settings[this.id],
                $ = oSettings.$,
                iColumns = this.slider( 'get', 'columns' );

            loop = validateType( loop, oDefaultSettings.loop, this.slider( 'get', 'loop' ) );
            this.setAttribute( 'data-loop', loop );

            // nothing to loop/slide
            if ( $.slides.children.length <= iColumns ) {
                // hide navigation buttons
                Sliders.helper.addClass.call( $.navigation.children[0], 'disabled' );
                Sliders.helper.addClass.call( $.navigation.children[1], 'disabled' );
            }
            else if ( loop ) {
                // show navigation buttons
                Sliders.helper.removeClass.call( $.navigation.children[0], 'disabled' );
                Sliders.helper.removeClass.call( $.navigation.children[1], 'disabled' );
            }
            // show/hide navigation buttons
            else {
                if ( oSettings.iCurrentSlide == 0 ) Sliders.helper.addClass.call( $.navigation.children[0], 'disabled' );
                else Sliders.helper.removeClass.call( $.navigation.children[0], 'disabled' );

                if ( oSettings.iCurrentSlide == $.slides.children.length - iColumns ) Sliders.helper.addClass.call( $.navigation.children[1], 'disabled' );
                else Sliders.helper.removeClass.call( $.navigation.children[1], 'disabled' );
            }

            return this;
        },

        /**
         * Parse dimensions and set attribute.
         *
         * @param {string} dimension
         */
        setDimension: function ( dimension ) {
            var $slides = window.Sliders.settings[this.id].$.slides,
                i, image, format;

            // reset image positioning
            for ( i = 0; i < $slides.children.length; i++ ) {
                window.Sliders.helper.removeClass.call( $slides.children[i], ['cover-height', 'cover-width'] );
            }

            if ( dimension == 'auto' ) {
                this.setAttribute( 'data-dimension', dimension );
                $slides.style.paddingTop = '';
            }
            else {
                this.removeAttribute( 'data-dimension' );

                if ( typeof dimension != 'undefined' ) {
                    // get format values
                    var aDimensions = dimension.match( oDefaultSettings.dimension.regexp );

                    var width = aDimensions[3],
                        wUnit = aDimensions[4],

                        height = aDimensions[8],
                        hUnit = aDimensions[9];

                    // square
                    if ( !aDimensions[6] || !height ) {
                        height = '100';
                        hUnit = '%';
                    }
                    // ratio
                    else if ( aDimensions[6] == ':' ) {
                        height = height * 100 / width;
                        hUnit = '%';

                        width = false;
                        wUnit = false;
                    }
                    // 'fixed' dimension
                    else {
                        // ... but in this case always in % to keep it responsive
                        if ( [hUnit, wUnit].indexOf( '%' ) < 0 ) {
                            height = height * 100 / width;
                            hUnit = '%';
                        }
                    }

                    // set width
                    if ( !!width ) this.style.width = width + ( wUnit ? wUnit : 'px' );

                    // set height
                    if ( !!height ) {
                        if ( hUnit == '%' ) $slides.style.paddingTop = height + hUnit;
                        else {
                            $slides.style.paddingTop = '';
                            $slides.style.height = height + 'px';
                        }
                    }
                }

                // class for positioning (like background-size: cover)
                for ( i = 0; i < $slides.children.length; i++ ) {
                    image = $slides.children[i].getElementsByTagName( 'img' );
                    if ( !image.length ) continue;

                    if ( image[0].offsetHeight * $slides.children[i].offsetWidth / image[0].offsetWidth < $slides.children[i].offsetHeight )
                        format = 'height';
                    else format = 'width';

                    window.Sliders.helper.addClass.call( $slides.children[i], 'cover-' + format );
                }
            }

            return this;
        },

        /**
         * Set slide attribute.
         * ... and add/change transition css.
         *
         * @param {integer} duration
         */
        setDuration: function ( duration ) {
            var oSettings = window.Sliders.settings[this.id];

            if ( validateType( duration, 'number', oSettings.duration ) ) {
                this.setAttribute( 'data-duration', duration );

                // remove old css
                if ( typeof oSettings.$.css != 'undefined' ) oSettings.$.css.remove();

                duration = 'transition: transform ' + duration / 1000 + 's;';

                // create and add new css
                oSettings.$.css = document.createElement( 'style' );
                oSettings.$.css.type = 'text/css';
                oSettings.$.css.innerHTML = '#' + this.id + " .slides {\n" +
                '-moz-' + duration +
                "\n-o-" + duration +
                "\n-webkit-" + duration +
                duration + "\n}";
                document.getElementsByTagName( 'head' )[0].appendChild( oSettings.$.css );
            }

            return this;
        },

        /**
         * Reset attribute(s) to initial state.
         *
         * @param {string|array} attributes
         */
        reset: function ( attributes ) {
            if ( attributes == undefined ) attributes = [];
            else if ( typeof attributes == 'string' ) attributes = [attributes];

            if ( !validateType( attributes, 'array' ) ) return this;

            for ( var i = 0; i < aChangeableAttributes.length; i++ ) {
                if ( !attributes.length || attributes.indexOf( aChangeableAttributes[i] ) > -1 ) {
                    this.slider( 'set', aChangeableAttributes[i], window.Sliders.settings[this.id][aChangeableAttributes[i]] );
                }
            }

            return this;
        },

        /**
         * Remove slider ... actions, markup and stuff.
         *
         * @param {string} confirmation
         */
        destroy: function ( confirmation ) {
            if ( confirmation !== 'destroy' ) {
                console.error( 'Missing confirmation "destroy" to destroy slider. Are you really sure?' );
                return this;
            }

            var oSettings = window.Sliders.settings[this.id],
                property;

            // remove HTML traces
            oSettings.$.navigation.remove();
            oSettings.$.pager.remove();
            oSettings.$.css.remove();

            // remove classes
            Sliders.helper.removeClass.call( this, 'slider-attached' );
            Sliders.helper.removeClass.call( oSettings.$.slides, 'slides' );

            // remove styles
            oSettings.$.slides.style.left = '';
            oSettings.$.slides.style.paddingTop = '';
            oSettings.$.slides.style.transform = '';

            // remove attributes
            // todo: also remove 'id' and 'tabindex' IF set by slider
            this.removeAttribute( 'data-slides' );
            for ( property in oSettings ) {
                this.removeAttribute( 'data-' + property );
            }

            // last: delete Sliders entry and wrapper
            delete( window.Sliders.settings[this.id] );
            delete( this.slider );

            return this;
        },

        /**
         * Place for the element's settings.
         */

        settings: {},

        /**
         * Helper functions.
         */

        helper: {

            /**
             * Add, remove or toggle element's class(es).
             *
             * @param {array|string} classes
             * @param {string} action
             */
            toggleClass: function ( classes, action ) {
                // string to array
                if ( typeof classes == 'string' ) classes = classes.split( ' ' );

                classes = classes.filter( function ( item ) {
                    return item.trim();
                } );

                // nothing to do
                if ( !classes.length ) return;

                if ( ['add', 'remove'].indexOf( action ) < 0 ) action = 'toggle';

                // element's classes
                var classList = this.className.split( ' ' ),
                    i, j, doAction;

                classList = classList.filter( function ( item ) {
                    return item.trim();
                } );

                // merge 'classes'
                for ( i = 0; i < classes.length; i++ ) {
                    if ( action != 'toggle' ) doAction = action;
                    else {
                        if ( classList.indexOf( classes[i] ) < 0 ) doAction = 'add';
                        else doAction = 'remove';
                    }

                    switch ( doAction ) {
                        case 'add':
                            if ( classList.indexOf( classes[i] ) < 0 ) {
                                classList.push( classes[i] );
                            }
                            break;

                        case 'remove':
                            // get class index
                            j = classList.indexOf( classes[i] );

                            // found!? than remove
                            if ( j > -1 ) {
                                classList.splice( j, 1 );
                            }
                            break;
                    }

                }

                this.className = classList.join( ' ' );

                return this;
            },

            /**
             * Wrapper for adding element's class(es).
             *
             * @param {string|array} classes
             */
            addClass: function ( classes ) {
                return Sliders.helper.toggleClass.call( this, classes, 'add' );
            },

            /**
             * Wrapper for removing element's class(es).
             *
             * @param classes
             */
            removeClass: function ( classes ) {
                return Sliders.helper.toggleClass.call( this, classes, 'remove' );
            }

        }
    };

    return function Slider( $elements, oSettings ) {
        if ( !( this instanceof Slider ) ) return new Slider( $elements, oSettings );

        var $originalElements = $elements;

        /**
         * Collect elements.
         */

        // string to HTMLElement/~collection
        if ( Object.prototype.toString.call( $elements ) == '[object String]' ) {
            if ( $elements.match( new RegExp( '(\\w+(\\.|#)| |>|\\+|~)' ) ) ) $elements = document.querySelectorAll( $elements );
            else if ( $elements[0] == '.' ) $elements = document.getElementsByClassName( $elements.slice( 1 ) );
            else if ( $elements[0] == '#' ) $elements = document.getElementById( $elements.slice( 1 ) );

            $originalElements = $elements;
        }

        // [object HTML~] to array
        switch ( Object.prototype.toString.call( $elements ) ) {
            default:
                $elements = [$elements];
                break;

            case '[object NodeList]':
            case '[object HTMLCollection]':
                $elements = [].slice.call( $elements );
                break;
        }

        // filter out elements the slider is already attached to
        $elements.filter( function ( $element ) {
            return !( typeof $element.slider == 'function' );
        } );

        // nothing to do
        if ( !$elements.length ) return $originalElements;

        oSettings = oSettings || {};

        var oElementSettings,
            $element, $slides, $navigation, $pager, $item,
            property, i = 0, j;

        // loop through elements and attach slider actions
        while ( $element = $elements[i++] ) {
            Sliders.helper.addClass.call( $element, 'slider-attached' );

            if ( $element.children.length < 1 ) return;
            else if ( $element.children.length > 1 )
                console.info( 'Multiple children in .slider detected. Slider will work fine but the navigation and pager will likely be on wrong positions. Solution: expected markup: slider > slides{1} > slide{n}' );

            // we need an ID
            if ( !$element.id ) $element.id = uid( 'slider-{5}' );

            $slides = $element.children[0];
            Sliders.helper.addClass.call( $slides, 'slides' );
            $element.setAttribute( 'data-slides', $slides.children.length );

            /**
             * Collect/merge/override settings.
             */

            oElementSettings = {};
            for ( j = 0; j < aChangeableAttributes.length; j++ ) {
                oElementSettings[aChangeableAttributes[j]] = $element.getAttribute( 'data-' + aChangeableAttributes[j] );
            }

            // override element settings by js settings
            for ( property in oSettings ) {
                // ckeck 'support'
                if ( oDefaultSettings.hasOwnProperty( property ) ) {
                    // check type
                    oSettings[property] = validateType( oSettings[property], ( oDefaultSettings[property].regexp != undefined ? oDefaultSettings[property].regexp : oDefaultSettings[property] ) );

                    if ( oSettings[property] != undefined ) {
                        oElementSettings[property] = oSettings[property];
                    }
                }
            }

            // merge default settings
            for ( property in oDefaultSettings ) {
                // check type
                oElementSettings[property] = validateType( oElementSettings[property], ( oDefaultSettings[property].regexp != undefined
                    ? oDefaultSettings[property].regexp : oDefaultSettings[property] ) );

                if ( oElementSettings[property] != undefined ) continue;

                oElementSettings[property] = ( oDefaultSettings[property].value != undefined
                    ? oDefaultSettings[property].value : oDefaultSettings[property] );
            }

            // setting will be added as data-attributes later

            /**
             * Navigation.
             */

            $navigation = document.createElement( 'ul' );
            Sliders.helper.addClass.call( $navigation, 'slider__navigation' );

            // create navigation items
            for ( j = 0; j < 2; j++ ) {
                $item = document.createElement( 'li' );

                if ( !j ) {
                    $item.innerHTML = oElementSettings.t9n.previous;
                    $item.setAttribute( 'data-slide', 'prev' );
                }
                else {
                    $item.innerHTML = oElementSettings.t9n.next;
                    $item.setAttribute( 'data-slide', 'next' );
                }

                $item.addEventListener( 'click', function ( e ) {
                    this.slider( e.target.getAttribute( 'data-slide' ) );
                }.bind( $element ) );

                $navigation.appendChild( $item );
            }

            // eventually append
            $element.appendChild( $navigation );

            /**
             * Pager.
             */

            $pager = document.createElement( 'ul' );
            window.Sliders.helper.addClass.call( $pager, 'slider__pager' );

            // create pager items
            for ( j = 1; j <= $slides.children.length; j++ ) {
                $item = document.createElement( 'li' );
                $item.innerHTML = j;

                $item.addEventListener( 'click', function ( e ) {
                    this.slider( 'slide', e.target.innerHTML );
                }.bind( $element ) );

                $pager.appendChild( $item )
            }

            // eventually append
            $element.appendChild( $pager );

            /**
             * ...
             */

            $element.addEventListener( 'mouseover', function () {
                Sliders.helper.addClass.call( this, 'hover' );
            }.bind( $element ) );

            $element.addEventListener( 'mouseout', function ( e ) {
                var isChild = e.relatedTarget;

                // check if mouse is 'in' slider
                // we need this for childNodes
                while ( isChild ) {
                    if ( isChild.tagName == 'BODY' ) isChild = false; // went tree to top
                    else if ( isChild == this ) isChild = true; // still 'in' slider

                    // solution found
                    if ( typeof isChild === 'boolean' ) break;

                    // next parent
                    isChild = isChild.parentNode;
                }

                if ( !isChild ) Sliders.helper.removeClass.call( this, 'hover' );
            }.bind( $element ) );

            /**
             * Swipe.
             */

            var swipe = false,
                swipestart = function ( e ) {
                    var iClientX, iClientY;

                    if ( !!e.clientX ) {
                        iClientX = e.clientX;
                        iClientY = e.clientY;

                        this.focus();
                    }
                    else {
                        iClientX = e.changedTouches[0].clientX;
                        iClientY = e.changedTouches[0].clientY;
                    }

                    swipe = {
                        clientX: parseInt( iClientX ),
                        clientY: parseInt( iClientY )
                    };
                },
                swipemove = function ( e ) {
                    // not started or swipe already detected
                    if ( typeof swipe == 'boolean' ) {
                        if ( swipe ) e.preventDefault();

                        return;
                    }

                    var iClientX, iClientY;

                    if ( !!e.clientX ) {
                        iClientX = e.clientX;
                        iClientY = e.clientY;
                    }
                    else {
                        iClientX = e.changedTouches[0].clientX;
                        iClientY = e.changedTouches[0].clientY;
                    }

                    var iTouchDistanceX = parseInt( iClientX ) - swipe.clientX;

                    // horizontal swipe
                    if ( Math.abs( iTouchDistanceX ) > Math.abs( parseInt( iClientY ) - swipe.clientY ) ) {
                        e.preventDefault();
                    }

                    // threshold
                    if ( Math.abs( iTouchDistanceX ) < 50 ) return;

                    if ( iTouchDistanceX < 0 ) this.slider( 'next' );
                    else this.slider( 'prev' );

                    swipe = true;
                }, // reset
                swipeend = function () {
                    swipe = false;
                };

            $element.addEventListener( 'touchstart', swipestart, false );
            $element.addEventListener( 'mousedown', swipestart, false );

            $element.addEventListener( 'touchmove', swipemove, false );
            $element.addEventListener( 'mousemove', swipemove, false );

            $element.addEventListener( 'touchend', swipeend, false );
            $element.addEventListener( 'mouseup', swipeend, false );

            /**
             * Keyboard.
             */

            $element.setAttribute( 'tabindex', 0 );

            $element.addEventListener( 'keydown', function ( e ) {
                switch ( e.keyCode ) {
                    case 38:
                    case 40:
                        return this;

                    case 37:
                        e.preventDefault();
                        return this.slider( 'prev' );

                    case 39:
                        e.preventDefault();
                        return this.slider( 'next' );
                }
            }.bind( $element ) );

            /**
             * Slider's settings/data.
             */

            window.Sliders.settings[$element.id] = oElementSettings;
            window.Sliders.settings[$element.id].iCurrentSlide = oElementSettings.startSlide;
            window.Sliders.settings[$element.id]['$'] = {
                slides: $slides,
                navigation: $navigation,
                pager: $pager
            };

            /**
             * Wrapper function to access element's Slider.
             */
            $element.slider = function ( method ) {
                var Slider = { fnMethods: window.Sliders };
                Slider.oSettings = Slider.fnMethods.settings[this.id];

                var found;

                // try to get right data/callback
                // first methods than settings
                for ( property in Slider ) {
                    found = true;

                    switch ( typeof Slider[property][method] ) {
                        default:
                            return Slider[property][method];

                        case 'function':
                            return Slider[property][method].apply( this, [].slice.call( arguments ).slice( 1 ) );

                        case 'undefined':
                            found = false;
                            break;
                    }

                    // ...
                    if ( found ) break;
                }

                // nothing found ... return element
                return this;
            };

            // set data-attributes (the ones needed for CSS)
            window.Sliders.reset.apply( $element );

            // after init callback
            $element.slider( 'onInit' );
            if ( oElementSettings.startSlide ) $element.slider( 'slide', oElementSettings.startSlide );
        }

        // get back what you hand over
        // ... return the original elements
        return $originalElements;
    };

    /**
     * Create (unique) html id.
     *
     * @param {string} pattern
     * @returns {boolean|string}
     */
    function uid( pattern ) {
        var regexp = '{(\\d+)}';

        if ( typeof pattern == 'undefined' || !pattern.match( new RegExp( regexp ) ) ) {
            console.error( "Pattern with at least \"{INTEGER_LENGHT}\" expected." );
            return false;
        }

        var uid = '';

        while ( !uid || document.getElementById( uid ) ) {
            uid = pattern.replace( new RegExp( regexp, 'g' ), function ( match ) {
                var length = parseInt( match.match( new RegExp( regexp ) )[1] ),
                    uid = '';

                while ( uid.length < length ) {
                    uid += ( Math.random().toString( 36 ) ).substr( 2 );

                    // no integer in front
                    uid = uid.replace( new RegExp( '^\\d+' ), '' );
                }

                return uid.substr( 0, length );
            } );
        }

        return uid;
    }

    /**
     * Validate value type against expected one.
     * ... and (in case) return value in expected type (e.g. '1' to true).
     *
     * @param value
     * @param expected
     * @param fallback
     */
    function validateType( value, expected, fallback ) {
        switch ( expected ) {
            case 'bool':
            case 'boolean':
            case '[object Boolean]':
                if ( [1, '1', true, 'true'].indexOf( value ) > -1 ) return true;
                else if ( [0, '0', false, 'false'].indexOf( value ) > -1 ) return false;
                break;

            case 'string':
            case '[object String]':
                if ( value + '' == value ) return value + '';
                break;

            case 'number':
            case 'float':
            case '[object Number]':
                if ( parseFloat( value ) == value ) return parseFloat( value );
                break;

            case 'int':
            case 'integer':
                if ( parseInt( value ) == value ) return parseInt( value );
                break;

            case 'function':
            case '[object Function]':
                if ( typeof value == 'function' ) return value;
                break;

            case 'array':
            case '[object Array]':
                if ( Object.prototype.toString.call( value ) == '[object Array]' ) return value;
                break;

            case 'object':
            case '[object Object]':
                if ( Object.prototype.toString.call( value ) == '[object Object]' ) return value;
                break;

            // 'expected' is not one of the types above
            // so I assume it's a variable to compare with
            default:
                if ( Object.prototype.toString.call( expected ) == '[object RegExp]' ) {
                    if ( ( value + '' ).match( expected ) ) return value;
                }
                else return validateType( value, Object.prototype.toString.call( expected ), fallback );
        }

        if ( typeof fallback != 'undefined' ) return fallback;
        else return undefined;
    }

} );
