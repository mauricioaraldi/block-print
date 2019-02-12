;(function ( $, window ) {

	/**
	 * @author mauricio.araldi
	 * @since 25/08/2014
	 *
	 * This module controls headers interactions.
	 */
	App.Headers = (function(){
	
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
			 * Controls the scrolling of the line and column headers
			 *
			 * @element main
			 * @event scroll
			 */
			$(window).on('scroll', function(ev) {
				var originalScrollLeft = window.scrollX,
					originalScrollTop = window.scrollY;
					
				//If the horizontal scroll has changed
				if (originalScrollLeft != App.Values.lastScrollLeft) { //Scroll left
					var scrollAmount = originalScrollLeft - App.Values.lastScrollLeft;
					$('#line-headers').css('left', parseInt( $('#line-headers').css('left') ) + scrollAmount);
				} else { //Scroll top
					var scrollAmount = originalScrollTop - App.Values.lastScrollTop;
					$('#column-headers').css('top', parseInt( $('#column-headers').css('top') ) + scrollAmount);
				}
				
				App.Values.lastScrollLeft = originalScrollLeft;
				App.Values.lastScrollTop = originalScrollTop;
			});
			
			/**
			 * @author mauricio.araldi
			 * @since 25/08/2014
			 *
			 * Insert or remove a highlight in the header that
			 * has been clicked
			 *
			 * @element .header
			 * @event click
			 */
			$(document).on('click', '.header', function() {
				var header = $(this),
					type = header.data('line') || header.data('line') == 0 ? 'line' : 'column', 
					headerIndex = header.data(type),
					currentHighlight;
					
				//Filter all highlights to check if the header is already highlighted
				currentHighlight = $('.highlight').filter(function() {
					return $(this).data(type) == headerIndex;
				});
				
				//If the the header is already highlighted, remove the highlight
				if (currentHighlight[0]) {
					currentHighlight.remove();
					header.removeClass('highlighted');
					return;
				}
				
				//If the header is not highlighted, highlight it
				highlight(header, type);
			});
			
			/**
			 * @author mauricio.araldi
			 * @since 25/08/2014
			 *
			 * Opens the dropdown menu with header actions when any
			 * header is right-clicked
			 *
			 * @element .header
			 * @event mousedown
			 */
			$(document).on('mousedown', '.header', function(ev) {
				if (ev.which == 3) {
					var header = $(this),
						type = header.data('line') || header.data('line') == 0 ? 'line' : 'column',
						position = {x: ev.clientX, y: ev.clientY};
					
					header.addClass('active-header');

					if (type == 'line') {
						DropDown($('#headers-line-contextmenu')[0], position, {
							onClose: function() {
								$('.header.active-header').removeClass('active-header');
							}
						});
					} else if (type == 'column') {
						DropDown($('#headers-column-contextmenu')[0], position, {
							onClose: function() {
								$('.header.active-header').removeClass('active-header');
							}
						});
					}
				}
			});
			
			/**
			 * @author mauricio.araldi
			 * @since 25/08/2014
			 *
			 * Prevents the browser context-menu (right click menu) from
			 * opening when headers are clicked
			 *
			 * @element .header
			 * @event contextmenu
			 */
			$(document).on('contextmenu', '.header', function(ev) {
				return false;
			});

			/**
			 * @author mauricio.araldi
			 * @since 08/01/2015
			 *
			 * Deletes the contextmenu'ed line
			 *
			 * @element #delete-line
			 * @event click
			 */
			$('#delete-line').on('click', function() {
				var lineNumber = $('.active-header').data('line');

				//Removes the line
				App.Map.removeLine(lineNumber);
				
				//Update app values
				updateAppValues();
				
				//Highlight again previous highlighted lines
				reHighlightLines(lineNumber);
			});

			/**
			 * @author mauricio.araldi
			 * @since 08/01/2015
			 *
			 * Deletes the highlighted lines
			 *
			 * @element #delete-highlighted-lines
			 * @event click
			 */
			$('#delete-highlighted-lines').on('click', function() {
				removeHighlightedLines();
				$('.header.active-header').removeClass('active-header');
			});

			/**
			 * @author mauricio.araldi
			 * @since 08/01/2015
			 *
			 * Deletes the contextmenu'ed column
			 *
			 * @element #delete-column
			 * @event click
			 */
			$('#delete-column').on('click', function() {
				var columnNumber = $('.active-header').data('column');

				//Removes the column
				App.Map.removeColumn(columnNumber);
				
				//Update app values
				updateAppValues();
				
				//Remove this column highlight
				reHighlightColumns(columnNumber);
			});

			/**
			 * @author mauricio.araldi
			 * @since 08/01/2015
			 *
			 * Deletes the highlighted columns
			 *
			 * @element #delete-highlighted-columns
			 * @event click
			 */
			$('#delete-highlighted-columns').on('click', function() {
				removeHighlightedColumns();
				$('.header.active-header').removeClass('active-header');
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
		 * @since 25/08/2014
		 *
		 * Highlights a header and its line/column
		 *
		 * @parameter HTMLElement header - The header that has been clicked
		 * @parameter String type - The type of the header ('line' or 'column')
		 */
		function highlight(header, type) {
			var $header = $(header),
				headerIndex = $header.data(type),
				highlight = $('<div class="highlight">');
				
			$header.addClass('highlighted');
			
			//If its a line header
			if (type == 'line') {
				highlight.addClass('line-highlight')
					.attr('data-line', headerIndex)
					.css({
						'top' : (headerIndex * App.Values.cellSize) + 'px',
						'width' : App.Values.stage.width + 'px',
						'height' : App.Values.cellSize + 'px'
					});
					
			//If its a column header		
			} else if (type == 'column') {
				highlight.addClass('column-highlight')
					.attr('data-column', headerIndex)
					.css({
						'left' : (headerIndex * App.Values.cellSize) + 'px',
						'height' : App.Values.stage.height + 'px',
						'width' : App.Values.cellSize + 'px'
					});
			}
		
			//Appends highlight into app
			$('main').append(highlight);
		}
		
		/**
		 * @author mauricio.araldi
		 * @since 25/08/2014
		 *
		 * Draw a header for each line in the map
		 */
		function drawLineHeaders() {
			var lineManager = $('#line-headers');
			
			//Reset current headers
			lineManager.empty();
			
			//Draw a header for each line
			App.currentMap.forEach(function(line, l) {
				var header;

				header = $('<div class="header line-header">')
							.attr('data-line', l)
							.text(l+1);
				
				//Append the header into app
				lineManager.append(header);

				//Initialize tooltip on the header
				var tooltip = new Opentip(header, l+1, {delay: 0});

				setTimeout(function() {
					tooltip.deactivate();
				}, 100);
			});
		}
		
		/**
		 * @author mauricio.araldi
		 * @since 18/08/2014
		 *
		 * Draw a header for each column in the map
		 */
		function drawColumnHeaders() {
			var columnManager = $('#column-headers');
				
			//Reset current headers
			columnManager.empty();
			
			//Draw a header for each column
			App.currentMap[0].forEach(function(column, c) {
				var header;

				header = $('<div class="header column-header">')
							.attr('data-column', c)
							.text(c+1);
				
				//Append the header into app
				columnManager.append(header);

				//Initialize tooltip on the header
				var tooltip = new Opentip(header, c+1, {delay: 0});

				setTimeout(function() {
					tooltip.deactivate();
				}, 100);
			});
		}
		
		/**
		 * @author mauricio.araldi
		 * @since 18/08/2014
		 *
		 * Draw the column and line headers
		 */
		function drawHeaders() {
			//Stop drawing if no map is found
			if (!App.currentMap[0]) {
				$('#line-headers').empty();
				$('#column-headers').empty();
				console.warn( App.i18n('noMapFound') );
				return;
			}
			
			drawLineHeaders();
			drawColumnHeaders();
		}
		
		/**
		 * @author mauricio.araldi
		 * @since 25/08/2014
		 *
		 * Adjusts the stage container position accordingly to line and column managers
		 */
		function adjustStageContainerPosition() {
			var zoomContainer = $('#zoom-container'),
				main = $('main');
				
			zoomContainer.css({
				'top' : $('#top-bar').height(),
				'left' : $('#left-bar').width()
			});

			main.css({
				'top' : $('#column-headers').height(),
				'left' : $('#line-headers').width()
			});
		}
		
		/**
		 * @author mauricio.araldi
		 * @since 18/08/2014
		 *
		 * Adjust header managers position
		 */
		function adjustHeaderManagersPosition() {
			var lineManager = $('#line-headers'),
				columnManager = $('#column-headers');
			
			//Sets line manager positions
			lineManager.css('top', columnManager.height());
			
			//Sets column manager position
			columnManager.css('left', lineManager.width());
		}
		
		/**
		 * @author mauricio.araldi
		 * @since 20/08/2014
		 *
		 * Function called whenever lines or columns are removed, so the app updates
		 * itself where it is needed
		 */
		function updateAppValues() {
			//Stage update
			App.Stage.adjustSize();
			
			//Map update
			App.Map.drawMap(App.currentMap, App.Values.stage);
			
			//Grid update
			App.Grid.draw();
			App.Grid.adjustSize();
			
			//Headers update
			drawHeaders();
		}
		
		/**
		 * @author mauricio.araldi
		 * @since 20/08/2014
		 *
		 * Removes all lines that are highlighted
		 */
		function removeHighlightedLines() {
			var highlightedLines = $('#line-headers .highlighted');
			
			//Remove current highlights
			$('.highlight[data-line]').remove();
			$('.line-header.highlighted').removeClass('highlighted');
			
			//Delete lines from the biggest number to the lowest
			var i = highlightedLines.length;
			while (i--) {
				var lineNumber = $(highlightedLines[i]).data('line');

				//Removes the line
				App.Map.removeLine(lineNumber);
			}

			//Update app values
			updateAppValues();
		}
		
		/**
		 * @author mauricio.araldi
		 * @since 20/08/2014
		 *
		 * Removes all columns that are highlighted
		 */
		function removeHighlightedColumns() {
			var highlightedColumns = $('#column-headers .highlighted');
			
			//Remove current highlights
			$('.highlight[data-column]').remove();
			$('.column-header.highlighted').removeClass('highlighted');
			
			//Delete lines from the biggest number to the lowest
			var i = highlightedColumns.length;
			while (i--) {
				var columnNumber = $(highlightedColumns[i]).data('column');

				//Removes the column
				App.Map.removeColumn(columnNumber);
			}

			//Update app values
			updateAppValues();
		}
		
		/**
		 * @author mauricio.araldi
		 * @since 20/08/2014
		 *
		 * Highlights again all previously highlighted lines (for when a line delete occurs)
		 *
		 * @parameter Integer lineNumber - The number of the line that has been deleted
		 */
		function reHighlightLines(lineNumber) {
			var highlights = $('.line-highlight');
			
			highlights.each(function(i, highlight) {
				//Get the highlighted line number
				var highlightLine = $(highlight).data('line'),
					header;
					
				//Remove previous highlight
				$(highlight).remove();
				
				//If the highlight is after the line deleted, moves it one line down
				if (highlightLine > lineNumber) {
					highlightLine--;
				}
				
				//Header to highlight
				header = $('#line-headers div[data-line='+ highlightLine +']');
					
				//Click on header to highlight again
				$(header).click();
			});
		}
		
		/**
		 * @author mauricio.araldi
		 * @since 20/08/2014
		 *
		 * Highlights again all previously highlighted columns (for when a column delete occurs)
		 *
		 * @parameter Integer columnNumber - The number of the column that has been deleted
		 */
		function reHighlightColumns(columnNumber) {
			var highlights = $('.column-highlight');
			
			highlights.each(function(i, highlight) {
				//Get the highlighted column number
				var highlightColumn = $(highlight).data('column'),
					header;
			
				//Remove previous highlight
				$(highlight).remove();
					
				//If the highlight is after the column deleted, moves it one column down
				if (highlightColumn > columnNumber) {
					highlightColumn--;
				}
				
				//Header to highlight
				header = $('#column-headers div[data-column='+ highlightColumn +']');
				
				//Click on header to highlight again
				$(header).click();
			});
		}
		
		//These functions will be visible
		return {
			bindEvents : bindEvents,
			init : init,
			drawHeaders : drawHeaders,
			adjustHeaderManagersPosition : adjustHeaderManagersPosition,
			adjustStageContainerPosition : adjustStageContainerPosition,
		};
	})();

	// DOM Ready -- Initialize Module
	$(function() {
		App.Headers.bindEvents();
		App.Headers.init();
	});
	
})( jQuery, window );