/*
==================================
Variable Declaration
==================================
*/

//Sorting data variable declaration
var testElem1, testElem2,
num=7, exchangeCount = 0, k = 1, counterVar=0, cmpIndex = [];
array = [1, 2, 3, 4, 5, 6, 7];

// SVG parameters
var containerWidth = $("#trial-svg-holder").width(), svgHeight = 480, svgWidth = containerWidth;

// Variables for SVG coordinates
var padding = 45, upperMargin = 120, lowerMargin = upperMargin+120;

//Variables for SVG dimensions
var imgWidth = 120,
imgHeight = imgWidth*2/3,
scaleHeight = 20, scaleWidth = 300, balanceHeight = 108,
scaleLateX = (containerWidth/2 - scaleWidth/2), scaleLateY = upperMargin+180,
scaleLeft = (containerWidth/2 - scaleWidth/2), scaleRight = (containerWidth/2 + scaleWidth/2 - imgWidth),
rectLeftX = (containerWidth/2-scaleWidth/2-padding), rectBtm = lowerMargin+160, rectRightX = (containerWidth/2+scaleWidth/2+padding);

// Variables for selection and storing selection data
var select1 = false, select2=false, select1Id, select2Id;

//Variables for animation
var resetRotate=0, long_dur=500, short_dur=200;

//Tutorial instructions variables
var selected1 = false, selected2 = false, selectedScale = false;

/*
==================================
SVG Declaration
==================================
*/

var bubbleTextX = 200, bubbleTextY = 84, dyVal = 10,
    textX = containerWidth/2, textY = 16;
    lineData = [{ "x": 260,   "y": 120},  
                { "x": 270,  "y": 108},
                { "x": 310,  "y": 108},
                { "x": 310,  "y": 68},
                { "x": 100,  "y": 68},
                { "x": 100, "y": 108},
                { "x": 250, "y": 108},
                { "x": 260, "y": 120}];

var canvas = d3.select("svg#try-canvas")
                .attr("height", svgHeight)
                .attr("width", svgWidth);

var bgCircle1 = canvas.append("circle")
                .attr("class", "non-active")
                .attr("id", "sample1")
                .attr("r", imgWidth/2)
                .attr("cx", (containerWidth/2 - imgWidth - padding + imgWidth/2))
                .attr("cy", upperMargin+imgHeight/2);

var bgCircle2 = canvas.append("circle")
                .attr("class", "non-active")
                .attr("id", "sample2")
                .attr("r", imgWidth/2)
                .attr("cx", (containerWidth/2 + padding + imgWidth/2))
                .attr("cy", upperMargin+imgHeight/2);

var petri = canvas.append("image")
                .attr("class", "img-element")
                .attr("id", "sample1")
                .attr("height", imgHeight)
                .attr("width", imgWidth)
                .attr("x", (containerWidth/2 - imgWidth - padding))
                .attr("y", upperMargin)
                .attr("xlink:href", "images/elements/01.png");

var petri = canvas.append("image")
                .attr("class", "img-element")
                .attr("id", "sample2")
                .attr("height", imgHeight)
                .attr("width", imgWidth)
                .attr("x", (containerWidth/2 + padding))
                .attr("y", upperMargin)
                .attr("xlink:href", "images/elements/02.png");

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

var lineFunction = d3.svg.line()
                    .x(function(d){return d.x})
                    .y(function(d){return d.y})
                    .interpolate("linear");

var pathBubble = canvas.append("path")
                        .attr("class", "bubble-notif")
                        .attr("d", lineFunction(lineData))
                        .attr("stroke", "white")
                        .attr("stroke-width", 1)
                        .attr("fill", "#F4F2D0");

var bubbleText = canvas.append("text")
                    .attr("class", "bubble-notif")
                    .attr("id", "bubble-text")
                    .attr("x", bubbleTextX)
                    .attr("y", bubbleTextY)
                    .attr("dy", dyVal)
                    .attr("text-anchor", "middle")
                    .text("Click to select!");

//Variables for storing, shuffling and sorting input array
var sort = shuffle(array);
var sortedArray = sort.slice(0);
testElem1 = sortedArray[0], testElem2 = sortedArray[1];

/*
==================================
Element highlight and selection
==================================
*/
var select1 = false, select2=false, select1Id, select2Id;
canvas.selectAll("image")
    .on("mouseover", mousemoveIn)
    .on("mouseout", mousemoveOut)
    .on("click", elementSelect);

// Element highlight on Mouse Move-IN
function mousemoveIn(){
    thisId = d3.select(this).attr("id");
    d3.select("circle#"+thisId)
        .classed("hover-highlight", true)
        .classed("non-active", false);
}

// Remove element highlight on Mouse Move-OUT
function mousemoveOut(){
    d3.select("circle#"+thisId)
        .classed("hover-highlight", false)
        .classed("non-active", true);
}

