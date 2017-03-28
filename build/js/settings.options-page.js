;
(function ( $ ) {

    var $form_referer = $( 'input[name="_wp_http_referer"]' ),
        $sections = $( 'div.nav-section' ),
        $tabs = $( 'a.nav-tab' ).on( 'click', function ( e ) {
            var $tab = $( this ).blur();
            if ( $tab.hasClass( 'nav-tab-active' ) ) return;

            var $tabnow = $tab[0].search.match( /(\?|&)tab=([^&]*)/ );
            if ( $tabnow ) {
                // get tab's section
                var $section = $( '#' + $tabnow[2] );

                if ( $section.length ) {
                    e.preventDefault();

                    $tabs.removeClass( 'nav-tab-active' );
                    $tab.addClass( 'nav-tab-active' );

                    $sections.hide();
                    $section.show();

                    window.history.pushState( null, null, $tab.prop( 'href' ) );
                    $form_referer.val( $form_referer.val().replace( /(\?|&)tab=([^&]*)/, "$1tab=" + $tabnow[2] ) );
                }
            }

        } );

    // ...
    if ( !window.location.search.match( /(\?|&)tab=([^&]*)/ ) ) {
        window.location.href = $tabs[0].href;
    }

})( jQuery );