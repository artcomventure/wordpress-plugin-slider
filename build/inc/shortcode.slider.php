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

	// calculate dimension
	// height always in % of width to be responsive
	if ( preg_match( '/((\d+)(px|%)?)((:|x)?((\d+)(px|%)?))?/', $attr['slider__dimension'], $dimension ) ) {
		$width = $dimension[2];
		$wUnit = $dimension[3];
		$height = $dimension[7];
		$hUnit = $dimension[8];

		// square
		if ( ! $dimension[5] || ! $height ) {
			$height = '100';
			$hUnit = '%';
		} // ratio
		elseif ( $dimension[5] == ':' ) {
			$height = $height * 100 / $width;
			$hUnit = '%';

			unset( $width, $wUnit );
		} // 'fixed' dimension
		else {
			if ( $hUnit != '%' ) {
				$height = $height * 100 / $width;
				$hUnit = '%';
			}
		}

		if ( ! empty( $width ) ) {
			$width .= ( $wUnit ? $wUnit : 'px' );
			$width = " style=\"width:$width;\"";
		}

		if ( ! empty( $height ) ) {
			$height .= $hUnit;
			if ( $hUnit == '%' ) {
				$height = " padding-top:$height;";
			} else {
				$height = " height:$height;";
			}
		}
	}

	// remove unneeded stuff
	$slider = preg_replace( array(
		'/gallery-columns-\d/',
		'/gallery-size-\w+/',
	), '', $slider );

	// 'gallery' to 'slider'
	$slider = preg_replace( '/gallery(?![\w])/', 'slider', $slider );

	// ...
	preg_match( '/<div([^>]*)>(.*)<\/div>/s', $slider, $slider );

	// number of slides
	$slides = substr_count( $slider[2], '</figure>' );

	if ( ! $slider[1] = shortcode_parse_atts( $slider[1] ) ) {
		$slider[1] = array();
	}

	// slider attributes
	$slider[1] = array_filter( array(
			'data-navigation' => $attr['slider__navigation'],
			'data-pager' => $attr['slider__pager'],
			'data-captions' => $attr['slider__captions'],
			'data-slides' => $slides,
			'data-slideshow' => $attr['slider__slideshow'],
			'data-duration' => $attr['slider__duration'],
			'data-columns' => ( isset( $attr['columns'] ) ? $attr['columns'] : 3 ),
		) ) + $slider[1];

	foreach ( $slider[1] as $attribute => &$value ) {
		$value = $attribute . '="' . $value . '"';
	}

	$slider[1][] = isset( $width ) ? $width : '';
	$slider[1] = implode( ' ', array_filter( $slider[1] ) );

	// markup
	$output = '<div ' . $slider[1] . '>';
	$output .= '<div class="slider__canvas">';
	$output .= '<div class="slides" style="left:0;' . ( isset( $height ) ? $height : '' ) . '">';
	$output .= $slider[2];
	$output .= '</div></div>';
	$output .= '<ul class="slider__pager"><li>' . implode( '</li><li>', range( 1, $slides ) ) . '</li></ul>';
	$output .= '<ul class="slider__navigation"><li>' . __( 'previous', 'slider' ) . '</li><li>' . __( 'next', 'slider' ) . '</li></ul>';
	$output .= '</div><!-- .slider -->';

	return $output;
}
