function FilledArray(size, content) {
	return Array.apply(null, new Array(size)).map(content.constructor.prototype.valueOf, content);
}