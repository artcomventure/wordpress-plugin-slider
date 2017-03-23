<div class="wrap">
	<h1><?php echo __( 'Gallery Slider', 'slider' ) . ' ' . __( 'Settings' ); ?></h1>

	<p><?php _e( 'Each of these settings can be individually overridden for each slider.', 'slider' ) ?><br />
		<?php printf( __( 'For more information <a href="%1$s" target="_blank">see the possible option values at GitHub</a>.', 'slider' ), 'https://github.com/artcomventure/wordpress-plugin-slider#possible-options'); ?></p>

	<hr />

	<form method="post" action="options.php">
		<?php settings_fields( 'slider' );

		$defaults = get_slider_options( true );
		foreach ( ( $options = get_slider_options() ) as $option => $value ) {
			if ( isset( $defaults[$option] ) && $defaults[$option] == $value ) {
				unset( $options[$option] );
			}
		} ?>

		<table class="form-table">
			<tbody>

			<tr valign="top">
				<th scope="row"><?php _e( 'Columns' ); ?></th>
				<td>
					<select name="slider[columns]"><?php
						$columns = 0;
						while ( $columns++ < 9 ) : ?>
							<option value="<?php echo $columns ?>"<?php selected( isset( $options['columns'] ) ? $options['columns'] : $defaults['columns'], $columns ); ?>>
								<?php echo $columns; ?>
							</option>
						<?php endwhile; ?></select>
					<p class="description"><?php _e( 'Number of slides displayed at a time', 'slider' ); ?></p>
				</td>
			</tr>

			<tr valign="top">
				<th scope="row"><?php _e( 'Show Navigation', 'slider' ) ?></th>
				<td>
					<fieldset><legend class="screen-reader-text"><span><?php _e( 'Show Navigation', 'slider' ) ?></span></legend>
						<label for="slider__navigation"><input type="checkbox" id="slider__navigation" value="true" name="slider[navigation]"
								<?php checked( ( isset( $options['navigation'] ) ? $options['navigation'] : $defaults['navigation'] ), 'true' ); ?> />
							<?php _e( 'Show next and previous buttons', 'slider' ); ?></label>
					</fieldset>
				</td>
			</tr>

			<tr valign="top">
				<th scope="row"><?php _e( 'Show pager at', 'slider' ); ?></th>
				<td>
					<select name="slider[pager]"><?php
						foreach ( array( 'bottom', 'top', 'none' ) as $position ) : ?>
							<option value="<?php echo $position ?>"<?php selected( isset( $options['pager'] ) ? $options['pager'] : $defaults['pager'], $position ); ?>>
								<?php _e( $position == 'none' ? 'nowhere' : $position, 'slider' ) ?>
							</option>
						<?php endforeach; ?></select>
				</td>
			</tr>

			<tr valign="top">
				<th scope="row"><?php _e( 'Animation duration', 'slider' ) ?></th>
				<td>
					<input type="text" name="slider[duration]"
					       value="<?php echo isset( $options['duration'] ) ? $options['duration'] : ''; ?>"
					       placeholder="<?php echo $defaults['duration']; ?>" class="regular-text" />
					<p class="description"><?php _e( 'in milliseconds', 'slider' ); ?></p>
				</td>
			</tr>

			<tr valign="top">
				<th scope="row"><?php _e( 'Jump', 'slider' ) ?></th>
				<td>
					<input type="text" name="slider[jump]"
					       value="<?php echo isset( $options['jump'] ) ? $options['jump'] : ''; ?>"
					       placeholder="<?php echo $defaults['jump']; ?>" class="regular-text" />
					<p class="description"><?php _e( 'Number of columns that will slided on slide action', 'slider' ); ?></p>
				</td>
			</tr>

			<tr valign="top">
				<th scope="row"><?php _e( 'Loop', 'slider' ) ?></th>
				<td>
					<fieldset><legend class="screen-reader-text"><span><?php _e( 'Loop', 'slider' ) ?></span></legend>
						<label for="slider__loop"><input type="checkbox" id="slider__loop" value="true" name="slider[loop]"
								<?php checked( isset( $options['loop'] ) ? $options['loop'] : $defaults['loop'], 'true' ); ?>/>
							<?php _e( 'Jump from last to first slide (and vice versa)', 'slider' ); ?></label>
					</fieldset>
				</td>
			</tr>

			<tr valign="top">
				<th scope="row"><?php _e( 'Slideshow', 'slider' ) ?></th>
				<td>
					<input type="text" name="slider[slideshow]"
					       value="<?php echo isset( $options['slideshow'] ) ? $options['slideshow'] : ''; ?>"
					       placeholder="<?php echo $defaults['slidershow'] ?>" class="regular-text" />
					<p class="description"><?php _e( 'Auto-slide in milliseconds', 'slider' ); ?></p>
				</td>
			</tr>

			<tr valign="top">
				<th scope="row"><?php _e( 'Dimension', 'slider' ) ?></th>
				<td>
					<input type="text" name="slider[dimension]"
					       value="<?php echo isset( $options['dimension'] ) ? $options['dimension'] : ''; ?>"
					       placeholder="<?php echo $defaults['dimension']; ?>" class="regular-text" />
					<p class="description"><?php _e( 'Ratio or exact size', 'slider' ); ?></p>
				</td>
			</tr>

			<tr valign="top">
				<th scope="row"><?php _e( 'Show Captions', 'slider' ) ?></th>
				<td>
					<fieldset><legend class="screen-reader-text"><span><?php _e( 'Show Captions', 'slider' ) ?></span></legend>
						<label for="slider__captions"><input type="checkbox" id="slider__captions" value="true" name="slider[captions]"
								<?php checked( isset( $options['captions'] ) ? $options['captions'] : $defaults['captions'], 'true' ); ?>/>
							<?php _e( 'Show Captions', 'slider' ); ?></label>
					</fieldset>
				</td>
			</tr>

			</tbody>
		</table>

		<?php submit_button(); ?>

	</form>
</div>
