a.util = {
	isObject: function (v) {
		return (
			v &&
			typeof v === 'object' &&
			typeof v !== null &&
			Object.prototype.toString.call(v) === "[object Object]"
		) ? true : false;
	},
	isArray: function (v) {
		if ( typeof Array.isArray === 'function' ) {
			return Array.isArray(v);
		}
		return (
			v &&
			typeof v === 'object' &&
			typeof v.length === 'number' &&
			typeof v.splice === 'function' &&
			!v.propertyIsEnumerable('length') &&
			Object.prototype.toString.call(v) === "[object Array]"
		) ? true : false;
	},
	getArgs: function (a) {
		var args = new Array(a.length),
			i;
		for (i=0; i<args.length; i+=1) {
			args[i] = a[i];
		}
		return args;
	},
	extend: function () {
		var args = Array.prototype.slice.call(arguments),
			len = args.length,
			arr = [],
			objects = [],
			first, last,
			result;
			
		if (len === 1) {
			first = args[0];
			if ( this.isArray(first)  &&  first.length > 1 ) {
				last = first.pop();
				objects = first;
			} else if ( this.isObject(first) ){
				result = Object.create(first);
			}
		} else if (len === 2) {
			first = args[0];
			last = args[len-1];
			if ( this.isObject(first) ) {
				result = Object.create(first);
			}
		} else if (len > 2) {
			last = args.pop();
			objects = args;
		}
		
		if (objects.length !== 0) {
			arr.push( {} );
			objects.forEach(function (el, i) {
				if ( this.isObject(el) ) {
					Object.keys(el).forEach(function (k) {
						arr[i][k] = el[k];
					});
					arr.push( Object.create(arr[i]) );
				}
			});
			result = arr[arr.length-1];
		}
		
		if ( last && this.isObject(last) ) {
			Object.keys(last).forEach(function(key) {
				result[key] = last[key];
			});
		}
		return result;
	}
};