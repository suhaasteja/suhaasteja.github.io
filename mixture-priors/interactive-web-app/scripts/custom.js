// Defining variables for plotting the graphs

var canvas = {w: 640, h: 400}, // dimensions of the canvas for plotting the posterior
	margin = {top: 30, right: 30, bottom: 30, left: 30} // margins for the canvas for plotting the posterior
	input = {h: 300, w: 300}, // dimensions of the input-pad for plotting the posterior
	margin_input = {top: 50, right: 50, bottom: 50, left: 50}, // margins for the input-pad for posterior weights
	prior_loc = [ [margin_input.left, (margin_input.top - 30)], 
					[(input.w - margin_input.right), (margin_input.top - 30)], 
					[margin_input.left, input.h - 30], 
					[(input.w - margin_input.right), input.h - 30] ];

// Defining some global variables which are going to be useful for storing the data
var samples, j, priors, log_ll, data,
	single_prior_densities = {}, 
	posterior_estimates = {},
	prior_weight = {};

var svg_prior = d3.select('div#graph-prior')
			.append('svg')
			.attr('width', canvas.w)
			.attr('height', canvas.h);

var svg = d3.select('div#graph-posterior')
			.append('svg')
			.attr('width', canvas.w)
			.attr('height', canvas.h);

var sketchpad = d3.select('div#sketchpad')
			.append('svg')
			.attr('class', 'input')
			//.style('cursor', 'crosshair')
			.attr('width', input.w)
			.attr('height', input.h);

var x = d3.scaleLinear()
			.domain([-20, 20])
			.range([margin.left, canvas.w - margin.right]),

	y = d3.scaleLinear()
			.domain([0, 0.4])
			.range([canvas.h - margin.bottom, margin.top]),

	input_x = d3.scaleLinear()
			.domain([0, 100])
			.range([margin_input.left, input.w - margin_input.right]),

	input_y = d3.scaleLinear()
			.domain([100, 0])
			.range([input.h - margin_input.bottom, margin_input.top]),

	color = d3.scaleOrdinal()
				.range(["#54BA94", "#A0C4E2", "#FF8552",  "#297373", "#59ADDE"]);

svg_prior.append("g")
	.attr("class", "axis axis--x")
	.attr("transform", "translate(0," + (canvas.h - margin.bottom) + ")")
	.call(d3.axisBottom(x))
	.append("text")
	.attr("x", canvas.w - margin.right)
	.attr("y", -6)
	.attr("fill", "#000")
	.attr("text-anchor", "end")
	.text("estimates");

svg_prior.append("g")
	.attr("class", "axis axis--y")
	.attr("transform", "translate(" + margin.left + ",0)")
	.call(d3.axisLeft(y).ticks(null));

svg.append("g")
	.attr("class", "axis axis--x")
	.attr("transform", "translate(0," + (canvas.h - margin.bottom) + ")")
	.call(d3.axisBottom(x))
	.append("text")
	.attr("x", canvas.w - margin.right)
	.attr("y", -6)
	.attr("fill", "#000")
	.attr("text-anchor", "end")
	.text("estimates");

svg.append("g")
	.attr("class", "axis axis--y")
	.attr("transform", "translate(" + margin.left + ",0)")
	.call(d3.axisLeft(y).ticks(null));

input_group = sketchpad.append('g');

svg_prior.append('text')
	.attr('class', 'desc')
	.text('Prior densities')
	.attr('x', (x.range()[0] * 1.5))
	.attr('y', (y.range()[1] * 2));

svg.append('text')
	.attr('class', 'desc')
	.text('Posterior densities')
	.attr('x', (x.range()[0] * 1.5))
	.attr('y', (y.range()[1] * 2));

