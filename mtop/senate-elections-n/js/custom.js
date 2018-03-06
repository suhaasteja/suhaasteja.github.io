var	width = 1080,
	height = 600,
	domain = {x: 960, y: 504},
	margin = {top: 64, right: 100, bottom: 32, left: 20}
	scale = 1 // width/domain.x;

var svg1 = d3.select('div#graph-1')
				.append('svg')
				.attr('class', '2014-midterm-elections')
				.attr('width', width)
				.attr('height', height)
				.style('background', '#fff');


var svg2 = d3.select('div#graph-2')
				.append('svg')
				.attr('class', '2014-midterm-elections')
				.attr('width', width)
				.attr('height', height)
				.style('background', '#fff');

var svg3 = d3.select('div#graph-3')
				.append('svg')
				.attr('class', '2014-midterm-elections')
				.attr('width', width)
				.attr('height', height)
				.style('background', '#fff');

var x = d3.scaleLinear()
				.domain([0, domain.x])
				.range([margin.left, width - margin.right]),
	y = d3.scaleLinear()
				.domain([domain.y, 0])
				.range([height - margin.bottom, margin.top]),
	radius = d3.scalePow()
				.exponent(0.5)
				.domain([0, 1e6])
				.range([0, 24*scale]),
	labelPos = d3.scaleOrdinal()
				.domain(["N", "U", "R", "L", "D"])
				.range([[0, 0, 1], [0, -1, 0], [1, 0, 1], [0, 0, 0], [0, 1, 0]]);

var dur = 1000, censusData;

d3.tsv('data/census-2014-midterm.tsv', function(data){
	const annotations1 = [{
		note: {
			label: "Total population of a state"
		},
		connector: {
			end: "arrow"
		},
		x: (x(data[4].x) + radius(data[4].Population)),
		y: (y(data[4].y) + radius(data[4].Population)),
		dy: 40,
		dx: 12,
		color: "#E8336D"
	},{
		note: {
			label: "Proportion of the population who are of voting age (Registered to vote)"
		},
		connector: {
			end: "arrow"
		},
		x: (x(data[4].x) + radius(data[4].Registered)),
		y: (y(data[4].y) + radius(data[4].Registered)),
		dy: 144,
		dx: 40,
		color: "#E8336D"
	},{
		note: {
			label: "Proportion of voting-age Americans who actually voted"
		},
		connector: {
			end: "arrow"
		},
		x: (x(data[4].x) + radius(data[4].Voted)),
		y: (y(data[4].y) + radius(data[4].Voted)),
		dy: 72,
		dx: -1,
		color: "#E8336D"
	}
	]

	const annotations2 = [{
		note: {
			label: "States which do not have senate elections"
		},
		connector: {
			end: "arrow"
		},
		x: (x(data[4].x) + radius(data[4].Population)),
		y: (y(data[4].y) + radius(data[4].Population)),
		dy: 72,
		dx: 40,
		color: "#E8336D"
	},{
		note: {
			label: "States which have senate elections where outcomes are in doubt"
		},
		connector: {
			end: "arrow"
		},
		x: (x(data[32].x) + radius(data[32].Voted)),
		y: (y(data[32].y) + radius(data[32].Voted)),
		dy: 64,
		dx: 40,
		color: "#E8336D"
	},{
		note: {
			label: "States which have senate elections, but aren't close races"
		},
		connector: {
			end: "arrow"
		},
		x: (x(data[42].x) + radius(data[42].Voted)),
		y: (y(data[42].y) + radius(data[42].Voted)),
		dy: 72,
		dx: 40,
		color: "#E8336D"
	}
	]

	const annotations3 = [{
		note: {
			label: d3.format(",")(data[1].Voted) + " voters"
		},
		connector: {
			end: "arrow"
		},
		x: (x(data[1].x) + radius(data[1].Population)),
		y: (y(data[1].y) + radius(data[1].Population)/2),
		dy: 0,
		dx: 40,
		color: "#000"
	},  {
		note: {
			label: d3.format(",")(data[3].Voted) + " voters"
		},
		connector: {
			end: "arrow"
		},
		x: (x(data[3].x) + radius(data[3].Population)),
		y: (y(data[3].y) + radius(data[3].Population)/2),
		dy: 0,
		dx: 40,
		color: "#000"
	}, {
		note: {
			label: d3.format(",")(data[5].Voted) + " voters"
		},
		connector: {
			end: "arrow"
		},
		x: (x(data[5].x)),
		y: (y(data[5].y) + radius(data[5].Population)/2),
		dy: 0,
		dx: -40,
		color: "#000"
	}, {
		note: {
			label: d3.format(",")(data[14].Voted) + " voters"
		},
		connector: {
			end: "arrow"
		},
		x: (x(data[14].x) + radius(data[14].Population)),
		y: (y(data[14].y) + radius(data[14].Population)/2),
		dy: 0,
		dx: 40,
		color: "#000"
	}, {
		note: {
			label: d3.format(",")(data[15].Voted) + " voters"
		},
		connector: {
			end: "arrow"
		},
		x: (x(data[15].x) + radius(data[15].Population)),
		y: (y(data[15].y) + radius(data[15].Population)/2),
		dy: 0,
		dx: 40,
		color: "#000"
	}, {
		note: {
			label: d3.format(",")(data[17].Voted) + " voters"
		},
		connector: {
			end: "arrow"
		},
		x: (x(data[17].x) + radius(data[17].Population)),
		y: (y(data[17].y) + radius(data[17].Population)/2),
		dy: 0,
		dx: 40,
		color: "#000"
	}, {
		note: {
			label: d3.format(",")(data[28].Voted) + " voters"
		},
		connector: {
			end: "arrow"
		},
		x: (x(data[28].x)),
		y: (y(data[28].y) + radius(data[28].Population)/2),
		dy: 0,
		dx: -40,
		color: "#000"
	}, {
		note: {
			label: d3.format(",")(data[32].Voted) + " voters"
		},
		connector: {
			end: "arrow"
		},
		x: (x(data[32].x) + radius(data[32].Population)),
		y: (y(data[32].y) + radius(data[32].Population)/2),
		dy: 0,
		dx: 40,
		color: "#000"
	}
	]

	drawOutline(data, "Population", svg1, handleMouseOver);
	drawFill(data, "Registered", 0.3, svg1, handleMouseOver);
	drawFill(data, "Voted", 1, svg1, handleMouseOver);
	drawStateLabels(data, svg1);
	addAnnotations(annotations1, 140, svg1);

	drawOutline(data, "Population", svg2);
	drawFill(data, "Voted", 1, svg2);
	drawStateLabels(data, svg2);
	filterStatesSenate(svg2);
	addAnnotations(annotations2, 160, svg2);

	drawOutline(data, "Population", svg3 , handleMouseOver3);
	drawFill(data, "Voted", 1, svg3, handleMouseOver3);
	drawStateLabels(data, svg3);
	filterStatesCompetetive(svg3);
	addAnnotations(annotations3, 40, svg3);
});

