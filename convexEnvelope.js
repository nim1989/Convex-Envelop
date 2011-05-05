/**
 * An implementation of the Convex hull algorithms (divide and conquer) 
 *
 * Authors:	Nima Izadi - Nicolas Dupont
 */

/**
 * Protecting namespace
 */
(function() {

	/*
	 * Adding the beget method to Object which instanciate an object
	 * Code took from "Javascript - The Good Parts" by Douglas Crockford.
	 */
	if (typeof Object.beget !== 'function') { 
		Object.beget = function (o) {
			var F = function () {};
			F.prototype = o; 
			return new F();
		}
	};
	
	/*
	 * Adding the swap method to the Array object prototype
	 */
	Array.prototype.swap = function (a, b) {
	  var tmp = this[b];
	  this[b] = this[a];
	  this[a] = tmp;
	};
	
	
	/*
	 * Return the dom element object
	 */
	var $ = function (divName) {
		return document.getElementById(divName);
	};
	
	/*
	 * Compute the cross product between three point
	 */
	var pointCrossProduct = function (p1, p2, p3) {
		return (p2.x - p1.x)*(p3.y - p1.y) - (p3.x - p1.x)*(p2.y - p1.y);
	};
	
	/*
	 * Compute the cross product between two vector
	 */
	var crossProduct = function (v1, v2) {
		return v1.x * v2.y - v1.y * v2.x;
	};
	
	
	var printPoints = function (pointsArray) {
		var div = $("output"), i;
		for (i = 0; i < pointsArray.length; i+= 1) {
			div.innerHTML +=  pointsArray[i].print();
		}
		div.innerHTML += "<br />";
	};
	
	/*
	 * Point object
	 * Parameter:
	 *	Hash - spec{ 
	 *					x,
	 *					y
	 *				}
	 */
	var point = function (spec) {
		var that = {};
		var x = spec.x, y = spec.y;
		that.x = x;
		that.y = y;
		that.print = function() {
			return "(" + x + "," + y + ") ";
		};
		return that;
	};
	/*
	 * Vector object
	 * Parameter:
	 *	Hash - spec{ 
	 *					p1,
	 *					p2
	 *				}
	 */
	var vector = function(spec) {
		var that = {};
		that.x = spec.p2.x - spec.p1.x;
		that.y = spec.p2.y - spec.p1.y;
		return that;
	};
	
	var populate = function (n, array) {
		var i = 0;
		while(i < n) {
			var randX = Math.floor(Math.random() * 600);
			var randY = Math.floor(Math.random() * 600);
			i += 1;
			array.push(Object.beget(point({
				x: randX,
				y: randY
			})));
		}
	}
	/*
	 	 * display all points of the array passed in parameter
	 	 */
	function displayAllPoints(array) {
		var i;
		for(i = 0; i < array.length; i += 1) {
			displayPoint(array[i], randomColor());
			}
		}
		
				
		/*
	 	 * display a colored point
	 	 */
		function displayPoint(point, color) {
			var exemple = $('exemple');
			var context = exemple.getContext('2d');
			context.fillStyle = color;
			context.beginPath();
			context.arc(point.x,600 - point.y, 3, 0, Math.PI * 2,true);
			context.closePath();
			context.fill();
		}
		
		/*
	 	 * display a colored line between the point a and the point b
	 	 */
		function displayLine(a, b, color) {
/* 			alert(a.print() + ", " + b.print()); */
			var exemple = $('exemple');
			var context = exemple.getContext('2d');
		 	context.lineWidth=2;
		  context.lineCap='round'; 
			context.moveTo(a.x,600 - a.y);
			context.lineTo(b.x,600 - b.y);
			context.strokeStyle = color;
			context.stroke();
		}
		
		/*
	 	 * clear the canvas /!\ Does not work
	 	 * TODO 
	 	 */
		function clearCanvas() {
			var exemple = $('exemple');
			var context = exemple.getContext('2d');
			
		}
		
		/*
	 	 * display the closed path of a polygon with the array of polygon's vertices
	 	 */
		function displayPolygon(pointsArray, color) {
			var k;
			for (k = 0; k < pointsArray.length - 1; k+= 1) {
				displayLine(pointsArray[k], pointsArray[k + 1], color);
			}
			displayLine(pointsArray[0], pointsArray[pointsArray.length - 1], color);
		}
		
		/*
	 	 * return a random color
	 	 */
		function randomColor() {
			return "rgba(" + randomValueUntil(200) + "," + randomValueUntil(200) + "," + randomValueUntil(200) + ",1)";
		}
		
		/*
	 	 * return a random value between 0 and the value passed in parameter
	 	 */
		function randomValueUntil(value) {
			return Math.floor(Math.random() * value);
		}
	/**
	 * Affecting onclick function to the execute button
	 */
	window.onload = function () {
		$('execute_button').onclick = function (e) {
			return execute();
		};
		$('populate_button').onclick = function (e) {
			populate($('input').value, points);
			displayAllPoints(points);
		};
	};
	var points = [];
	var execute = function () {
		
		points.print = function (outputDiv) {
			var div = $(outputDiv), i;
			div.innerHTML = "";
			for (i = 0; i < points.length; i+= 1) {
				div.innerHTML +=  points[i].print();
			}
		};
		
				
		//clearCanvas();
/*
		
		var p1 = point({x: 100, y: 200});
		var p2 = point({x: 200, y: 200});
		var p3 = point({x: 300, y: 200});  
		var p4 = point({x: 400, y: 200});		
		
		//cas limite : points align�s
		
		var p = [];
		p.push(p2);
		p.push(p3);
		p.push(p4);
		p.push(p1);
		
*/
		var env = divide(points.sort(function(a,b) { return a.x - b.x;}));
		displayPolygon(env, randomColor());
		
		//displayAllPoints(p);
		
		function divide(pointsArray) {
			if (pointsArray.length < 4) {
				if(pointsArray.length > 2) {
					//When we have an array of size 3, we sort its elements in counterclockwise by swapping two elements
					if(pointCrossProduct(pointsArray[0], pointsArray[1], pointsArray[2]) <= 0) {
						pointsArray.swap(1,2);
					}
				}
				return pointsArray;
			} else {
				var median = pointsArray.length / 2;
				var leftPointsArray = pointsArray.slice(0, median);
				var rightPointsArray = pointsArray.slice(median, pointsArray.length);

				var leftEnv = divide(leftPointsArray);
				var rightEnv = divide(rightPointsArray);
				rightEnv.reverse();//reverse the sub-envelope right
				
				var iGauche = maxX(leftEnv); //index of the point having the largest abscissa
				var iDroite = minX(rightEnv); //index of the point having the smallest abscissa 
				var iDroiteFirst = iDroite;
				var iGaucheFirst = iGauche;
				
				var finished = false;
			//	joinTop(finished, leftEnv, rightEnv, iGauche, iDroite)
				while (!finished) {
					finished = true;
					var v1 = Object.beget(vector({p1: leftEnv[iGauche], p2: rightEnv[iDroite]}));
					var v2 = Object.beget(vector({p1: leftEnv[iGauche], p2: rightEnv[nextIndex(rightEnv, iDroite)]}));
					var v3 = Object.beget(vector({p1: rightEnv[iDroite], p2: leftEnv[nextIndex(leftEnv, iGauche)]}));
					var v4 = Object.beget(vector({p1: rightEnv[iDroite], p2: leftEnv[iGauche]}));
					
					var c1 = crossProduct(v1, v2);
					if(c1 == 0 && (rightEnv[iDroite].x < rightEnv[nextIndex(rightEnv, iDroite)].x)) {
						finished = false;
						iDroite = nextIndex(rightEnv, iDroite);
					}
					if (c1 >= 0) {
						finished = false;
						iDroite = nextIndex(rightEnv, iDroite);
					}
					
					var c2 = crossProduct(v3, v4);
					if(c2 == 0 && (leftEnv[iGauche].x > leftEnv[nextIndex(leftEnv, iGauche)].x)) {
						finished = false;
						iGauche = nextIndex(leftEnv, iGauche);
					}
					if (c2 >= 0) {
						finished = false;
						iGauche = nextIndex(leftEnv, iGauche);
					}
				}
				
				var iGH = iGauche;
				var iDH = iDroite;

				var envelop = [];
				envelop.push(leftEnv[iGH]);
				var finished = false;
				
				iGauche = maxX(leftEnv); 
				iDroite = minX(rightEnv); 
				iDroiteFirst = iDroite;
				iGaucheFirst = iGauche;

				while (!finished) {
					var v1 = Object.beget(vector({p1: leftEnv[iGauche], p2: rightEnv[iDroite]}));
					var v2 = Object.beget(vector({p1: leftEnv[iGauche], p2: rightEnv[previousIndex(rightEnv, iDroite)]}));
					var v3 = Object.beget(vector({p1: rightEnv[iDroite], p2: leftEnv[previousIndex(leftEnv, iGauche)]}));
					var v4 = Object.beget(vector({p1: rightEnv[iDroite], p2: leftEnv[iGauche]}));
					
					finished = true;
					c1 = crossProduct(v1, v2);
					if(c1 == 0 && (rightEnv[iDroite].x < rightEnv[previousIndex(rightEnv, iDroite)].x)) {
						finished = false;
						iDroite = previousIndex(rightEnv, iDroite);
					}
					if (c1 < 0) {
						finished = false;
						iDroite = previousIndex(rightEnv, iDroite);
					}
					c2 = crossProduct(v3, v4);
					if(c2 == 0 && (leftEnv[iGauche].x > leftEnv[previousIndex(leftEnv, iGauche)].x)) {
						finished = false;
						iGauche = previousIndex(leftEnv, iGauche);
					}
					if (c2 < 0) {
						finished = false;
						iGauche = previousIndex(leftEnv, iGauche);
					}
				}
				
				var i = iDH;
				while (i != iDroite) {
					envelop.push(rightEnv[i]);
					i = nextIndex(rightEnv, i); 
				}
				envelop.push(rightEnv[iDroite]);	
						
				i = iGauche;
				while (i != iGH) {
					envelop.push(leftEnv[i]);
					i = previousIndex(leftEnv, i); 
				}
				envelop.reverse();
				return envelop;
			}
		}
		
		function joinTop(finished, leftEnv, rightEnv, iGauche, iDroite) {
			while (!finished) {
					finished = true;
					var v1 = Object.beget(vector({p1: leftEnv[iGauche], p2: rightEnv[iDroite]}));
					var v2 = Object.beget(vector({p1: leftEnv[iGauche], p2: rightEnv[nextIndex(rightEnv, iDroite)]}));
					var v3 = Object.beget(vector({p1: rightEnv[iDroite], p2: leftEnv[nextIndex(leftEnv, iGauche)]}));
					var v4 = Object.beget(vector({p1: rightEnv[iDroite], p2: leftEnv[iGauche]}));
				
					if (crossProduct(v1, v2) >= 0) {
						finished = false;
						iDroite = (iDroite + 1) % rightEnv.length;
					}
					
					if (crossProduct(v3, v4) >= 0) {
						finished = false;
						iGauche = (iGauche + 1)  % leftEnv.length;
					}
				}
		}
		
		function nextIndex(array, index) {
			return (index + 1) % array.length;
		}
		
		function previousIndex(array, index) {
			return (index - 1 + array.length)  % array.length;
		}
		
		/*
	 	 * returns the index of the point having the largest abscissa
	 	 */
		function maxX(array) {
			var iMax = 0, i;
			for (i = 1; i < array.length; i+= 1) {
				if (array[i].x > array[iMax].x) {
					iMax = i;
				}
			}
			return iMax;
		}
		
		/*
	 	 * returns the index of the point having the smallest abscissa
	 	 */
		function minX(array) {
			var iMin = 0, i;
			for (i = 1; i < array.length; i+= 1) {
				if (array[i].x < array[iMin].x) {
					iMin = i;
				}
			}
			return iMin;
		}
	};
})();