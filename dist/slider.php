<?php

/**
 * Plugin Name: Slider
 * Description: Swiper goes Gutenberg.
 * Version: 3.1.1
 * Text Domain: slider
 * Author: artcom venture GmbH
 * Author URI: http://www.artcom-venture.de/
 */

if ( ! defined( 'SLIDER_DIRECTORY_URI' ) ) {
    define( 'SLIDER_DIRECTORY', plugin_dir_path( __FILE__ ) );
}

if ( ! defined( 'SLIDER_DIRECTORY_URI' ) ) {
    define( 'SLIDER_DIRECTORY_URI', plugin_dir_url( __FILE__ ) );
}

/**
 * Since this plugin is not listed on https://wordpress.org/plugins/
 * we remove any update notification in case of _name overlaps_.
 */
add_filter( 'site_transient_update_plugins', function( $value ) {
	if ( isset( $value->response[$plugin_file = plugin_basename( __FILE__ )] ) ) {
		unset( $value->response[$plugin_file] );
	}

	return $value;
} );

// t9n
add_action( 'after_setup_theme', function() {
    load_theme_textdomain( 'slider', SLIDER_DIRECTORY . '/languages' );
} );

/**
 * Enqueue frontend scripts and styles.
 */
function slider_scripts() {
    wp_register_script( 'swiper', SLIDER_DIRECTORY_URI . 'lib/swiper/swiper-bundle.min.js', array(), '8.1.5', true );
	wp_enqueue_script( 'slider', SLIDER_DIRECTORY_URI . 'js/slider.min.js', array( 'swiper' ), '3.0.0', true );

    wp_register_style( 'swiper', SLIDER_DIRECTORY_URI . 'lib/swiper/swiper-bundle.min.css', array(), '8.1.5' );
    wp_enqueue_style( 'slider', SLIDER_DIRECTORY_URI . 'css/slider.css', array( 'swiper' ), filemtime( SLIDER_DIRECTORY . '/css/slider.css' ) );
}
add_action( 'wp_enqueue_scripts', 'slider_scripts', 11 );

// auto-include first level `/inc/` files
if ( $inc = opendir( $path = dirname( __FILE__ ) . '/inc' ) ) {
    while ( ($file = readdir( $inc )) !== false ) {
        if ( !preg_match( '/\.php$/', $file ) ) continue;
        require $path . '/' . $file;
    }

    closedir( $inc );
}
