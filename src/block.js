import { __, _n } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { InspectorControls, InnerBlocks, ButtonBlockAppender, BlockControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, SelectControl, ToolbarGroup, ToolbarButton, __experimentalNumberControl as NumberControl, TextControl } from "@wordpress/components";
import { compose, withState } from '@wordpress/compose';
import { withSelect, select, dispatch, subscribe } from '@wordpress/data';
import { moreHorizontalMobile, aspectRatio, formatListBullets, arrowRight, redo } from '@wordpress/icons';

const SliderEdit = ( { attributes, slides, slide, clientId, setAttributes, ...props } ) => {
    const { setState } = props;

    // keep current visible slide in boundaries (0 <=> slides.length - 1)
    // setState( { slide: Math.min( Math.max(1, slide ), slides ) } )

    // pass attributes to child blocks
    // select( 'core/block-editor' ).getBlocksByClientId( clientId )[0].innerBlocks.forEach( function ( block ) {
    //     dispatch( 'core/block-editor' ).updateBlockAttributes( block.clientId, { slide: slide } )
    // } )

    // get current slide blocks
    let slideBlocks = select( 'core/block-editor' ).getBlocksByClientId( clientId )[0].innerBlocks.map( ( block ) => block.clientId );
    subscribe( () => {
        // get _new_ slide blocks
        let _slideBlocks = select( 'core/block-editor' ).getBlocksByClientId( clientId )[0];
        if ( !_slideBlocks ) return;
        _slideBlocks = _slideBlocks.innerBlocks.map( ( block ) => block.clientId );

        // nothing's changed
        if ( _slideBlocks.length === slideBlocks.length ) return;

        // slide added
        if ( _slideBlocks.length > slideBlocks.length && attributes.blockView === 'slide' ) {
            // switch to added block
            setState( { slide: _slideBlocks.length } )
        }

        // update current slide block list with the new one for further comparison
        slideBlocks = _slideBlocks;
    } );

    return (
        <>
            <InspectorControls>
                <PanelBody title={ __( 'Slider Settings', 'slider' ) } className="slider-settings-panel" >
                    <PanelBody title={ __( 'Display', 'slider' ) } initialOpen={ false } icon={ redo }>
                        <>
                            <TextControl
                                label={ __( 'Slides per view', 'slider' ) }
                                help={ __( 'Number (or "auto") of slides visible at the same time on slider\'s container.', 'slider' ) }
                                value={ attributes.slidesPerView }
                                // disabled={ slides === 1 }
                                placeholder={ SliderBlock.attributes.slidesPerView.default }
                                onChange={ ( slidesPerView ) => {
                                    if ( slidesPerView === 'a' ) slidesPerView = 'auto'
                                    else if ( slidesPerView === 'aut' ) slidesPerView = ''
                                    if ( /^(|\d+|auto)$/.test( slidesPerView ) )
                                    setAttributes( { slidesPerView } )
                                } } />
                        </>
                        <NumberControl
                            label={ __( 'Space between slides (in px)', 'slider' ) }
                            min={ 0 }
                            value={ attributes.spaceBetween }
                            placeholder={ SliderBlock.attributes.spaceBetween.default }
                            onChange={ ( spaceBetween ) => setAttributes( { spaceBetween } ) }
                        />
                        <ToggleControl
                            label={ __( 'Show overflow', 'slider' ) }
                            help={ __( 'Show slides outside of slider\'s premises.', 'slider' ) }
                            checked={ attributes.showOverflow }
                            onChange={ ( showOverflow ) => setAttributes( { showOverflow } ) }
                        />
                        <ToggleControl
                            label={ __( 'Center slides', 'slider' ) }
                            help={ __( 'Active slide will be centered, not always on the left side.', 'slider' ) }
                            checked={ attributes.centeredSlides }
                            onChange={ ( centeredSlides ) => setAttributes( { centeredSlides } ) }
                        />
                        <ToggleControl
                            label={ __( 'Auto height', 'slider' ) }
                            help={ __( 'Enable and slider wrapper will adapt its height to the height of the currently active slide.', 'slider' ) }
                            checked={ attributes.autoHeight }
                            onChange={ ( autoHeight ) => setAttributes( { autoHeight } ) }
                        />
                        <ToggleControl
                            label={ __( 'Navigation', 'slider' ) }
                            help={ __( 'Aka prev and next buttons.', 'slider' ) }
                            checked={ attributes.navigation }
                            onChange={ ( navigation ) => setAttributes( { navigation } ) }
                        />
                        <SelectControl
                            label={ __( 'Pagination', 'slider' ) }
                            value={ attributes.pagination }
                            options={ [
                                { value: false, label: __( 'Nope', 'slider' ) },
                                { value: 'bullets', label: __( 'Bullets', 'slider' ) },
                                { value: 'fraction', label: __( 'Fraction', 'slider' ) },
                                { value: 'progressbar', label: __( 'Progressbar', 'slider' ) },
                                { value: 'scrollbar', label: __( 'Scrollbar', 'slider' ) }
                            ] }
                            onChange={ ( pagination ) => setAttributes( { pagination } ) }
                        />
                    </PanelBody>
                    <PanelBody title={ __( 'Animation', 'slider' ) } initialOpen={ false } icon={ redo }>
                        <SelectControl
                            label={ __( 'Transition effect', 'slider' ) }
                            value={ attributes.effect }
                            options={ [
                                { value: 'slide', label: __( 'slide', 'slider' ) },
                                { value: 'fade', label: __( 'fade', 'slider' ) },
                                { value: 'cube', label: __( 'cube', 'slider' ) },
                                { value: 'coverflow', label: __( 'coverflow', 'slider' ) },
                                { value: 'flip', label: __( 'flip', 'slider' ) },
                                { value: 'cards', label: __( 'cards', 'slider' ) }
                            ] }
                            onChange={ ( effect ) => setAttributes( { effect } ) }
                        />
                        <>
                            <NumberControl
                                label={ __( 'Speed', 'slider' ) }
                                value={ attributes.speed !== SliderBlock.attributes.speed.default ? attributes.speed : '' }
                                min={ 0 }
                                placeholder={ SliderBlock.attributes.speed.default }
                                onChange={ ( speed ) => setAttributes( { speed } ) }/>
                            <p className="components-base-control__help">
                                { __( 'Duration of transition between slides (in ms).', 'slider' ) }
                            </p>
                        </>
                        <SelectControl
                            label={ __( 'Direction', 'slider' ) }
                            value={ attributes.direction }
                            options={ [
                                { value: 'horizontal', label: __( 'horizontal', 'slider' ) },
                                { value: 'vertical', label: __( 'vertical', 'slider' ) }
                            ] }
                            onChange={ ( direction ) => setAttributes( { direction } ) }
                        />
                    </PanelBody>
                    <PanelBody title={ __( 'Behaviour', 'slider' ) } initialOpen={ false } icon={ redo }>
                        <TextControl
                            label={ __( 'Slides per group', 'slider' ) }
                            help={ __( 'Set numbers of slides to define and enable group sliding. "auto" will slide as many slides as defined in "Slides per view".', 'slider' ) }
                            value={ attributes.slidesPerGroup }
                            disabled={ attributes.slidesPerView === 1 }
                            placeholder={ SliderBlock.attributes.slidesPerGroup.default }
                            onChange={ ( slidesPerGroup ) => {
                                if ( slidesPerGroup === 'a' ) slidesPerGroup = 'auto'
                                else if ( slidesPerGroup === 'aut' ) slidesPerGroup = ''
                                if ( /^(|\d+|auto)$/.test( slidesPerGroup ) )
                                    setAttributes( { slidesPerGroup } )
                            } } />
                        <ToggleControl
                            label={ __( 'Freemode', 'slider' ) }
                            checked={ attributes.freeMode }
                            onChange={ ( freeMode ) => setAttributes( { freeMode } ) }
                        />
                        <ToggleControl
                            label={ __( 'Loop', 'slider' ) }
                            help={ __( 'Enable continuous loop mode.', 'slider' ) }
                            disabled={ attributes.rewind }
                            checked={ attributes.loop }
                            onChange={ ( loop ) => setAttributes( { loop } ) }
                        />
                        <ToggleControl
                            label={ __( 'Rewind', 'slider' ) }
                            help={ __( 'Last slide will slide back to the first slide and vice versa.', 'slider' ) }
                            disabled={ attributes.loop }
                            checked={ attributes.rewind }
                            onChange={ ( rewind ) => setAttributes( { rewind } ) }
                        />
                        <ToggleControl
                            label={ __( 'Slide to clicked slide', 'slider' ) }
                            help={ __( 'Click on any slide will produce transition to this slide.', 'slider' ) }
                            checked={ attributes.slideToClickedSlide }
                            onChange={ ( slideToClickedSlide ) => setAttributes( { slideToClickedSlide } ) }
                        />
                        <div className={ 'attribute--group attribute-autoplay--group' }>
                            <NumberControl
                                label={ __( 'Autoplay', 'slider' ) }
                                value={ attributes.autoplay.delay||'' }
                                help={ __( 'Delay between transitions (in ms).', 'slider' ) }
                                min={ 0 }
                                placeholder={ __( 'disabled', 'slider' ) }
                                onChange={ ( delay ) => {
                                    const autoplay = { ...attributes.autoplay }
                                    setAttributes( { autoplay: { ...autoplay, ...{ delay } } } )
                                } }
                            />

                            <ToggleControl
                                label={ __( 'Pause on mouseenter', 'slider' ) }
                                help={ __( 'Autoplay will be paused on pointer (mouse) enter over Swiper container.', 'slider' ) }
                                disabled={ !attributes.autoplay.delay }
                                checked={ !!attributes.autoplay.pauseOnMouseEnter }
                                onChange={ ( pauseOnMouseEnter ) => {
                                    const autoplay = { ...attributes.autoplay }
                                    setAttributes( { autoplay: { ...autoplay, ...{ pauseOnMouseEnter } } } )
                                } }
                            />

                            <ToggleControl
                                label={ __( 'Disable on interaction', 'slider' ) }
                                help={ __( 'Autoplay will be disabled after user interactions (swipes).', 'slider' ) }
                                disabled={ !attributes.autoplay.delay }
                                checked={ !!attributes.autoplay.disableOnInteraction }
                                onChange={ ( disableOnInteraction ) => {
                                    const autoplay = { ...attributes.autoplay }
                                    setAttributes( { autoplay: { ...autoplay, ...{ disableOnInteraction } } } )
                                } }
                            />
                        </div>
                        <ToggleControl
                            label={ __( 'Keyboard control', 'slider' ) }
                            help={ __( 'Sliders currently in viewport can be controlled using the keyboard.', 'slider' ) }
                            checked={ attributes.keyboard }
                            onChange={ ( keyboard ) => setAttributes( { keyboard } ) }
                        />
                        <ToggleControl
                            label={ __( 'Simulate touch', 'slider' ) }
                            help={ __( 'Slider will accept mouse events like touch events (click and drag to change slides).', 'slider' ) }
                            checked={ attributes.simulateTouch }
                            onChange={ ( simulateTouch ) => setAttributes( { simulateTouch } ) }
                        />
                        <div className={ 'attribute--group attribute-mousewheel--group' }>
                            <ToggleControl
                                label={ __( 'Mouse wheel', 'slider' ) }
                                help={ __( 'Navigate through slides using mouse wheel.', 'slider' ) }
                                checked={ attributes.mousewheel }
                                onChange={ ( mousewheel ) => setAttributes( { mousewheel } ) }
                            />
                            <ToggleControl
                              label={ __( 'Release on edges', 'slider' ) }
                              help={ __( 'Allow page scrolling when swiper is on edge positions (in the beginning or in the end)', 'slider' ) }
                              disabled={ !attributes.mousewheel }
                              checked={ attributes.releaseOnEdges }
                              onChange={ ( releaseOnEdges ) => setAttributes( { releaseOnEdges } ) }
                            />
                        </div>
                    </PanelBody>
                    <PanelBody title={ __( 'Accessibility', 'slider' ) } initialOpen={ false } icon={ redo }>
                        <SelectControl
                            label={ __( 'Role', 'slider' ) }
                            help={ __( 'Value of the "role" attribute to be set.', 'slider' ) }
                            value={ attributes.a11y.containerRole || 'group' }
                            options={ [
                                { value: 'group', label: 'group' },
                                { value: 'region', label: 'region' }
                            ] }
                            onChange={ containerRole => {
                                const a11y = { ...attributes.a11y }
                                setAttributes( { a11y: { ...a11y, ...{ containerRole } } } )
                            } }
                        />
                        <TextControl
                            label={ __( 'Label', 'slider' ) }
                            help={ __( 'Message for screen readers what this slider is about.', 'slider' ) }
                            value={ attributes.a11y.containerMessage || '' }
                            onChange={ containerMessage => {
                                const a11y = { ...attributes.a11y }
                                setAttributes( { a11y: { ...a11y, ...{ containerMessage } } } )
                            } } />
                    </PanelBody>
                </PanelBody>
            </InspectorControls>

            <BlockControls>
                <ToolbarGroup>
                    <ToolbarButton
                        icon={ aspectRatio }
                        label={ __( 'Slide view', 'slider' ) }
                        onClick={ () => setAttributes( { blockView: 'slide' } ) }
                    />
                    <ToolbarButton
                        icon={ formatListBullets }
                        label={ __( 'List view', 'slider' ) }
                        onClick={ () => setAttributes( { blockView: 'list' } ) }
                    />
                </ToolbarGroup>
            </BlockControls>

            <div className="swiper" data-view={ attributes.blockView } data-slide={ slide }>
                <div className="swiper-wrapper">
                    <InnerBlocks
                        allowedBlocks={ [ 'acv/slide' ] }
                        template={ Array(slides).fill( [ 'acv/slide' ] ) }
                        templateLock={ false } />
                </div>
                <div className="swiper-pagination">
                    { Array(slides).fill().map( ( value, index ) =>
                        <span className={ slide === ++index ? 'active' : '' } title={ __( 'show slide %d', 'slider' ).replace( '%d', index ) }
                              onClick={ () => setState( { slide: index } ) }>{ index }</span> ) }
                </div>
            </div>
        </>
    )
}