// Element highlight on Mouse Toggle
function elementSelect(){
    thisId = d3.select(this).attr("id");

    if (thisId=="sample1"&&select1==false){
        select1 = true;
        select1Id = thisId;
        d3.select("circle#"+thisId)
            .classed("selection-highlight", true);

        selected1 = true;

        d3.selectAll(".bubble-notif")
            .attr("transform", "translate(220, 0)");

        d3.selectAll(".tut-text").remove();

        var bubbleText = canvas.append("text")
            .attr("class", "tut-text")
            .attr("x", textX)
            .attr("y", textY)
            .attr("dy", dyVal)
            .attr("text-anchor", "middle")
            .text("ELement 1 has been selected!");

    } else if (thisId=="sample2"&&select2==false){
        select2 = true;
        select2Id = thisId;
        d3.select("circle#"+thisId)
            .classed("selection-highlight", true);

        if (selected1==true){
            d3.selectAll(".bubble-notif")
                .attr("transform", "translate(110, 180)");    
        }
        selected2 = true;

        d3.selectAll(".tut-text").remove();

        var bubbleText = canvas.append("text")
            .attr("class", "tut-text")
            .attr("x", textX)
            .attr("y", textY)
            .attr("dy", dyVal)
            .attr("text-anchor", "middle")
            .text("ELement 2 has been selected!");        

    } else if (thisId=="sample1"&&select1==true){
        select1 = false;
        select1Id = "";
        d3.select("circle#"+thisId)
            .classed("selection-highlight", false);

        d3.selectAll(".tut-text").remove();

        var bubbleText = canvas.append("text")
            .attr("class", "tut-text")
            .attr("x", textX)
            .attr("y", textY)
            .attr("dy", dyVal)
            .attr("text-anchor", "middle")
            .text("ELement 1 has been de-selected!");

    } else if (thisId=="sample2"&&select2==true){
        select2 = false;
        select2Id = "";
        d3.select("circle#"+thisId)
            .classed("selection-highlight", false);

        d3.selectAll(".tut-text").remove();

        var bubbleText = canvas.append("text")
            .attr("class", "tut-text")
            .attr("x", textX)
            .attr("y", textY)
            .attr("dy", dyVal)
            .attr("text-anchor", "middle")
            .text("ELement 2 has been de-selected!");
    };
}

// Remove element highlight on Mouse Toggle
function elementDeselect(){
    select1 = false;
    select2 = false;
    d3.select("circle#"+select1Id)
        .classed("selection-highlight", false);

    d3.select("circle#"+select2Id)
        .classed("selection-highlight", false);
    select1Id = undefined;
    select2Id = undefined;
}

/*
==================================================================
Function for adding compare animation function to weighing scale
==================================================================
*/
d3.selectAll("#scale").on("click", compareElem);

