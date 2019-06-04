/*
==================================
Variable Declaration
==================================
*/

//Sorting data variable declaration
var dataset = [],
num=7, k = 1, cmpIndex = [];
array = [1, 2, 3, 4, 5, 6, 7];

// SVG parameters
var containerWidth = $(".display-wide").width(), svgHeight = 420, svgWidth = containerWidth;

// Variables for SVG coordinates
var padding = 20, upperMargin = 36, lowerMargin = 210;

//Variables for SVG dimensions
var imgWidth = Math.floor((containerWidth - (2*num*padding))/7),
imgHeight = imgWidth*2/3,
scaleLeft = 410, scaleRight = 614, scaleLateX = 410, scaleLateY = 270, 
scaleHeight = 20, scaleWidth = 328, balanceHeight = 108,
rectLeftX = 365, rectBtm = lowerMargin+160, rectRightX = 768;

// Variables for selection and storing selection data
var select1 = false, select2=false, select1Id, select2Id;

//Variables for animation
var resetRotate=0, long_dur=500, short_dur=200;

//Variables for textual explanation
var message="";

var sort = shuffle(array);
dataset[0] = sort.slice(0);
bubblesort(sort);
//insertionsort(sort);

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

var weighScale = canvas.append("image")
                        .attr("id", "scale")
                        .attr("height", 20)
                        .attr("width", 328)
                        .attr("transform", "translate("+ scaleLateX + "," + scaleLateY +")")
                        .attr("xlink:href", "images/scales.png");
var balance = canvas.append("image")
                .attr("id", "scale")
                .attr("height", 108)
                .attr("width", 328)
                .attr("transform", "translate("+ scaleLateX + "," + (scaleLateY+10) +")")
                .attr("xlink:href", "images/balance.png");

/*
==================================
Element highlight and selection
==================================
*/
canvas.selectAll("image")
    .on("mouseover", mousemoveIn)
    .on("mouseout", mousemoveOut);
    //.on("click", elementSelect);

function mousemoveIn(){
    thisId = d3.select(this).attr("id");
    d3.select("circle#"+thisId)
        .classed("hover-highlight", true)
        .classed("non-active", false);
}

function mousemoveOut(){
    d3.select("circle#"+thisId)
        .classed("hover-highlight", false)
        .classed("non-active", true);
}

d3.select("#vis-btn").on("click", sortVis);

function sortVis(){
    for(var index=0; index<cmpIndex.length; index++){
        swap1 = cmpIndex[index];
        swap2 = swap1+1;
        delay = 1000+3000*index;
        document.getElementById("counter-text").innerHTML = "No. of Operations: "+0;

        (function(swap1, swap2, index) {
            setTimeout(function(){
                printCount(index);
                elementSelect(swap1, swap2);
                placeElem(swap1, swap2, index);
            }, delay);
            setTimeout(function(){
                weighElem(swap1, swap2, index);
                weightVis(swap1, swap2, index);
            }, delay+600);
            setTimeout(function(){
                resetRot(swap1, swap2);
            }, delay+1200);
            setTimeout(function(){
                elementDeselect(swap1, swap2);
                exchangeElem(swap1, swap2, index);
                explainText(index);
            }, delay+1800);
        })(swap1, swap2, index)
    }
    
    d3.select("#vis-btn").remove();
    //explainText();
    completeVis();
}

/*
=============================================
Function for Weight Comparision Visualization
=============================================
*/
function printCount(index){
    document.getElementById("counter-text").innerHTML = "No. of Operations: "+(index+1);
}

function elementSelect(swap1, swap2){
    swap1Id = "sample"+swap1;
    swap2Id = "sample"+swap2;
    d3.select("circle#"+swap1Id)
        .classed("selection-highlight", true);

    d3.select("circle#"+swap2Id)
        .classed("selection-highlight", true);
}

function elementDeselect(swap1, swap2){
    swap1Id = "sample"+swap1;
    swap2Id = "sample"+swap2;
    d3.select("circle#"+swap1Id)
        .classed("selection-highlight", false);

    d3.select("circle#"+swap2Id)
        .classed("selection-highlight", false);
}

function placeElem(swap1, swap2, index){
    swap1Id = "sample"+swap1;
    swap2Id = "sample"+swap2;
    d3.select("image#"+swap1Id)
        .transition()
        .duration(long_dur)
        .ease("in-out")
        .attr("x", scaleLeft)
        .attr("y", lowerMargin);

    d3.select("image#"+swap2Id)
        .transition()
        .duration(long_dur)
        .ease("in-out")
        .attr("x", scaleRight)
        .attr("y", lowerMargin);
}

function weighElem(swap1, swap2, index){
    if (dataset[index][swap1]>dataset[index][swap2]){
        rotateAngle = -10;
    } else if (dataset[index][swap1]<dataset[index][swap2]){
        rotateAngle = 10;
    } else if (dataset[index][swap1]==dataset[index][swap2]){
        rotateAngle = 0;
    }

    swap1Id = "sample"+swap1;
    swap2Id = "sample"+swap2;

    d3.select("#scale")
        .transition()
        .duration(long_dur)
        .ease("linear")
        .attr("transform", "translate("+ scaleLateX +","+ scaleLateY +") rotate("+rotateAngle+","+(scaleWidth/2)+", 0)");

    d3.select("image#"+swap1Id)
                    .transition()
                    .duration(500)
                    .ease("linear")
                    .attr("transform", "rotate("+rotateAngle+","+ (scaleLateX+scaleWidth/2) +", "+ (scaleLateY-imgHeight/2) +")");

    d3.select("image#"+swap2Id)
        .transition()
        .duration(500)
        .ease("linear")
        .attr("transform", "rotate("+rotateAngle+","+ (scaleLateX+scaleWidth/2) +", "+ (scaleLateY-imgHeight/2) +")");
}

