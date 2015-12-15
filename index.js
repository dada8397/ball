document.onkeydown = checkKey;
var vx = 1, vy = 1; // velocity
var x  = 0, y = 0;  // position
var ball_length = 30;
var xdir = 1, ydir = 1; // direction
var xmin = 0, xmax = 800, ymin = 0, ymax = 600;
var bar_width = 200;
var ybar = 690, xbar_left = 500, xbar_right = xbar_left+bar_width;
var vbar = 35;
var start = false;
var timer_id;
var start_time;
var bombs = new Array();
var bullets = new Array();
var bombs_timer;
var bombs_generated = 1;
var score = 0;
var gameover = 0;


function startGame() {
   if(!start) {
       if(gameover == 1) {
           reset();
           gameover = 0;
       }
       document.getElementById("ball").style.display = "block";

       var ballSpeed = document.getElementById("ball-speed");
       vx = vy = parseInt(ballSpeed.options[ballSpeed.selectedIndex].value);
       ballSpeed.disabled = true;

       document.getElementById("bomb-speed").disabled = true;

       start = true;
       timer_id = setInterval(function(){ refresh(); }, 10);
       bombs_timer = 0;
       start_time = new Date().getTime();
   }
}

function refresh() {
   var bombSpeed = document.getElementById("bomb-speed")
   bombs_timer++;
   if(bombs_timer == parseInt(bombSpeed.options[bombSpeed.selectedIndex].value)) {
       generateBombs();
       bombs_timer = 0;
   }
   document.getElementById("ball").style.top = y;
   document.getElementById("ball").style.left = x;

   document.getElementById("bar").style.left = xbar_left;
   moveBallX();
   moveBallY();
   moveBullets();
   moveBombs();
   checkBump();
   updateTime();
   updateScore();
}

function checkKey(e) {
   e = e || window.event;
   if (e.keyCode == '38') {
       // up arrow
       generateBullets();
   }
   else if (e.keyCode == '40') {
       // down arrow
   }
   else if (e.keyCode == '37') {
      // left arrow
      moveBarLeft();
   }
   else if (e.keyCode == '39') {
      // right arrow
      moveBarRight();
   }
}


function moveBallX() {
   if(x + vx * xdir >= xmin && x + vx * xdir <= xmax - ball_length)
       x += vx * xdir;
   else if(xdir > 0)
       x = xmax - ball_length;
   else
       x = xmin;
   if(x == xmin || x == xmax - ball_length)
       xdir *= -1;
}

function moveBallY() {
   if(y + vy * ydir > ybar-ball_length && x <= xbar_right-ball_length/2 && x >= xbar_left-ball_length/2 && ydir == 1) {
       ydir *= -1;
       y = ybar - ball_length;
   } else {
       if(y + vy * ydir >= ymin && y + vy * ydir <= ymax - ball_length)
           y += vy * ydir;
       else if(ydir > 0)
           y = ymax - ball_length;
       else
           y = ymin;
       if(y == ymin)
           ydir *= -1;
       else if(y == ymax - ball_length) {
           gameOver();
       }
   }
}

function moveBarLeft() {
   if(xbar_left - vbar >= xmin) {
       xbar_left -= vbar;
       xbar_right = xbar_left + bar_width;
   } else {
       xbar_left = xmin;
       xbar_right = xbar_left + bar_width;
   }
}

function moveBarRight() {
   if(xbar_left + vbar <= xmax - bar_width) {
       xbar_left += vbar;
       xbar_right = xbar_left + bar_width;
   } else {
       xbar_left = xmax - bar_width;
       xbar_right = xbar_left + bar_width;
   }
}

function generateBombs() {
   var div = document.createElement("div");
   bombs.push(div);
   document.getElementById("game-area").appendChild(div);
   div.style.position = "absolute";
   div.style.left = Math.random() * (xmax - bar_width - 50) + bar_width/2;
   div.style.top = 0;
   div.style.width = 50;
   div.style.height = 50;
   div.innerHTML = "<img src=\"./img/bomb.png\" height=\"50px\" width=\"50px\"/>";
}

