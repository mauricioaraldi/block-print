;(function ( $, window ) {

	/**
	 * @author mauricio.araldi
	 * @since 20/08/2014
	 *
	 * This module controls blockSet interactions.
	 */
	App.BlockSet = (function(){
	
		/**
		 * @author mauricio.araldi
		 * @since 20/08/2014
		 *
		 * Default function with all event bindings related to this module
		 */
		function bindEvents() {

			/**
			 * @author mauricio.araldi
			 * @since 09/01/2015
			 *
			 * Load the block from an image to replace selected blockset block
			 *
			 * @element #img-blockset-editor
			 * @event change
			 */
			$('#img-blockset-editor').on('change', function(ev) {
				var file = this.files[0],
					item = $('.editing-block'),
					isActiveTool = item.hasClass('active');

				if (item[0]) { //CHANGE BLOCK
					item.removeClass('editing-block');

					item.find('img').attr('src', App.Values.blocksImagesSrc + file.name);

					//Change current blockSet
					changeBlock(item.attr('data-blockSet-id'), file.name);

					//Redraws the map
					App.Map.drawMap(App.currentMap, App.Values.stage);

					//Changes the tooltip
					item.data('opentips')[0].setContent(file.name.slice(0, file.name.indexOf('.')));

					//If the tool removed was the active tool, reset the active tool
					if (isActiveTool) {
						$('#tools .tool[data-blockSet-id='+ item.attr('data-blockSet-id') +']').trigger($.Event('mousedown', {which: 1}));
					}

					//Remove this from last tool
					$('#last-tools .tool[data-blockSet-id='+ item.attr('data-blockSet-id') +']').remove();
				} else { //ADD BLOCK
					addBlock(file.name);
				}
			});
		}
		
		/**
		 * @author mauricio.araldi
		 * @since 20/08/2014
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
		 * Exports a string for the current BlockSet
		 *
		 * @return String blockSet - The current blockSet as string
		 */
		function exportBlockSet() {
			return JSON.stringify(App.currentBlockSet);
		}

		/**
		 * @author mauricio.araldi
		 * @since 20/03/2014
		 *
		 * Imports the provided blockSet string and load the tools
		 *
		 * @parameter String blockSetJSON - JSON string that should be parsed and loaded
		 * as blockSet tools
		 */
		function importBlockSet(blockSetJSON) {
			//If no data was provided
			if (!blockSetJSON) {
				//Send an error message to the screen and console
				App.Utils.addErrorMessage( App.i18n('errorNoDataProvided') );
				console.error( App.i18n('errorNoDataProvided') );
				return;
			}
			
			try {
				//Try to parse
				App.currentBlockSet = JSON.parse(blockSetJSON);
				
				//Load tools
				loadToolsFromBlockSet(App.currentBlockSet, App.Values.blocksImagesSrc);
				
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
		 * Load tools from a BlockSet directly onto the app
		 *
		 * @parameter BlockSet blockSet - The blockSet from which the
		 * tools are going to be loaded
		 * @parameter String pathToImgs - The path to the directory where the
		 * block images are contained
		 */
		function loadToolsFromBlockSet(blockSet, pathToImgs) {
			//Clear current tools and last tools
			$('#tools').empty();
			$('#last-tools').empty();
			
			blockSet.forEach(function(block) {
				var imgURL = pathToImgs + block.imgName,
					image = new Image(),
					div = $('<div class="tool">'),
					fileName = block.imgName.slice(0, block.imgName.indexOf('.'));
					
				//Sets the image of the block
				image.src = imgURL;
				
				//Populate the div that will represent the block
				div.attr('data-blockSet-id', block.blockSetId).append(image);
					
				//Adds tooltip to the div
				new Opentip(div[0], fileName, {delay: 0});
				
				//Puts the tool on the app
				$('#tools').append(div);

				//Updates currentBlockSetId
				if (App.Values.currentBlockSetId < block.id) {
					App.Values.currentBlockSetId = block.id;
				}
			});
		}

		/**
		 * @author mauricio.araldi
		 * @since 09/01/2015
		 *
		 * Change one block from the blockSet
		 *
		 * @parameter Integer id - The ID of the block to be changed
		 * @parameter String imgName - The new block image name
		 */
		function changeBlock(id, imgName) {
			App.currentBlockSet.forEach(function(block) {
				if (block.blockSetId == id) {
					block.imgName = imgName;
				}
			});
		}

		/**
		 * @author mauricio.araldi
		 * @since 12/01/2015
		 *
		 * Removes one block from the blockSet
		 *
		 * @parameter Integer id - The ID of the block to be removes
		 */
		function removeBlock(id) {
			var blockIndex;

			App.currentBlockSet.some(function(block, index) {
				if (block.blockSetId == id) {
					blockIndex = index;
					return true;
				}
			});

			App.currentBlockSet = App.currentBlockSet.slice(0, blockIndex).concat(App.currentBlockSet.slice(blockIndex + 1));
		}

		/**
		 * @author mauricio.araldi
		 * @since 12/01/2015
		 *
		 * Add one block to the blockSet
		 *
		 * @parameter String fileName - The name of the file that represents the block
		 */
		function addBlock(fileName) {
			var block = {blockSetId: ++App.Values.currentBlockSetId, imgName: fileName},
				div = $('<div class="tool">'),
				image = new Image();

			//Sets the image of the block
			image.src = App.Values.blocksImagesSrc + fileName;

			//Populate the div that will represent the block
			div.attr('data-blockSet-id', block.blockSetId).append(image);

			//Adds tooltip to the div
			new Opentip(div[0], fileName, {delay: 0});

			//Updates the currentBlockSet
			App.currentBlockSet.push( block );

			//Puts the tool on the app
			$('#tools').append(div);
		}


		//These functions will be visible
		return {
			bindEvents : bindEvents,
			init : init,
			exportBlockSet : exportBlockSet,
			importBlockSet : importBlockSet,
			loadToolsFromBlockSet : loadToolsFromBlockSet,
			removeBlock: removeBlock,
		};
	})();

	// DOM Ready -- Initialize Module
	$(function() {
		App.BlockSet.bindEvents();
		App.BlockSet.init();
	});
	
})( jQuery, window );