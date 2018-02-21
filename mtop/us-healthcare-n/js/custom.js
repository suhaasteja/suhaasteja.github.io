var	domain = {x: 720, y: 720},
	margin = {top: 20, left: 120, bottom: 20, right: 120},
	SVGwidth = 400,
	SVGheight = SVGwidth,
	width =  SVGwidth - margin.left - margin.right,
	height = SVGheight - margin.top - margin.bottom,
	scale = width/domain.x;

var x = d3.scalePoint().range([margin.left, margin.left + width]),
	y = {},
	ranks = [];

var line = d3.line(),
	axis = d3.axisLeft(),
	axis1 = d3.axisLeft(),
	axis2 = d3.axisRight(),
	countries, paths, circlesExpense, circlesOutcome;

var healthData,
	dimExpense = "Per-capita spending on health care ($)", 
	dimOutcome = "Life expectancy at birth (years)";

d3.csv('data/healthcare-spending.csv', function(data){	
	healthData = data;
	initialize(data, svg1, 1, "Per-capita spending on health care ($)", "Life expectancy at birth (years)", "$");
	initialize(data, svg2, 2, "Per-capita spending on health care ($)", "Infant mortality per 1000 live births", "$", "", true, true, true);
	initialize(data, svg3, 3, "Per-capita spending on health care ($)", "Maternal mortality per 100,000 live births", "$", "", true, true, true);
	initialize(data, svg4, 4, "Per-capita spending on health care ($)", 
		"Probability of dying prematurely from noncommunicative disease (%)", "$", "%", true, false, true);
	initialize(data, svg5, 5, "Per-capita spending on health care ($)", 
		"Obesity as % of population ages 15 and over", "$", "%", true, false, true);
	initialize(data, svg6, 6, "Government spending on health care (%)", "Life expectancy at birth (years)", "%", "", false);
	//initialize(data, svg7, 7, "Per-capita spending on pharmaceuticals ($)", "Life expectancy at birth (years)");
	highlight(1, 6);
});


function initialize(data, svg, idx, dim1, dim2, affix1_symbol = "", affix2_symbol = "", affix1_pre = true, affix2_pre = true, reverse = false){
	console.log(affix1_symbol, affix2_symbol, affix1_pre, affix2_pre, reverse);

	dimExpense = dim1, dimOutcome = dim2;
	x.domain(dimensions = d3.keys(data[0]).filter(function(d) {
		if (reverse) {
			return (d == dim1 || d == dim2) && (y[dim1] = d3.scaleLinear()
				.domain(d3.extent(data, function(p) { return +p[dim1]; }))
				.range([height + margin.top, margin.top])) && (y[dim2] = d3.scaleLinear()
				.domain(d3.extent(data, function(p) { return +p[dim2]; }))
				.range([margin.top, height + margin.top]));
		} else {
			return (d == dim1 || d == dim2) && (y[d] = d3.scaleLinear()
				.domain(d3.extent(data, function(p) { return +p[d]; }))
				.range([height + margin.top, margin.top]));
		}
	}));

	var rankExp = data.map(function(p){ return parseFloat(p[dim1]); }).sort(function(a, b) { return d3.descending(a, b)});
	var rankOut = data.map(function(p){ return parseFloat(p[dim2]); })
				.sort(function(a, b) { 
					if (reverse){ return d3.ascending(a, b); } 
					else { return d3.descending(a, b); }
				});

	ranks.push({ "graph": 1, "rankExp": rankExp, "rankOut": rankOut});

	// Add a group element for each dimension.
	var g = svg.selectAll(".dimension")
		.data(dimensions)
		.enter().append("g")
		.attr("class", function(d, i){
			return "dimension dim" + i + " group" + idx;
		})
		.attr("transform", function(d) { return "translate(" + x(d) + ")"; });

	g.append("g")
		.attr("class", "axis")
		.each(function(d) {
			if (d == dim1){
				d3.select(this).call(axis1.scale(y[d]).tickSize(0).tickValues([]));
			} else {
				d3.select(this).call(axis2.scale(y[d]).tickSize(0).tickValues([]));
			}
		});

	countries = svg.append("g")
		.attr("class", "foreground")
		.selectAll("path")
		.data(data)
		.enter()
		.append("g")
		.attr("class", function(d, i){ 
			return "graph-"+idx+" country-g "+d.CD+" exp-"+(rankExp.indexOf(parseFloat(d[dim1]))+1)+" out-"+(rankOut.indexOf(parseFloat(d[dim2]))+1); 
		})
		.style("opacity", 0.2);

	paths = countries.append("path")
		.attr("d", path)
		// .on("mouseover", handleMouseOver)
		// .on("mouseout", handleMouseOut);

	circlesExpense = countries.append("circle")
		.attr("r", "6")
		.attr("cx", function(d){ return x(dim1); })
		.attr("cy", function(d){ return y[dim1](d[dim1]); })
		.attr("fill", "#fff")
		.attr("fill-opacity", 0.5)
		.attr("stroke", "#444")
		.attr("stroke-width", "2px")
		// .on("mouseover", handleMouseOver)
		// .on("mouseout", handleMouseOut);

	circlesOutcome = countries.append("circle")
		.attr("r", "6")
		.attr("cx", function(d){ return x(dim2); })
		.attr("cy", function(d){ return y[dim2](d[dim2]); })
		.attr("fill", "#fff")
		.attr("fill-opacity", 0.5)
		.attr("stroke", "#444")
		.attr("stroke-width", "2px")
		// .on("mouseover", handleMouseOver)
		// .on("mouseout", handleMouseOut);

	labelsExpense = countries.append("g")
		.attr("class", function(d) { return "data-label-group dim0 " + d.CD + " graph-" + idx })
		.attr("transform", function(d) { return "translate(" + (x(dim1) - 16) + "," + y[dim1](d[dim1]) + ")" })		
		.attr("text-anchor", "end");

	labelsExpenseRank = labelsExpense.append("text")
		.attr("dx", 0)
		.attr("dy", -8)
		.text(function(d){
			return "#" + (rankExp.indexOf(parseFloat(d[dim1])) + 1);
		})

	labelsExpense.append("text")
		.attr("dx", 0)
		.attr("dy", 4)
		.text(function(d){
			return d.Country;
		})

	labelsExpenseValue = labelsExpense.append("text")
		.attr("dx", 0)
		.attr("dy", 20)
		.text(function(d){ 
			if (affix1_pre){
				return affix1_symbol + d3.format(",")(d[dim1]);
			} else {
				return d3.format(",")(d[dim1]) + affix1_symbol;
			}
		})
		.style("font-weight", 700);

	labelsOutcome = countries.append("g")
		.attr("class", function(d) { return "data-label-group dim1 " + d.CD  + " graph-" + idx })
		.attr("transform", function(d) { return "translate(" + (x(dim2) + 16) + "," + y[dim2](d[dim2]) + ")" })	
		.attr("text-anchor", "start");

	labelsOutcomeRank = labelsOutcome.append("text")
		.attr("dx", 0)
		.attr("dy", -8)
		.text(function(d){
			return "#" + (rankOut.indexOf(parseFloat(d[dim2])) + 1);
		})

	labelsOutcome.append("text")
		.attr("dx", 0)
		.attr("dy", 4)
		.text(function(d){
			return d.Country;
		})

	labelsOutcomeValue = labelsOutcome.append("text")
		.attr("dx", 0)
		.attr("dy", 20)
		.text(function(d){ 
			if (affix2_pre){
				return affix2_symbol + d3.format(",")(d[dim2]);
			} else {
				return d3.format(",")(d[dim2]) + affix2_symbol;
			}
		})
		.style("font-weight", 700);

	d3.selectAll(".data-label-group").style("opacity", 0);
}

