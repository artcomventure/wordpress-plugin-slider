<?php

/**
 * Wrapper for gallery slider.
 */
add_shortcode( 'slider', 'slider_shortcode' );
function slider_shortcode( $attr ) {
	if ( empty( $attr['slider'] ) ) {
		return '';
	}

	return gallery_shortcode( $attr );
}

/**
 * Change gallery to slider markup.
 */
add_filter( 'post_gallery', 'slider__post_gallery', 10, 3 );
function slider__post_gallery( $output, $attr, $instance ) {
	// no slider ... nothing to do
	if ( empty( $attr['slider'] ) ) {
		return FALSE;
	}

	// remove slider attributes to get standard gallery output
	$gallery_attr = $attr;
	foreach ( $gallery_attr as $key => $value ) {
		if ( preg_match( '/^slider/', $key ) ) {
			unset( $gallery_attr[$key] );
		}
	}

	// get gallery output
	$slider = gallery_shortcode( $gallery_attr );

	// merge defaults
	$attr += array(
		'slider' => '',
		'slider__navigation' => '',
		'slider__pager' => 'bottom',
		'slider__captions' => '',
		'slider__dimension' => '',
		'slider__slideshow' => '',
		'slider__duration' => '',
	);

	// remove unneeded stuff
	$slider = preg_replace( array(
		'/gallery-columns-\d/',
		'/gallery-size-\w+/',
	), '', $slider );

	// 'gallery' to 'slider'
	$slider = preg_replace( '/gallery(?![\w])/', 'slider', $slider );

	// ...
	preg_match( '/<div([^>]*)>(.*)<\/div>/s', $slider, $slider );

	if ( ! $slider[1] = shortcode_parse_atts( $slider[1] ) ) {
		$slider[1] = array();
	}

	// slider attributes
	$slider[1] = array_filter( array(
			'data-navigation' => $attr['slider__navigation'],
			'data-pager' => $attr['slider__pager'],
			'data-captions' => $attr['slider__captions'],
			'data-slideshow' => $attr['slider__slideshow'],
			'data-duration' => $attr['slider__duration'],
			'data-dimension' => $attr['slider__dimension'],
			'data-columns' => ( isset( $attr['columns'] ) ? $attr['columns'] : 3 ),
		) ) + $slider[1];

	foreach ( $slider[1] as $attribute => &$value ) {
		$value = $attribute . '="' . $value . '"';
	}

	$slider[1] = implode( ' ', array_filter( $slider[1] ) );

	// markup
	$output = '<div ' . $slider[1] . '>';
	$output .= '<div class="slides" style="left:0;">';
	$output .= $slider[2];
	$output .= '</div>';
	$output .= '</div><!-- .slider -->';

	return $output;
}
