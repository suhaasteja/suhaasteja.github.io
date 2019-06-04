/*
=============================================
Function for Weight Comparision Visualization
=============================================
*/
function compareCPU(){    
    cpuMaxCount = cmpIndex.length;
    if (counterVar<cpuMaxCount){
        // CPU Gameplay visualization
        cpuSwap1 = cmpIndex[counterVar];
        cpuSwap2 = cpuSwap1+1;
        var delay=3000;
        (function(cpuSwap1, cpuSwap2) {
            setTimeout(function(){
                cpuPlay(cpuSwap1, cpuSwap2);
            }, delay);
            setTimeout(function(){
                cpuDeselect(cpuSwap1, cpuSwap2);
            }, delay+500);
        })(cpuSwap1, cpuSwap2)
        
    } else {
        gameEnd()
    }

    function cpuPlay(cpuSwap1, cpuSwap2){
        cpuSwap1Id = "cpu-sample"+cpuSwap1;
        cpuSwap2Id = "cpu-sample"+cpuSwap2;

        d3.select("circle#u-"+cpuSwap1Id)
            .classed("selection-highlight", true);
        d3.select("circle#u-"+cpuSwap2Id)
            .classed("selection-highlight", true);

        if (dataset[counterVar-1][cpuSwap1]>dataset[counterVar-1][cpuSwap2]){
            var k = cpuSwap1;
            cpuSwap1 = cpuSwap2;
            cpuSwap2 = k;

            d3.select("image#"+cpuSwap1Id)
                .transition()
                .duration(short_dur)
                .ease("in-out")
                .attr("x", padding+((imgWidth+2*padding)*(cpuSwap1)))
                .attr("y", lowerElem);

            d3.select("image#"+cpuSwap2Id)
                .transition()
                .duration(short_dur)
                .ease("in-out")
                .attr("x", padding+((imgWidth+2*padding)*(cpuSwap2)))
                .attr("y", lowerElem);

            //Update ID of Element
            d3.select("image#"+cpuSwap1Id).attr("id", "randomId");
            d3.select("image#"+cpuSwap2Id).attr("id", cpuSwap1Id);
            d3.select("image#randomId").attr("id", cpuSwap2Id);

        } else {
            d3.select("image#"+cpuSwap1Id)
                .transition()
                .delay(3000)
                .duration(short_dur)
                .ease("in-out")
                .attr("x", padding+((imgWidth+2*padding)*(cpuSwap1)))
                .attr("y", lowerElem);

            d3.select("image#"+cpuSwap2Id)
                .transition()
                .delay(3000)
                .duration(short_dur)
                .ease("in-out")
                .attr("x", padding+((imgWidth+2*padding)*(cpuSwap2)))
                .attr("y", lowerElem);
        }
    }

    function cpuDeselect(cpuSwap1, cpuSwap2){
        cpuSwap1Id = "cpu-sample"+cpuSwap1;
        cpuSwap2Id = "cpu-sample"+cpuSwap2;

        d3.select("circle#u-"+cpuSwap1Id)
            .classed("selection-highlight", false);
        d3.select("circle#u-"+cpuSwap2Id)
            .classed("selection-highlight", false);
    }
}