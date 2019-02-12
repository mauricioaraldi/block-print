;(function ( $, window ) {

	/**
	 * @author mauricio.araldi
	 * @since 21/08/2014
	 *
	 * This module controls settings interactions.
	 */
	App.Settings = (function(){
	
		/**
		 * @author mauricio.araldi
		 * @since 21/08/2014
		 *
		 * Default function with all event bindings related to this module
		 */
		function bindEvents() {
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
		
		/**
		 * @author mauricio.araldi
		 * @since 21/08/2014
		 *
		 * Changes the map size values and redraws the stage
		 *
		 * @parameter Integer lines - The new number of lines of the map
		 * @parameter Integer columns - The new number of columns of the map
		 */
		function changeMapSize(lines, columns) {
			//If no data was provided
			if (!lines || !columns) {
				//Send an error message to the screen and console
				App.Utils.addErrorMessage( App.i18n('errorNoDataProvided') );
				console.error( App.i18n('errorNoDataProvided') );
				return;
			}
		
			//Sets app values
			App.Values.lines = lines;
			App.Values.columns = columns;
			
			//Adjust map size, deleting or inserting lines and columns
			App.currentMap = App.Utils.adjustMapSize(App.currentMap);
			
			//Adjust stage and draw map
			App.Stage.adjustSize();
			App.Map.drawMap(App.currentMap, App.Values.stage);
			
			//Adjust and draw grid
			App.Grid.adjustSize();
			App.Grid.draw();
			
			//Draw column and line headers
			App.Headers.drawHeaders();
			
			//Send a success message to the screen and console
			App.Utils.addSuccessMessage( App.i18n('dataSavedSuccessfully') );
			console.info( App.i18n('dataSavedSuccessfully') );
		}
		
		//These functions will be visible
		return {
			bindEvents : bindEvents,
			init : init,
			changeMapSize : changeMapSize,
		};
	})();

	// DOM Ready -- Initialize Module
	$(function() {
		App.Settings.bindEvents();
		App.Settings.init();
	});
	
})( jQuery, window );