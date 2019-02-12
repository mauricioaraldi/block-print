function DropDown(element, position, options, isSubMenu) {
	var screenBlock = document.createElement('div'),
		x,
		y;

	//Verify position
	if (isSubMenu) {
		x = position.x ? position.x : (position.getClientRects()[0].x + position.getClientRects()[0].width);
		y = position.y ? position.y : position.getClientRects()[0].y;
	} else {
		x = position.x ? position.x : position.getClientRects()[0].x;
		y = position.y ? position.y : (position.getClientRects()[0].y + position.getClientRects()[0].height);
	}

	//Verify options
	options = options ? options : {};
	options.onOpen = options.onOpen ? options.onOpen : function(){};
	options.onClose = options.onClose ? options.onClose : function(){};

	//ScreenBlock settings
	if (!isSubMenu) {
		screenBlock.id = 'dd-screen-block';
		screenBlock.onclick = function() {
			DropDown.closeAll(options);
		};
		screenBlock.oncontextmenu = function() {
			return false;
		};
		document.querySelector('body').appendChild(screenBlock);
	}

	//Position element
	element.style.left = x + 'px';
	element.style.top = y + 'px';

	//Shows element
	element.style.display = 'block';

	options.onOpen();

	//Close action to children of element
	//TODO Fix the closeAll on child click
	var achors = element.querySelectorAll('a');
	var i = achors.length;
	while (i--) {
		var child = achors[i];
		child.addEventListener('click', DropDown.closeAll);
	}

	//Sub-navigation action from sub-menus
	var submenus = element.querySelectorAll('.dd-submenu');
	var i = submenus.length;
	while (i--) {
		var submenu = submenus[i];

		submenu.addEventListener('mouseenter', function() {
			var nav = this.querySelector('.dd-menu');
			DropDown(nav, this, null, true);
		});

		submenu.addEventListener('mouseleave', function() {
			var nav = this.querySelector('.dd-menu');
			nav.style.display = '';
		});
	}

	element.oncontextmenu = function() {
		return false;
	};
}

DropDown.close = function(element, options) {
	var screenBlock = document.querySelector('#dd-screen-block');
	element.style.display = '';
	screenBlock.remove();

	if (options && options.onClose) {
		options.onClose();
	}
}

DropDown.closeAll = function(options) {
	var dropdowns = document.querySelectorAll('.dd-menu'),
		screenBlock = document.querySelector('#dd-screen-block');
	
	var i = dropdowns.length;
	while (i--) {
		dropdowns[i].style.display = '';
	}

	screenBlock.remove();

	if (options && options.onClose) {
		options.onClose();
	}
}