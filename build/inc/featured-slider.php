<?php

/**
 * Adds custom classes to the array of post classes.
 * `has-post-thumbnail` vs `has-post-slider`
 *
 * @param array $classes Classes for the body element.
 * @return array
 */
add_filter( 'post_class', 'featured_slider__post_classes' );
function featured_slider__post_classes( $classes ) {
	if ( ($post = get_post()) && featured_slider_is_supported( $post->post_type )  ) {
		$fspt = get_featured_slider_post_types();
		if ( array_key_exists( $post->post_type, $fspt )
		     && ($fspt[$post->post_type] == '2'
		         || ($fspt[$post->post_type] == 1 && is_singular( $post->post_type ))
		     )
		) {
			if ( $shortcode = get_post_meta( $post->ID, '_featured_slider', true ) ) {
				$atts = shortcode_parse_atts( trim( $shortcode, '[]' ) );
				if ( count(explode( ',', $atts['ids'] )) > 1 ) {
					$classes = array_values($classes);
					array_splice( $classes, array_search( 'has-post-thumbnail', $classes ), 1);
					$classes[] = 'has-post-slider';
				}
			}
		}
	}

	return $classes;
}

/**
 * Display the feature slider.
 */
function the_featured_slider( $post = null ) {
	echo get_the_featured_slider( $post );
}

/**
 * Retrieve the feature slider.
 */
function get_the_featured_slider( $post = null ) {
	$post = get_post( $post );
	if ( ! $post || !featured_slider_is_supported( $post->post_type ) || !( $shortcode = get_post_meta( $post->ID, '_featured_slider', true ) ) ) {
		return '';
	}

	return apply_filters( 'featured_slider_html', do_shortcode( $shortcode ), $post->ID, $shortcode );
}

/**
 * Check if theme/post type supports post thumbnails and thereby supports featured slider.
 *
 * @param null|string|WP_Post_Type $post_type Optional. Post type ID or WP_Post_Type object. Default is `null`.
 * @return bool Whether featured slider is supported or not.
 */
function featured_slider_is_supported( $post_type = null ) {
	if ( !$post_type ) $post_type = get_post_type(); // get current post type
    if ( is_string( $post_type ) ) $post_type = get_post_type_object( $post_type );
    if ( !$post_type ) return false;

	return (bool) current_theme_supports( 'post-thumbnails' ) && post_type_supports( $post_type->name, 'thumbnail' ) || 'revision' === $post_type->name;
}

/**
 * Override thumbnail html with featured slider html.
 * ... but only if slider replacement is needed (> 1 image selected). Otherwise show standard post thumbnail.
 */
add_filter( 'post_thumbnail_html', 'featured_slider__post_thumbnail_html', 10, 5 );
function featured_slider__post_thumbnail_html( $html, $post_id, $post_thumbnail_id, $size, $attr ) {
	if ( ( $post = get_post( $post_id ) ) && ( $featured_slider_enabled_post_types = get_featured_slider_post_types() ) ) {
		if ( array_key_exists( $post->post_type, $featured_slider_enabled_post_types ) && featured_slider_is_supported( $post->post_type ) ) {
			$post_thumnbail = $html;

			$atts = shortcode_parse_atts( trim( get_post_meta( $post->ID, '_featured_slider', true ), '[]' ) );
			if ( $atts && count(explode( ',', $atts['ids'] )) > 1 ) {
				switch ( $featured_slider_enabled_post_types[$post->post_type] ) {
					case '1':
						if ( !is_singular( $post->post_type ) ) break;

					case '2':
						if ( !$html = get_the_featured_slider( $post ) ) {
							// fallback to default post thumbnail
							$html = $post_thumnbail;
						}
						break;
				}
			}
		}
	}

	return $html;
}

/**
 * Post (featured) slider meta box.
 */
