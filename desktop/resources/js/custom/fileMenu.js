;(function ( $, window ) {

	/**
	 * @author mauricio.araldi
	 * @since 20/03/2014
	 *
	 * This module controls file menu.
	 */
	App.FileMenu = (function(){
	
		/**
		 * @author mauricio.araldi
		 * @since 20/03/2014
		 *
		 * Default function with all event bindings related to this module
		 */
		function bindEvents() {
			/**
			 * @author mauricio.araldi
			 * @since 20/03/2014
			 *
			 * When any option is clicked, the screen will be unblocked
			 *
			 * @element #file-menu li
			 * @event click
			 */
			$('#file-menu li').on('click', function() {
				App.Utils.unblockScreen();
			});
			
			/**
			 * @author mauricio.araldi
			 * @since 20/08/2014
			 *
			 * When the "File" button is pressed, opens file menu
			 *
			 * @element #open-file-menu
			 * @event click
			 */
			$('#open-file-menu').on('click', function() {
				DropDown($('#file-menu')[0], this);
			});
			
			/**
			 * @author mauricio.araldi
			 * @since 20/08/2014
			 *
			 * When the "Export Blockset" button is pressed, opens the popup
			 * to export the BlockSet string
			 *
			 * @element #export-blockSet-btn
			 * @event click
			 */
			$('#export-blockSet-btn').on('click', function() {
				Popups($('#blockSet-popup-content')[0], 
					{	//Options
						title: App.i18n('blockSet.export'), 
						onLoad: function() {
							//Sets data on the field
							$('#blockSet-json').val( App.BlockSet.exportBlockSet() );
						}
					}
				);
			});
			
			/**
			 * @author mauricio.araldi
			 * @since 21/08/2014
			 *
			 * When the "Import Blockset" button is pressed, opens the popup
			 * to import the BlockSet string
			 *
			 * @element #import-blockSet-btn
			 * @event click
			 */
			$('#import-blockSet-btn').on('click', function() {
				Popups($('#blockSet-popup-content')[0], 
					{	//Options
						title: App.i18n('blockSet.import'), 
						onLoad: function() {
							$('#blockSet-json').val('');
						}
					}, 
					{	//Buttons
						Load : function() {
							var data = $('#blockSet-json').val();
							App.BlockSet.importBlockSet(data);
							
							//Close all popups
							Popups.closeAll();
						}
					}
				);
			});

			/**
			 * @author mauricio.araldi
			 * @since 21/08/2014
			 *
			 * When the "Export Map" button is pressed, opens the popup
			 * to export the map string
			 *
			 * @element #export-map-btn
			 * @event click
			 */
			$('#export-map-btn').on('click', function() {
				Popups($('#map-popup-content')[0], 
					{	//Options
						title: App.i18n('map.export'), 
						onLoad: function() {
							//Sets data on the field
							$('#map-json').val( App.Map.exportMap() );
						}
					}
				);
			});
			
			/**
			 * @author mauricio.araldi
			 * @since 21/08/2014
			 *
			 * When the "Import Map" button is pressed, opens the popup
			 * to import the map string
			 *
			 * @element #import-map-btn
			 * @event click
			 */
			$('#import-map-btn').on('click', function() {
				Popups($('#map-popup-content')[0], 
					{	//Options
						title: App.i18n('map.import'), 
						onLoad: function() {
							$('#map-json').val('');
						}
					}, 
					{	//Buttons
						Load : function() {
							var data = $('#map-json').val();
							App.Map.importMap(data);
							
							//Close all popups
							Popups.closeAll();
						}
					}
				);
			});
			
			/**
			 * @author mauricio.araldi
			 * @since 21/08/2014
			 *
			 * When the "Load Workspace" button is pressed
			 *
			 * @element #load-workspace-btn
			 * @event click
			 */
			$('#load-workspace-btn').on('click', function() {
				var data = localStorage.getItem(App.Values.localStorageKey);
				App.Workspace.load(data);
			});
			
			/**
			 * @author mauricio.araldi
			 * @since 21/08/2014
			 *
			 * When the "Save Workspace" button is pressed
			 *
			 * @element #save-workspace-btn
			 * @event click
			 */
			$('#save-workspace-btn').on('click', function() {
				App.Workspace.save();
			});

			/**
			 * @author mauricio.araldi
			 * @since 12/01/2015
			 *
			 * When the "Import Workspace" button is pressed
			 *
			 * @element #import-workspace-btn
			 * @event click
			 */
			$('#import-workspace-btn').on('click', function() {
				Popups($('#workspace-popup-content')[0],
				{	//Options
					title: App.i18n('workspace.import'),
					onLoad: function() {
						$('#workspace-string').val('');
					}
				},
				{	//Buttons
					Save: function() {
						var data = $('#workspace-string').val();

						App.Workspace.importWorkspace(data);
						
						//Close all popups
						Popups.closeAll();
					}
				});
			});

			/**
			 * @author mauricio.araldi
			 * @since 12/01/2015
			 *
			 * When the "Export Workspace" button is pressed
			 *
			 * @element #import-workspace-btn
			 * @event click
			 */
			$('#export-workspace-btn').on('click', function() {
				Popups($('#workspace-popup-content')[0],
				{	//Options
					title: App.i18n('workspace.export'),
					onLoad: function() {
						$('#workspace-string').val(App.Workspace.exportWorkspace());
					}
				});
			});
			
			
			/**
			 * @author mauricio.araldi
			 * @since 21/08/2014
			 *
			 * When the "Change Map Size" button is pressed opens the popup
			 * where the user can user can insert the new size
			 *
			 * @element #change-map-size-btn
			 * @event click
			 */
			$('#change-map-size-btn').on('click', function() {
				Popups($('#change-size-popup-content')[0],
				{	//Options
					title: App.i18n('settings.changeMapSize'),
					onLoad: function() {
						$('#lines-change-size').val(App.Values.lines);
						$('#columns-change-size').val(App.Values.columns);
					}
				},
				{	//Buttons
					Save: function() {
						var lines = $('#lines-change-size').val(),
							columns = $('#columns-change-size').val();
						
						App.Settings.changeMapSize(lines, columns);
						
						//Close all popups
						Popups.closeAll();
					}
				});
			});
			
			/**
			 * @author mauricio.araldi
			 * @since 22/08/2014
			 *
			 * When the "Load images" button is pressed opens the file
			 * select
			 *
			 * @element #load-images-btn
			 * @event click
			 */
			$('#load-images-btn').on('click', function() {
				$('#imgs').click();
			});
			
			/**
			 * @author mauricio.araldi
			 * @since 25/08/2014
			 *
			 * When the "New File" button is pressed clears the stage
			 *
			 * @element #new-file-btn
			 * @event click
			 */
			$('#new-file-btn').on('click', function() {
				App.currentMap = App.Map.createNewMap(App.Values.lines, App.Values.columns);
				App.Map.drawMap(App.currentMap, App.Values.stage);
			});
			
			/**
			 * @author mauricio.araldi
			 * @since 27/08/2014
			 *
			 * When the "Generate Image" button is pressed open a new window with the
			 * image from the stage
			 *
			 * @element #generate-image-btn
			 * @event click
			 */
			$('#generate-image-btn').on('click', function() {
				App.Utils.generateStageImage()
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

		//These function will be visible
		return {
			bindEvents : bindEvents,
			init : init,
			open : open,
		};
	})();

	// DOM Ready -- Initialize Module
	$(function() {
		App.FileMenu.bindEvents();
		App.FileMenu.init();
	});
	
})( jQuery, window );