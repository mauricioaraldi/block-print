Popups.Config = {
	btnClass: 'btn',
};

Popups.restoreLocation = {};

function Popups(content, options, buttons) {
	var options = typeof options == 'undefined' ? {} : options,
		popup = document.createElement('div'),
		closeBtn = document.createElement('div'),
		screenBlock = document.createElement('div'),
		body = document.querySelector('body');
	
	//Set attributes
	popup.id = 'popups';
	screenBlock.id = 'popups-screen-block';
	
	//ScreenBlock action
	screenBlock.onclick = Popups.closeAll;

	//Append close button
	closeBtn.id = 'popups-close-btn';
	closeBtn.innerHTML = 'X';
	closeBtn.onclick = Popups.closeAll;
	popup.appendChild(closeBtn);
	
	//Append title, if it exists
	if (options.title) {
		var h2 = document.createElement('h2');
		h2.innerHTML = options.title;
		popup.appendChild(h2);
	}
	
	//Append content
	if (typeof content == 'object') { //If the content is an object
		Popups.restoreLocation[content.id] = content.parentNode.id;
		content.setAttribute('data-popups', 'content');
		popup.appendChild(content);
	} else { //If the content is a string
		contentDiv = document.createElement('div');
		contentDiv.innerHTML = content;
		contentDiv.setAttribute('data-popups', 'content');
		popup.appendChild(contentDiv);
	}
	
	//Append buttons
	if (typeof buttons == 'object') {
		var btnLine = document.createElement('div');
		
		btnLine.id = 'popups-btn-line';
		
		for (var key in buttons) {
			var btn = document.createElement('div');
			btn.innerHTML = key;
			
			btn.onclick = buttons[key];
			
			btn.classList.add(Popups.Config.btnClass);
			
			btnLine.appendChild(btn);
		}
		
		popup.appendChild(btnLine);
	}
	
	//Append popup to the body
	body.appendChild(screenBlock);
	body.appendChild(popup);
	
	//Execute initialization function
	var onLoadFunction = options.onLoad ? options.onLoad : function(){};
	onLoadFunction();
}

Popups.closeAll = function() {
	var popup = document.querySelector('#popups'),
		screenBlock = document.querySelector('#popups-screen-block');
		
	if (Object.keys(Popups.restoreLocation).length > 0) {
		var content = popup.querySelector('[data-popups=content]');
		document.querySelector('#'+Popups.restoreLocation[content.id]).appendChild(content);
		Popups.restoreLocation = {};
	}
		
	popup.remove();
	screenBlock.remove();
};