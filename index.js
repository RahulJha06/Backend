var rect = require('./rect');

function solveRectangle(l,b){
  console.log("Solving for rectangle with l = "+l+ "and breadth ="+b);
  if( l <=0 || b<= 0  ){
    console.log("Rectangle invlaid");
  }
  else{
    console.log("Area of the rectangel is:" +rect.area(l,b));
    console.log("Perimeter of the rectange is :" + rect.perimeter(l,b));
  }
}

solveRectangle(2,5);
solveRectangle(4,0);
