var screenSize = screen.width;
if (screenSize<1100){
	var	canvasWidth = 408,
		canvasHeight = 408,
		tileHeight = 22,
		tileWidth = 22;
}

if (screenSize>1101 && screenSize<1400){
	var	canvasWidth = 544,
		canvasHeight = 544,
		tileHeight = 30,
		tileWidth = 30;
}

if (screenSize>1401 && screenSize<1601){
	var	canvasWidth = 612,
		canvasHeight = 612,
		tileHeight = 34,
		tileWidth = 34;
}

if (screenSize>1602 && screenSize<2000){
	var	canvasWidth = 714,
		canvasHeight = 714,
		tileHeight = 40,
		tileWidth = 40;
}

if (screenSize>2001){
	var	canvasWidth = 884,
		canvasHeight = 884,
		tileHeight = 50,
		tileWidth = 50;
}
