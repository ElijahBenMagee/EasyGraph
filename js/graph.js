
var W = (screen.availWidth-60)/2
var H = 800
var buttonToggle = 4;
var graph;
var currentPoint;
var state = 0;


//Helper Functions
function arrayMin(arr) {
  var len = arr.length, min = Infinity;
  while (len--) {
    if (parseFloat(arr[len]) < min) {
      min = parseFloat(arr[len]);
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

function standardDev(x){
	var avrg = 0;	
	var s = 0;	
	for(i=0; i<x.length; i++){
		avrg += x[i];
	}
	avrg/=x.length
	for(i=0; i<x.length; i++){
		s+= (x[i]-avrg)**2;
	}
	return (s/(x.length-1))**0.5;
}


function arrayMax(arr) {
  var len = arr.length, max = -Infinity;
  while (len--) {
    if (parseFloat(arr[len]) > max) {
      max = parseFloat(arr[len]);
    }
  }
  return max;
};

function arrayCount(arr,x) {
	var c = 0;
	for (var i = 0; i < arr.length; i++) {
		if(arr[i] == x){
			c += 1;		
		}
	}
	return c;
}

function drawSquarePoint(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;    
    ctx = graphCanvas.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x-this.width/2, this.y-this.height/2, this.width, this.height);
}

function drawCircle(rad, color, x, y) {
    ctx = graphCanvas.context;
	 ctx.beginPath();
	 ctx.strokeStyle = color;
    ctx.arc(x,y,rad,0,2*Math.PI);
    ctx.stroke();
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
		   var noise = [];
		   var s = 0;
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
   		for (i = 0; i < x.length; i++){
		   	noise[i] = y[i] - (b*x[i]+a) 
		   }
		   s = standardDev(noise)
			console.log(s)		   
		   for (i = 0; i < x.length; i++){
		   	if (Math.abs(y[i] - (b*x[i]+a)) > 2*s){
		   		drawCircle(8,"black",this.xdtc(i), this.ydtc(y[i]))
		   	}
		   }
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

var plotGraph = {
	start: function(){
		document.getElementById("myCanvas").width = W;
      document.getElementById("myCanvas").height = H;
      this.context = document.getElementById("myCanvas").getContext("2d");
		var str = document.getElementById("dataBox1").value;
		var res = str.split(/\n/);
		var xySplit = []; 
   	graphCanvas.start();
		var arrayLength = res.length;
		this.xValues = [];
		this.yValues = [];
		var color = ['0','0','0','0','0','0'];
		for (var i = 0; i < arrayLength; i++) {
			xySplit = res[i].split(' ');
			this.xValues[i] = xySplit[0];
			this.yValues[i] = xySplit[1];
		}
		this.xSpace = 40;
		this.ySpace = 30;	
		this.vScale = (H-this.xSpace)/(arrayMax(this.yValues) - arrayMin(this.yValues));
		this.hScale = (W-this.ySpace-5)/(arrayMax(this.xValues) - arrayMin(this.xValues));
		this.xScale = ((W-this.ySpace-5)/arrayLength);
		this.dotSize = 2+(W/res.length)/1.7;	
		this.yMin = arrayMin(this.yValues);				
		this.xMin = arrayMin(this.xValues);						
		this.xSpan = arrayMax(this.xValues) - arrayMin(this.xValues)
		this.ySpan = arrayMax(this.yValues) - arrayMin(this.yValues)
		
		//console.log(arrayMax(this.xValues))				
		//console.log(this.xSpan)	
		var clusters = [];
		this.xCenters = [];
		this.yCenters = [];
		clusters = this.cluster(3)
		
		
		this.drawGrid();
		//console.log(clusters)
		for (var i = 0; i < arrayLength; i++) {
			//console.log(this.xdtc(this.xValues[i]), this.ydtc(this.yValues[i]))
			color = ['0','0','0','0','0','0'];
			color[clusters[i]] = (clusters[i]+5).toString()
			color[(clusters[i]+3)%6] = (clusters[i]*9%10).toString()
			color[(clusters[i]+2)%6] = (clusters[i]*7%10).toString()
			color[(clusters[i]+1)%6] = (clusters[i]*3%10).toString()
			color[(clusters[i]+4)%6] = (clusters[i]*2).toString()
			//console.log('#'+color.join('')+';')
			
			currentPoint = new drawSquarePoint(this.dotSize, this.dotSize, '#'+color.join(''), this.xdtc(this.xValues[i]), this.ydtc(this.yValues[i]));
			
    	
		}		
		
		for (var i = 0; i < this.xCenters.length; i++) {
			//console.log(this.xdtc(this.xCenters[i]), this.ydtc(this.yCenters[i]))
			color = ['0','0','0','0','0','0'];
			color[i] = (i+5).toString()
			color[(i+3)%6] = (i*9%10).toString()
			color[(i+2)%6] = (i*7%10).toString()
			color[(i+1)%6] = (i*3%10).toString()
			color[(i+4)%6] = (i*2).toString()
			currentPoint = new drawSquarePoint(this.dotSize+20, this.dotSize+20, '#'+color.join(''), this.xdtc(this.xCenters[i]), this.ydtc(this.yCenters[i]));
		}
	
	},
	
	drawGrid : function(){
		var vRange = (H-this.xSpace)/this.vScale; 	
		
		var xNum  = 8
		var yNum = 5
		var yStep = (H-this.ySpace)/yNum;
		var xStep = (W-this.xSpace)/xNum;
		
		for(var i = 0; i < yNum+1; i++){
			drawLine(this.xSpace,i*yStep,W,i*yStep)
			//drawText(Math.round((parseFloat(this.xMin)+parseFloat(i*step))*10)/10,5,this.ydtc(parseFloat(this.xMin)+parseFloat(i*step))+6, 12)
			//console.log(parseFloat(this.resMin)+parseFloat(i*step))
			//console.log(vRange)	
			//console.log(H)
		}
		for (var i = 0; i < xNum+1; i++){
			drawLine(i*xStep+this.xSpace, H-this.ySpace, i*xStep+this.xSpace,0);
			drawText(parseInt(this.ixdtc(i*xStep+this.xSpace)),i*xStep+this.xSpace-6,H-12,12)
		
		}
	},
		
	cluster : function(c){	
		
		var calculations = 20;

			
		
		var xCenters = [];		
		var yCenters = [];
		var xTotals = [];
		var yTotals = [];
		var clusteredPoints = []					
		
		for (var i = 0; i < c; i++) {
			//console.log(Math.random()*this.xSpan)
			//console.log (this.xMin)
			xCenters[i] = this.xSpan*Math.random()+this.xMin;
			yCenters[i] = this.ySpan*Math.random()+this.yMin;
		}			
		while (calculations > 0){
				
				for (var i = 0; i < this.xValues.length; i++) {
				
					minDist = this.xSpan+this.ySpan
				 	for (var j = 0; j < xCenters.length; j++) {
				 		//console.log(Math.abs(this.xValues[i]-xCenters[j]))
						if (Math.abs(this.xValues[i]-xCenters[j]) + Math.abs(this.yValues[i]-yCenters[j]) < minDist){
							clusteredPoints[i] = j
							minDist = Math.abs(this.xValues[i]-xCenters[j]) + Math.abs(this.yValues[i]-yCenters[j])
							//console.log(i)
						}
					}
				}		
				
				for (var i = 0; i < c; i++) {
					xTotals[i] = 0
					yTotals[i] = 0
				} 
				console.log(xCenters,this.xValues.length)
						
				console.log(xTotals);
				
				for (var i = 0; i < this.xValues.length; i++) {
					xTotals[clusteredPoints[i]] += parseFloat(this.xValues[i])
					yTotals[clusteredPoints[i]] += parseFloat(this.yValues[i])
					
					
				} 
				
				for (var i = 0; i < c; i++) {
					xCenters[i] = xTotals[i]/arrayCount(clusteredPoints,i)
					yCenters[i] = yTotals[i]/arrayCount(clusteredPoints,i)
				}
				
				console.log(clusteredPoints);
				console.log(xTotals);
				console.log(xCenters,this.xValues.length)
				calculations -= 1;
				//console.log(xTotals,yTotals)
		}
		this.xCenters = xCenters
		this.yCenters = yCenters
		return clusteredPoints
	},
	
	xdtc : function(x1){	
		return this.xSpace+(parseFloat(x1)-this.xMin)*(W-this.xSpace)/this.xSpan
		
	},	
	ydtc : function(y1){
		return (H-this.ySpace)+this.vScale*this.yMin-this.vScale*parseFloat(y1);
	},
	
	ixdtc : function(x1){
		return (x1-this.xSpace)/((W-this.xSpace)/this.xSpan) + this.xMin;
		//return this.xSpace+(parseFloat(x1)-this.xMin)*(W-this.xSpace)/this.xSpan
		
	},	
	iydtc : function(y1){
		return (H-this.ySpace)+this.vScale*this.yMin-this.vScale*parseFloat(y1);
	}
	
	
}


function graphHover(){
	graph.hover();
}

function loadStatesData() {
 	document.getElementById("dataBox1").value = "-5961.513053 2236.041996\n-9287.821355 4028.410983\n-7743.816805 2311.143387\n-6379.680295 2400.107649\n-8392.976246 2664.025176\n-7253.950857 2745.804159\n-5021.665662 2885.918649\n-5218.571379 2705.918983\n-5822.883103 2104.087378\n-5830.983188 2332.669658\n-10905.10504 1472.356075\n-8031.51782 3013.520309\n-6194.45216 2748.850124\n-5952.431603 2749.381607\n-6468.796015 2873.753598\n-6611.764205 2697.49477\n-5863.673038 2639.266057\n-6297.394751 2104.52199\n-4820.477118 3062.564136\n-5285.898333 2692.861561\n-4907.692362 2918.26924\n-5841.810479 2952.69961\n-6432.391858 3105.850152\n-6232.912673 2233.1719\n-6369.879835 2665.223916\n-7740.58223 3219.568143\n-6679.847274 2819.784977\n-8274.473795 2705.851822\n-4943.734526 2986.321077\n-5165.325085 2779.147951\n-7321.6928 2464.451053\n-5097.970699 2947.609263\n-5433.544922 2471.621041\n-6963.392322 3372.790406\n-5734.984919 2761.217902\n-6739.245293 2451.673744\n-8500.781583 3104.544866\n-5311.77162 2782.467859\n-4934.959722 2889.826009\n-5599.167231 2349.252618\n-6932.808784 3065.634125\n-5996.398211 2498.844733\n-6754.101276 2091.29549\n-7731.295151 2815.973108\n-5014.406471 3058.615664\n-5352.150228 2593.851273\n-8491.378907 3250.427165\n-5640.506753 2649.784006\n-6176.077619 2976.276571\n-7241.366809 2842.97901";
}

function loadWeightsData(){
		document.getElementById("dataBox1").value = "202.6\n201\n200.6\n197.6\n203.2\n199.8\n198.2\n198.6\n198.2\n196.2\n195.2\n194.6\n195.2\n196.6\n195.2\n194.8\n193\n192.4\n192.2\n192\n192.4\n191.6\n190.6\n187.6\n189.2\n190\n189.4\n187.8\n188.6\n187.3\n186.1\n187.6\n189.2\n187.8\n186.4\n185\n186.2\n186.6\n184.4\n183.8\n185.4\n184.8\n184.8\n181.3\n182.8\n185.4\n183.8\n180.8\n181.8\n187\n184.4\n183.6\n183.6\n184\n183.6\n181.6\n184\n181.6\n182.8\n181.8\n181.4\n181.8\n179.2\n179.2\n179.2\n179.2\n178.6\n178.4\n177.6";
}

function myFunction() {
	var str = document.getElementById("dataBox1").value;
	var res = str.split(/\n/);
	xySplit = res[0].split(' ');
	if (xySplit.length > 1){
		graph = plotGraph;
	}else{
		 	graph = timeGraph;
	
	}
 	graph.start();
 
}