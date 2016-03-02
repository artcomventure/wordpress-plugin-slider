<?php

/**
 * 'Override' (in this case: extend) WP's gallery shortcode.
 */
remove_shortcode( 'gallery' );
add_shortcode( 'gallery', 'slider__gallery_shortcode' );
function slider__gallery_shortcode( $atts ) {
	$gallery = gallery_shortcode( $atts );

	// no slider ... use WP's gallery
	if ( empty( $atts['slider'] ) ) {
		return $gallery;
	}

	$slider = $gallery;
	unset( $gallery );

	$atts += array(
		'slider' => '',
		'slider__navigation' => '',
		'slider__pager' => 'none',
		'slider__dimension' => '',
		'slider__slideshow' => '',
		'slider__duration' => '',
	);

	// dimension
	if ( preg_match( '/((\d+)(px|%)?)((:|x)?((\d+)(px|%)?))?/', $atts['slider__dimension'], $dimension ) ) {
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

	// ...
	if ( ! preg_match( '/data-src="([^"]*?)"/', $slider ) ) {
		// image src to background
		$slider = preg_replace( '/src="([^"]*?)"/', 'src="' . includes_url( '/images/blank.gif' ) . '" style="background-image:url($1)"', $slider );
	}
	// 'gallery' to 'slider'
	$slider = preg_replace( '/gallery(?![\w])/', 'slider', $slider );
	// remove unneeded stuff
	$slider = preg_replace( array(
		'/slider-columns-\d/',
		'/slider-size-(\w)+/',
	), '', $slider );

	// ...
	preg_match( '/<div([^>]*)>(.*)<\/div>/s', $slider, $slider );

	// number of slides
	$slides = substr_count( $slider[2], '</figure>' );

	if ( ! $slider[1] = shortcode_parse_atts( $slider[1] ) ) {
		$slider[1] = array();
	}

	// slider attributes
	$slider[1] = array_filter( array(
			'data-navigation' => $atts['slider__navigation'],
			'data-pager' => $atts['slider__pager'],
			'data-slides' => $slides,
			'data-slideshow' => $atts['slider__slideshow'],
			'data-duration' => $atts['slider__duration'],
		) ) + $slider[1];

	foreach ( $slider[1] as $attribute => &$value ) {
		$value = $attribute . '="' . $value . '"';
	}

	$slider[1][] = isset( $width ) ? $width : '';
	$slider[1] = implode( ' ', array_filter( $slider[1] ) );

	return '<div ' . $slider[1] . '><div class="slides" style="left:0;' . ( isset( $height ) ? $height : '' ) . '">'
	       . $slider[2] . '</div><ul class="slider__pager"><li>' . implode( '</li><li>', range( 1, $slides ) ) . '</li></ul>'
	       . '<ul class="slider__navigation"><li>' . __( 'previous' ) . '</li><li>' . __( 'next' ) . '</li></ul></div>';
}
