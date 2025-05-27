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

        let parameters = $swiper.getAttribute( 'data-swiper' )||"{}";
        try { parameters = JSON.parse( parameters ); } // try to parse parameters
        catch( e ) { parameters = {}; }

        // https://swiperjs.com/swiper-api#navigation-parameters
        if ( !!parameters.navigation ) {
            parameters.navigation = {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            }
        }

        // https://swiperjs.com/swiper-api#pagination-parameters
        if ( typeof parameters.pagination === 'string' ) {
            parameters.pagination = {
                el: '.swiper-pagination',
                type: parameters.pagination
            }

            if ( parameters.pagination.type === 'bullets' ) {
                parameters.pagination.clickable = true;
            }

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

        // https://swiperjs.com/swiper-api#mousewheel-control-parameters
        if ( parameters.mousewheel ) {
            parameters.mousewheel = {
                releaseOnEdges: !!parameters.releaseOnEdges
            }
        }

        // https://swiperjs.com/swiper-api#grid-parameters
        if ( !!parameters.rows ) {
            parameters.grid = { rows: parameters.rows }
            delete parameters.rows;
        }

        // https://swiperjs.com/swiper-api#autoplay-parameters
        if ( parameters.autoplay ) {
            // backwards compatibility @since 1.14.0
            if ( !isNaN( parameters.autoplay ) ) parameters.autoplay = {
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

        if ( parameters.slidesPerGroup === 1 )
            delete parameters.slidesPerGroup;

        // https://swiperjs.com/swiper-api#free-mode-parameters
        if ( !!parameters.freeMode ) parameters.freeMode = {
            enabled: true,
            sticky: false
        };

        // https://swiperjs.com/swiper-api#accessibility-parameters
        parameters.a11y = { ...{
            containerRole: 'group',
            containerRoleDescriptionMessage: 'carousel',

            firstSlideMessage: wp.i18n.__( 'This is the first slide', 'slider' ),
            lastSlideMessage: wp.i18n.__( 'This is the last slide', 'slider' ),
            nextSlideMessage: wp.i18n.__( 'Next slide', 'slider' ),
            prevSlideMessage: wp.i18n.__( 'Previous slide', 'slider' ),
            paginationBulletMessage: wp.i18n.__( 'Go to slide {{index}}', 'slider' ),

            scrollOnFocus: false
        }, ...parameters.a11y }

        // make hidden/visible slides non-active/accessible
        function slideA11y( swiper ) {
            swiper.slides.forEach( ( $slide, i) => {
                const accessible = $slide.classList.contains( 'swiper-slide-visible' );

                $slide[accessible ? 'removeAttribute' : 'setAttribute']( 'inert', '' ) // browser will ignore the element
                $slide[accessible ? 'removeAttribute' : 'setAttribute']( 'aria-hidden', 'true' ) // hide from accessibility API
            } );
        }

        if ( !parameters.on ) parameters.on = {};
        const afterInit = parameters.on.afterInit || (()=>{})
        parameters.on.afterInit = swiper => {
            slideA11y( swiper );

            afterInit( swiper ) // custom callback
            swiper.el.dispatchEvent( new CustomEvent( 'swiper:afterInit', {
                detail: swiper,
                bubbles: true
            } ) );
        }

        // https://gist.github.com/enoks/a336e8db4594737a98d8bd2c3783c2d6
        if ( typeof Alter !== 'undefined' ) {
            parameters = Alter.do( 'swiper:parameters', parameters, $swiper )
        }

        // make sure number values are actually type of number
        for ( const parameter in parameters ) {
            if ( !isNaN( parameters[parameter] ) ) parameters[parameter] = parameters[parameter] * 1;
        }

        // make boolean
        ['keyboard', 'simulateTouch'].forEach( parameter => {
            if ( typeof parameters[parameter] !== 'undefined' )
                parameters[parameter] = !!parameters[parameter];
        } )

        // init slider
        const swiper = new Swiper( $swiper, {
            watchSlidesProgress: true,
            threshold: ('ontouchstart' in window || navigator.msMaxTouchPoints > 0) ? 0 : 10,
            ...parameters
        } );

        swiper.on( 'transitionEnd', slideA11y )
        swiper.on( 'scrollbarDragEnd', slideA11y )
        swiper.on( 'update', slideA11y )
    } );

    return $sliders;

}

doSliders();