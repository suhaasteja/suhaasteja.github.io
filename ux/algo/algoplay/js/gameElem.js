/*
==================================
Variable Declaration
==================================
*/

//Sorting data variable declaration
var dataset = [], gameset = [],
num=8, cmpCount = 0, k = 1, counterVar=0, index = 0, cmpIndex = [];
array = [1, 2, 3, 4, 5, 6, 7, 8];

// SVG parameters
var containerWidth = $(".display-wide").width(), svgHeight = 720, svgWidth = containerWidth;

// Variables for SVG coordinates
var padding = 20, paddingLarge = 32, upperMargin = 72, lowerMargin = 250, lowerElem = 560;

//Variables for SVG dimensions
var imgWidth = Math.floor((containerWidth - (2*num*padding))/num), imgHeight = imgWidth*2/3,
scaleLeft = 410, scaleRight = 614, scaleLateX = 410, scaleLateY = 300, 
scaleHeight = 20, scaleWidth = 328, balanceHeight = 108,
rectLeftX = 365, rectBtm = lowerMargin+160, rectRightX = 768;

// Variables for selection and storing selection data
var select1 = false, select2=false, select1Id, select2Id;

//Variables for animation
var resetRotate=0, long_dur=500, short_dur=200;

//Competition Variables
var gameSuccess = false, userAct = []; 

/*
==================================
SVG Declaration
==================================
*/
canvas = d3.select(".display-wide")
            .append("svg")
            .attr("class", "workspace")
            .attr("width", svgWidth)
            .attr("height", svgHeight);

for (i=0; i<num; i++){
    var bgCircle = canvas.append("circle")
                    .attr("class", "non-active")
                    .attr("id", "sample"+i)
                    .attr("r", imgWidth/2)
                    .attr("cx", padding+(imgWidth/2)+((imgWidth+2*padding)*i))
                    .attr("cy", upperMargin+imgHeight/2);

    var CPUbgCircle = canvas.append("circle")
                    .attr("class", "non-active")
                    .attr("id", "u-cpu-sample"+i)
                    .attr("r", imgWidth/2)
                    .attr("cx", padding+(imgWidth/2)+((imgWidth+2*padding)*i))
                    .attr("cy", lowerElem + imgHeight/2);
}

for (i=0; i<num; i++){
    var petri = canvas.append("image")
                    .attr("class", "img-element")
                    .attr("id", "sample"+i)
                    .attr("height", imgHeight)
                    .attr("width", imgWidth)
                    .attr("x", padding+((imgWidth+2*padding)*i))
                    .attr("y", upperMargin)
                    .attr("xlink:href", "images/elements/0"+(i+1)+".png");
}

for (i=0; i<num; i++){
    var cpuPetri = canvas.append("image")
                    .attr("id", "cpu-sample"+i)
                    .attr("height", imgHeight)
                    .attr("width", imgWidth)
                    .attr("x", padding+((imgWidth+2*padding)*i))
                    .attr("y", lowerElem)
                    .attr("xlink:href", "images/elements/default.png");
}

var weighScale = canvas.append("image")
                        .attr("id", "scale")
                        .attr("height", scaleHeight)
                        .attr("width", scaleWidth)
                        .attr("transform", "translate("+ scaleLateX + "," + scaleLateY +")")
                        .attr("xlink:href", "images/scales.png");
var balance = canvas.append("image")
                .attr("id", "scale")
                .attr("height", balanceHeight)
                .attr("width", scaleWidth)
                .attr("transform", "translate("+ scaleLateX + "," + (scaleLateY+10) +")")
                .attr("xlink:href", "images/balance.png");

var revScale = d3.scale.linear()
                .domain([0, 100])
                .range([100, 0]);