const SliderControl = compose( [
    withState(),
    withSelect( ( select, props ) => {
        return {
            slides: select( 'core/block-editor' ).getBlockCount( props.clientId )||1,
            slide: 1,
            ...props
        }
    } )
] )( SliderEdit )

const SliderBlock = registerBlockType( 'acv/slider', {
    title: __( 'Slider', 'slider' ),
    description: __( 'Swiper goes Gutenberg.', 'slider' ),
    icon: moreHorizontalMobile,
    category: 'media',
    // https://developer.wordpress.org/block-editor/reference-guides/block-api/block-supports/
    supports: {
        align: [ 'wide', 'full' ],
        color: true
    },

    attributes: {
        blockView: {
            type: 'string',
            default: 'slide' // 'list'
        },
        showOverflow: {
            type: 'boolean',
            default: false
        },

        // Swiper parameters

        a11y: {
            type: 'object',
            default: {}
        },

        autoHeight: {
            type: 'boolean',
            default: false
        },
        autoplay: {
            type: 'object',
            default: {}
        },
        centeredSlides: {
            type: 'boolean',
            default: false
        },
        direction: {
            type: 'string',
            default: 'horizontal'
        },
        freeMode: {
            type: 'boolean',
            default: false
        },
        effect: {
            type: 'string',
            default: 'slide'
        },
        keyboard: {
            type: 'boolean',
            default: false
        },
        loop: {
            type: 'boolean',
            default: false
        },
        mousewheel: {
            type: 'boolean',
            default: false
        },
        navigation: {
            type: 'boolean',
            default: false
        },
        pagination: {
            type: 'string',
            default: 'false'
        },
        releaseOnEdges: {
            type: 'boolean',
            default: false
        },
        rewind: {
            type: 'boolean',
            default: false
        },
        simulateTouch: {
            type: 'boolean',
            default: true
        },
        slidesPerGroup: {
            type: 'string',
            default: 'auto'
        },
        slidesPerView: {
            type: 'string',
            default: '1' // 'auto'
        },
        slideToClickedSlide: {
            type: 'boolean',
            default: false
        },
        spaceBetween: {
            type: 'string',
            default: '0'
        },
        speed: {
            type: 'string',
            default: '300'
        }
    },

    edit: ( props ) => {
        return <SliderControl { ...props } />
    },

    save: function( { attributes } ) {
        const parameters = { ...attributes }

        // remove default or empty values
        Object.keys( parameters ).map( ( attribute ) => {
            if ( !SliderBlock.attributes[attribute] // no swiper attribute
                || ['blockView','showOverflow'].indexOf( attribute ) >= 0 // no needed
                || SliderBlock.attributes[attribute].default === parameters[attribute] // is default value
                || parameters[attribute] === '' // is empty
            ) delete parameters[attribute]
        } )

        // 'auto' is not swiper default
        if ( !parameters.slidesPerGroup )
            parameters.slidesPerGroup = 'auto';

        // no autoplay at all
        if ( !parameters.autoplay?.delay )
            delete parameters['autoplay']

        return <div className={ 'swiper' + (attributes.showOverflow ? ' swiper-overflow-visible' : '') } data-swiper={ JSON.stringify( parameters ) }>
            <div className="swiper-wrapper">
                <InnerBlocks.Content />
            </div>
            { (parameters.navigation || parameters.pagination) && <div className="swiper-ui">
                { parameters.pagination && ( parameters.pagination === 'scrollbar'
                    ? <div className="swiper-scrollbar"></div> : <div className="swiper-pagination"></div> ) }
                { parameters.navigation && <div className="swiper-button-prev"></div> }
                { parameters.navigation && <div className="swiper-button-next"></div> }
            </div> }
        </div>
    }
} );

const SlideBlock = registerBlockType( 'acv/slide', {
    title: __( 'Slide', 'slider' ),
    parent: [ 'acv/slider' ],
    // https://developer.wordpress.org/block-editor/reference-guides/block-api/block-supports/
    supports: {
        color: true,
        anchor: true
    },

    edit: ( { clientId } ) => {
        return <>
            <InnerBlocks
                templateLock={ false }
                renderAppender={ () => (
                    <ButtonBlockAppender rootClientId={ clientId } />
                ) } />
        </>
    },

    save: () => {
        return <div className="swiper-slide"><InnerBlocks.Content /></div>
    }
} );
