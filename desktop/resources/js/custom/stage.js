;(function ( $, window ) {

	/**
	 * @author mauricio.araldi
	 * @since 21/08/2014
	 *
	 * This module controls stage interactions.
	 */
	App.Stage = (function(){
	
		/**
		 * @author mauricio.araldi
		 * @since 21/08/2014
		 *
		 * Default function with all event bindings related to this module
		 */
		function bindEvents() {
			/**
			 * @author mauricio.araldi
			 * @since 20/03/2014
			 *
			 * Disables context menu in canvas
			 *
			 * @element canvas
			 * @event contextmenu
			 */
			$('canvas').on('contextmenu', function(ev){
				ev.preventDefault();
			});
			
			/**
			 * @author mauricio.araldi
			 * @since 25/08/2014
			 *
			 * Shows block cursor when mouse enters the stage
			 *
			 * @element canvas
			 * @event mouseenter
			 */
			$('canvas').on('mouseenter', function() {
				$(App.Values.cursor).show();
			});
			
			/**
			 * @author mauricio.araldi
			 * @since 25/08/2014
			 *
			 * Hides the mouse cursor and stop placing blocks when
			 * mouse leaves the stage
			 *
			 * @element canvas
			 * @event mouseleave
			 */
			$('canvas').on('mouseleave', function() {
				App.Control.placingBlocks = false;
				App.Control.erasingBlocks = false;
				$(App.Values.cursor).hide();
			})
			
			/**
			 * @author mauricio.araldi
			 * @since 20/03/2014
			 *
			 * When the mouse goes up, reset control variables
			 *
			 * @element canvas
			 * @event mouseup
			 */
			$('canvas').on('mouseup', function(){
				App.Control.placingBlocks = false;
				App.Control.erasingBlocks = false;
			})
			
			/**
			 * @author mauricio.araldi
			 * @since 20/03/2014
			 *
			 * When the mouse goes down, verifies if its a left or right click.
			 * Then take the action for it (Drawing or erasing block)
			 *
			 * @element canvas
			 * @event mousedown
			 */
			$('canvas').on('mousedown', function(ev) {
				//Event position
				var eventY = ev.originalEvent.layerY,
					eventX = ev.originalEvent.layerX,
				//BlockSetId of the block to be drawed
					blockSetId = $('.tool.active').attr('data-blockSet-id');
					
				if (ev.which == 1) { //Left Mouse Button
					App.Stage.placeBlockAtPos(eventX, eventY, blockSetId);
					App.Control.placingBlocks = true;
				} else if (ev.which == 3) { //Right Mouse Button
					App.Stage.eraseBlockAtPos(eventX, eventY);
					App.Control.erasingBlocks = true;
				}
			})
			
			/**
			 * @author mauricio.araldi
			 * @since 20/03/2014
			 *
			 * When the mouse moves, take action accordingly to the mouse button being
			 * pressed.
			 *
			 * Using Vanilla JS to increase performance
			 *
			 * @element canvas
			 * @event mousemove	
			 */
			$('canvas').on('mousemove', function(ev) {
				//Event position
				var eventY = ev.originalEvent.layerY,
					eventX = ev.originalEvent.layerX,
				//The active tool
					activeTool = document.querySelector('.tool.active'),
				//BlockSetId of the block to be drawed
					blockSetId = activeTool ? activeTool.getAttribute('data-blockSet-id') : null;
				
				if (App.Control.placingBlocks) { //Left mouse button pressed
					App.Stage.placeBlockAtPos(eventX, eventY, blockSetId);
				} else if (App.Control.erasingBlocks) { //Right mouse button pressed
					App.Stage.eraseBlockAtPos(eventX, eventY);
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
	
		/**
		 * @author mauricio.araldi
		 * @since 20/03/2014
		 *
		 * Places a block on the stage accordingly to the x and y coordinates
		 * passed. The coordinates will be processed to fit the grid (increments
		 * of values of cellSize). For example: If the cellSize is 50 and the X or
		 * Y are 57, it will be rounded to 50, fitting the grid.
		 *
		 * @parameter Integer x - The X cordinate where the block should be placed
		 * @parameter Integer y - The Y cordinate where the block should be placed
		 * @parameter Integer blockSetId - The id of the block relative to the blockSet
		 */
		function placeBlockAtPos(x, y, blockSetId) {
			//Round the values to fit the grid
			var gridX = x - (x % App.Values.cellSize),
				gridY = y - (y % App.Values.cellSize),
			//Get the map line and column numbers, accordingly to grid position
				mapLine = gridY / App.Values.cellSize,
				mapColumn = gridX / App.Values.cellSize,
			//Get the id of the block that was previously on this position
				oldBlockId = App.currentMap[mapLine][mapColumn],
			//Get the context of the stage
				ctx = App.Values.stage.getContext('2d');
				
			//If the block being placed is different from the current block on the position
			if (oldBlockId != blockSetId) {
				//Get the image of the current block on the position
				var imgData = ctx.getImageData(gridX, gridY, App.Values.cellSize, App.Values.cellSize),
					currentImg = App.Values.cursorImg;

				//Adds the block value to the undo/redo manager
				App.UndoManager.add({
					undo: function() {
						ctx.putImageData(imgData, gridX, gridY);
						App.currentMap[mapLine][mapColumn] = parseInt(oldBlockId);
					},
					redo: function() {
						ctx.drawImage(currentImg, gridX, gridY, App.Values.cellSize, App.Values.cellSize);
						App.currentMap[mapLine][mapColumn] = parseInt(blockSetId);
					}
				});
			
				//Sets the current position on the map with the blockSetId
				App.currentMap[mapLine][mapColumn] = parseInt(blockSetId);
				
				//Draw the image on the stage
				ctx.drawImage(currentImg, gridX, gridY, App.Values.cellSize, App.Values.cellSize);
			}
		}
		
		/**
		 * @author mauricio.araldi
		 * @since 20/03/2014
		 *
		 * Erases a block on stage. This function has been separated 
		 * from "placeBlockAtPos" for performance reasons.
		 *
		 * @parameter Integer x - The X cordinate where the block should be erased
		 * @parameter Integer y - The Y cordinate where the block should be erased
		 */
		function eraseBlockAtPos(x, y) {
			//Round the values to fit the grid
			var gridX = x - (x % App.Values.cellSize),
				gridY = y - (y % App.Values.cellSize),
			//Get the map line and column numbers, accordingly to grid position
				mapLine = gridY / App.Values.cellSize,
				mapColumn = gridX / App.Values.cellSize,
			//Get the context of the stage
				ctx = App.Values.stage.getContext('2d');
				
			//If there is a block on the position being erased
			if (App.currentMap[mapLine][mapColumn] != 0) {
				//Get the image of the current block on the position
				var imgData = ctx.getImageData(gridX, gridY, App.Values.cellSize, App.Values.cellSize);
				
				//Adds the block value to the undo/redo manager
				App.UndoManager.add({
					undo: function() {
						ctx.putImageData(imgData, gridX, gridY);
						App.currentMap[mapLine][mapColumn] = App.currentMap[mapLine][mapColumn];
					},
					redo: function() {
						ctx.clearRect(gridX, gridY, App.Values.cellSize, App.Values.cellSize);
						App.currentMap[mapLine][mapColumn] = 0;
					}
				});
				
				//Clears the current position on the map
				App.currentMap[mapLine][mapColumn] = 0;
				
				//Clears the position on the stage
				ctx.clearRect(gridX, gridY, App.Values.cellSize, App.Values.cellSize);
			}
		}
		
		/**
		 * @author mauricio.araldi
		 * @since 20/03/2014
		 *
		 * Adjusts the size of the stage by values on app
		 */
		function adjustSize() {
			//Set stage values
			App.Values.stage.height = App.Values.lines * App.Values.cellSize;
			App.Values.stage.width = App.Values.columns * App.Values.cellSize;
		}
		
		//These functions will be visible
		return {
			bindEvents : bindEvents,
			init : init,
			placeBlockAtPos : placeBlockAtPos,
			eraseBlockAtPos : eraseBlockAtPos,
			adjustSize : adjustSize,
		};
	})();

	// DOM Ready -- Initialize Module
	$(function() {
		App.Stage.bindEvents();
		App.Stage.init();
	});
	
})( jQuery, window );