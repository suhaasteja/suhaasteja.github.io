var	domain = {x: 960, y: 504},
	margin = {top: 0, right: 0, bottom: 40, left: 20},
	SVGwidth = d3.select(".container")["_groups"][0][0].scrollWidth - 300,
	SVGheight = SVGwidth * 0.5625,
	width =  SVGwidth - margin.left - margin.right,
	height = SVGheight - margin.top - margin.bottom,
	scale = width/domain.x;

var svg = d3.select('div#graph')
				.append('svg')
				.attr('class', '2014-midterm-elections')
				.attr('width', SVGwidth)
				.attr('height', SVGheight);

var x = d3.scaleLinear()
				.domain([0, domain.x])
				.range([0, width]),
	y = d3.scaleLinear()
				.domain([domain.y, 0])
				.range([height, 0]),
	radius = d3.scalePow()
				.exponent(0.5)
				.domain([0, 1e6])
				.range([0, 24*scale]),
	labelPos = d3.scaleOrdinal()
				.domain(["N", "U", "R", "L", "D"])
				.range([[0, 0, 1], [0, -1, 0], [1, 0, 1], [0, 0, 0], [0, 1, 0]]);

var dur = 500, censusData;

d3.tsv('data/census-2018-midterm.tsv', function(data){
	drawTotal(data);
});

const statesAll = svg.append("g").attr("class", "state-all"),
	stateChange = svg.append("g").attr("class", "state-change"),
	textLabels = svg.append("g").attr("class", "state-labels");

function drawTotal(data){
	total = statesAll.selectAll("g")
				.data(data).enter()
				.append("rect")
				.attr("class", function(d){ return "s s-" + d.Text + " senate" + d.Senate + 
					" competetive" + d.Competetive + " incumbent-" + d.Incumbent + " elected-" + d.Elected; })
				.attr("x", function(d){ return x(d.x); })
				.attr("y", function(d){ return y(d.y); })
				.attr("width", function(d){ return radius(d.Population); })
				.attr("height", function(d){ return radius(d.Population); })
				.attr("fill", "None")
				.attr("stroke", "#85E0E0");

	selected = stateChange.selectAll("g")
				.data(data).enter()
				.append("rect")
				.attr("class", function(d){ return "c c-" + d.Text + " senate" + d.Senate + 
					" competetive" + d.Competetive + " incumbent-" + d.Incumbent + " elected-" + d.Elected; })
				.attr("x", function(d){ return x(d.x); })
				.attr("y", function(d){ return y(d.y); })
				.attr("width", function(d){ return radius(d.Population); })
				.attr("height", function(d){ return radius(d.Population); })
				.attr("fill", "#85E0E0")
				.attr("stroke", "rgb(153, 153, 153)");

	labels = textLabels.selectAll("g")
				.data(data).enter()
				.append("text")
				.attr("class", function(d){ return "state-label " + d.Text + " senate" + d.Senate + 
					" competetive" + d.Competetive + " incumbent-" + d.Incumbent + " elected-" + d.Elected; })
				.attr("x", function(d) { return x(d.x); })
				.attr("y", function(d) { return y(d.y); })
				.attr("dx", function(d){
					let x = +d3.select("rect.s-"+d.Text).attr("width");
					if (d.Label == "L"){
						return -28;
					}
					return x*labelPos(d.Label)[0] + 2*labelPos(d.Label)[2];
				})
				.attr("dy", function(d){
					return labelPos(d.Label)[1] * 18 + 14;
				})
				.text(function(d) { return d.Text; });
}

function updateData(key, duration){
	elem = svg.select(".senateN")

	if (elem.style("opacity") == 1){
		svg.transition()
			.ease(d3.easeQuadOut)
			.selectAll(".c")
			.duration(duration)
			.attr("width", function(d){ return radius(d[key]) })
			.attr("height", function(d){ return radius(d[key]) });
	}
}

function updatePos(duration){
	svg.selectAll("rect, text").style("opacity", 0);

	elem = svg.selectAll(".c.competetiveY, text.competetiveY");
	
	elem.style("opacity", 1);

	// d3.select("text.AK")
	// 	.attr("dx", function(d){ return -24 })
	// 	.attr("dy", function(d){ return (labelPos("L")[1] * 18 + 12) });

	elem.transition()
		.ease(d3.easeQuadOut)
		.duration(duration)
		.attr("x", function(d){ return d.Grouped.split(", ")[0] })
		.attr("y", function(d){ return d.Grouped.split(", ")[1]});
}

