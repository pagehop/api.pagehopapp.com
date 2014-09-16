'use strict';

( function() {

var HEADER_HIGHT = 50;

var scrollToElement = function(e, id, extraOffset) {
	$( 'html, body' ).stop().animate( {
		scrollTop: $( id ).offset().top + extraOffset - HEADER_HIGHT
	}, 800, 'easeInOutExpo' );
	e.preventDefault();
};

// Handle scrolling on local (#) navigation
$( "a" ).bind( "click", function(e) {
	var $element = $( this ),
		// if buttons are added - use this:
		// id = this.tagName.toLowerCase() === "a" ? $element.attr( 'href' ) : $element.attr( 'data-target' ),
		id = $element.attr( 'href' ),
		extraOffset;

	if ( $element.hasClass( "page-scroll" ) ) {
		extraOffset = 250; // should be updated with rule: section.demo-section h2
		extraOffset += $element.hasClass( "last-nav-item" ) ? 60 : 0;
		extraOffset += $element.hasClass( "extra-scroll-40" ) ? 40 : 0;
		scrollToElement( e, id, extraOffset );
	} else if ( $element.hasClass( "page-scroll-no-offset" ) ) {
		extraOffset = $element.hasClass( "first-nav-item" ) ? 50 : 0;
		scrollToElement( e, id, extraOffset );
	}
} );

// Closes the Responsive Menu on Menu Item Click
$( '.navbar-collapse ul li a' ).click( function() {
	$( '.navbar-toggle:visible' ).click();
} );

} )();