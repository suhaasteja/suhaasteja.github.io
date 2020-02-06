//Variables for storing, shuffling and sorting input array
var sort = shuffle(array);
var sortArray = sort.slice(0);
gameset[0] = sort.slice(0);
dataset[0] = sort.slice(0);
bubblesort(sortArray);
console.log(sort);

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
    if(select1==false&&select2==false){
        select1 = true;
        select1Id = thisId;
        d3.select("circle#"+thisId)
            .classed("selection-highlight", true);
    } else if(select1==true&&select2==false){
        if(thisId!=select1Id){
            select2 = true;
            select2Id = thisId;
            d3.select("circle#"+thisId)
                .classed("selection-highlight", true);
        } else if(thisId == select1Id){
            select1 = false;
            d3.select("circle#"+thisId)
                .classed("selection-highlight", false);
        }
    } else if(select1==false&&select2==true){
        if(thisId!=select2Id){
            select1 = true;
            select1Id = thisId;
            d3.select("circle#"+thisId)
                .classed("selection-highlight", true);
        } else if(thisId == select2Id){
            select2 = false;
            d3.select("circle#"+thisId)
                .classed("selection-highlight", false);
        }
    } else if(select1==true&&select2==true){
        if(thisId == select1Id){
            select1 = false;
            d3.select("circle#"+thisId)
                .classed("selection-highlight", false);
        } if(thisId == select2Id){
            select2 = false;
            d3.select("circle#"+thisId)
                .classed("selection-highlight", false);
        }
    }
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
document.getElementById("counter-text").innerHTML = "No. of Operations: "+0;

/*
=============================================
Function for Weight Comparision Visualization
=============================================
*/
function compareElem(){
    if (select1Id==null || select2Id==null){
        popupSelectionError.style.display = "block";
        var delay=3000;
        setTimeout(function() {
          popupSelectionError.style.display = "none";
        }, delay);
    }

    maxCount = cmpIndex.length;
    index1 = select1Id.slice(6,7);
    index2 = select2Id.slice(6,7);
    if (index2<index1){
        var swapIndices = index1;
        var swapId = select1Id;

        index1 = index2;
        index2 = swapIndices;

        select1Id = select2Id;
        select2Id = swapId;
    }

    placeElem();
    counter();

    (function(index1, index2, cmpCount) {
        setTimeout(function(){
            weightVis(index1, index2, cmpCount);
        }, 700);
        setTimeout(function(){
            weighElem(index1, index2, cmpCount);
        }, 1000);
        setTimeout(function(){
            resetRot(index1, index2);
        }, 1800);
        setTimeout(function(){
            exchangeElem(index1, index2);
        }, 2500);
        setTimeout(function(){
            elementDeselect(index1, index2, cmpCount);
        }, 3000);
    })(index1, index2, cmpCount)

    function counter(){
        counterVar++;

        if ((counterVar<=maxCount) && arrayCmp(gameset[cmpCount], sortArray)){
            gameWin();
        }

        // Put inside function
        document.getElementById("counter-text").innerHTML = "No. of Operations: "+(counterVar);

        if (counterVar>maxCount){
            gameEnd()
        }
    }

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
        if (gameset[cmpCount][index1]>gameset[cmpCount][index2]){
            rotateAngle = -10;
        } else if (gameset[cmpCount][index1]<gameset[cmpCount][index2]){
            rotateAngle = 10;
        } else if (gameset[cmpCount][index1]==gameset[cmpCount][index2]){
            rotateAngle = 0;
        }

        select1Id = "sample"+index1;
        select2Id = "sample"+index2;

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
    }

    function weightVis(select1, select2, index){
        initHeight = 30;
        initY = rectBtm -initHeight;
        leftWeight = gameset[cmpCount][index1]*10+50;
        rightWeight = gameset[cmpCount][index2]*10+50;
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

    function resetRot(index1, index2){
        select1Id = "sample"+index1;
        select2Id = "sample"+index2;

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
    }

    function exchangeElem(index1, index2){
        xPos1 = padding+((imgWidth+2*padding)*(index1));
        xPos2 = padding+((imgWidth+2*padding)*(index2));

        d3.selectAll("rect")
            .transition()
            .duration(500)
            .attr("style", "opactity: 0.0")
            .remove();

        if (gameset[cmpCount][index1]>gameset[cmpCount][index2] && xPos2>xPos1){
            var k = index1;
            index1 = index2;
            index2 = k;

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

            cmpCount++;
            gameset[cmpCount] = gameset[cmpCount-1].slice(0);
            var dataStore = gameset[cmpCount][index1];
            gameset[cmpCount][index1] = gameset[cmpCount][index2];
            gameset[cmpCount][index2] = dataStore;

            //Update ID of Element
            d3.select("image#"+select1Id).attr("id", "randomId");
            d3.select("image#"+select2Id).attr("id", select1Id);
            d3.select("image#randomId").attr("id", select2Id);
        }
        else {
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

            cmpCount++;
            gameset[cmpCount] = gameset[cmpCount-1].slice(0);
        }

        sendArray(gameset[cmpCount-1], gameset[cmpCount], index1, index2);
    }

    function gameWin(){
        var delay=3000;
        setTimeout(function() {
            popupGameWin.style.display = "block";
            gameWinText.style.display = "block";
        }, delay);        
    }

    function gameEnd(){
        var delay=3000;
        setTimeout(function() {
            popupGameFail.style.display = "block";
            gameFailText.style.display = "block";
        }, delay);
    }
}

/*
==================================
Send User Compare Data to Database
==================================
*/

var indices;

function sendArray(array1, array2, index1, index2){
    if (index1>index2){
        indices = {index1: index2, index2: index1};
    } else {
        indices = {index1: index1, index2: index2};
    }

    if (cmpCount <= 0){
        return;
    }
    else {
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
            }
        }

        var arrayStr = JSON.stringify(array1);
        var arrayStr2 = JSON.stringify(array2);
        var newIndices = JSON.stringify(indices);

        xmlhttp.open("POST", "getArray.html");
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send("data="+arrayStr+"&data2="+arrayStr2+"&indices="+newIndices);
    }
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
    /*console.log(cmpIndex);
    for (i=0; i<dataset.length; i++){
        console.log(dataset[i]);
    }*/
    return array;
}

function insertionsort(array) {
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
}

function arrayCmp(array, dataset){
    var i, j=0;
    for (i=0; i<array.length; i++){
        if (array[i] == dataset[i]){
            j++;
        }
    }
    if (j == array.length){
        return true;
    }
    else return false;
}