<h2 class="hide-if-js"><?php _e( 'Featured Slider', 'slider' ); ?></h2>

<h3><?php _e( 'Enable/Disable featured slider for post types', 'slider' ) ?></h3>

<p><?php _e( "Replace WordPress' featured image with a featured slider.<br /><b>But no fear!</b> The featured image will not disappear. The first image will be used as the featured image as you know it.", 'slider' ); ?></p>
<p class="description"><?php _e( 'This has nothing to do with the slider possibility in the editor.', 'slider' ); ?></p>

<table class="form-table">
	<tbody>

	<?php foreach ( get_featured_slider_post_types( false ) as $post_type => $status ) :
		$post_type = get_post_type_object( $post_type );
		$id = 'featured_slider_for_' . $post_type->name; ?>

		<tr valign="top">
			<th scope="row"><?php echo $post_type->label; ?>:</th>
			<td>
				<label for="<?php echo $id; ?>">
					<select name="featured_slider[<?php echo $post_type->name; ?>]" id="<?php echo $id; ?>" >
						<option value="0"<?php selected( $status, 0 ); ?>><?php _e( 'Deactivate' ) ?></option>
						<option value="1"<?php selected( $status, 1 ); ?>><?php _e( 'Replace post thumbnail in single post', 'slider' ) ?></option>
						<option value="2"<?php selected( $status, 2 ); ?>><?php _e( 'Replace all post thumbnails', 'slider' ) ?></option>
						<option value="3"<?php selected( $status, 3 ); ?>><?php _e( "Don't auto-replace post thumbnails", 'slider' ) ?></option>
					</select>
				</label>
			</td>
		</tr>

	<?php endforeach; ?>

	</tbody>
</table>