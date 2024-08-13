<?php

//return;

/**
 * Enqueue gutenberg block styles and scripts.
 */
function register_slider() {
    // automatically load dependencies and version
    $asset_file = include(SLIDER_DIRECTORY . 'build/block.asset.php');

    wp_register_script(
        'slider-be-js',
        SLIDER_DIRECTORY_URI . 'build/block.js',
        $asset_file['dependencies'],
        $asset_file['version']
    );

    wp_set_script_translations( 'slider-be-js', 'slider', SLIDER_DIRECTORY . 'languages' );

    wp_register_style(
        'slider-be-css',
        SLIDER_DIRECTORY_URI . 'css/gutenberg.css',
        array(),
        filemtime(SLIDER_DIRECTORY . 'css/gutenberg.css')
    );

    register_block_type( 'acv/slider', array(
        'editor_script' => 'slider-be-js',
        'editor_style' => 'slider-be-css',
    ) );
}
add_action( 'init', 'register_slider' );

// change i18n json file name to `LOCALE-HASH.json` like created by `wp i18n make-json`
add_filter( 'load_script_translation_file', function( $file, $handle, $domain ) {
    if ( $file && $domain == 'slider' ) {
        if ( $handle == 'slider-be-js' ) {
            $md5 = md5('build/block.js' );
            $file = preg_replace( '/slider-\/' . $domain . '-([^-]+)-.+\.json$/', "/slider-$1-{$md5}.json", $file );
        }
    }

    return $file;
}, 10, 3 );

// allow slider block by default
add_filter( 'allowed_block_types_all', 'allow_slider_block', 11, 2 );
function allow_slider_block( $allowed_blocks, $post ) {
    if ( is_array( $allowed_blocks ) ) {
    	$allowed_blocks[] = 'acv/slider';
    	$allowed_blocks[] = 'acv/slide';
    }
    return $allowed_blocks;
}

// add default styles to Gutenberg
add_action( 'after_setup_theme', function() {
	add_theme_support( 'editor-styles' );
	// relative path from `functions.php`
	add_editor_style(  '../../plugins/slider/lib/swiper/swiper-bundle.min.css' );
	add_editor_style(  '../../plugins/slider/css/slider.css' );
}, 11 );
