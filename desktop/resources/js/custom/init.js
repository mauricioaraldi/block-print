$(function() {
	//Set app values
	App.Values.cursor = $('#cursor')[0];
	App.Values.stage = $('canvas')[0];
	App.Values.grid = $('#grid')[0];
	
	//Draw a new map and adjust it
	App.currentMap = App.Map.createNewMap(App.Values.lines, App.Values.columns);
	App.Stage.adjustSize();
	
	//Adjust and draw grid
	App.Grid.adjustSize();
	App.Grid.draw();
	
	//Draw and adjust line and column headers
	App.Headers.drawHeaders();
	App.Headers.adjustStageContainerPosition();
	App.Headers.adjustHeaderManagersPosition();

	$(window).on('resize', function() {
		App.Headers.drawHeaders();
		App.Headers.adjustStageContainerPosition();
		App.Headers.adjustHeaderManagersPosition();
	});

	/**
	 * @author mauricio.araldi
	 * @since 20/03/2014
	 *
	 * Makes the context menu not able to open on screen block
	 *
	 * @element .screen-block
	 * @event contextmenu
	 */
	$(document).on('contextmenu', '.screen-block', function(ev) {
		ev.preventDefault();
	});
	
	/**
	 * @author mauricio.araldi
	 * @since 20/03/2014
	 *
	 * When the user clicks the block-screen, unblocks the screen
	 *
	 * @element .screen-block
	 * @event mousedown
	 */
	$(document).on('mousedown', '.screen-block', function(ev) {
		App.Utils.unblockScreen();
	});
});