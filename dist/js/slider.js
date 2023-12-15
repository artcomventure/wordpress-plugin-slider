const doSliders = function( $context ) {

    $context = $context||document;

    let $sliders; // get sliders
    if ( ['HTMLCollection', 'NodeList'].indexOf( $context.constructor.name ) >= 0 ) $sliders = $context;
    else if ( !!$context.classList && $context.classList.contains( 'swiper' ) ) $sliders = [$context];
    else $sliders = $context.getElementsByClassName( 'swiper' );

    [].forEach.call( $sliders, function( $swiper ) {
        $swiper.dispatchEvent( new CustomEvent( 'swiper:beforeInit', {
            detail: $swiper,
            bubbles: true
        } ) );

        let parameters = $swiper.getAttribute( 'data-swiper' )||{};
        // try to parse parameters
        try { parameters = JSON.parse( parameters ); }
        catch( e ) { parameters = {}; }

        // make sure number values are actually type of number
        for ( const attribute in parameters ) {
            if ( !isNaN( parameters[attribute] ) ) parameters[attribute] = parameters[attribute] * 1;
        }

        if ( !!parameters.navigation ) {
            parameters.navigation = {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            }
        }

        if ( typeof parameters.pagination === 'string' ) {
            parameters.pagination = {
                el: '.swiper-pagination',
                type: parameters.pagination
            }

            // bullets
            if ( parameters.pagination.type === 'bullets' ) {
                parameters.pagination.clickable = true;
            }

            // scrollbar
            if ( parameters.pagination.type === 'scrollbar' ) {
                parameters.scrollbar = {
                    el: ".swiper-scrollbar",
                    draggable: true,
                    snapOnRelease: (parameters.effect || 'swipe') === 'fade',
                    dragSize: 'auto',
                    hide: false
                };
            }
        }

        if ( parameters.mousewheel ) {
            parameters.mousewheel = {
                forceToAxis: true,
                releaseOnEdges: true
            }
        }

        if ( parameters.autoplay ) {
            parameters.autoplay = {
                delay: parameters.autoplay,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
            }
        }

        if ( !!parameters.slidesPerGroup && parameters.slidesPerGroup === 'auto' ) {
            if ( parameters.slidesPerView === 'auto' ) {
                parameters.slidesPerGroup = 1;
                parameters.slidesPerGroupAuto = true;
            }
            else parameters.slidesPerGroup = parameters.slidesPerView || 1;
        }

        // filter default values
        // and _normalize_ given ones

        if ( parameters.slidesPerGroup === 1 )
            delete parameters.slidesPerGroup;

        // make boolean
        ['keyboard', 'simulateTouch'].forEach( parameter => {
            if ( typeof parameters[parameter] !== 'undefined' )
                parameters[parameter] = !!parameters[parameter];
        } )

        // init slider
        new Swiper( $swiper, parameters = {
            watchSlidesProgress: true,
            threshold: ('ontouchstart' in window || navigator.msMaxTouchPoints > 0) ? 0 : 10,
            on: {
                afterInit: function( swiper ) {
                    // for some reason swiper doesn't get drag width right
                    // so we update scrollbar's `dragSize` parameter immediately after init
                    if ( swiper.params.scrollbar.dragSize === 'auto' ) {
                        const $drag = swiper.el.querySelector( '.swiper-scrollbar-drag' )
                        if ( $drag ) swiper.params.scrollbar.dragSize = $drag.offsetWidth;
                    }

                    swiper.el.dispatchEvent( new CustomEvent( 'swiper:afterInit', {
                        detail: swiper,
                        bubbles: true
                    } ) );
                },
                disable: function( swiper ) { swiper.el.classList.add( 'swiper-lock' ); },
                enable: function( swiper ) { swiper.el.classList.remove( 'swiper-lock' ); }
            },
            // merge slider specific parameters
            ...parameters
        } );
    } );

    return $sliders;

}

doSliders();