add_action( 'add_meta_boxes', 'featured_slider__meta_box' );
function featured_slider__meta_box() {
	foreach ( get_featured_slider_post_types() as $post_type => $enabled ) {
	    if ( !featured_slider_is_supported( $post_type ) ) continue;

		add_meta_box( 'featuredsliderdiv', __( 'Featured Slider', 'slider' ), 'featured_slider_meta_box', $post_type, 'side' );
		remove_meta_box( 'postimagediv', $post_type, 'side' );
	}
}

/**
 * Display post slider meta box.
 */
function featured_slider_meta_box( $post ) {
	$featured_slider = get_post_meta( $post->ID, '_featured_slider', TRUE );
	echo _slider_featured_slider_html( $featured_slider, $post->ID );
}

/**
 * @see ROOT/wp-admin/includes/post.php:_wp_post_thumbnail_html()
 */
function _slider_featured_slider_html( $featured_slider = NULL, $post = NULL, $thumbnail_id = null ) {
	$post = get_post( $post );
	$set_thumbnail_link = '<p class="hide-if-no-js"><a href="%s" id="set-featured-slider"%s class="thickbox">%s</a></p>';
	$upload_iframe_src  = get_upload_iframe_src( 'image', $post->ID );

	$content = sprintf( $set_thumbnail_link, esc_url( $upload_iframe_src ), '', __( 'Set featured slider', 'slider' ) );
	$content .= '<p class="hide-if-no-js howto" id="set-featured-slider-desc">'
	            . __( 'The first image will be used as the featured image.', 'slider' ) . '</p>';

	if ( $featured_slider ) {
		$pattern = get_shortcode_regex();
		preg_match( "/$pattern/", $featured_slider, $atts );

		if ( ( $atts = shortcode_parse_atts( trim( $atts[3] ) ) ) && !empty( $atts['ids'] ) ) {
			$atts['ids']  = explode( ',', $atts['ids'] );
			$thumbnail_id = $atts['ids'][0];

			$size = isset( $_wp_additional_image_sizes['post-thumbnail'] ) ? 'post-thumbnail' : array( 266, 266 );
			$size = apply_filters( 'admin_post_thumbnail_size', $size, $thumbnail_id, $post );

			$thumbnail_html = wp_get_attachment_image( $thumbnail_id, $size );

			if ( ! empty( $thumbnail_html ) ) {
				$content = sprintf( $set_thumbnail_link,
					esc_url( $upload_iframe_src ),
					' aria-describedby="set-post-thumbnail-desc"',
					$thumbnail_html
				);
				$content .= '<p class="hide-if-no-js howto" id="set-featured-slider-desc">' . __( 'Click the featured image to edit or update this and the featured slider.', 'slider' ) . '</p>';
				$content .= '<p class="hide-if-no-js"><a href="#" id="remove-featured-slider">' . __( 'Remove featured slider', 'slider', 'slider' ) . '</a></p>';
			}
		}
	}

	$content .= wp_nonce_field( 'post_slider__save_post', 'post_slider_nonce', true, false );

	$content .= '<input type="hidden" id="_thumbnail_id" name="_thumbnail_id" value="' . esc_attr( $thumbnail_id ? $thumbnail_id : '-1' ) . '" />';
	$content .= '<input type="hidden" id="_featured_slider" name="_featured_slider" value="' . esc_attr( $featured_slider ? $featured_slider : '-1' ) . '" />';

	// since 4.7.0 WP got wp_doing_ajax()
	// but to keep it a little bit more backward capability ...
	if ( apply_filters( 'wp_doing_ajax', defined( 'DOING_AJAX' ) && DOING_AJAX ) && $featured_slider !== get_post_meta( $post->ID, '_featured_slider', true ) ) {
		$post_type_object   = get_post_type_object( $post->post_type );

		$content = '<div class="notice notice-info inline"><p>'
		           . sprintf( __( "Don't forget to save this %s to make your changes effective.", 'slider' ), $post_type_object->labels->singular_name ) . '</p></div>' . $content;
	}

	return apply_filters( 'admin_featured_slider_html', $content, $post->ID, $featured_slider, $thumbnail_id );
}

