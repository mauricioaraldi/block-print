;(function ( $, window ) {

	/**
	 * @author mauricio.araldi
	 * @since 25/08/2014
	 *
	 * This module controls shortcut interactions.
	 */
	App.Shortcut = (function(){
	
		/**
		 * @author mauricio.araldi
		 * @since 25/08/2014
		 *
		 * Default function with all event bindings related to this module
		 */
		function bindEvents() {
			/**
			 * @author mauricio.araldi
			 * @since 26/03/2014
			 *
			 * Shortcuts that require to press a key
			 *
			 * @element document
			 * @event keydown
			 */
			$(document).on('keydown', function(ev) {
				//Reset zoom level
				if (ev.which == 96 || ev.which == 48) { //Numpad and keyboard 0
					//If CTRL is being held
					if (App.Control.ctrl) {
						App.Utils.setZoomLevel(1);
						ev.preventDefault;
					}
				}

				//Undo action
				else if (ev.which == 90) { //Z
					//If CTRL is being held
					if (App.Control.ctrl) {
						App.UndoManager.undo();
					}
				}
				
				//Redo action
				else if (ev.which == 89) { //Y
					//If CTRL is being held
					if (App.Control.ctrl) {
						App.UndoManager.redo();
					}
				}
			});
			
			/**
			 * @author mauricio.araldi
			 * @since 20/03/2014
			 *
			 * Controls the scrolling with shift holded, case in which
			 * the scroll will be horizontal
			 *
			 * @element main
			 * @event mousewheel
			 */
			$(window).mousewheel(function(ev) {
				var scrollAmount = (ev.deltaY * App.Values.scrollSpeed);
				
				//If SHIFT is being held
				if (App.Control.shift) {
					$(window).scrollLeft( $(window).scrollLeft() + scrollAmount );
					ev.preventDefault();
				}
			});
			
			/**
			 * @author mauricio.araldi
			 * @since 26/03/2014
			 *
			 * When the user scrolls with CTRL pressed, 
			 * do a zoom in the stage only
			 *
			 * @element document
			 * @event mousewheel
			 */
			$(document).mousewheel(function(ev) {
				//If CTRL is being held
				if (App.Control.ctrl) {
					App.Utils.changeZoomLevel(ev.deltaY * App.Values.zoomSpeed);
					ev.preventDefault();
				}
			});
		}
		
		/**
		 * @author mauricio.araldi
		 * @since 21/08/2014
		 *
		 * Default function that runs as soon as the page is loaded
		 * and events are binded (see bindEvents())
		 */
		function init() {
		}
	
		//These functions will be visible
		return {
			bindEvents : bindEvents,
			init : init,
		};
	})();

	// DOM Ready -- Initialize Module
	$(function() {
		App.Shortcut.bindEvents();
		App.Shortcut.init();
	});
	
})( jQuery, window );