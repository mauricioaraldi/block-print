App = {
	Values: {
		stage: {}, //Canvas
		grid: {}, //Canvas
		cellSize: 50,
		lines: 50,
		columns: 50,
		cursorImg: {},
		blocksImagesSrc: 'resources/images/blocks/',
		gridImageSrc: 'resources/images/grid.png',
		lastUsedToolsQuantity: 2,
		zoomLevel: 1,
		zoomSpeed: 0.1,
		scrollSpeed: 40,
		lastScrollLeft: 0,
		lastScrollTop: 0,
		localStorageKey: 'block-print',
		currentBlockSetId: 0,
	},
	
	UndoManager : new UndoManager(),
	
	Control: {
		shift: false,
		ctrl: false,
		placingBlocks: false,
		erasingBlocks: false,
	},
	
	currentMap: [
	],
	
	currentBlockSet: [
	],
	
	Utils: {
		/**
		 * @author mauricio.araldi
		 * @since 20/03/2014
		 *
		 * Sets a new image source on cursor
		 *
		 * @author mauricio.araldi
		 * @since 07/01/2015
		 *
		 * Now the cursor is being setted via CSS 'cursor' property, no a div with an image
		 * anymore. This increases performance drastically. So, to make the images the size of
		 * of the cell, they need to be resized with an canvas.
		 *
		 * @parameter String imgSrc - The URL of the image to be loaded on the cursor
		 */
		setCursorImg : function(imgSrc) {
			var canvas = document.createElement('canvas'),
				ctx = canvas.getContext('2d'),
				cursorSize = App.Values.cellSize,
				img = new Image(),
				imgDataUrl;

			cursorSize = cursorSize * App.Values.zoomLevel;

			if (cursorSize < 5) {
				cursorSize = 5;
			} else if (cursorSize > 128) {
				cursorSize = 128;
			}

			canvas.height = cursorSize;
			canvas.width = cursorSize;

			img.src = imgSrc;

			img.onload = function() {
				ctx.drawImage(img, 0, 0, cursorSize, cursorSize);
				$('#canvas').css('cursor', 'url(' + canvas.toDataURL() + ') '+ cursorSize / 2 +' '+ cursorSize / 2 +', auto');
				App.Values.cursorImg = img;
			};
		},
		
		/**
		 * @author mauricio.araldi
		 * @since 20/03/2014
		 *
		 * Removes the screen block
		 */
		unblockScreen : function() {
			$('.screen-block').remove();
			$('.active-header').removeClass('active-header');
			$('#file-menu').hide();
		},
		
		/**
		 * @author mauricio.araldi
		 * @since 20/08/2014
		 *
		 * Blocks the screen
		 *
		 * @parameter Boolean darkenScreen - If the screen should be darkened
		 */
		blockScreen : function(darkenScreen) {
			var screenBlock = $('<div>').addClass('screen-block');
			
			if (darkenScreen) {
				screenBlock.addClass('darken');
			}
			
			$('body').append( screenBlock );
		},
		
		/**
		 * @author mauricio.araldi
		 * @since 20/03/2014
		 *
		 * Returns a block object from a blockSet, searching for its id
		 *
		 * @parameter Integer blockSetId - The id of the block to search on blockSet
		 * @parameter Object blockSet - The blockSet in which to look for the block
		 *
		 * @return Object block - The block that corresponds to the id passed as parameter
		 */
		getBlockFromBlockSet : function(blockSetId, blockSet) {
			var returnBlock; 
			
			if (!blockSet) {
				return;
			}
			
			blockSet.some(function(block) {
				if (block.blockSetId == blockSetId) {
					//Makes a true return to stop looping
					return returnBlock = block;
				}
			});
			
			return returnBlock;
		},
		
		/**
		 * @author mauricio.araldi
		 * @since 20/03/2014
		 *
		 * Generates an image from the stage and opens it in a window for the user
		 */
		generateStageImage : function() {
			var canvas = App.Values.stage,
				width = canvas.width > window.outerWidth ? window.outerWidth - 10 : canvas.width + 10,
				height = canvas.height > window.outerHeight ? window.outerHeight - 10 : canvas.height + 10;
				
			window.open(canvas.toDataURL("image/png"), 'Stage image', 'width='+width+', height='+height);
		},
		
		/**
		 * @author mauricio.araldi
		 * @since 25/03/2014
		 *
		 * Verifies wether the map needs to be adjusted to the canvas size
		 *
		 * @parameter Array map - The map to be adjusted to canvas size
		 *
		 * @return Array map - The array adjusted to canvas size
		 */
		adjustMapSize : function(map) {
			map = App.Utils.leanMap(map);
			map = App.Utils.fillMap(map);
			
			return map
		},
		
		/**
		 * @author mauricio.araldi
		 * @since 25/03/2014
		 *
		 * Leans an existing map, popping elements out of it, for when line and column values are
		 * smaller than the map passed
		 *
		 * @parameter Array map - The map to be leaned
		 *
		 * @return Array map - The leaned map
		 */
		leanMap : function(map) {
			var mapLines = map.length,
				mapColumns = map[0].length;
				
			//Verify Lines
			if (App.Values.lines < mapLines) {
				map = map.slice(0, App.Values.lines);
			}
			
			//Verify Columns
			if (App.Values.columns < mapColumns) {
				for (var l = 0; l < App.Values.lines; l++) {
					map[l] = map[l].slice(0, App.Values.columns);
				}
			}
			
			return map;
		},
		
		/**
		 * @author mauricio.araldi
		 * @since 20/03/2014
		 *
		 * Fills an existing map with 0, for when line and column values are bigger
		 * than the map passed
		 *
		 * @parameter Array map - The map to be filled
		 * 
		 * @return Array map - The filled map
		 */
		fillMap : function(map) {
			var mapLines = map.length,
				mapColumns = map[0].length;
				
			//Verify Lines
			if (App.Values.lines > mapLines) {
				for (var l = mapLines; l < App.Values.lines; l++) {
					map.push(new FilledArray(App.Values.columns, 0));
				}
			}
			
			//Verify Columns
			if (App.Values.columns > mapColumns) {
				for (var l = 0; l < App.Values.lines; l++) {
					for (var c = mapColumns; c < App.Values.columns; c++) {
						map[l].push(0);
					}
				}
			}
			
			return map;
		},
		
		/**
		 * @author mauricio.araldi
		 * @since 26/03/2014
		 *
		 * Changes the zoom level of the canvas, accordingly to the portion passed
		 *
		 * @parameter Float zoomPortion - The amount to change on zoom portion
		 */
		changeZoomLevel : function(zoomPortion) {
			App.Values.zoomLevel += zoomPortion;

			if (App.Values.zoomLevel < 0.1) {
				App.Values.zoomLevel = 0.1;
			} else if (App.Values.zoomLevel > 5) {
				App.Values.zoomLevel = 5;
			}

			if (App.Values.zoomLevel < 0.7) {
				$('.header').each(function() {
					$(this).data('opentips')[0].activate();
				});
			} else {
				$('.header').each(function() {
					$(this).data('opentips')[0].deactivate();
				});
			}

			$('#zoom-container').css('transform', 'scale('+App.Values.zoomLevel+')');

			App.Utils.setCursorImg(App.Values.cursorImg.src);
		},
		
		/**
		 * @author mauricio.araldi
		 * @since 26/03/2014
		 *
		 * Changes the zoom level of the canvas
		 *
		 * @parameter Float zoomLevel - The zoom level to be used
		 */
		setZoomLevel : function(zoomLevel) {
			App.Values.zoomLevel = zoomLevel;

			if (App.Values.zoomLevel < 0.1) {
				App.Values.zoomLevel = 0.1;
			} else if (App.Values.zoomLevel > 5) {
				App.Values.zoomLevel = 5;
			}

			if (App.Values.zoomLevel < 0.7) {
				$('.header').each(function() {
					$(this).data('opentips')[0].activate();
				});
			} else {
				$('.header').each(function() {
					$(this).data('opentips')[0].deactivate();
				});
			}

			$('#zoom-container').css('transform', 'scale('+App.Values.zoomLevel+')');

			App.Utils.setCursorImg(App.Values.cursorImg.src);
		},
		
		/**
		 * @author mauricio.araldi
		 * @since 21/08/2014
		 *
		 * Makes a noty on the screen with no style
		 *
		 * @parameter String text - The text of the notification to be created
		 * @parameter String type - The type of the notification to be created
		 */
		addMessage : function(text, type) {
			noty({
				layout: 'bottomCenter',
				type: type,
				text: text,
				timeout: 4000,
			});
		},
		
		/**
		 * @author mauricio.araldi
		 * @since 21/08/2014
		 *
		 * Makes a noty on the screen with info style
		 *
		 * @parameter String text - The text of the notification to be created
		 */
		addInfoMessage : function(text) {
			App.Utils.addMessage(text, 'information');
		},
		
		/**
		 * @author mauricio.araldi
		 * @since 21/08/2014
		 *
		 * Makes a noty on the screen with warning style
		 *
		 * @parameter String text - The text of the notification to be created
		 */
		addWarningMessage : function(text) {
			App.Utils.addMessage(text, 'warning');
		},
		
		/**
		 * @author mauricio.araldi
		 * @since 21/08/2014
		 *
		 * Makes a noty on the screen with error style
		 *
		 * @parameter String text - The text of the notification to be created
		 */
		addErrorMessage : function(text) {
			App.Utils.addMessage(text, 'error');
		},
		
		/**
		 * @author mauricio.araldi
		 * @since 21/08/2014
		 *
		 * Makes a noty on the screen with success style
		 *
		 * @parameter String text - The text of the notification to be created
		 */
		addSuccessMessage : function(text) {
			App.Utils.addMessage(text, 'success');
		},
	}
};