/**
 * ...
 */
add_action( 'admin_enqueue_scripts', 'featured_slider_style' );
function featured_slider_style() {
    if ( featured_slider_is_supported() ) return;
    wp_enqueue_style( 'featured-slider-div', SLIDER_PLUGIN_URL . 'css/featured-slider.css' );
}

/**
 * Ajax handler for retrieving HTML for the featured slider.
 *
 * @since 1.10.0
 */
add_action( 'wp_ajax_get-post-slider-html', 'wp_ajax_get_post_slider_html', 1 );
function wp_ajax_get_post_slider_html() {
	$post_ID = intval( $_POST['post_id'] );

	check_ajax_referer( "update-post_$post_ID" );

	if ( ! current_user_can( 'edit_post', $post_ID ) ) {
		wp_die( - 1 );
	}

	$featured_slider = wp_kses_stripslashes( $_POST['featured_slider'] );

	if ( -1 === $featured_slider ) {
		$featured_slider = null;
	}

	$return = _slider_featured_slider_html( $featured_slider, $post_ID );
	wp_send_json_success( $return );
}

/**
 * Extend media upload.
 */
add_action( 'print_media_templates', 'post_slider__print_media_templates' );
function post_slider__print_media_templates() { ?>
	<script type="text/javascript">

		(function ( $ ) {

			$( document ).ready( function () {

				// this is a mixture of wp.media.gallery (wp.media.collection)
				// and wp.media.featuredImage

				wp.media.featuredSlider = _.extend( {}, wp.media.gallery, {
					set: function( featured_slider ) {
						var settings = wp.media.view.settings;

						wp.media.post( 'get-post-slider-html', {
							post_id: settings.post.id,
							featured_slider: featured_slider,
							_wpnonce: settings.post.nonce
						} ).done( function ( html ) {
							if ( html == '0' ) {
								window.alert( <?php __( 'Could not set featured post slider. Please try again.', 'slider' ); ?> );
								return;
							}

							$( '.inside', '#featuredsliderdiv' ).html( html );
						} );
					},

					edit: function ( content ) {
						var shortcode = wp.shortcode.next( this.tag, content ),
							attributes = {
								frame: 'post',
								state: 'gallery-library',
								title: this.editTitle,
								editing: false,
								multiple: true
							};

						if ( !!shortcode && shortcode.content === content ) {
							shortcode = shortcode.shortcode;

							if ( _.isUndefined( shortcode.get('id') ) && ! _.isUndefined( this.defaults.id ) ) {
								shortcode.set( 'id', this.defaults.id );
							}

							var attachments = this.attachments( shortcode ),
								selection = new wp.media.model.Selection( attachments.models, {
									props: attachments.props.toJSON(),
									multiple: true
								} );

							selection[ this.tag ] = attachments[ this.tag ];

							selection.more().done( function() {
								selection.props.set({ query: false });
								selection.unmirror();
								selection.props.unset('orderby');
							} );

							attributes.selection = selection;
							attributes.state = 'gallery-edit';
							attributes.editing = true;
						}

						// destroy the previous gallery frame
						if ( this.frame ) this.frame.dispose();

						this.frame = wp.media( attributes ).open();

						return this.frame;
					},

					// change frame title aka 'gallery' vs 'slider'
					changeFrameTitle: function( $title ) {
						if ( !$title ) $title = $( wp.media.featuredSlider.frame.title.selector ).find( 'h1' );
						else $title = $title.$el;

						$title.html( {
							'gallery-library': '<?php _e( 'Add to slider', 'slider' ) ?>',
							'gallery-edit': '<?php _e( 'Edit Slider', 'slider' ) ?>'
						}[wp.media.featuredSlider.frame.state().get( 'id' )]||$title.html() )
					},

					// change frame button text aka 'gallery' vs 'slider'
					changeFrameActionText: function() {
						setTimeout( function() {
							$( wp.media.featuredSlider.frame.toolbar.selector ).find( 'button.button-primary' ).html( {
								'gallery-library': '<?php _e( 'Add to slider', 'slider' ) ?>',
								'gallery-edit': ( wp.media.featuredSlider.frame.options.editing ? '<?php _e( 'Update Slider', 'slider' ) ?>' : '<?php _e( 'Set Slider', 'slider' ) ?>' )
							}[wp.media.featuredSlider.frame.state().get( 'id' )]||$title.html() );
						}, 1 );
					},

					init: function () {
						$( '#featuredsliderdiv' ).on( 'click', '#set-featured-slider', function ( e ) {
							e.preventDefault();
							// stop propagation to prevent thickbox from activating
							e.stopPropagation();

							wp.media.featuredSlider.edit( $( '#_featured_slider' ).val() )
								.on( 'selection:toggle', wp.media.featuredSlider.changeFrameActionText )
								// change 'gallery' strings to 'slider'
								.on( 'uploader:ready', function() {
									var menuLabels = {};
									menuLabels[$.parseHTML( '<?php _e( '&#8592; Cancel Gallery' ) ?>' )[0].data] = '<?php _e( '&#8592; Cancel Slider', 'slider' ) ?>';

									menuLabels = _.extend( menuLabels, {
										'<?php _e( 'Edit Gallery' ) ?>': '<?php _e( 'Edit Slider', 'slider' ) ?>',
										'<?php _e( 'Add to gallery' ) ?>': '<?php _e( 'Add to slider', 'slider' ) ?>'
									} );

									$( wp.media.featuredSlider.frame.menu.selector ).find( 'a' ).each( function() {
										var $item = $( this ),
											sItemText = $item.text();

										$item.html( menuLabels[sItemText]||sItemText )
									} );

									wp.media.featuredSlider.changeFrameTitle();

									// and do 'activate' event stuff (@see next event)
									this.trigger( 'activate' );
								} )
								// force slider
								.on( 'toolbar:render', wp.media.featuredSlider.changeFrameActionText )
								.on( 'uploader:ready activate', function() {
									if ( wp.media.featuredSlider.frame.state().get( 'id' ) !== 'gallery-edit' ) return;

									$( 'input[data-setting="slider"]' ).prop( 'checked', true ).trigger( 'change' )
										.prop( 'disabled', true );
								} )
								// change title's 'gallery' to 'slider'
								.on( 'title:render', wp.media.featuredSlider.changeFrameTitle )
								// insert/update slider
								.on( 'update', function () {
									var shortcode = wp.media.featuredSlider.shortcode( wp.media.featuredSlider.frame.state().get( 'library' ) );

									wp.media.featuredSlider.set( wp.shortcode.string( shortcode ) );
								} ).state().get( 'library' )
								.on( 'selection:single selection:unsingle', wp.media.featuredSlider.changeFrameActionText );
						} ).on( 'click', '#remove-featured-slider', function ( e ) {
							e.preventDefault();
							wp.media.featuredSlider.set( '-1' );
						} );
					}
				} );

				wp.media.featuredSlider.init();

			} );

		})( jQuery );

	</script>
<?php }

/**
 * Save _featured_slider.
 */
add_action( 'save_post', 'post_slider__save_post', 1, 2 );
function post_slider__save_post( $post_id, $post ) {
	// if this is an autosave, our form has not been submitted, so we don't want to do anything
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;
	// check if our nonce is set and verify that the nonce is valid
	if ( !isset( $_POST['post_slider_nonce'] ) || !wp_verify_nonce( $_POST['post_slider_nonce'], 'post_slider__save_post' ) ) return;
	// check the users permissions
	if ( !current_user_can( 'edit_page', $post_id ) ) return;

	// OK, it's safe for us to save the data now

	// delete vs set/update
	if ( empty( $_POST['_featured_slider'] ) || $_POST['_featured_slider'] == '-1' )
		delete_post_meta( $post_id, '_featured_slider' );
	else update_post_meta( $post_id, '_featured_slider', $_POST['_featured_slider'] );
}
