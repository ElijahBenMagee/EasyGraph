
var W = 1000
var H = 500
var buttonToggle = 4;

var currentPoint;


//Helper Functions
function arrayMin(arr) {
  var len = arr.length, min = Infinity;
  while (len--) {
    if (arr[len] < min) {
      min = arr[len];
    }
  }
  return min;
};

function sumPower(arr,pwr){
	runningSum = 0;
	for(i=0; i<arr.length; i++){
		runningSum += arr[i]**pwr;
	}
	return runningSum;
}

function arrayMax(arr) {
  var len = arr.length, max = -Infinity;
  while (len--) {
    if (arr[len] > max) {
      max = arr[len];
    }
  }
  return max;
};

function drawSquarePoint(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;    
    ctx = graphCanvas.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x-this.width/2, this.y-this.height/2, this.width, this.height);
}

function drawText(text,x,y,size,color='#000000'){
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	
	ctx.font = String(size)+"px Arial";
	ctx.fillStyle = color;
	ctx.fillText(text, x, y);
	
}

function drawLine(x1,y1,x2,y2,width=1,color='#000000'){
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.lineWidth = width;
	ctx.strokeStyle = color;
	ctx.stroke();
}



//Initialize the canvas
var graphCanvas = { 
    start : function() {
        document.getElementById("myCanvas").width = W;
        document.getElementById("myCanvas").height = H;
        this.context = document.getElementById("myCanvas").getContext("2d");
    }
}



//Draw a time graph
var timeGraph = {
	start : function() {
      document.getElementById("myCanvas").width = W;
      document.getElementById("myCanvas").height = H;
      this.context = document.getElementById("myCanvas").getContext("2d");
		var str = document.getElementById("dataBox1").value;
  		var res = str.split(/\n/); 
   	graphCanvas.start();
		var arrayLength = res.length;
		this.xLength = res.length;
		this.xSpace = 40;
		this.ySpace = 30;	
		this.vScale = (H-this.xSpace)/(arrayMax(res) - arrayMin(res));
		this.hScale = (W-this.ySpace-5)/arrayLength;
		this.dotSize = Math.min(this.hScale/2.5,20);	
		this.resMin = arrayMin(res);
		var t = this.xdtc(30);
		const xValues = [];
		const yValues = [];
		
		this.drawGrid()   		
		
		for (var i = 0; i < arrayLength; i++) {
			xValues[i] = i;
			yValues[i] = res[i];
			
			currentPoint = new drawSquarePoint(this.dotSize, this.dotSize, "red", this.xdtc(i), this.ydtc(res[i]));
		
			if(i < arrayLength - 1) {
				drawLine(this.xdtc(i),this.ydtc(res[i]), this.xdtc(i+1),this.ydtc(res[i+1]))
			}
			if((i < arrayLength - 4) && (i > 3)){
				currentPoint = new drawSquarePoint(this.dotSize, this.dotSize, "yellow", this.xdtc(i), this.ydtc((parseInt(res[i])+parseInt(res[i+1])+parseInt(res[i+2])+parseInt(res[i+3])+parseInt(res[i-3])+parseInt(res[i-2])+parseInt(res[i-1]))/7));
				
			}
    	
		}
		this.linearTrend(xValues,yValues)
	
	},
    
   linearTrend : function(x,y){
   		var sumBoth = 0;
		   var a = 0;
		   var b = 0;
		   for (i = 0; i < x.length; i++){
		   	sumBoth += x[i]*y[i]
		   }
		   
			a = (sumPower(y,1)*sumPower(x,2)-sumPower(x,1)*sumBoth)/(x.length*sumPower(x,2)-sumPower(x,1)**2);
		   b = (x.length*sumBoth-sumPower(x,1)*sumPower(y,1))/(x.length*sumPower(x,2)-sumPower(x,1)**2);
   		xInt = (this.resMin-a)/b;
   		yInt = a;
   		console.log(a,b,xInt,yInt,sumPower(y,1),sumPower(y,2),sumBoth)
   		drawLine(this.xdtc(0),this.ydtc(yInt),this.xdtc(xInt),this.ydtc(this.resMin),3,'orange');
   		drawText("y = "+Math.round(b * 10) / 10+"x + "+Math.round(a * 10) / 10, W/2-30,20,20,'orange')
   },
   
	drawGrid : function(){
		var vRange = (H-this.xSpace)/this.vScale; 	
		var step = vRange/5;
		var xStep = this.xLength/8
		for(var i = 0; i < 5; i++){
			drawLine(this.xSpace,this.ydtc(parseFloat(this.resMin)+parseFloat(i*step)),W,this.ydtc(parseFloat(this.resMin)+parseFloat(i*step)))
			drawText(Math.round((parseFloat(this.resMin)+parseFloat(i*step))*10)/10,5,this.ydtc(parseFloat(this.resMin)+parseFloat(i*step))+6, 12)
			//console.log(parseFloat(this.resMin)+parseFloat(i*step))
			//console.log(vRange)	
			//console.log(H)
		}
		for (var i = 0; i < xStep; i++){
			drawLine(this.xdtc(i*xStep), H-this.ySpace, this.xdtc(i*xStep),0);
			drawText(parseInt(i*xStep),this.xdtc(i*xStep)-6,H-12,12)
		}
	},
	xdtc : function(x1){
		return this.hScale*x1+this.xSpace;
	},	
	ydtc : function(y1){
		return (H-this.ySpace)+this.vScale*this.resMin-this.vScale*y1;
	}
}

function myFunction() {
 	timeGraph.start();
 
}