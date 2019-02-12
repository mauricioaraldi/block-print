;(function ( $, window ) {

	/**
	 * @author mauricio.araldi
	 * @since 22/08/2014
	 *
	 * This module controls tools interactions.
	 */
	App.Tools = (function(){
	
		/**
		 * @author mauricio.araldi
		 * @since 22/08/2014
		 *
		 * Default function with all event bindings related to this module
		 */
		function bindEvents() {
			/**
			 * @author mauricio.araldi
			 * @since 22/08/2014
			 *
			 * When a tool is clicked, style it as selected and
			 * add its image to the cursor
			 *
			 * @author mauricio.araldi
			 * @since 09/01/2015
			 *
			 * Added contextmenu
			 *
			 * @element #tools .tool
			 * @event mousedown
			 */
			$('#tools').on('mousedown', '.tool', function(ev) {
				ev.stopPropagation();

				if (ev.which == 1) {
					selectTool(this);
				} else if (ev.which == 3) {
					var position = {x: ev.clientX, y: ev.clientY};

					$(this).addClass('editing-block');

					DropDown(document.querySelector('#tool-contextmenu'), position, {
						onClose: function() {
							$('.editing-block').removeClass('editing-block');
						}
					});
				}
			});

			/**
			 * @author mauricio.araldi
			 * @since 13/01/2015
			 *
			 * When a last tool is clicked, select the tool related to it
			 *
			 * @element #last-tools .tool
			 * @event mousedown
			 */
			$('#last-tools').on('click', '.tool', function(ev) {
				selectTool(this);
			});

			/**
			 * @author mauricio.araldi
			 * @since 22/08/2014
			 *
			 * When the left-bar is clicked, verifies if it is a contextmenu click
			 *
			 * @element #left-bar
			 * @event mousedown
			 */
			$('#left-bar').on('mousedown', function(ev) {
				if (ev.which == 3) {
					var position = {x: ev.clientX, y: ev.clientY};

					DropDown(document.querySelector('#left-bar-contextmenu'), position);
				}
			});

			/**
			 * @author mauricio.araldi
			 * @since 09/01/2015
			 *
			 * Calls the image selector to change a block
			 *
			 * @element #change-tool-block
			 * @event click
			 */
			$('#change-tool-block').on('click', function(ev) {
				$('#img-blockset-editor').click();
			});
			
			/**
			 * @author mauricio.araldi
			 * @since 12/01/2015
			 *
			 * Removes a block from BlockSet
			 *
			 * @element #remove-tool-block
			 * @event mousedown
			 */
			$('#remove-tool-block').on('mousedown', function(ev) {
				var blockSetId = $('.editing-block').attr('data-blockSet-id'),
					isActiveTool = $('.editing-block').hasClass('active');

				//Remove the block from blockSet
				App.BlockSet.removeBlock(blockSetId);

				//Remove the tool
				$('.editing-block').remove();

				//Remove this from last tool
				$('#last-tools .tool[data-blockSet-id='+ blockSetId +']').remove();

				//If the tool removed was the active tool, reset the active tool
				if (isActiveTool) {
					$('#tools .tool:first').trigger($.Event('mousedown', {which: 1}));
				}

				//Redraws the map
				App.Map.drawMap(App.currentMap, App.Values.stage);
			});

			/**
			 * @author mauricio.araldi
			 * @since 12/01/2015
			 *
			 * Calls the image selector to add a block
			 *
			 * @element .add-tool-block
			 * @event click
			 */
			$('.add-tool-block').on('click', function(ev) {
				//Remove the tool selection
				$('.editing-block').removeClass('editing-block');

				$('#img-blockset-editor').click();
			});

			/**
			 * @author mauricio.araldi
			 * @since 09/01/2015
			 *
			 * Cancel tools contextmenu
			 *
			 * @element #tools .tool
			 * @event contextmenu
			 */
			$('#tools').on('contextmenu', '.tool', function(ev) {
				return false;
			});

			/**
			 * @author mauricio.araldi
			 * @since 12/01/2015
			 *
			 * Cancel left-bar contextmenu
			 *
			 * @element #left-bar
			 * @event contextmenu
			 */
			$('#left-bar').on('contextmenu', '.tool', function(ev) {
				return false;
			});
			
			/**
			 * @author mauricio.araldi
			 * @since 22/08/2014
			 *
			 * Makes the Last Tools section scrolls horizontal when mousewheel is used
			 *
			 * @element #last-tools
			 * @event mousewheel
			 */
			$('#last-tools').mousewheel(function(ev) {
				this.scrollLeft -= (ev.deltaY * 40);
				ev.preventDefault();
			});
			
			/**
			 * @author mauricio.araldi
			 * @since 22/08/2014
			 *
			 * Load the tools from images as soons as the images are selected
			 *
			 * @element #imgs
			 * @event change
			 */
			$('#imgs').on('change', function() {
				var imgs = $('#imgs')[0];
				App.Tools.loadFromFiles(imgs.files);
			});
		}
		
		/**
		 * @author mauricio.araldi
		 * @since 22/08/2014
		 *
		 * Default function that runs as soon as the page is loaded
		 * and events are binded (see bindEvents())
		 */
		function init() {
		}

		/**
		 * @author mauricio.araldi
		 * @since 09/01/2015
		 *
		 * Load a tool from a HTMLElement
		 *
		 * @parameter HTMLElement element - The element tool to be loaded
		 */
		function selectTool(element) {
			var tool = $(element);

			//Before changing, insert the current tool in the last tools
			App.Tools.insertInLastTools($('#tools .active'));
			
			//Mark the new tool as active
			$('.tool').removeClass('active');
			$('.tool[data-blockSet-id=' + tool.attr('data-blockSet-id') + ']').addClass('active');
			
			//Sets the cursor image
			App.Utils.setCursorImg(tool.find('img').attr('src'));
		}
	
		/**
		 * @author mauricio.araldi
		 * @since 20/03/2014
		 *
		 * Load tools from image files. Used when the user directly load images
		 * as tools
		 *
		 * @parameter Filelist files - The Filelist that contains the files to be
		 * loaded as tools
		 */
		function loadFromFiles(files) {
			var files = Array.prototype.slice.call(files);
				
			//Clear current tools and BlockSet
			$('#tools').empty();
			App.currentBlockSet = [];
			
			files.forEach(function(file, i) {
				var imgURL = App.Values.blocksImagesSrc + file.name,
					imgName = file.name.slice(0, file.name.indexOf('.')),
					img = new Image(),
					div = $('<div class="tool">'),
					block = new Block(i+1, file.name);

				//Updates the current BlockSetId
				App.Values.currentBlockSetId = block.blockSetId;
				
				//Add tool to the BlockSet
				App.currentBlockSet.push(block);
				
				//Set tool image
				img.src = imgURL;
				
				//Append img element on tool element
				div.attr('data-blockSet-id', block.blockSetId)
					.append(img);
					
				//Initialize tooltip on the tool
				new Opentip(div[0], imgName, {delay: 0});
				
				//Append the tool to the app
				$('#tools').append(div);
			});
			
			//Redraws the map
			App.Map.drawMap(App.currentMap, App.Values.stage);
			
			//Select the first tool
			$('.tool').get(0).click();
			
			//Clear last tools
			$('#last-tools').empty();
			
			App.Utils.addSuccessMessage( App.i18n('dataLoadedSuccessfully') );
		}
		
		/**
		 * @author mauricio.araldi
		 * @since 26/03/2014
		 *
		 * Add a tool to the last tools
		 *
		 * @parameter HTMLElement tool - The tool to be added to last tools
		 */
		function insertInLastTools(tool) {
			var lastTools = $('#last-tools'),
				blockSetId = tool.attr('data-blockSet-id');
			
			tool = $(tool);
			
			//If the tool is valid
			if (tool[0]) {
				var equalTools = lastTools.find('.tool[data-blockSet-id='+ blockSetId +']');
				
				//If the tool isn't already in last tools
				if (equalTools.length == 0) {
					var clone = tool.clone();
					
					//Creates and sets a clone of the tool
					clone
					.removeClass('active')
					.on('click', function() {
						$('#tools .tool[data-blockSet-id='+ blockSetId +']').trigger('click');
					});
					
					//Append the tool in the last tools
					lastTools.append(clone);
				}
				
				//If the number of last tools is higher than the limit
				if (lastTools.find('div').length > App.Values.lastUsedToolsQuantity) {
					//Remove the first tool on the list
					$('#last-tools div:first-child').remove();
				}
			}
		}
		
		//These functions will be visible
		return {
			init : init,
			bindEvents : bindEvents,
			loadFromFiles : loadFromFiles,
			insertInLastTools : insertInLastTools,
		};
	})();

	// DOM Ready -- Initialize Module
	$(function() {
		App.Tools.bindEvents();
		App.Tools.init();
	});
	
})( jQuery, window );