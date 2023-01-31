const CANVAS = document.getElementsByTagName('canvas')[0];
const CTX = CANVAS.getContext('2d');

const HTML = document.getElementsByTagName('html')[0]; 
//<!--><script src="settings.js"></script><!-->
const socket = io('https://scrawlpaper.professorfish.repl.co');
var overX, overY;
var grid;
var selectedColour = '#FFFFFF';

var backgroundURL = -1;

socket.on('load', board => {
  grid = board;
  frame();
});

function livelyPropertyListener(name, val)
{
    switch(name){
      case 'sELECTED_COLOUR':
        selectedColour = val;
        break;
      case 'bACKGROUND_IMAGE':
        if(backgroundURL === -1){
          HTML.style['background-image'] = 'url(' + val + ')';
        }
        backgroundURL = val;
        break;
      case 'sET_BACKGROUND':
        HTML.style['background-image'] = 'url(' + backgroundURL + ')';
    }
}

socket.on('placed', ({x, y, colour}) =>{
  if(grid){
    grid[x][y] = colour;
  }
})

CANVAS.width = window.innerWidth;
CANVAS.height = window.innerHeight;

window.onresize = function() {
  CANVAS.width = window.innerWidth;
  CANVAS.height = window.innerHeight;
}

window.addEventListener("keyup", (e) => {
  if (e.keyCode == 32) {
    openNav();
  }
})

function frame() {
  requestAnimationFrame(frame);
  
  CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);

  let perBoxWidth = CANVAS.width / grid.length
  let boxWidth = Math.floor(perBoxWidth);
  let extraWidth = Math.abs(perBoxWidth - boxWidth) * grid.length;

  overX = Math.floor((mouseX - (extraWidth / 2)) / boxWidth);
  
  let perNBoxHeight = CANVAS.height / grid[1].length;
  
  let NboxHeight = Math.floor(perNBoxHeight);
  
  let NextraHeight = CANVAS.height - NboxHeight * grid[1].length;
  
  for (var x in grid) {
    var perBoxHeight, extraHeight, boxHeight;
    //console.log(x)
    if(x == 0){
      //console.log("0")
      //Available / amount of colours;
      perBoxHeight = (CANVAS.height - (CANVAS.height - NboxHeight * grid[1].length )) / grid[0].length;
      
      boxHeight = Math.floor(perBoxHeight);// * grid[0].length;

      //(Size availble - size used) * number of colours
      extraHeight = CANVAS.height - boxHeight * grid[0].length;
    }
    else{
      perBoxHeight = perNBoxHeight
    boxHeight = NboxHeight
    extraHeight = NextraHeight
    }//Math.abs(perBoxHeight - boxHeight) * grid[x].length;
  if(overX == x)overY = Math.floor((mouseY - (extraHeight / 2)) / boxHeight);
    for (var y in grid[x]) {
      
      //If cell is alive
      //if (grid[x][y]) CTX.fillStyle = liveColour;
      //else CTX.fillStyle = deadColour;
      CTX.fillStyle = grid[x][y];
      let onX = boxWidth * x;
      let onY = boxHeight * y;
      CTX.fillRect(onX + extraWidth / 2, onY + extraHeight / 2, boxWidth, boxHeight);
      
      if (x == overX && y == overY && grid[overX][overY] != '#00000000'){
        CTX.globalAlpha = 0.75;
        if(overX)CTX.fillStyle = selectedColour;
        else CTX.fillStyle = '#FFF';
        CTX.fillRect(onX + extraWidth / 2, onY + extraHeight / 2, boxWidth, boxHeight);
        CTX.globalAlpha = 1;
      }
    }
  }
}