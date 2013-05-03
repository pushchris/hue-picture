var onecolor = require('onecolor');

var Color = function(percentage) {
	this.percentage = percentage;
};

module.exports.create = function(percentage) {
    return new Color(percentage);
};

Color.prototype.set = function(value){
	combine(this, value);
	return this; 
}

function combine(obj, values){
	var argIdx = 1,
        state,
        property;

    while (argIdx < arguments.length) {
        state = arguments[argIdx];
        for (property in state) {
            obj[property] = state[property];
        }
        argIdx++;
    }
    return obj;
}