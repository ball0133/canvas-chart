var canvas, context, data, pct, cheese;
var total = 0;

document.addEventListener("DOMContentLoaded", function () {
    
    var cheeseData = $.ajax({
        dataType: "json",
        url: "js/cheese.json",
        type: "GET"
    });
    cheeseData.done(function(data) {
        console.log(data);
        for (var i=0; i<data.segments.length; i++){
            total += data.segments[i].value;  
            cheese = data.segments;
    }
        
    //var i=0, saying to grab the first item
    //find the length of the information, how much of it to grab. We want to grab all of segments
    //i< means to start at the first item and keep going for the length of segments
    //i++ count by 1
    //+= adding info
    //total is used for pie chart to get towards 100%
    //call for next function
        showPie();
        showBars();
    });
});
    
function setDefaultStyles(){
  //set default styles for canvas
  context.strokeStyle = "#333";	//colour of the lines
  context.lineWidth = 3;
  context.font = "normal 10pt Helvetica";
  context.textAlign = "left";
}

    
function showPie(){
    canvas = document.querySelector("#pie");
    context = canvas.getContext("2d");
    //set the styles in case others have been set
    setDefaultStyles();
    context.restore();
    context.clearRect(0, 0, canvas.width, canvas.height);
        
    var cx = (canvas.width/2) - 40; //center of circle set in the middle of the canvas
    var cy = canvas.height/2; //center of circle set in the middle of the canvas
    var radius = 100; //size of circle
    var currentAngle = 0;
    //the difference for each wedge in the pie is arc along the circumference
    //we use the percentage to determine what percentage of the whole circle
    //the full circle is 2 * Math.PI radians long.
    //start at zero and travelling clockwise around the circle
    //start the center for each pie wedge
    //then draw a straight line out along the radius at the correct angle
    //then draw an arc from the current point along the circumference
    //stopping at the end of the percentage of the circumference
    //finally going back to the center point.
    for(var i=0; i<cheese.length; i++){
        if(cheese[i].value <= 4 ){ //smaller percentage
            radius = 110;
        }else if(cheese[i].value >= 40){ //larger percentage
            radius = 90;
        }else{
            radius = 100; //other percentages
        }
        
        pct = cheese[i].value/total;
        //create colour 0 - 16777216 (2 ^ 24) based on the percentage
        var colour = cheese[i].color;
        
        var endAngle = currentAngle + (pct * (Math.PI * 2));
        //draw the arc
        context.moveTo(cx, cy);
        context.beginPath();
        context.fillStyle = colour;
        context.arc(cx, cy, radius, currentAngle, endAngle, false);  
        context.lineTo(cx, cy);
        context.fill();

        //Now draw the lines that will point to the values
        context.save();
        context.translate(cx, cy);//make the middle of the circle the (0,0) point
        context.strokeStyle = "#000";
        context.lineWidth = 1;
        context.beginPath();
        //angle to be used for the lines
        var midAngle = (currentAngle + endAngle)/2;//middle of two angles
        context.moveTo(0,0);//this value is to start at the middle of the circle
        //to start further out...
        var dx = Math.cos(midAngle) * (0.8 * radius); //length of line
        var dy = Math.sin(midAngle) * (0.8 * radius); //length of line
        context.moveTo(dx, dy);
        //ending points for the lines
        var dx = Math.cos(midAngle) * (radius + 30); //30px beyond radius
        var dy = Math.sin(midAngle) * (radius + 30);
        context.lineTo(dx, dy);
        context.stroke();
        var text = cheese[i].label;

        if(text == "Gouda"){
            context.fillText(text, dx - 30, dy - 10);
        }else if(text == "Danish Blue"){
            context.fillText(text, dx - 35, dy - 10);
        }else if(text == "Cheddar"){
            context.fillText(text, dx - 28, dy + 20);
        }else if(text == "Monterey Jack"){
            context.fillText(text, dx + 10, dy + 3);
        }else if(text == "Stilton"){
            context.fillText(text, dx + 10, dy + 0);
        }else if(text == "Mozzarella"){
            context.fillText(text, dx + 10, dy + 10);
        }else{
            context.fillText(text, dx + 5, dy + 5);
        }
        //put the canvas back to the original position
        context.restore();
        //update the currentAngle
        currentAngle = endAngle;
    }
}

function showBars(){
    canvas = document.querySelector("#bar");
    context = canvas.getContext("2d");

    //clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    //set the styles in case others have been set
    setDefaultStyles();
    //the percentage of each value will be used to determine the height of the bars.
    var graphHeight = 300;    //bottom edge of the graph
    var offsetX = 30;	//space away from left edge of canvas to start drawing.
    var barWidth = 25;	//width of each bar in the graph
    var spaceBetweenPoints = 20; //how far apart to make each x value.
    //start at values[1].
    //values[0] is the moveTo point.
    var x = offsetX + 20;	//left edge of first rectangle
    //var y = offsetY - (graphHeight * (values[0]/100));
    //start a new path
    
    for(var i=0; i<cheese.length; i++){
        pct = cheese[i].value / total;
        //context.fillStyle = cheese[i].color;
        context.beginPath();
        context.fillStyle = cheese[i].color;
        var barHeight = (graphHeight * pct);
        //(x, y) coordinates for a rectangle are the top, left values unless you do negative values for w, h
        context.rect(x, graphHeight-1, barWidth, -1 * barHeight);
        context.fill();
        //for the first point the moveTo and lineTo values are the same
        //All the labels for the bars are going above the bars
        context.save();
        var text = cheese[i].label;
        context.translate(x+10, graphHeight - barHeight - 55);
        context.rotate(Math.PI*1.5);
        
        context.fillText(text, 0, 0);
        
        context.restore();
        var lbl = Math.round(pct * 100).toString();
        context.fillText(lbl, x, graphHeight - barHeight - 30-1);
        x = x + barWidth + spaceBetweenPoints;	
        //move the x value for the next point
        
        
        context.closePath();
    }
  
    context.strokeStyle = "#ccc";
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(offsetX, canvas.height-graphHeight);
    context.lineTo(offsetX, graphHeight);
    context.lineTo(canvas.width-offsetX, graphHeight);
    context.stroke();  
}
