( function( window, document, undefined ) {

    document.addEventListener( "DOMContentLoaded", function() {

        var $sliders = document.getElementsByClassName( 'slider' );
        if ( !$sliders ) return;

        for ( var i = 0; i < $sliders.length; i++ ) {

            ( function() {
                var $slider = $sliders[i],
                    $slides = $slider.getElementsByClassName( 'slides' )[0];

                $slider.slides = $slider.getElementsByTagName( 'figure' );

                if ( $slider.slides.length <= 1 ) return;

                // navigation action
                var $navigation = $sliders[i].getElementsByClassName( 'slider__navigation' );
                $navigation = $navigation[0].getElementsByTagName( 'li' );

                for ( var j = 0; j < $navigation.length; j++ ) {
                    $navigation[j].addEventListener( 'click', function() {
                        slide( this == true ? 'next' : 'prev' );
                    }.bind(!!j) );
                }

                // pager action
                var $pager = $sliders[i].getElementsByClassName( 'slider__pager' )[0];
                $pager = $pager.getElementsByTagName( 'li' );

                for ( j = 0; j < $pager.length; j++ ) {
                    if ( !j ) {
                        $pager[j].className += ' active';
                        $slider.currentSlide = j;
                    }
                    $pager[j].addEventListener( 'click', slide );
                }

                function slide( nb ) {
                    if ( nb == 'next' ) nb = $slider.currentSlide + 1;
                    else if ( nb == 'prev' ) nb = $slider.currentSlide - 1;
                    else {
                        if ( isNaN( parseFloat( nb ) ) || !isFinite( nb ) ) {
                            nb = parseInt( nb.target.innerHTML );
                        }

                        nb--;
                    }

                    // loop
                    if ( nb < 0 ) nb = $pager.length - 1;
                    else if ( nb > $pager.length - 1 ) nb = 0;

                    $slider.currentSlide = nb;

                    for ( var k = 0; k < $pager.length; k++ ) {
                        if ( k == nb ) {
                            if ( $pager[k].className.indexOf( 'active' ) === -1 ) {
                                var sTransform = 'translate(' + -100 / $slider.slides.length * nb + '%,0)';
                                $slides.style.msTransform = sTransform;
                                $slides.style.mozTransform = sTransform;
                                $slides.style.transform = sTransform;

                                $pager[k].className += ' active';
                            }
                        }
                        else $pager[k].className = $pager[k].className.replace( ' active', '' );
                    }
                }

                // animation duration
                $slider.duration = parseInt( $slider.getAttribute( 'data-duration' ) ) || 500;
                if ( $slider.duration != 500 ) {
                    var css = document.createElement( 'style' );
                    css.type = 'text/css';
                    css.innerHTML = '#' + $slider.id + ' .slides {' +
                    '-moz-transition: transform ' + $slider.duration/1000 + 's;' +
                    '-o-transition: transform ' + $slider.duration/1000 + 's;' +
                    '-webkit-transition: transform ' + $slider.duration/1000 + 's;' +
                    'transition: transform ' + $slider.duration/1000 + 's; }';
                    document.getElementsByTagName( 'head' )[0].appendChild(css);
                }

                // slideshow
                $slider.slideshow = parseInt( $slider.getAttribute( 'data-slideshow' ) ) || 0;
                if ( $slider.slideshow ) {
                    $slider.addEventListener( 'mouseover', function() {
                        if ( $slider.className.indexOf( 'hover' ) === -1 ) {
                            $slider.className += ' hover';
                        }
                    } );

                    $slider.addEventListener( 'mouseout', function( e ) {
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

                        if ( !isChild ) $slider.className = $slider.className.replace( ' hover', '' );
                    } );

                    // initial call after suggested time
                    // following + 2s (time for animation; @see ../css/slider.scss)
                    setTimeout( function() {
                        if ( $slider.className.indexOf( 'hover' ) === -1 ) slide( 'next' );

                        $slider.slideshow = setInterval( function() {
                            if ( $slider.className.indexOf( 'hover' ) === -1 ) slide( 'next' );
                        }, $slider.slideshow + $slider.duration );
                    }, $slider.slideshow );
                }
            })();

        }

    } );

} )( this, this.document );
