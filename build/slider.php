<?php

/**
 * Plugin Name: Gallery Slider
 * Plugin URI: https://github.com/artcomventure/wordpress-plugin-slider
 * Description: Extends WP's gallery (media popup) with a slider option.
 * Version: 1.10.8
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
	// matching the shortcode name

	// get slider defaults
	$defaults = get_slider_defaults();  ?>

	<script type="text/html" id="tmpl-slider-setting">
		<h3 style="float:left;"><?php _e( 'Slider settings', 'slider' ); ?></h3>
		<label class="setting">
			<span><?php _e( 'Display as slider', 'slider' ) ?></span>
			<input data-setting="slider" type="checkbox" />
		</label>
		<label class="setting" title="<?php _e( 'Show next and previous buttons', 'slider' ); ?>">
			<span><?php _e( 'Show Navigation', 'slider' ) ?></span>
			<input data-setting="slider__navigation" value="true" type="checkbox"<?php checked( $defaults['navigation'], 'true' ); ?> />
		</label>
		<label class="setting">
			<span><?php _e( 'Show pager at', 'slider' ); ?></span>
			<select data-setting="slider__pager"><?php
				foreach ( array( 'bottom', 'top', 'none' ) as $position ) : ?>
					<option value="<?php echo $position ?>"<?php selected( $defaults['pager'], $position ); ?>>
						<?php _e( $position == 'none' ? 'nowhere' : $position, 'slider' ) ?>
					</option>
				<?php endforeach; ?></select>
		</label>
		<label class="setting">
			<span><?php _e( 'Animation', 'slider' ) ?></span>
			<input data-setting="slider__duration" type="text" placeholder="<?php echo $defaults['duration'] ?>"
			       title="<?php _e( 'Duration in milliseconds', 'slider' ) ?>"/>
		</label>
		<label class="setting">
			<span><?php _e( 'Jump', 'slider' ) ?></span>
			<input data-setting="slider__jump" type="text" placeholder="<?php echo $defaults['jump'] ?>"
			       title="<?php _e( 'Number of columns that will slided on slide action', 'slider' ) ?>"/>
		</label>
		<label class="setting" title="<?php _e( 'Springe vom letzten zum ersten Slide (und umgegehrt)', 'slider' ); ?>">
			<span><?php _e( 'Loop', 'slider' ) ?></span>
			<input data-setting="slider__loop" value="true" type="checkbox"<?php checked( $defaults['loop'], 'true' ); ?> />
		</label>
		<label class="setting">
			<span><?php _e( 'Slideshow', 'slider' ) ?></span>
			<input data-setting="slider__slideshow" type="text"
			       placeholder="<?php echo ( $defaults['slideshow'] ? $defaults['slideshow'] : __( 'Auto-slide in milliseconds', 'slider' ) ); ?>"
			       title="<?php _e( 'Auto-slide in milliseconds', 'slider' ) ?>"/>
		</label>
		<label class="setting">
			<span><?php _e( 'Dimension', 'slider' ) ?></span>
			<input data-setting="slider__dimension" type="text" placeholder="<?php echo $defaults['dimension'] ?>"/>
		</label>
		<label class="setting">
			<span><?php _e( 'Show Captions', 'slider' ) ?></span>
			<input data-setting="slider__captions" value="true" type="checkbox"<?php checked( $defaults['captions'], 'true' ); ?> />
		</label>
	</script>

	<script type="text/javascript">

		(function ($) {

			$(document).ready(function () {

				// original @see ROOT/wp-includes/js/media-editor.js line 611
				wp.media.gallery.setDefaults = function( attrs ) {
					var self = this, changed = ! _.isEqual( wp.media.galleryDefaults, wp.media._galleryDefaults );
					_.each( this.defaults, function( value, key ) {
						attrs[ key ] = self.coerce( attrs, key );
						if ( value === attrs[ key ] && ( ! changed || value === wp.media._galleryDefaults[ key ] ) ) {
							delete attrs[ key ];
						}
					} );

					// slider attrs
					_.each( <?php echo json_encode( $defaults ); ?>, function( value, key ) {
						key = 'slider__' + key;
						attrs[ key ] = self.coerce( attrs, key ) + '';
						if ( !attrs[ key ] || attrs[ key ] === 'undefined' || value === attrs[ key ] ) {
							delete attrs[ key ];
						}
					} );

					return attrs;
				};

				// merge default gallery settings template with yours
				wp.media.view.Settings.Gallery = wp.media.view.Settings.Gallery.extend({
					template: function (view) {
						return wp.media.template('gallery-settings')(view)
							+ wp.media.template('slider-setting')(view);
					},
					render: function () {
						wp.media.View.prototype.render.apply(this, arguments);

						// select the correct values
						_(this.model.attributes).chain().keys().each(this.update, this);

						var $columns = this.$('select[data-setting="columns"]'),
							$slider = this.$('input[data-setting="slider"]'),
							$sliderNavigation = this.$('input[data-setting="slider__navigation"]'),
							$sliderPager = this.$('select[data-setting="slider__pager"]'),
							$sliderDuration = this.$('input[data-setting="slider__duration"]'),
							$sliderJump = this.$('input[data-setting="slider__jump"]'),
							$sliderLoop = this.$('input[data-setting="slider__loop"]'),
							$sliderSlideshow = this.$('input[data-setting="slider__slideshow"]'),
							$sliderDimension = this.$('input[data-setting="slider__dimension"]'),
							$sliderCaptions = this.$('input[data-setting="slider__captions"]' );

						// disable columns select if slider is enabled
						function toggleColumns( e ) {
							var bIsSlider = $slider.is(':checked');

							// default gallery columns vs slider columns
							if ( !wp.media.frame.options.editing ) {
								$columns.val( bIsSlider && $columns.val() == wp.media.gallery.defaults.columns
									? <?php echo $defaults['columns']; ?>
									: ( !bIsSlider && $columns.val() == <?php echo $defaults['columns']; ?> ? wp.media.gallery.defaults.columns : $columns.val() )
								).trigger( 'change' );
							}

							$sliderNavigation.prop('disabled', !bIsSlider);
							$sliderPager.prop('disabled', !bIsSlider);
							$sliderDuration.prop('disabled', !bIsSlider);
							$sliderJump.prop('disabled', !bIsSlider);
							$sliderLoop.prop('disabled', !bIsSlider);
							$sliderSlideshow.prop('disabled', !bIsSlider);
							$sliderDimension.prop('disabled', !bIsSlider);
							$sliderCaptions.prop('disabled', !bIsSlider);
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
	wp_enqueue_style( 'slider', SLIDER_PLUGIN_URL . 'css/slider.min.css', array(), '1.10.1' );
	wp_add_inline_style( 'slider', '.slider-attached {
	margin-bottom: 1.5em;
}

.slider-attached.gallery {
    margin-right: auto;
    margin-left: auto;
}' );

	wp_enqueue_script( 'slider', SLIDER_PLUGIN_URL . 'js/slider.min.js', array(), '1.8.3', TRUE );
	wp_add_inline_script( 'slider', "(function ( window, document, undefined ) {

	document.addEventListener( 'DOMContentLoaded', function () {

        // initial call for sliders
        // ... for all elements with the class 'slider'
        new Slider( '.slider' );

    } );

    // wait till resource and its dependent resources have finished loading
    document.addEventListener( 'load', function () {

        var \$sliders = document.getElementsByClassName( 'slider-attached' ),
            \$slider, i = 0;

        while ( \$slider = \$sliders[i++] ) {
            // ... calculate whether the slider image has to cover width or height
            \$slider.slider( 'set', 'dimension', \$slider.slider( 'get', 'dimension' ) );
        }

    } );

})( this, this.document );" );
}

// editor styles
add_action( 'admin_head', 'slider__admin_head' );
function slider__admin_head() {
	add_editor_style( plugins_url( '/css/editor.min.css?', __FILE__ ) . '?' . time() );
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

/**
 * Includes.
 */

require SLIDER_PLUGIN_DIR . 'inc/settings.php';
require SLIDER_PLUGIN_DIR . 'inc/featured-slider.php';
// auto include shortcodes
foreach ( scandir( SLIDER_PLUGIN_DIR . 'inc' ) as $file ) {
	if ( ! preg_match( '/shortcode\..+\.php/', $file ) ) {
		continue;
	}

	require SLIDER_PLUGIN_DIR . 'inc/' . $file;
}
