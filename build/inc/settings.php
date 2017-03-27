<?php

/**
 * Return array of default slider configuration.
 */
function get_slider_defaults( $js_defaults = FALSE ) {
	// backward compatibility <= 1.9.0
	if ( $slider = get_option( 'slider' ) ) {
		// save options to new option name
		update_option( 'slider_defaults', $slider );
		delete_option( 'slider' );
	}

	// same as js defaults
	$defaults = array(
		'startSlide' => '1',
		'duration'   => '500',
		'loop'       => 'true',
		'pager'      => 'bottom',
		'navigation' => 'false',
		'dimension'  => '16:9',
		'columns'    => '1',
		'jump'       => 'columns',
		'slideshow'  => '',
		'captions'   => 'false'
	);

	// return js defaults
	if ( $js_defaults ) {
		return $defaults;
	}

	// get options ans merge defaults
	return array_filter( get_option( 'slider_defaults', array() ) ) + $defaults;
}

/**
 * ...
 */
function get_featured_slider_post_types( $is_enabled = true ) {
	$option = get_option( 'featured_slider', array() );
	if ( !is_array( $option ) ) $option = array();

	// all available post types
	$post_types = array_filter( get_post_types(), function ( $post_type ) {
		return ! in_array( $post_type, array( 'revision', 'nav_menu_item', 'attachment', 'customize_changeset', 'custom_css' ) );
	} );

	// merge post types
	foreach ( $post_types as $post_type ) {
		if ( ! array_key_exists( $post_type, $option ) ) {
			$option[ $post_type ] = 0;
		}
	}

	// check if post types still exists
	foreach ( $option as $post_type => $enabled ) {
		if ( ! array_key_exists( $post_type, $post_types ) ) {
			unset( $option[ $post_type ] );
		}
	}

	// get post type objects
	foreach ( $post_types as $post_type => $post_type_name ) {
		$post_types[$post_type] = get_post_type_object( $post_type );
	}

	// only return enabled post types
	if ( $is_enabled ) $option = array_filter( $option );

	// sort by post type label
	uksort ($option, function( $a, $b ) use ( $post_types ) {
		return $post_types[$a]->name > $post_types[$b]->name;
	} );

	return $option;
}

/**
 * Set SliderDefaults variable.
 */
add_action( 'wp_enqueue_scripts', 'slider_settings_scripts' );
function slider_settings_scripts() {
	$slider_defaults = get_slider_defaults( true );
	$options = get_slider_defaults();
	foreach ( $slider_defaults as $option => $value ) {
		if ( empty( $options[$option] ) || $slider_defaults[$option] == $options[$option] ) {
			unset( $options[$option] );
		}
	}

	// nothing to override
	if ( !$options ) return;

	wp_add_inline_script( 'slider', "
// override js' defaults
Sliders.setDefaults( " . json_encode( $options ) . " );" );
}

/**
 * Register settings options.
 */
add_action( 'admin_init', 'slider__admin_init' );
function slider__admin_init() {
	register_setting( 'slider', 'slider_defaults' );
	register_setting( 'slider', 'featured_slider' );
}

/**
 * Register APIs options pages.
 */
add_action( 'admin_menu', 'slider__admin_menu' );
function slider__admin_menu() {
	$options_page = add_options_page(
		__( 'Gallery Slider', 'slider' ),
		__( 'Gallery Slider', 'slider' ),
		'manage_options',
		'options-slider',
		'slider_options_page'
	);

	add_action( 'admin_enqueue_scripts', function ( $hook ) use ( $options_page ) {
		if ( $hook !== $options_page ) return;

		wp_enqueue_script( 'slider-settings', SLIDER_PLUGIN_URL . 'js/settings.options-page.min.js', array( 'jquery' ), '1.0.0', TRUE );
	} );
}

/**
 * Social options page markup.
 */
function slider_options_page() {
	include( SLIDER_PLUGIN_DIR . 'inc/settings.options-page.php' );
}
