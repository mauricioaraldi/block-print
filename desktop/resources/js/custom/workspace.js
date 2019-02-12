;(function ( $, window ) {

	/**
	 * @author mauricio.araldi
	 * @since 21/08/2014
	 *
	 * This module controls workspace interactions.
	 */
	App.Workspace = (function(){
	
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
		 * @since 20/03/2014
		 *
		 * Saves the data related to workspace on localStorage
		 */
		function save() {
			//Build and saves the related data
			var data = exportWorkspace();
			localStorage.setItem(App.Values.localStorageKey, data);
			
			//Send a success message to the screen and console
			App.Utils.addSuccessMessage( App.i18n('dataSavedSuccessfully') );
			console.info( App.i18n('dataSavedSuccessfully') );
		}

		/**
		 * @author mauricio.araldi
		 * @since 12/01/2015
		 *
		 * Loads the Workspace from local storage
		 */
		function load() {
			var data = localStorage.getItem(App.Values.localStorageKey);
				importWorkspace(data);
		}

		/**
		 * @author mauricio.araldi
		 * @since 12/01/2015
		 *
		 * Returns a json string representing the workspace
		 *
		 * @return String json - A json string representation of the workspace
		 */
		function exportWorkspace() {
			var data = {
				blockSet: App.currentBlockSet, 
				map: App.currentMap, 
				zoomLevel: App.Values.zoomLevel,
				currentBlockSetId: App.Values.currentBlockSetId
			};

			return JSON.stringify(data);
		}

		/**
		 * @author mauricio.araldi
		 * @since 12/01/2015
		 *
		 * Loads the workscace from a json string representing the workspace
		 *
		 * @parameter String workspaceJSON - A json string representation of the workspace
		 */
		function importWorkspace(workspaceJSON) {
			//If no data was provided
			if (!workspaceJSON) {
				//Send error message to screen and console
				App.Utils.addErrorMessage( App.i18n('errorNoDataProvided') );
				console.error( App.i18n('errorNoDataProvided') );
				return
			}
		
			try {
				//Parse the data
				var workspace = JSON.parse(workspaceJSON);
			
				//Set the BlockSet
				App.currentBlockSet = workspace.blockSet;
				App.BlockSet.loadToolsFromBlockSet(App.currentBlockSet, App.Values.blocksImagesSrc);
				
				//Set App Values
				App.Values.lines = workspace.map.length;
				App.Values.columns = workspace.map[0].length;

				//Adjusts stage and draw map
				App.currentMap = workspace.map;
				App.Stage.adjustSize();
				App.Map.drawMap(App.currentMap, App.Values.stage);
				
				//Adjust and draw grid
				App.Grid.adjustSize();
				App.Grid.draw();
				
				//Create column and line headers
				App.Headers.drawHeaders();

				//Set zoom level
				App.Utils.setZoomLevel(workspace.zoomLevel);

				//Set blockSetId
				App.Values.currentBlockSetId = workspace.currentBlockSetId;
				
				//Send success message to screen and console
				App.Utils.addSuccessMessage( App.i18n('dataLoadedSuccessfully') );
				console.info( App.i18n('dataLoadedSuccessfully') );
			} catch (err) {
				//Send error message to screen and console
				App.Utils.addErrorMessage( App.i18n('invalidDataProvided') );
				console.error(err);
			}
		}
	
	
		//These functions will be visible
		return {
			bindEvents : bindEvents,
			init : init,
			load : load,
			save : save,
			exportWorkspace : exportWorkspace,
			importWorkspace : importWorkspace,
		};
	})();

	// DOM Ready -- Initialize Module
	$(function() {
		App.Workspace.bindEvents();
		App.Workspace.init();
	});
	
})( jQuery, window );