var legendPos = {x: 8, y: 120}

function drawLegend(svg){
	svg.append("rect")
		.attr("width", radius(1e6))
		.attr("height", radius(1e6))
		.attr("x", width - margin.right - radius(1e6) - legendPos.x)
		.attr("y", height/2 + legendPos.y)
		.attr("class", "scale-legend")

	svg.append("text")
		.attr("class", "legend-text")
		.attr("x", width - margin.right)
		.attr("y", height/2 + legendPos.y)
		.attr("dx", 0)
		.attr("dy", "16px")
		.text("= 1 million people")
}

function drawOutline(data, key, svg, mouseover){
	var statesAll = svg.append("g").attr("class", "state-all");		

	statesAll.selectAll("g")
			.data(data).enter()
			.append("rect")
			.attr("class", function(d){ return "s s-" + d.Text + " senate" + d.Senate + " competetive" + d.Competetive; })
			.attr("x", function(d){ return x(d.x); })
			.attr("y", function(d){ return y(d.y); })
			.attr("width", function(d){ return radius(d[key]); })
			.attr("height", function(d){ return radius(d[key]); })
			.attr("fill", "#fff")
			.attr("stroke", "rgba(133, 224, 224, 1)")
			.on("mouseover", mouseover)
			.on("mouseout", handleMouseOut);
}