d3.csv("posterior_estimates.csv", function(error, d){
	if (error) throw error;

	data = d; // setting it to the globally declared variable so that it can be accessed by functions

	j = d3.max(data, function(d) { return d.j; });

	log_ll = d3.nest()
					.key(function(d) { return d.j; })
					.rollup(function(v) { return +v[0].log_C; }) // d3.mean(v, function(d) { return d.log_C; }); })
					.object(data);

	priors = d3.nest()
					.key(function(d) { return d.j; })
					.rollup(function(v) { return [+v[0].prior_mu, +v[0].prior_sigma]; })
					.object(data);

	console.log(data[10000]);

	for (var i = 1; i <= j; i++){
		posterior_estimates[i] = [];

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
            .style('fill', color(i))
			.attr('x', prior_loc[i-1][0])
			.attr('y', prior_loc[i-1][1])
			.attr('dx', 0)
			.attr('dy', 0);

		prior_text.append('tspan')
            .attr('class', 'weight-'+i)
            .style('font-style', 'italic')
			.text('weight: 0.25')
			.attr('x', prior_loc[i-1][0])
			.attr('y', prior_loc[i-1][1])
			.attr('dx', 0)
			.attr('dy', 16);
	}

	data.forEach(function(d, i) {
		posterior_estimates[d.j].push(d.estimate);
	});

	for (var i = 1; i <= j; i++){
		single_prior_densities[i] = kernelDensityEstimator(kernelEpanechnikov(1), x.ticks(100), rnorm(100000, priors[i][0], priors[i][1]));

		draw_kernel_density(svg_prior, single_prior_densities[i], 'none',  color(i), 2, 'prior');

		var posterior_densities = kernelDensityEstimator(kernelEpanechnikov(1), x.ticks(100), posterior_estimates[i])

		draw_kernel_density(svg, posterior_densities, 'none', color(i), 0); 
	}

	draw_mixture_prior_density(Object.values(single_prior_densities), Object.values(prior_weight));

	draw_posterior_density(data, j, prior_weight, log_ll);

	input_group.append('rect')
		.attr('class', 'input-space')
		.attr('x', input_x(0))
		.attr('y', input_y(0))
		.attr('width', (input_x(100) - input_x(0)))
		.attr('height', (input_y(100) - input_y(0)))
		.attr('fill', '#ddd')
		.on('mouseup', get_coord);

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

			d3.select(this).attr("cx", sketchpad_x).attr("cy", sketchpad_y);

			coords = {x: (input_x.invert(sketchpad_x)  / 100) , y: (input_y.invert(sketchpad_y) / 100) } ;

			weights = [ +((1 - coords.x) * (1 - coords.y)).toFixed(2), 
						+(coords.x * (1 - coords.y)).toFixed(2), 
						+((1 - coords.x) * coords.y).toFixed(2), 
						+(coords.x * coords.y).toFixed(2) ];

			for (var i = 1; i <= j; i++){
				input_group.select('.weight-' + i)
					.text("weight: " + weights[i-1]);
			}

			draw_mixture_prior_density(Object.values(single_prior_densities), weights);
			draw_posterior_density(data, j, weights, log_ll);
		})
		.on("end", function(d){
			coords = {x: (input_x.invert(+d3.select(this).attr('cx'))  / 100) , y: (input_y.invert(+d3.select(this).attr('cy')) / 100) } ;

			weights = [ +((1 - coords.x) * (1 - coords.y)).toFixed(2), 
						+(coords.x * (1 - coords.y)).toFixed(2), 
						+((1 - coords.x) * coords.y).toFixed(2), 
						+(coords.x * coords.y).toFixed(2) ];

			for (var i = 1; i <= j; i++){
				input_group.select('.weight-' + i)
					.text("weight: " + weights[i-1]);
			}

			draw_mixture_prior_density(Object.values(single_prior_densities), weights);
			draw_posterior_density(data, j, weights, log_ll);
		}));
});

function get_coord(){
	if (d3.mouse(this)[0] >= margin_input.left && d3.mouse(this)[0] <= (input.w - margin_input.right) && 
		(d3.mouse(this)[1] >= margin_input.top) && (d3.mouse(this)[1] <= (input.w - margin_input.right))) {
		coords = {x: input_x.invert(d3.mouse(this)[0]) / 100, y: input_y.invert(d3.mouse(this)[1]) / 100};

		d3.select('.weight-indicator')
			.attr('cx', d3.mouse(this)[0])
			.attr('cy', d3.mouse(this)[1]);

		weights = [ +((1 - coords.x) * (1 - coords.y)).toFixed(2), 
				+(coords.x * (1 - coords.y)).toFixed(2), 
				+((1 - coords.x) * coords.y).toFixed(2), 
				+(coords.x * coords.y).toFixed(2) ];

		for (var i = 1; i <= j; i++){
			 input_group.select('.weight-' + i)
                    .text("weight: " + weights[i-1]);
		}

		draw_mixture_prior_density(Object.values(single_prior_densities), weights);
		draw_posterior_density(data, j, weights, log_ll);
	}
}

