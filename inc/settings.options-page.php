<div class="wrap">
	<h1><?php echo __( 'Gallery Slider', 'slider' ) . ' ' . __( 'Settings' ); ?></h1>

	<?php // define tabs
	$tabs = array( 'Slider Configuration', 'Featured Slider' ); ?>

	<h2 class="nav-tab-wrapper hide-if-no-js">
		<?php global $pagenow;
		$tabnow = !empty( $_GET['tab'] ) ? $_GET['tab'] : sanitize_title( $tabs[0] );

		foreach ( $tabs as $tab ) :
			$tabslug = sanitize_title( $tab ); ?>
			<a href="<?php echo add_query_arg( array(
				'page' => $_GET['page'],
				'tab' => $tabslug,
			), admin_url( $pagenow ) ); ?>" class="nav-tab<?php echo $tabslug == $tabnow ? '  nav-tab-active' : ''; ?>"><?php _e( $tab, 'slider' ); ?></a>
		<?php endforeach; ?>
	</h2>

	<form method="post" action="options.php">
		<?php settings_fields( 'slider' );

		foreach ( $tabs as $tab ) :
			$tabslug = sanitize_title( $tab ); ?>
			<div id="<?php echo $tabslug; ?>"<?php echo $tabslug != $tabnow ? '  style="display: none;"' : ''; ?> class="nav-section">
				<?php include( SLIDER_PLUGIN_DIR . "inc/settings.$tabslug.php" ); ?>
			</div>
		<?php endforeach;

		submit_button(); ?>

	</form>
</div>
