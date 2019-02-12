/**
 * @author mauricio.araldi
 * @since 20/03/2014
 *
 * This file contains the control of keys that are pressed
 *
 */
 
 
//KEY DOWN
$(window).on('keydown', function(ev) {
	switch(ev.which) {
		case 16: //SHIFT
			App.Control.shift = true;
		break;
		
		case 17: //CTRL
			App.Control.ctrl = true;
		break;
	}
})

//KEY UP
.on('keyup', function(ev) {
	switch(ev.which) {
		case 16: //SHIFT
			App.Control.shift = false;
		break;
		
		case 17: //CTRL
			App.Control.ctrl = false;
		break;
	}
});