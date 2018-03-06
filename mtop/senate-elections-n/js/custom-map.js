var	SVGwidth = 960,
	SVGheight = 600,
	margin = {top: 10, right: 10, bottom: 10, left: 10},
	width = SVGwidth - margin.left - margin.right,
	height = SVGheight - margin.top - margin.bottom;

var svg = d3.select('div#graph')
				.append('svg')
				.attr('class', 'co2-levels')
				.attr('width', SVGwidth)
				.attr('height', SVGheight); 

var x = d3.scaleLinear()
				.rangeRound([0, width]),
	y = d3.scaleLinear()
				.range([height, 0]);

var radius = d3.scalePow()
	.exponent(0.5)
	.domain([0, 1e6])
	.range([0, 20]);

function scale (scaleFactor) {
	return d3.geoTransform({
		point: function(x, y) {
			this.stream.point( (x - width/2) * scaleFactor + width/2 , (y - height/2) * scaleFactor + height/2);
		}
	});
}

var projection = d3.geoAlbersUsa();
var path = d3.geoPath();

queue()
	.defer(d3.json, "https://d3js.org/us-10m.v1.json")
	.defer(d3.json, "us-state-centroids.json")
	.await(ready);

function ready(error, us, centroid) {
 	if (error) throw error;

	svg.append("g")
		.attr("class", "states")
		.selectAll("path")
		.data(topojson.feature(us, us.objects.states).features)
		.enter()
		.append("path")
		.attr("d", path)
		.attr("fill", "#fff")
		.attr("stroke", "#fff");

	popData = centroid.features.sort(function(a, b) { return d3.ascending(b.properties.population, a.properties.population); });

	svg.selectAll("circle")
		.data(popData)
		.enter()
		.append("rect")
		.attr("x", function (d) { return projection(d.geometry.coordinates)[0]; })
		.attr("y", function (d) { return projection(d.geometry.coordinates)[1]; })
		.attr("width", function(d){ return radius(d.properties.population); })
		.attr("height", function(d){ return radius(d.properties.population); })
		.attr("fill", "rgb(51, 204, 204)")
		.attr("stroke", "rgb(153, 153, 153)")
		.attr("opacity", "0.9");
}

/*

var gs = d3.graphScroll()
			.container(d3.select('#container'))
			.graph(d3.selectAll('#graph'))
			.eventId('uniqueId1')
			.sections(d3.selectAll('#sections > div'))
			.on('active', function(i){
				update(i);
			})

var steps = [
	function step0() {
		
	},
	function step1() {

	},
	function step2() {

	},
	function step3() {

	},
	function step4() {

	},
	function step5() {

	},
	function step6() {
	},
	function step7() {

	},
	function step8() {

	},
	function step9() {

	},
	function step10() {

	},
	function step11() {

	}               
]

function update(step) {
	svg.selectAll(".down-trend").remove();
	svg.selectAll(".overall-trend").remove();
	svg.selectAll(".mean-line").remove();
	steps[step].call();
}

*/