function translatePos(state){
	// d3.select("text.AK")
	// 	.attr("dx", function(d){ return (labelPos("U")[0] + 2*labelPos("U")[2]) })
	// 	.attr("dy", function(d){ return (labelPos("U")[1] * 18 + 12) });

	d3.selectAll("text.competetiveY")
		.transition()
		.duration(500)
		.attr("x", function(d) { return x(d.x); })
		.attr("y", function(d) { return y(d.y); });

	d3.selectAll("rect.s, text.competetiveN")
		.transition()
		.duration(500)
		.style("opacity", 1);

	elem = svg.selectAll(".c.competetiveY")
				.transition()
				.duration(1000)
				.attr("x", function(d){ return x(d.Translated.split(", ")[0]) })
				.attr("y", function(d){ return y(d.Translated.split(", ")[1]) });
}

function filterStates(key, duration){
	// d3.select("text.AK")
	// 	.attr("dx", function(d){ return (labelPos("U")[0] + 2*labelPos("U")[2]) })
	// 	.attr("dy", function(d){ return (labelPos("U")[1] * 18 + 12) });

	svg.selectAll(".s." + key + "N")
		.transition()
		.ease(d3.easeQuadOut)
		.duration(duration)
		.style("opacity", 0.2);
	svg.selectAll(".c." + key + "N")
		.transition()
		.ease(d3.easeQuadOut)
		.duration(duration)
		.style("opacity", 0);
	svg.selectAll("text." + key + "N")
		.transition()
		.ease(d3.easeQuadOut)
		.duration(duration)
		.style("opacity", 0.2);
}

function toggleParties(key, duration){
	if (key){
		d3.selectAll(".c.incumbent-Rep")
			.transition()
			.duration(duration)
			.attr('fill', '#E84B4B')
			.style('opacity', 1);
		d3.selectAll(".c.incumbent-Dem")
			.transition()
			.duration(duration)
			.attr('fill', '#00ADF6')
			.style('opacity', 1);
		d3.selectAll(".s.incumbent-Rep")
			.transition()
			.duration(duration)
			.attr('stroke', '#E84B4B')
			.style('opacity', 1);
		d3.selectAll(".s.incumbent-Dem")
			.transition()
			.duration(duration)
			.attr('stroke', '#00ADF6')
			.style('opacity', 1);

		d3.selectAll('text.incumbent-Rep, text.incumbent-Dem').style('opacity', 1);
	} else {
		d3.selectAll(".c.incumbent-Rep, .c.incumbent-Dem")
			.transition()
			.duration(duration)
			.attr('fill', '#85E0E0')
			.style('opacity', 1);
		d3.selectAll(".s.incumbent-Rep, .s.incumbent-Dem")
			.transition()
			.duration(duration)
			.attr('stroke', '#85E0E0')
			.style('opacity', 1);
	}
	
}

function restorePos(duration){
	svg.selectAll(".c.competetiveY, text.competetiveY")
		.transition()
		.duration(duration)
		.attr("x", function(d){ return x(d.x) })
		.attr("y", function(d){ return y(d.y) });
}

function showAll(selector = "*", duration){
	svg.selectAll(selector)
		.transition()
		.duration(duration)
		.style("opacity", 1);
}

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
		//drawTotal(censusData);
		updateData("Population", dur);
	},
	function step1() {
		updateData("Registered", dur);
	},
	function step2() {
		showAll(".senateN", dur);
		updateData("Voted", dur);
	},
	function step3() {
		showAll(".senateY", dur);
		filterStates("senate", dur);
		// toggleParties(false, dur);
	},	
	function step4() {
		// toggleParties(true, dur);
	},
	function step5() {
		showAll(".competetiveY", dur);
		filterStates("competetive", dur);
		restorePos(dur);
	},
	function step6() {
		updatePos(dur);
	},
	function step7() {
		translatePos("FL");
	}             
]

function update(step) {
	svg.selectAll(".down-trend").remove();
	svg.selectAll(".overall-trend").remove();
	svg.selectAll(".mean-line").remove();
	steps[step].call();
}