function moveBombs() {
   for(var i = 0; ; i++) {
       if(i == bombs.length)
           return;
       if(parseInt(bombs[i].style.top) + 1.5 > ymax - 50) {
           bombs[i].parentNode.removeChild(bombs[i]);
           bombs.splice(i, 1);
           i--;
       } else {
           bombs[i].style.top = parseInt(bombs[i].style.top) + 1.5;
       }
       if(parseInt(bombs[i].style.top) + 50 >= ybar &&
           parseInt(bombs[i].style.left) >= xbar_left - 50/2 &&
           parseInt(bombs[i].style.left) <= xbar_right - 50/2) {
           gameOver();
           document.getElementById('bomb-sound').play();
           bombs[i].innerHTML = "<img src=\"./img/bomb1.png\" height=\"50px\" width=\"50px\"/>";
       }
   }
}

function generateBullets() {
   var div = document.createElement("div");
   bullets.push(div);
   document.getElementById("game-area").appendChild(div);
   div.style.position = "absolute";
   div.style.left = xbar_left + bar_width/2 - 40/2;
   div.style.top = ybar - 50;
   div.style.width = 20;
   div.style.height = 50;
   div.innerHTML = "<img src=\"./img/bullet.png\" height=\"50px\" width=\"20px\"/>";
}

function moveBullets() {
   for(var i = 0; ; i++) {
       if(i == bullets.length)
           return;
       if(parseInt(bullets[i].style.top) - 3 < ymin) {
           bullets[i].parentNode.removeChild(bullets[i]);
           bullets.splice(i, 1);
           i--;
       } else {
           bullets[i].style.top = parseInt(bullets[i].style.top) - 3;
       }
   }
}

function gameOver() {
   showMessage("提示", "遊戲結束");
   start = false;
   gameover = 1;
   clearInterval(timer_id);
   document.getElementById("ball-speed").disabled = false;
   document.getElementById("bomb-speed").disabled = false;
}

function updateTime() {
   var buf = new Date().getTime() - start_time;
   var elasped_time = new Date(buf);
   var string = "時間：" + elasped_time.getMinutes() + "分" + elasped_time.getSeconds() + "秒";
   document.getElementById("time").innerHTML = "<p style=\"font-size:36;\">" + string + "</p>";
}

function updateScore() {
   var string = "分數：" + score+ "分";
   document.getElementById("score").innerHTML = "<p style=\"font-size:36;\">" + string + "</p>";
}

function checkBump() {
   for (var i = 0; ;i++) {
       if(i == bullets.length)
           return;
       for (var j = 0; j < bombs.length; j++) {
           var xbombs = parseInt(bombs[j].style.left);
           var ybombs = parseInt(bombs[j].style.top);
           var xbullets = parseInt(bullets[i].style.left);
           var ybullets = parseInt(bullets[i].style.top);
           if(ybullets <= ybombs + 50) {
               if(xbullets >= xbombs - 20/2 && xbullets <= xbombs + 50 - 20/2) {
                   score += 10;
                   bullets[i].parentNode.removeChild(bullets[i]);
                   bullets.splice(i, 1);
                   bombs[j].parentNode.removeChild(bombs[j]);
                   bombs.splice(j, 1);
                   i--;
                   break;
               }
           }
       }
   }
}

function reset() {
   document.getElementById("ball").style.top = 0;
   document.getElementById("ball").style.left = 0;
   for(var i = 0; i < bombs.length; i++)
       bombs[i].parentNode.removeChild(bombs[i]);
   for(var i = 0; i < bullets.length; i++)
       bullets[i].parentNode.removeChild(bullets[i]);
   bombs.length = 0;
   bullets.length = 0;
   score = 0;
   x = 0;
   y = 0;
}

document.addEventListener("DOMContentLoaded", function(event) {
   document.getElementById('bomb-sound').load();
});
