var _ = require('underscore'),
	onecolor = require('onecolor'),
	c = require('./color');
	
exports.predominantColors = function(colors){
	var prerun = [],
		color,
		rgb;
	for(i in colors){
		rgb = _stringArrayToInt(colors[i].rgb);
		color = c.create(colors[i].percent).set({'onecolor': new onecolor('rgb('+rgb[0]+','+rgb[1]+','+rgb[2]+')')});
		if((color.onecolor.value()*100) > 30 && (color.onecolor.saturation()*100) > 30)
			prerun.push(color);
	}
	
	var buckets = _placeIntoBuckets(prerun);	
	return buckets;
}

function _placeIntoBuckets(colors){
	var red = [], orange = [], yellow = [], green = [], cyan = [], blue = [], magenta = [],
	hue,
	color;
	
	/**
	 *	value * 360
	 *	
	 *	red = 331-360, 0-20
	 *	orange = 21-50
	 *	yellow = 51-70
	 *	green = 71-160
	 *	cyan = 161-200
	 *	blue = 201-280
	 *	magenta = 281-330
	 */

	for(i in colors){
		color = colors[i];
		hue = color.onecolor.hue() * 360;
		color.onecolor.value(1).saturation(1);
		
		if(hue > 0 && hue <= 20)
			red.push(color);
		else if(hue > 20 && hue <= 50)
			orange.push(color);
		else if(hue > 50 && hue <= 70)
			yellow.push(color);
		else if(hue > 70 && hue <= 160)
			green.push(color);
		else if(hue > 160 && hue <= 200)
			cyan.push(color);
		else if(hue > 200 && hue <= 280)
			blue.push(color);
		else if(hue > 280 && hue <= 330)
			magenta.push(color);
		else
			red.push(color);
	}
	
	red.sort(function(a,b){return b.percentage-a.percentage});
	orange.sort(function(a,b){return b.percentage-a.percentage});
	yellow.sort(function(a,b){return b.percentage-a.percentage});
	green.sort(function(a,b){return b.percentage-a.percentage});
	cyan.sort(function(a,b){return b.percentage-a.percentage});
	blue.sort(function(a,b){return b.percentage-a.percentage});
	magenta.sort(function(a,b){return b.percentage-a.percentage});
	
	
	var buckets = [red, orange, yellow, green, cyan, blue, magenta];	
	buckets.sort(function(a,b){return b.length-a.length});
		
	return buckets;
}

function _stringArrayToInt(array){
	var intArr = [];
	for(var i = 0; i < 3; i++){
		if(array[i])
			intArr[i] = array[i].length < 1 ? 0 : parseInt(array[i]);
		else
			intArr[i] = 0;
	}
	return intArr;
}

function _colorToRGB(colors){
	var arr = [];
	for(i in colors){
		rgb = colors[i];
		arr[i] = [rgb.red(), rgb.green(), rgb.blue()];
	}
	return arr;
}