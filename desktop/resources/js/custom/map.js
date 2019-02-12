;(function ( $, window ) {

	/**
	 * @author mauricio.araldi
	 * @since 21/08/2014
	 *
	 * This module controls map interactions.
	 */
	App.Map = (function(){
	
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
		 * Exports a string for the current map
		 *
		 * @return String map - The current map as string
		 */
		function exportMap() {
			return JSON.stringify(App.currentMap);
		}
		
		/**
		 * @author mauricio.araldi
		 * @since 21/08/2014
		 *
		 * Imports the provided map string, set app values accordingly 
		 * and adjusts the stage, redrawing it.
		 *
		 * @parameter String mapJSON - JSON string that should be parsed and loaded
		 * as a map
		 */
		function importMap(mapJSON) {
			//If no data was provided
			if (!mapJSON) {
				//Send an error message to the screen and console
				App.Utils.addErrorMessage( App.i18n('errorNoDataProvided') );
				console.error( App.i18n('errorNoDataProvided') );
				return;
			}
			
			try {
				//Try to parse
				App.currentMap = JSON.parse(mapJSON);
				
				//Adjust app values
				App.Values.lines = App.currentMap.length;
				App.Values.columns = App.currentMap[0].length;
				
				//Adjust and redraw stage
				App.Stage.adjustSize();
				App.Map.drawMap(App.currentMap, App.Values.stage);
				
				//Adjust and redraw grid
				App.Grid.adjustSize();
				App.Grid.draw();
				
				//Send a success message to the screen and console
				App.Utils.addSuccessMessage( App.i18n('dataLoadedSuccessfully') );
				console.info( App.i18n('dataLoadedSuccessfully') );
			} catch (err) {
				//Send an error message to the screen and console
				App.Utils.addErrorMessage( App.i18n('invalidDataProvided') );
				console.error(err);
			}
		}
		
		/**
		 * @author mauricio.araldi
		 * @since 20/03/2014
		 *
		 * Creates a new map filled with ids '0' (blank)
		 *
		 * @parameter Integer lines - The number of lines the map should contain
		 * @parameter Integer columns - The number of columns the map should contain
		 *
		 * @return Array - The new map
		 */
		function createNewMap(lines, columns) {
			var arr = [];
			
			while (lines--) {
				arr.push(new FilledArray(columns, 0));
			}
			
			return arr;
		}
		
		/**
		 * @author mauricio.araldi
		 * @since 25/08/2014
		 *
		 * Draws a map into a canvas
		 *
		 * @parameter Array map - The array which represents the map do be drawed
		 * @parameter HTMLElement canvas - A canvas in which the map will be drawed
		 */
		function drawMap(map, canvas) {
			//Reset canvas
			canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

			//For each line on the canvas
			map.forEach(function(line, l) {
			
				//For each column inside a line
				line.forEach(function(column, c) {
					//Get grid position
					var gridX = c * App.Values.cellSize,
						gridY = l * App.Values.cellSize,
					//Get the block
						block = App.Utils.getBlockFromBlockSet(column, App.currentBlockSet),
					//Get the context
						ctx = canvas.getContext('2d'),
						imgSrc;

					//If the block is valid, draw it
					if (block) {
						imgSrc = App.Values.blocksImagesSrc + block.imgName;

						var image = new Image();

						image.src = imgSrc;

						image.onload = function() {
							ctx.drawImage(this, gridX, gridY, App.Values.cellSize, App.Values.cellSize);
						};
						
					//If not, clear the rect
					} else {
						ctx.clearRect(gridX, gridY, App.Values.cellSize, App.Values.cellSize);
					}
				});
			});
		}
		
		
		/**
		 * @author mauricio.araldi
		 * @since 25/08/2014
		 *
		 * Removes a line from current map
		 *
		 * @parameter Integer lineNumber - The line to be removed
		 */
		function removeLine(lineNumber) {
			//Decrease app line number
			App.Values.lines--;
			
			//Remove the line
			App.currentMap = App.currentMap.slice(0, lineNumber).concat( App.currentMap.slice(lineNumber+1) );
		}
		
		/**
		 * @author mauricio.araldi
		 * @since 25/08/2014
		 *
		 * Removes a column from current map
		 *
		 * @parameter Integer columnNumber - The column to be removed
		 */
		function removeColumn(columnNumber) {
			//Decrease app column number
			App.Values.columns--;
			
			//Remove the column
			App.currentMap.forEach(function(line, i) {
				App.currentMap[i] = line.slice(0, columnNumber).concat( line.slice(columnNumber+1) );
			});
		}
	
		//These functions will be visible
		return {
			bindEvents : bindEvents,
			init : init,
			exportMap : exportMap,
			importMap : importMap,
			createNewMap : createNewMap,
			drawMap : drawMap,
			removeLine : removeLine,
			removeColumn : removeColumn,
		};
	})();

	// DOM Ready -- Initialize Module
	$(function() {
		App.Map.bindEvents();
		App.Map.init();
	});
	
})( jQuery, window );