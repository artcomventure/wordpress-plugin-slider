<?php

/**
 * Return array of options.
 */
function get_slider_options( $js_defaults = false ) {
	// same as js defaults
	$defaults = array(
		'startSlide' => '1',
		'duration' => '500',
		'loop' => 'true',
		'pager' => 'bottom',
		'navigation' => 'false',
		'dimension' => '16:9',
		'columns' => '1',
		'jump' => 'columns',
		'slideshow' => '',
		'captions' => 'false'
	);

	// return js defaults
	if ( $js_defaults ) return $defaults;

	// get options ans merge defaults
	return array_filter( get_option( 'slider', array() ) ) + $defaults;
}

/**
 * Register settings options.
 */
add_action( 'admin_init', 'slider__admin_init' );
function slider__admin_init() {
	register_setting( 'slider', 'slider' );
}

/**
 * Register APIs options pages.
 */
add_action( 'admin_menu', 'slider__admin_menu' );
function slider__admin_menu() {
	add_options_page(
		__( 'Gallery Slider', 'slider' ),
		__( 'Gallery Slider', 'slider' ),
		'manage_options',
		'slider',
		'slider_options_page'
	);
}

/**
 * Social options page markup.
 */
function slider_options_page() {
	include( SLIDER_PLUGIN_DIR . 'inc/settings.options-page.php' );
}
