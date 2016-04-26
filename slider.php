<?php

/**
 * Plugin Name: Gallery Slider
 * Plugin URI: https://github.com/artcomventure/wordpress-plugin-slider
 * Description: Extends WP's gallery (media popup) with a slider option.
 * Version: 1.4.1
 * Text Domain: slider
 * Author: artcom venture GmbH
 * Author URI: http://www.artcom-venture.de/
 */

if ( ! defined( 'SLIDER_PLUGIN_URL' ) ) {
	define( 'SLIDER_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
}

if ( ! defined( 'SLIDER_PLUGIN_DIR' ) ) {
	define( 'SLIDER_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
}

/**
 * Extend media upload.
 */
add_action( 'print_media_templates', 'slider__print_media_templates' );
function slider__print_media_templates() {
	// the "tmpl-" prefix is required,
	// and your input field should have a data-setting attribute
	// matching the shortcode name ?>

	<script type="text/html" id="tmpl-slider-setting">
		<h3 style="float:left;"><?php _e( 'Slider settings', 'slider' ); ?></h3>
		<label class="setting">
			<span><?php _e( 'Display as slider', 'slider' ) ?></span>
			<input data-setting="slider" type="checkbox"/>
		</label>
		<label class="setting" title="<?php _e( 'next and previous button', 'slider' ); ?>">
			<span><?php _e( 'Show Navigation', 'slider' ) ?></span>
			<input data-setting="slider__navigation" type="checkbox"/>
		</label>
		<label class="setting">
			<span><?php _e( 'Show pager at', 'slider' ); ?></span>
			<select data-setting="slider__pager">
				<option value="bottom"><?php _e( 'bottom', 'slider' ); ?></option>
				<option value="top"><?php _e( 'top', 'slider' ); ?></option>
				<option value="left"><?php _e( 'left', 'slider' ); ?></option>
				<option value="right"><?php _e( 'right', 'slider' ); ?></option>
				<option value="none"><?php _e( 'nowhere', 'slider' ); ?></option>
			</select>
		</label>
		<label class="setting">
			<span><?php _e( 'Show Captions', 'slider' ) ?></span>
			<input data-setting="slider__captions" type="checkbox"/>
		</label>
		<label class="setting">
			<span><?php _e( 'Slideshow', 'slider' ) ?></span>
			<input data-setting="slider__slideshow" type="text"
			       placeholder="<?php _e( 'Auto-slide in milliseconds', 'slider' ) ?>"
			       title="<?php _e( 'Auto-slide in milliseconds', 'slider' ) ?>"/>
		</label>
		<label class="setting">
			<span><?php _e( 'Animation', 'slider' ) ?></span>
			<input data-setting="slider__duration" type="text" placeholder="500"
			       title="<?php _e( 'Duration in milliseconds', 'slider' ) ?>"/>
		</label>
		<label class="setting">
			<span><?php _e( 'Dimension', 'slider' ) ?></span>
			<input data-setting="slider__dimension" type="text" placeholder="16:9"/>
		</label>
	</script>

	<script type="text/javascript">

		(function ($) {

			$(document).ready(function () {

				// default values
				_.extend(wp.media.gallery.defaults, {
					slider: false,
					slider__navigation: false,
					slider__pager: 'bottom',
					slider__captions: false,
					slider__dimension: '',
					slider__slideshow: '',
					slider__duration: ''
				});

				// merge default gallery settings template with yours
				wp.media.view.Settings.Gallery = wp.media.view.Settings.Gallery.extend({
					template: function (view) {
						return wp.media.template('gallery-settings')(view)
							+ wp.media.template('slider-setting')(view);
					},
					render: function () {
						wp.media.View.prototype.render.apply(this, arguments);

						// Select the correct values.
						_(this.model.attributes).chain().keys().each(this.update, this);

						var $slider = this.$('input[data-setting="slider"]'),
							$sliderNavigation = this.$('input[data-setting="slider__navigation"]'),
							$sliderPager = this.$('select[data-setting="slider__pager"]'),
							$sliderCaptions = this.$('input[data-setting="slider__captions"]'),
							$sliderDimension = this.$('input[data-setting="slider__dimension"]'),
							$sliderDuration = this.$('input[data-setting="slider__duration"]'),
							$sliderSlideshow = this.$('input[data-setting="slider__slideshow"]');

						// disable columns select if slider is enabled
						function toggleColumns() {
							var bIsSlider = $slider.is(':checked');

							$sliderNavigation.prop('disabled', !bIsSlider);
							$sliderPager.prop('disabled', !bIsSlider);
							$sliderCaptions.prop('disabled', !bIsSlider);
							$sliderDimension.prop('disabled', !bIsSlider);
							$sliderDuration.prop('disabled', !bIsSlider);
							$sliderSlideshow.prop('disabled', !bIsSlider);
						}

						toggleColumns(); // on initial popup
						$slider.on('change', toggleColumns); // ...

						return this;
					}
				});

			});

		})(jQuery);

	</script>
<?php
}

/**
 * Enqueue scripts and styles.
 */
add_action( 'wp_enqueue_scripts', 'slider_scripts' );
function slider_scripts() {
	wp_enqueue_style( 'slider', SLIDER_PLUGIN_URL . 'css/slider.min.css', array(), '1.3.4' );
	wp_enqueue_script( 'slider', SLIDER_PLUGIN_URL . 'js/slider.min.js', array(), '1.3.3', TRUE );
}

/**
 * t9n.
 */
add_action( 'after_setup_theme', 'slider__after_setup_theme' );
function slider__after_setup_theme() {
	load_theme_textdomain( 'slider', SLIDER_PLUGIN_DIR . 'languages' );
}

/**
 * Remove update notification
 * ... due to 'update conflicts' with an other slider plugin
 */
add_filter( 'site_transient_update_plugins', 'slider__site_transient_update_plugins' );
function slider__site_transient_update_plugins( $value ) {
	$plugin_file = plugin_basename( __FILE__ );

	if ( isset( $value->response[ $plugin_file ] ) ) {
		unset( $value->response[ $plugin_file ] );
	}

	return $value;
}

/**
 * Change details link to GitHub repository.
 */
add_filter( 'plugin_row_meta', 'slider__plugin_row_meta', 10, 2 );
function slider__plugin_row_meta( $links, $file ) {
	if ( plugin_basename( __FILE__ ) == $file ) {
		$plugin_data = get_plugin_data( WP_PLUGIN_DIR . '/' . $file );

		$links[2] = '<a href="' . $plugin_data['PluginURI'] . '">' . __( 'Plugin-Seite aufrufen' ) . '</a>';
	}

	return $links;
}

// auto include shortcodes
foreach ( scandir( SLIDER_PLUGIN_DIR . 'inc' ) as $file ) {
	if ( ! preg_match( '/shortcode\..+\.php/', $file ) ) {
		continue;
	}

	require SLIDER_PLUGIN_DIR . 'inc/' . $file;
}