function highlight(start, end){
	for (i = start; i <= end; i++){
		d3.select("g.graph-"+i+".exp-1").style("opacity", 1);
		d3.select("g.graph-"+i+".out-1").style("opacity", 1);
		d3.select("g.graph-"+i+".exp-1").selectAll(".data-label-group").style("opacity", 1);
		d3.select("g.graph-"+i+".out-1").selectAll(".data-label-group").style("opacity", 1);

		d3.select("g.graph-"+i+".exp-35").style("opacity", 1);
		d3.select("g.graph-"+i+".out-35").style("opacity", 1);
		d3.select("g.graph-"+i+".exp-35").selectAll(".data-label-group").style("opacity", 1);
		d3.select("g.graph-"+i+".out-35").selectAll(".data-label-group").style("opacity", 1);

		d3.selectAll("g.graph-"+i+".USA").style("opacity", 1);
		d3.selectAll("g.graph-"+i+".USA").selectAll(".data-label-group").style("opacity", 1);
	}
}

// Returns the path for a given data point.
function path(d) {
	return line(dimensions.map(function(p) {return  [x(p), y[p](d[p])]; }));
}


function handleMouseOver(d, i){
	country = d3.select(this.parentNode).attr("class").split(' ')[2];
	d3.selectAll("g.data-label-group." + country).style("opacity", 1);
	d3.selectAll("g.country-g." + country).style("opacity", 1);
}

function handleMouseOut(d, i){
	graph = d3.select(this.parentNode).attr("class").split(' ')[0];
	country = d3.select(this.parentNode).attr("class").split(' ')[2];
	d3.selectAll("g." + country).style("opacity", 0.2);
	d3.selectAll("g.data-label-group." + country).style("opacity", 0);
	highlight(1, 6);
}


var svg1 = d3.select('div.graph-1')
				.append('svg')
				.attr('width', SVGwidth)
				.attr('height', SVGheight);

var svg2 = d3.select('div.graph-2')
				.append('svg')
				.attr('width', SVGwidth)
				.attr('height', SVGheight);

var svg3 = d3.select('div.graph-3')
				.append('svg')
				.attr('width', SVGwidth)
				.attr('height', SVGheight);

var svg4 = d3.select('div.graph-4')
				.append('svg')
				.attr('width', SVGwidth)
				.attr('height', SVGheight);

var svg5 = d3.select('div.graph-5')
				.append('svg')
				.attr('width', SVGwidth)
				.attr('height', SVGheight);

var svg6 = d3.select('div.graph-6')
				.append('svg')
				.attr('width', SVGwidth)
				.attr('height', SVGheight);
				
var svg7 = d3.select('div.graph-7')
				.append('svg')
				.attr('width', SVGwidth)
				.attr('height', SVGheight);
				
var svg8 = d3.select('div.graph-8')
				.append('svg')
				.attr('width', SVGwidth)
				.attr('height', SVGheight);
				
var svg9 = d3.select('div.graph-9')
				.append('svg')
				.attr('width', SVGwidth)
				.attr('height', SVGheight);