function weightVis(swap1, swap2, index){
    initHeight = 30;
    initY = rectBtm -initHeight;
    leftWeight = dataset[index][swap1]*10+50;
    rightWeight = dataset[index][swap2]*10+50;
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

}

function resetRot(swap1, swap2){
    swap1Id = "sample"+swap1;
    swap2Id = "sample"+swap2;

    d3.select("#scale")
        .transition()
        .duration(long_dur)
        .ease("linear")
        .attr("transform", "translate("+ scaleLateX + "," + scaleLateY +") rotate("+resetRotate+","+(scaleWidth/2)+", 0)");
    
    d3.select("image#"+swap1Id)
                    .transition()
                    .duration(500)
                    .ease("linear")
                    .attr("transform", "rotate("+resetRotate+")");

    d3.select("image#"+swap2Id)
        .transition()
        .duration(500)
        .ease("linear")
        .attr("transform", "rotate("+resetRotate+")");
}

function exchangeElem(swap1, swap2, index){
    d3.selectAll("rect")
            .transition()
            .duration(long_dur)
            .attr("style", "opactity: 0.0")
            .remove();

    if (dataset[index][swap1]>dataset[index][swap2]){
        var k = swap1;
        swap1 = swap2;
        swap2 = k;
        d3.select("image#"+swap1Id)
            .transition()
            .duration(long_dur)
            .ease("in-out")
            .attr("x", padding+((imgWidth+2*padding)*(swap1)))
            .attr("y", upperMargin);

        d3.select("image#"+swap2Id)
            .transition()                    
            .duration(long_dur)
            .ease("in-out")
            .attr("x", padding+((imgWidth+2*padding)*(swap2)))
            .attr("y", upperMargin);

        //Update ID of Element
        d3.select("image#"+swap1Id).attr("id", "randomId");
        d3.select("image#"+swap2Id).attr("id", swap1Id);
        d3.select("image#randomId").attr("id", swap2Id);

    } else {
        d3.select("image#"+swap1Id)
            .transition()
            .duration(long_dur)
            .ease("in-out")
            .attr("x", padding+((imgWidth+2*padding)*(swap1)))
            .attr("y", upperMargin);

        d3.select("image#"+swap2Id)
            .transition()                    
            .duration(long_dur)
            .ease("in-out")
            .attr("x", padding+((imgWidth+2*padding)*(swap2)))
            .attr("y", upperMargin);
    }
}

// Function to add text for explanation of algorithm
function explainText(index){
    var heavyElem = d3.select("image#"+swap2Id).attr("xlink:href").slice(17, 18);
    var suffix, prevMsg = message;

    if (heavyElem==1){
        suffix = "st";
    } else if (heavyElem==2){
        suffix = "nd";
    } else if (heavyElem==3){
        suffix = "rd";
    } else {
        suffix = "th";
    }

    if (index>1 && cmpIndex[index]>1){
        message = "The bubble sort algorithm tries to find the largest element and put it at the end of the list.";
    } if (index>=5 && cmpIndex[index]>=5){
        message = "The heaviest element is the "+heavyElem+suffix+" element. It has been placed at the end.";
    } if (index>5 && cmpIndex[index]<=3){
        message = "Once the heaviest element is placed the algorithm tries to find the next heaviest element, which now is the " + heavyElem+suffix+" element.";
    } if (index>9 && cmpIndex[index]>3){
        message = "The "+heavyElem+suffix+" element has now been placed at the end of the remaining 6 elements in the unsorted list.";
    } if (index>10 && cmpIndex[index]<3){
        message = "The algorithm continues to go through the list of elements.";
    } if (index>12){
        message = "As the process continues we obtain the sorted list of elements";
    }

    console.log(prevMsg, message);
    
    if (!(prevMsg===message)){
        $('p#explain-text').append(message+"<br>");
    }
    
}

function completeVis(){
    var delay=3000*cmpIndex.length + 2000;
    setTimeout(function() {
        popupGameFail.style.display = "block";
        gameFailText.style.display = "block";
    }, delay);
}

/*
==================================
Sorting calculations
==================================
*/

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

function bubblesort(array) {
    var n = array.length;
    do {
        var swapped = false;
        for (i=1; i<n; i++){
            if (array[i-1]>array[i]){
                var swap = array[i];
                array[i] = array[i-1];
                array[i-1] = swap;
                swapped = true;
            }
            cmpIndex[k-1] = i-1;
            dataset[k] = array.slice(0);
            k++;
        }
        n -= 1;
    }
    while (swapped == true);
}

/*function insertionsort(array) {
    var n = array.length;
    for (i=1; i<n; i++){
        var j = i, swap = array[i];
        while (j>0 && array[j-1]>array[j]){
            console.log(j);
            array[j] = array[j-1];
            cmpIndex[k-1] = j;
            j--;
        }
        array[j] = swap;
        dataset[k] = array.slice(0);
        k++;
    }
    console.log(cmpIndex);
    for (i=0; i<dataset.length; i++){
        console.log(dataset[i]);
    }
    return array;
}

function selectionsort(array) {
    var n = array.length;
    do {
        var swapped = false;
        for (i=1; i<n; i++){
            if (array[i-1]>array[i]){
                var swap = array[i];
                array[i] = array[i-1];
                array[i-1] = swap;
                swapped = true;
            }
            cmpIndex[k-1] = i-1;
            dataset[k] = array.slice(0);
            k++;
        }
        n -= 1;
    }
    while (swapped == true);
    console.log(cmpIndex);
    for (i=0; i<dataset.length; i++){
        console.log(dataset[i]);
    }
    return array;
}*/