function drawFill(data, key, opacity, svg, mouseover){
	var statesAll = svg.append("g").attr("class", "state-all");		

	statesAll.selectAll("g")
			.data(data).enter()
			.append("rect")
			.attr("class", function(d){ return "c c-" + d.Text + " senate" + d.Senate + " competetive" + d.Competetive; })
			.attr("x", function(d){ return x(d.x); })
			.attr("y", function(d){ return y(d.y); })
			.attr("width", function(d){ return radius(d[key]); })
			.attr("height", function(d){ return radius(d[key]); })
			.attr("fill", "rgba(133, 224, 224,"+opacity+")")
			.attr("stroke", "rgba(133, 224, 224, 0.5)")
			.on("mouseover", mouseover)
			.on("mouseout", handleMouseOut);
}

function drawStateLabels(data, svg){
	var textLabels = svg.append("g").attr("class", "state-labels");
	
	textLabels.selectAll("g")
			.data(data).enter()
			.append("text")
			.attr("class", function(d){ return "state-label " + d.Text + " senate" + d.Senate + " competetive" + d.Competetive; })
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

function filterStatesSenate(svg){
	svg.selectAll(".c.senateN")
		.style("opacity", 0);
	svg.selectAll(".s.senateN")
		.attr("stroke", "rgba(151, 151, 151, 0.2)");
	svg.selectAll("text.senateN")
		.attr("opacity", "0.2");
	svg.selectAll(".c.competetiveY")
		.attr("fill", "#8FA7E5")
		.attr("stroke", "#8FA7E5");
	svg.selectAll(".s.competetiveY")
		.attr("stroke", "#8FA7E5")
}

function filterStatesCompetetive(svg){
	svg.selectAll(".c.competetiveN")
		.style("opacity", 0);
	svg.selectAll(".s.competetiveN")
		.attr("stroke", "rgba(151, 151, 151, 0.2)");
	svg.selectAll("text.competetiveN")
		.attr("opacity", "0.2");
	svg.selectAll(".c.competetiveY")
		.attr("fill", "#8FA7E5")
		.attr("stroke", "#8FA7E5");
	svg.selectAll(".s.competetiveY")
		.attr("stroke", "#8FA7E5")
}

function addAnnotations(annotation, width, svg){
	const makeAnnotations = d3.annotation()
		.textWrap(width)
		.type(d3.annotationCallout)
		.annotations(annotation);

	svg.append("g")
		.attr("class", "annotation-group")
		.call(makeAnnotations);
}


function handleMouseOver(d, i){
	svg1.append("rect")
		.attr("id", "t" + d.Text + "-" + i)
		.attr("width", 120)
		.attr("height", 60)
		.attr("x", x(d.x) - 35)
		.attr("y", y(d.y) - 72)
		.attr("fill", "rgba(255, 255, 255, 0.9)");

	svg1.append("text")
		.attr("id", "t" + d.Text + "-" + i)
		.attr("x", x(d.x) - 30 )
		.attr("y", y(d.y) - 60)
		.text(d.State);

	svg1.append("text")
		.attr("id", "t" + d.Text + "-" + i)
		.attr("x", x(d.x) - 30 )
		.attr("y", y(d.y) - 45)
		.text("Pop: "+ d.Population/1e6 + "mil");

	svg1.append("text")
		.attr("id", "t" + d.Text + "-" + i)
		.attr("x", x(d.x) - 30 )
		.attr("y", y(d.y) - 30)
		.text("Reg: "+ d.Registered/1e6 + "mil");

	svg1.append("text")
		.attr("id", "t" + d.Text + "-" + i)
		.attr("x", x(d.x) - 30 )
		.attr("y", y(d.y) - 15)
		.text("Voted: "+ d.Voted/1e6 + "mil");
}

function handleMouseOver3(d, i){
	svg3.append("rect")
		.attr("id", "t" + d.Text + "-" + i)
		.attr("width", 120)
		.attr("height", 30)
		.attr("x", x(d.x) - 35)
		.attr("y", y(d.y) - 42)
		.attr("fill", "rgba(255, 255, 255, 0.9)");

	svg3.append("text")
		.attr("id", "t" + d.Text + "-" + i)
		.attr("x", x(d.x) - 30 )
		.attr("y", y(d.y) - 30)
		.text(d.State);

	svg3.append("text")
		.attr("id", "t" + d.Text + "-" + i)
		.attr("x", x(d.x) - 30 )
		.attr("y", y(d.y) - 15)
		.text("Pop: "+ d.Population/1e6 + "mil");
}

function handleMouseOut(d, i) {
	d3.selectAll("#t" + d.Text + "-" + i).remove();  // Remove text location
}