/*
=============================================
Function for Weight Comparision Visualization
=============================================
*/
function compareElem(){
    if (selected1 == true && selected2 == true){
        d3.selectAll(".bubble-notif").remove();        
    }

    if (select1Id==null || select2Id==null){
        popupSelectionError.style.display = "block";
        var delay=5000;
        setTimeout(function() {
          popupSelectionError.style.display = "none";
        }, delay);
    }
    
    index1 = select1Id.slice(6,7);
    index2 = select2Id.slice(6,7);

    placeElem();
    weighElem();
    weightVis();
    exchangeElem();
    resetRot()
    elementDeselect();

    function placeElem(){
        d3.select("image#"+select1Id)
            .transition()
            .duration(500)
            .ease("in-out")
            .attr("x", scaleLeft)
            .attr("y", lowerMargin);

        d3.select("image#"+select2Id)
            .transition()
            .duration(500)
            .ease("in-out")
            .attr("x", scaleRight)
            .attr("y", lowerMargin);
    }

    function weighElem(){
        console.log(testElem1, testElem2);

        if (testElem1>testElem2){
            rotateAngle = -10;            
        } else if (testElem2>testElem1){
            rotateAngle = 10;
        } else if (testElem1==testElem2){
            rotateAngle = 0;
        }

        (function(select1Id, select2Id) {
            setTimeout(function(){
                d3.select("#scale")
                    .transition()
                    .duration(500)
                    .ease("linear")
                    .attr("transform", "translate("+ scaleLateX +","+ scaleLateY +") rotate("+rotateAngle+","+(scaleWidth/2)+", 0)");

                d3.select("image#"+select1Id)
                    .transition()
                    .duration(500)
                    .ease("linear")
                    .attr("transform", "rotate("+rotateAngle+","+ (scaleLateX+scaleWidth/2) +", "+ (scaleLateY-imgHeight/2) +")");

                d3.select("image#"+select2Id)
                    .transition()
                    .duration(500)
                    .ease("linear")
                    .attr("transform", "rotate("+rotateAngle+","+ (scaleLateX+scaleWidth/2) +", "+ (scaleLateY-imgHeight/2) +")");
            }, 1000);
        })(select1Id, select2Id)
    }

    function weightVis(){
        initHeight = 30;
        initY = rectBtm -initHeight;
        leftWeight = testElem1*10+50;
        rightWeight = testElem2*10+50;
        rectLeftY = rectBtm - leftWeight;
        rectRightY = rectBtm - rightWeight;
        weightWidth = 15;

        var rectLeft = canvas.append("rect")
                        .attr("class", "weight-compare-bar")
                        .attr("id", "weight-bar-left")
                        .attr("x", rectLeftX)
                        .attr("y", initY)
                        .attr("height", initHeight)
                        .attr("width", weightWidth);

        var rectRight = canvas.append("rect")
                        .attr("class", "weight-compare-bar")
                        .attr("id", "weight-bar-right")
                        .attr("x", rectRightX)
                        .attr("y", initY)
                        .attr("height", initHeight)
                        .attr("width", weightWidth);

        (function(rectLeftY, rectRightY, rectRightY, rightWeight) {
            setTimeout(function(){
                d3.select("#weight-bar-left")
                    .transition()
                    .duration(800)
                    .attr("y", rectLeftY)
                    .attr("height", leftWeight);

                d3.select("#weight-bar-right")
                    .transition()
                    .duration(800)
                    .attr("y", rectRightY)
                    .attr("height", rightWeight);
            }, 700);
        })(rectLeftY, rectRightY, rectRightY, rightWeight)
    }

    function resetRot(){
        (function(select1Id, select2Id, resetRotate) {
            setTimeout(function(){
                d3.select("#scale")
                    .transition()
                    .duration(500)
                    .ease("linear")
                    .attr("transform", "translate("+ scaleLateX + "," + scaleLateY +") rotate("+resetRotate+","+(scaleWidth/2)+", 0)");

                d3.select("image#"+select1Id)
                    .transition()
                    .duration(500)
                    .ease("linear")
                    .attr("transform", "rotate("+resetRotate+")");

                d3.select("image#"+select2Id)
                    .transition()
                    .duration(500)
                    .ease("linear")
                    .attr("transform", "rotate("+resetRotate+")");
            }, 1800);
        })(select1Id, select2Id, resetRotate)
    }

    function exchangeElem(){
        xPos1 = containerWidth/2 - imgWidth - padding;
        xPos2 = containerWidth/2 + padding;

        (function() {
            setTimeout(function(){
                d3.selectAll("rect")
                    .transition()
                    .duration(500)
                    .attr("style", "opactity: 0.0")
                    .remove();
            }, 2500);
        })()

        if (testElem1>testElem2 && xPos2>xPos1){
            var k = index1;
            index1 = index2;
            index2 = k;

            (function(select1Id, select2Id, xPos1, xPos2) {
                setTimeout(function(){

                    d3.selectAll(".tut-text").remove();

                    var bubbleText = canvas.append("text")
                                        .attr("class", "tut-text")
                                        .attr("x", textX)
                                        .attr("y", textY)
                                        .attr("dy", dyVal)
                                        .attr("text-anchor", "middle")
                                        .text("Element 1 is heavier! Thus the positions are exchanged.");

                    d3.select("image#"+select1Id)
                        .transition()
                        .duration(500)
                        .ease("in-out")
                        .attr("x", xPos2)
                        .attr("y", upperMargin);

                    d3.select("image#"+select2Id)
                        .transition()
                        .duration(500)
                        .ease("in-out")
                        .attr("x", xPos1)
                        .attr("y", upperMargin);

                    var x = testElem1;
                    testElem1 = testElem2;
                    testElem2 = x;

                    //Update ID of Element
                    d3.select("image#"+select1Id).attr("id", "randomId");
                    d3.select("image#"+select2Id).attr("id", select1Id);
                    d3.select("image#randomId").attr("id", select2Id);
                }, 2500);
            })(select1Id, select2Id, xPos1, xPos2)

        } else {
            (function(select1Id, select2Id, xPos1, xPos2) {
                setTimeout(function(){

                    d3.selectAll(".tut-text").remove();

                    var bubbleText = canvas.append("text")
                                        .attr("class", "tut-text")
                                        .attr("x", textX)
                                        .attr("y", textY)
                                        .attr("dy", dyVal)
                                        .attr("text-anchor", "middle")
                                        .text("ELement 2 is heavier! Thus the positions remain the same.");

                    d3.select("image#"+select1Id)
                        .transition()
                        .duration(500)
                        .ease("in-out")
                        .attr("x", xPos1)
                        .attr("y", upperMargin);

                    d3.select("image#"+select2Id)
                        .transition()
                        .duration(500)
                        .ease("in-out")
                        .attr("x", xPos2)
                        .attr("y", upperMargin);
                }, 2500);
            })(select1Id, select2Id, xPos1, xPos2)
        }
    }
}

//Sort Array by Fisher Yates shuffling algorithm
function shuffle(array) {
    var n = array.length, t, i;
    while (n) {
        i = Math.floor(Math.random()*n--);
        t = array[n];
        array[n] = array[i];
        array[i] = t;
    }
    return array;
}