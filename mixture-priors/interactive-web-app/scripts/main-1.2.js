
// Defining variables for plotting the graphs

var canvas = {w: 640, h: 400}, // dimensions of the canvas for plotting the posterior
	margin = {top: 40, right: 40, bottom: 40, left: 40} // margins for the canvas for plotting the posterior
	input = {h: 300, w: 300}, // dimensions of the input-pad for plotting the posterior
	margin_input = {top: 50, right: 50, bottom: 50, left: 50}, // margins for the input-pad for posterior weights
	prior_loc = [ [margin_input.left, (margin_input.top - 30)], 
					[(input.w - margin_input.right), (margin_input.top - 30)], 
					[margin_input.left, input.h - 30], 
					[(input.w - margin_input.right), input.h - 30] ];

// Defining some global variables which are going to be useful for storing the data
var samples, j, priors, log_ll, data,
	single_prior_densities = {}, 
	single_posterior_densities = {},
	prior_weight = {};

var svg = d3.select('div#graph')
			.append('svg')
			.attr('width', canvas.w)
			.attr('height', canvas.h);

var g = svg.append('g')
			.attr('class', 'graph');

var sketchpad = d3.select('div#sketchpad')
			.append('svg')
			.attr('class', 'input')
			.attr('width', input.w)
			.attr('height', input.h);

var x = d3.scaleLinear()
			.domain([-20, 20])
			.range([margin.left, canvas.w - margin.right]),

	y = d3.scaleLinear()
//			.domain([0, 0.4])
			.range([canvas.h - margin.bottom, margin.top]),

	input_x = d3.scaleLinear()
			.domain([0, 100])
			.range([margin_input.left, input.w - margin_input.right]),

	input_y = d3.scaleLinear()
			.domain([100, 0])
			.range([input.h - margin_input.bottom, margin_input.top]),

	color = d3.scaleOrdinal()
				.range(["#54BA94", "#A0C4E2", "#FF8552",  "#297373", "#59ADDE"]);

g.append("g")
	.attr("class", "axis axis--x")
	.attr("transform", "translate(0," + (canvas.h - margin.bottom) + ")")
	.call(d3.axisBottom(x))
	.append("text")
	.attr("x", canvas.w - margin.right)
	.attr("y", -6)
	.attr("fill", "#000")
	.attr("text-anchor", "end")
	.text("estimates");

// g.append("g")
// 	.attr("class", "axis axis--y")
// 	.attr("transform", "translate(" + margin.left + ",0)")
// 	.call(d3.axisLeft(y).ticks(null));

g.append("text")
	.attr("transform", "translate(" + (canvas.w/2) + " ," +  (canvas.h - 8) + ")")
	.style("text-anchor", "middle")
	.text("Mean difference in the number of pumps");

g.append('text')
	.attr('class', 'legend prior-legend')
	.text('Prior densities')
	.attr('x', (x.range()[0] * 1.5))
	.attr('y', (y.range()[1] * 1.5));

g.append('path')
	.attr('transform', 
		'translate(' + (x.range()[0] * 1.5 + d3.select('.prior-legend')._groups[0][0].getComputedTextLength() + 8) + ',' 
		+ (y.range()[1] * 1.5 - 4) + ')')
	.attr('d', 'M0 0 L50 0')
	.attr('stroke', '#333')
	.style('stroke-dasharray', 2)
	.attr('stroke-width', 2);

g.append('text')
	.attr('class', 'legend prior-mixture-legend')
	.text('Prior mixture density')
	.attr('x', (x.range()[0] * 1.5))
	.attr('y', (y.range()[1] * 2.25));

g.append('path')
	.attr('transform', 
		'translate(' + (x.range()[0] * 1.5 + d3.select('.prior-mixture-legend')._groups[0][0].getComputedTextLength() + 8) + ',' 
		+ (y.range()[1] * 2.25 - 4) + ')')
	.attr('d', 'M0 0 L50 0')
	.attr('stroke', 'red')
	.attr('stroke-width', 2);

input_group = sketchpad.append('g');

