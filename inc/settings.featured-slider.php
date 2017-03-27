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
					<input type="checkbox" name="featured_slider[<?php echo $post_type->name; ?>]"
					       value="1"<?php checked( $status, 1 ); ?>
					       id="<?php echo $id; ?>" />
					<?php _e( 'Activate' ); ?>
				</label>
			</td>
		</tr>

	<?php endforeach; ?>

	</tbody>
</table>