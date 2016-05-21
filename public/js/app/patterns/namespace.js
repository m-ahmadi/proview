a.namespace = function (name) {
	if (!name) { return; }
	var i,
		parts = name.split('.'),
		current = a;
	console.log(this);
	for (i=0; i < parts.length; i+=1) {
		if ( !current[ parts[i] ] ) {
			current[ parts[i] ] = {};
		}
		current = current[parts[i]];
	}
};