d3.csv("../R/prior_posterior_density_estimates.csv", function(error, d){
	if (error) throw error;

	data = d; // setting it to the globally declared variable so that it can be accessed by functions

	y.domain( [0, d3.max(data, function(d) { return d3.max([+d.prior_d, +d.post_d]); })] );

	j = d3.max(data, function(d) { return d.j; });

	log_ll = d3.nest()
				.key(function(d) { return d.j; })
				.rollup(function(v) { return +v[0].log_C; }) // d3.mean(v, function(d) { return d.log_C; }); })
				.object(data);

	priors = d3.nest()
				.key(function(d) { return d.j; })
				.rollup(function(v) { return [+v[0].prior_mu, +v[0].prior_sigma]; })
				.object(data);

	for (var i = 1; i <= j; i++){
		single_prior_densities[i] = []
		single_posterior_densities[i] = [];

		// by default, the prior weight would be equal among the mixtures
		// thus, it would be set to 1/J, where J is the number of different priors
		// In this version, J = 4
		prior_weight[i] = 1/j;

		prior_text = input_group.append('text')
			.style('font-weight', 'bold')
			.attr('text-anchor', 'middle');

		prior_text.append('tspan')
			.attr('class', 'prior-'+i)
			.text('N(' + priors[i][0] + ',' + priors[i][1] + ')')
			.style('fill', '#666')
			.attr('x', prior_loc[i-1][0])
			.attr('y', prior_loc[i-1][1])
			.attr('dx', 0)
			.attr('dy', 0);

		prior_text.append('tspan')
			.attr('class', 'weight-'+i)
			.style('font-style', 'italic')
			.style('fill', '#666')
			.text('weight: 0.25')
			.attr('x', prior_loc[i-1][0])
			.attr('y', prior_loc[i-1][1])
			.attr('dx', 0)
			.attr('dy', 16);
	}

	data.forEach(function(d, i) {
		single_prior_densities[d.j].push([d.grid, d.prior_d]);
		single_posterior_densities[d.j].push([d.grid, d.post_d]);
	});

	for (var i = 1; i <= j; i++){
		draw_density(g, single_prior_densities[i], 'prior', 'none', '#979797', 2, 'prior');
		//draw_density(g, single_posterior_densities[i], 'posterior', 'none', '#979797', 0);
	}

	var post_weights = get_posterior_weights(prior_weight, log_ll);

	draw_mixture_density(g, Object.values(single_prior_densities), 'prior mixture', Object.values(prior_weight), 'none', 'red');
	draw_mixture_density(g, Object.values(single_posterior_densities), 'posterior mixture', post_weights);

	input_group.append('rect')
		.attr('class', 'input-space')
		.attr('x', input_x(0))
		.attr('y', input_y(0))
		.attr('width', (input_x(100) - input_x(0)))
		.attr('height', (input_y(100) - input_y(0)))
		.attr('fill', '#ddd')
		.on('mouseup', function(d){
			if (d3.mouse(this)[0] >= margin_input.left && d3.mouse(this)[0] <= (input.w - margin_input.right) && 
				(d3.mouse(this)[1] >= margin_input.top) && (d3.mouse(this)[1] <= (input.w - margin_input.right))) {
				update_weights(d3.mouse(this)[0], d3.mouse(this)[1]);
			}
		})

	input_group.append('circle')
		.attr('class', 'weight-indicator')
		.attr('cx', input_x(50))
		.attr('cy', input_y(50))
		.attr('r', 5)
		.attr('fill', '#333')
		.attr('stroke', '#333')
		.attr('stroke-width', 3)
		.call(d3.drag()
		.on("drag", function(d){
			if (d3.event.x > margin_input.left && d3.event.x < (input.w - margin_input.right)) {
				sketchpad_x = d3.event.x;
			} else if (d3.event.x <= margin_input.left) {
				sketchpad_x = margin_input.left;
			} else {
				sketchpad_x = (input.w - margin_input.right);
			}

			if (d3.event.y > margin_input.top && d3.event.y < (input.h - margin_input.bottom)) {
				sketchpad_y = d3.event.y;
			} else if (d3.event.y <= margin_input.top) {
				sketchpad_y = margin_input.top;
			} else {
				sketchpad_y = (input.h - margin_input.bottom);
			}

			update_weights(sketchpad_x, sketchpad_y);
		}));
});

function draw_density(svg, density, dens_class, fillColor = 'none', strokeColor = 'none', dashArray = 0){
	svg.append("path")
		.datum(density)
		.attr('class', dens_class)
		.attr("fill", "none")
		.attr("stroke", "#000")
		.attr("stroke-width", 1.5)
		.attr("stroke-linejoin", "round")
		.attr("d",  d3.line()
		.curve(d3.curveBasis)
		.x(function(d) { return x(d[0]); })
		.y(function(d) { return y(d[1]); }))
		.style('fill', fillColor)
		.style('fill-opacity', 0.6)
		.style('stroke', strokeColor)
		.style('stroke-dasharray', dashArray)
		.style('stroke-width', 2);
}


