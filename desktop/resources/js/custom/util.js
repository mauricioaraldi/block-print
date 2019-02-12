/**
 * @author mauricio.araldi
 * @since 20/03/2014
 *
 * As the jQuery isn't the most performatic way to do some tasks, this file has been created. 
 * It substitutes jQuery in some simple tasks, achieving more performance.
 */

/**
 * @author mauricio.araldi
 * @since 20/03/2014
 *
 * Query Selector, return an array with the objects queried.
 * The parameter can be another object, an array of objects, a query string
 * or a string with '<' and '>', to create an object.
 */
S = function() {
	var arr = [],
		args = [];
		
	//Transforms the arguments into an array, to iterate them
	for(var i = arguments.length; i--; args.unshift(arguments[i]));
	
	args.forEach(function(arg) {
		if (!arg) {
			return false;
		}
	
		//If the arg passed is already an object, just enclose it
		if (typeof arg == 'object') {
			if (arg.length) { //If the object is an array already
				arr = arr.concat(arg);
			} else { //If the object is not an array
				arr.push(arg);
			}
			return;
		}

		//If the element is to be created
		if (arg.indexOf('<') > -1) {
			var tagName = arg.slice(1, arg.length-1);
			arr.push(document.createElement(tagName));
			return;
		}
		
		var nl = document.querySelectorAll(arg);

		//Nodelist to array
		for(var i = nl.length; i--; arr.unshift(nl[i]));
	});

	return arr;
};