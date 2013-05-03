var hue = require('hue-module'),
	extract = require('./extract'),
	buckets = require('./buckets');
	
hue.load("192.168.1.103", "d5f00a77b79281a6e164764b06b07886");
	
extract.imageMagick(__dirname+'/bridge.jpg', function(err, data){
	if(err){
		console.log('IMAGE MAGICK ERROR ',err);
		process.exit(1);
	}
    
   var colorBuckets = buckets.predominantColors(data);
   var rgb;
   
   
    hue.lights(function(lights){    
    	_splitBucketForLights(lights.length, colorBuckets, function(buckets){
    		var light = 0;
	    	for(i in buckets){
	    		var current = buckets[i];
		    	for(var j = 0; j < current.lights; j++){
		    		var rgb = current.bucket[0].onecolor;
		    		console.log([rgb.red(),rgb.green(),rgb.blue()]);
			    	hue.change(lights[light].set({"on":true, "rgb":[rgb.red(),rgb.green(),rgb.blue()], "colormode":"xy"}));
			    	light++;
		    	}
	    	}
    	});
    });
});


function _stringArrayToInt(array){
	var intArr = [];
	for(entry in array)
		intArr[entry] = array[entry].length < 1 ? 0 : parseInt(array[entry]);

	return intArr;
}

function _splitBucketForLights(numOfLights, buckets, callback){
	var lightsPerBucket = [],
		totalColors = _totalColors(buckets),
		availableLights = numOfLights,
		allottedLights,
		i = 0;
	while(availableLights > 0 && i < buckets.length){
		console.log("Lights allotted to color: " +(buckets[i].length*numOfLights)/totalColors);
		allottedLights = Math.round((buckets[i].length*numOfLights)/totalColors);
		if(availableLights == 1)
			allottedLights = 1;
		lightsPerBucket.push({'lights': (availableLights - allottedLights) > 0 ? allottedLights : availableLights, 'bucket': buckets[i]});
		availableLights -= allottedLights;
		i++;
	}
	callback(lightsPerBucket);
}
function _totalColors(buckets){
	var total = 0;
	for(i in buckets)
		total += buckets[i].length;
	return total;
}