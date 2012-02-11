/*global Gesture:true */
// namespace
var Game = {
    key : {}
};

// can't do it without onload attribute :(
function init(ev){
    Game.init();
}

Game.setViewBox = function(viewBox){
    var value = [viewBox.x, viewBox.y, viewBox.w, viewBox.h].join(' ');
    this.svg.setAttribute('viewBox', value);
};

Game.getViewBox = function(){
    var viewBox = this.svg.getAttribute('viewBox');
    var x = 0, y = 0, w = 0, h = 0;
	if (viewBox){
		var values = viewBox.split(/\s*,\s*|\s+/);
		x = parseInt(values[0],10);
		y = parseInt(values[1],10);
		w = parseInt(values[2],10);
		h = parseInt(values[3],10);
    }
    return {
        x : x,
        y : y,
        w : w,
        h : h
    };
};

Game.toSVGCoord = function(x, y){
    var vb = Game.getViewBox();
    var scale = vb.h / window.innerHeight;
    x = vb.x + x * scale;
    y = vb.y + y * scale;
    return {
        x : x,
        y : y
    };
};

Game.init = function(){
    this.svg = document.documentElement;
    this.bindEvents();
    this.initGestureDetection();
    this.initWorld();
    this.initPlayer();
    this.lastTime = Date.now();
    this.loop();
};

Game.initGestureDetection = function (){
    Gesture.init(Game.onGestureResult);
};


Game.initWorld = function(){
    // compute ground lines
};

Game.initPlayer = function(){
    this.player = new Player(document.getElementById('player'));
};
    
Game.bindEvents = function(){
    document.addEventListener('keydown',     this.onKeyDown,     false);
    document.addEventListener('keyup',       this.onKeyUp,       false);
    document.addEventListener('mousedown',   this.onMouseDown,   false);
    document.addEventListener('mousemove',   this.onMouseMove,   false);
    document.addEventListener('mouseup',     this.onMouseUp,     false);
    document.addEventListener('contextmenu', this.onContextMenu, false);
};

Game.onKeyDown = function(ev){
    Game.key[Game.keyName[ev.keyCode]] = true;
};

Game.onKeyUp = function(ev){
    Game.key[Game.keyName[ev.keyCode]] = false;
};

Game.onMouseMove = function(event){
    Gesture.mouseMoveEvent(event.clientX, event.clientY, event.button);
    event.preventDefault();
};

Game.onMouseDown = function(event){
    if(event.button === 1){
        var pos = Game.toSVGCoord(event.clientX, event.clientY);
        Game.player.x = pos.x;
        Game.player.y = pos.y;
    }
    Gesture.mouseDownEvent(event.clientX, event.clientY, event.button);
    event.preventDefault();
};

Game.onMouseUp = function(event){
    Gesture.mouseUpEvent(event.clientX, event.clientY, event.button);
    event.preventDefault();
};

Game.onContextMenu = function(event){
    event.preventDefault();
};

Game.keyName = {
  8: 'backspace', 9: 'tab', 13: 'enter',
  16: 'shift', 17: 'ctrl', 18: 'alt',
  20: 'caps_lock',
  27: 'esc',
  32: 'space',
  33: 'page_up', 34: 'page_down',
  35: 'end', 36: 'home',
  37: 'left', 38: 'up', 39: 'right', 40: 'down',
  45: 'insert', 46: 'delete',
  48: '0', 49: '1', 50: '2', 51: '3', 52: '4', 53: '5', 54: '6', 55: '7', 56: '8', 57: '9',
  65: 'a', 66: 'b', 67: 'c', 68: 'd', 69: 'e', 70: 'f', 71: 'g', 72: 'h', 73: 'i', 74: 'j', 75: 'k', 76: 'l', 77: 'm', 78: 'n', 79: 'o', 80: 'p', 81: 'q', 82: 'r', 83: 's', 84: 't', 85: 'u', 86: 'v', 87: 'w', 88: 'x', 89: 'y', 90: 'z',
  112: 'f1', 113: 'f2', 114: 'f3', 115: 'f4', 116: 'f5', 117: 'f6', 118: 'f7', 119: 'f8', 120: 'f9', 121: 'f10', 122: 'f11', 123: 'f12',
  144: 'num_lock'
};

Game.onGestureResult = function(result){
    console.log(result.Name, result.Score);
};

Game.loop = function(){
    var dt = (Date.now() - Game.lastTime)/1000;
    Game.lastTime = Date.now();
    Game.eventLoop(dt);
    Game.physLoop(dt);
    Game.update();
    window.requestAnimFrame(Game.loop);
};

Game.eventLoop = function(dt){
    var k = Game.key;
    if(k.d || k.right){
        Game.player.x += 500 * dt;
    }
    if(k.q || k.left){
        Game.player.x -= 500 * dt;
    }
    if(k.z || k.up){
        Game.player.y -= 600 * dt;
        // jump
    }
};

Game.physLoop = function(dt){
    //gravity
    // physObjects[] ?
    this.player.y += 5 * dt;
    // collisions
    var x = this.player.x;
    /*
    Game.lines.forEach(function(line){
        if(line)
    });
    * */
};

Game.update = function(){
    this.player.update();
};

var Player = function(el){
    this.el = el;
    this.x = this.y = 0;
};

Player.prototype.update = function(){
    this.el.setAttribute('x', this.x);
    this.el.setAttribute('y', this.y);
};

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
}());