// Calculates posterior weights from the prior weights and log-likelihood for each fitted posterior distribution
function get_posterior_weights(prior_weights, log_ll) {
	prior_weight_log = Object.values(prior_weights).map( x => Math.log(x) );
	ll_sum = math.add(prior_weight_log, Object.values(log_ll));
	log_sum_exp = get_log_sum_exp(ll_sum);

	return ll_sum.map( x => Math.exp(x - log_sum_exp));
}

// Helper function
function get_log_sum_exp(ll_sum){
	return Math.log(ll_sum.map( x => Math.exp(x - Math.max(...ll_sum))).reduce((a, b) => a + b)) + Math.max(...ll_sum);
}

function get_quantile(density, interval) {
	var del_x = density.map(x => +x[0]),
		y = density.map(x => +x[1]),
		lower = (1 - (interval/100))/2,
		upper = 1 - lower;

	var sum = 0;
	for (var i = 1; i < density.length; i++){
		if (sum < lower){
			sum += (del_x[i] - del_x[i-1])*y[i];
		} else {
			break;
		}
	}

	var sum = 0;
	for (var j = 1; j < density.length; j++){
		if (sum < upper){
			sum += (del_x[j] - del_x[j-1])*y[j];
		} else {
			break;
		}
	}
	return [i, j]
}

function draw_mixture_density(group, densities, dens_class, weights, fillColor = '#B9E3FF', strokeColor = 'none', dashArray = 0){
	var single_weighted_densities = [];
	var x_ticks = densities[0].map(x => x[0]);

	for (var i = 0; i < densities.length; i++){
		single_weighted_densities[i] = densities[i].map( x => math.multiply(x[1], weights[i]));
	}

	const add = (a, b) => (a + b);

	// calculates weighted sum of the densities to get the posterior density from a prior mixture density
	var mixture_density = _.zip( x_ticks, _.unzip(single_weighted_densities).map(x => x.reduce(add)) );

	draw_density(group, mixture_density, dens_class, fillColor, strokeColor, dashArray);

	if (dens_class == 'posterior mixture'){
		var [lower95, upper95] = get_quantile(mixture_density, 95);
		var [lowerMedian, upperMedian] = get_quantile(mixture_density, 2);

		HDI95 = mixture_density.slice(lower95, upper95);
		HDI95.splice(0, 0, [+mixture_density[lower95][0], 0]);
		HDI95.push([+mixture_density[upper95][0], 0]);
		draw_density(group, HDI95, dens_class, '#5D9CCA', 'none', dashArray);

		var dens = mixture_density.map(x => x[1]);
		median = mixture_density[dens.indexOf(d3.max(dens))];

		group.append('line')
			.attr('class', 'posterior median mixture')
			.attr('x1', x(median[0]))
			.attr('y1', y(median[1]))
			.attr('x2', x(median[0]))
			.attr('y2', y(0))
			.attr('stroke-width', 4)
			.attr('stroke', '#666');
	}
}

function update_weights(sketchpad_x, sketchpad_y){
	coords = {x: input_x.invert(sketchpad_x) / 100, y: input_y.invert(sketchpad_y) / 100};

	d3.select('.weight-indicator')
		.attr('cx', sketchpad_x)
		.attr('cy', sketchpad_y);

	var prior_weights = [ +((1 - coords.x) * (1 - coords.y)).toFixed(2), 
			+(coords.x * (1 - coords.y)).toFixed(2), 
			+((1 - coords.x) * coords.y).toFixed(2), 
			+(coords.x * coords.y).toFixed(2) ];

	for (var i = 1; i <= j; i++){
		 input_group.select('.weight-' + i)
                .text("weight: " + prior_weights[i-1]);
	}

	d3.selectAll('.mixture').remove();

	var post_weights = get_posterior_weights(prior_weights, log_ll);
	draw_mixture_density(g, Object.values(single_prior_densities), 'prior mixture', prior_weights, 'none', 'red');
	draw_mixture_density(g, Object.values(single_posterior_densities), 'posterior mixture', post_weights);
}