function draw_posterior_density(data, j, prior_weight, log_ll = log_ll) {
	d3.selectAll('.mixture-posterior').remove();

	var mixture_estimates = [], 
		count = {};

	for (var i = 1; i <= j; i++){
		count[i] = 0;
	}

	if (Object.values(prior_weight).length == j){
		posterior_weight_vector = get_posterior_weights(prior_weight, log_ll);

		// Calculates the estimates for the posterior by 
		// sampling a weighted mixture
		data.forEach(function(d, i) {
			var random = Math.random();
			if (random <= posterior_weight_vector[(d.j - 1)]){
				mixture_estimates.push(d.estimate);
				count[d.j] += 1;
			}
		});

		var mixture_density = kernelDensityEstimator(kernelEpanechnikov(1), x.ticks(100), mixture_estimates);
		draw_kernel_density(svg, mixture_density, '#a6a4c1', 'none', 0, 'mixture-posterior');

	} else {
		throw new Error('Prior weights are not the same dimension as the number of mixtures in the data');
	}
}

function draw_mixture_prior_density(single_prior_densities, prior_weight){
	d3.selectAll('.mixture-prior').remove();

	var single_prior_weighted_densities = [];
	var x_ticks = single_prior_densities[0].map(x => x[0]);

	for (var i = 0; i < single_prior_densities.length; i++){
		single_prior_weighted_densities[i] = single_prior_densities[i].map( x => math.multiply(x[1], prior_weight[i]));
	}

	const add = (a, b) => (a + b);

	var mixture_prior_density = _.zip( x_ticks, _.unzip(single_prior_weighted_densities).map(x => x.reduce(add)) );
	draw_kernel_density(svg_prior, mixture_prior_density, '#a6a4c1', 'none', 0, 'mixture-prior');
}

function draw_kernel_density(svg, density, fillColor = 'none', strokeColor = 'none', dashArray = 0, obj_class = 'posterior'){
	svg.append("path")
		.datum(density)
		.attr('class', obj_class)
		.attr("fill", "none")
		.attr("stroke", "#000")
		.attr("stroke-width", 1.5)
		.attr("stroke-linejoin", "round")
		.attr("d",  d3.line()
		.curve(d3.curveBasis)
		.x(function(d) { return x(d[0]); })
		.y(function(d) { return y(d[1]); }))
		.style('fill', fillColor)
		.style('fill-opacity', 0.7)
		.style('stroke', strokeColor)
		.style('stroke-dasharray', dashArray)
		.style('stroke-width', 2);
}

function get_log_sum_exp(ll_sum){
	return Math.log(ll_sum.map( x => Math.exp(x - Math.max(...ll_sum))).reduce((a, b) => a + b)) + Math.max(...ll_sum);
}

function get_posterior_weights(prior_weights, log_ll) {
	prior_weight_log = Object.values(prior_weights).map( x => Math.log(x) );
	ll_sum = math.add(prior_weight_log, Object.values(log_ll));
	log_sum_exp = get_log_sum_exp(ll_sum);

	return ll_sum.map( x => Math.exp(x - log_sum_exp));
}

function rnorm(n, mean, variance) {
	if (mean == undefined) mean = 0.0;
	if (variance == undefined) variance = 1.0;
	var V1, V2, S;
	yy = []

	for (var i = 0; i < n; i++){
		do {
			V1 = 2 * Math.random() - 1;
			V2 = 2 * Math.random() - 1;
			S = V1 * V1 + V2 * V2;
		} while (S > 1);

		xx = Math.sqrt(-2 * Math.log(S) / S) * V1;

		yy.push((mean + Math.sqrt(variance) * xx))
	}
	return yy;
}

// Kernel density estimation function created by Mike Bostock: https://bl.ocks.org/mbostock/4341954
function kernelDensityEstimator(kernel, X, V) {
	return X.map(function(x) {
		return [x, d3.mean(V, function(v) { return kernel(x - v); })];
	});
}

function kernelEpanechnikov(k) {
	return function(v) {
		return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
	};
}