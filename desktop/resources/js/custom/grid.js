;(function ( $, window ) {

	/**
	 * @author mauricio.araldi
	 * @since 25/08/2014
	 *
	 * This module controls grid interactions.
	 */
	App.Grid = (function(){
	
		/**
		 * @author mauricio.araldi
		 * @since 25/08/2014
		 *
		 * Default function with all event bindings related to this module
		 */
		function bindEvents() {
		}
		
		/**
		 * @author mauricio.araldi
		 * @since 25/08/2014
		 *
		 * Default function that runs as soon as the page is loaded
		 * and events are binded (see bindEvents())
		 */
		function init() {
		}
	
		/**
		 * @author mauricio.araldi
		 * @since 31/03/2014
		 *
		 * Draws a grid relative to the map width and height
		 */
		function draw() {
			var gridImg = new Image();
	
			//Sets the grid image
			gridImg.src = App.Values.gridImageSrc;
			
			gridImg.onload = function() {
				//Get context
				var ctx = App.Values.grid.getContext('2d'),
				
				//Sets the size
					width = App.Values.stage.width,
					height = App.Values.stage.height;
				
				//Draws the grid
				ctx.fillStyle = ctx.createPattern(gridImg, 'repeat');
				ctx.fillRect(0, 0, width, height);
			};
		}
		
		/**
		 * @author mauricio.araldi
		 * @since 20/03/2014
		 *
		 * Adjusts the size of the grid by values on app
		 */
		function adjustSize() {
			//Set grid values
			App.Values.grid.height = App.Values.stage.height;
			App.Values.grid.width = App.Values.stage.width;
		}
	
		//These functions will be visible
		return {
			bindEvents : bindEvents,
			init : init,
			draw : draw,
			adjustSize : adjustSize,
		};
	})();

	// DOM Ready -- Initialize Module
	$(function() {
		App.Grid.bindEvents();
		App.Grid.init();
	});
	
})( jQuery, window );