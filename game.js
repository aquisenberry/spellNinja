"use strict";

var Splat = require("splatjs");
var Tabris = require("tabris");
//var qunit = require("qunit");
var canvas = document.getElementById("canvas");

var page = tabris.create("Page", {
  title: "Hello, World!",
  topLevel: true
});

var canvas = tabris.create("Canvas", {
  layoutData: {left: 10, top: 10, right: 10, bottom: 10}
}).appendTo(page);

var manifest = {
	"images": {
		"title-bg": "images/lined-background.png",
		"title-play-btn" : "images/play.png",
		"spellninja-title": "images/spellninja-title.png",
		"wordlist-btn": "images/wordlist.png",
		"changewords-btn-pressed":"images/changewords-small-pressed.png",
		"changewords-btn":"images/changewords.png",
		"title-play-btn-pressed":"images/play-pressed.png",
		"play-small-pressed":"images/play-small-pressed.png",
		"wordlist-pressed":"images/wordlist-pressed.png"
	},
	"sounds": {
	},
	"fonts": {
	},
	"animations": {
	}
};

var game = new Splat.Game(canvas, manifest);

function centerText(context, text, offsetX, offsetY) {
	var w = context.measureText(text).width;
	var x = offsetX + (canvas.width / 2) - (w / 2) | 0;
	var y = offsetY | 0;
	context.fillText(text, x, y);
}
function spawnAnimatedEntity(game,array, posX, posY, vx, vy, sprite, offsetX, offsetY){
	var x = 0;
	var y = 0;
	var vX = 0;
	var vY = 0;
	var mysprite;
	var h;
	var w;
	if (!game){
		console.error("no game context given");
		return false;
	}else{
		mysprite =game.images.get("spellninja-title");
		h = mysprite.height;
		w = mysprite.width;
	}
	if(!array){
		console.error("Object not given an array to push to");
		return false;
	}
	if(posX){
		x = posX;
	}
	if (posY){
		y = posY;
	}
	if(vx){
		vX = vx;
	}
	if(vy){
		vY = vy;
	}
	if(sprite){
		mysprite = sprite;
		h = mysprite.height;
		w = mysprite.width;
	}
	if (!offsetX){
		offsetX = 0;
	}
	if(!offsetY){
		offsetY = 0;
	}
    var obj = new Splat.AnimatedEntity(x,y,w,h,mysprite,offsetX,offsetY);
    obj.vx = vX;
    obj.vy = vY;
    array.push(obj);
}
function rand( lowest, highest){
    var adjustedHigh = (highest - lowest) + 1;       
    return Math.floor(Math.random()*adjustedHigh) + parseFloat(lowest);
}
/*function applyPhysics(object,g, mvy){
	var gravityAccel = 0.003;
	var jumpSpeed = -0.04;
	var moveForce = 0.03;
	//var minJump = -0.3;
	var maxVelocity = 1.2;
	//var oldY = object.x;
	//var oldY = object.y
	applyGravity(object,gravityAccel,frictionFactor,time);
	moveObject(object,time);
}*/
function applyGravity(object, gravity,time){
	object.vy += gravity*time;
}
function slice(obj, mouse){
	for(var i =0;i < obj.length; i++){
		if (mouse.x <= obj[i].x+obj[i].width && mouse.x >= obj[i].x && mouse.y <= obj[i].y + obj[i].height && mouse.y >= obj[i].y){
			//TODO: add destruction animation
			obj.splice(i,1);
			i--;
		}
	}
}
/*function moveObject(object, time){
	
	object.move(time);
}
function ObjectSpawner(scene, type, fnDelay, fnSpawn) {
    var spawner = this;

    this.spawn = function () { return fnSpawn(scene); };

    this.timer = new Splat.Timer(undefined, fnDelay(), function() {
        console.log(type + " spawn");
        spawner.spawn();

        this.expireMillis = fnDelay();
        this.reset();
        this.start();
    });
    this.timer.start();

    scene.timers[type] = this.timer;
    scene.spawners.push(spawner);
}*/
game.scenes.add("title", new Splat.Scene(canvas, function() {
	// initialization
	var bgImage = game.images.get("title-bg");
	var playBtnImage = game.images.get("title-play-btn");
	var titleImage = game.images.get("spellninja-title");
	var wordListBtnImage = game.images.get("wordlist-btn");

	this.buttons = [];

	this.buttons.push( new Splat.Button(game.mouse,canvas.width/2 - playBtnImage.width/2,220 + canvas.height/2 - playBtnImage.height/2, { normal: playBtnImage, pressed: playBtnImage }, function(state) {
		if (state === "pressed"){
			game.scenes.switchTo("main");
		}
	}, function() {
	}));
	this.buttons.push( new Splat.Button(game.mouse,canvas.width/2 - wordListBtnImage.width/2,400 + canvas.height/2 - wordListBtnImage.height/2, { normal: wordListBtnImage, pressed: wordListBtnImage }, function(state) {
		if (state === "pressed") {
			game.scenes.switchTo("wordList");
		}
	},function(){

	}));
	//TODO: load current wordlist from datasource
	game.wordlist = [];


	this.bg = new Splat.AnimatedEntity(0,0,bgImage.width,bgImage.height,bgImage,0,0);
	this.title = new Splat.AnimatedEntity(canvas.width/2 - titleImage.width/2,100,titleImage.width,titleImage.height,titleImage,0,0);
}, function(elapsedMillis) {
	// simulation
	this.buttons.forEach(function(button) {
		button.move(elapsedMillis);
	});
}, function(context) {
	// draw

	context.fillStyle = "#092227";
	context.fillRect(0, 0, canvas.width, canvas.height);

	context.fillStyle = "#fff";
	context.font = "25px helvetica";
	centerText(context, "Spell Ninja", 0, canvas.height / 2 - 13);
	this.bg.draw(context);
	this.title.draw(context);
	this.buttons.forEach(function(button){
		button.draw(context);
	});
}));

game.scenes.add("main", new Splat.Scene(canvas, function() {
	// initialization
	this.gravity = 0.0003;
	this.items = [];
	this.spawnpointY = canvas.height;
	this.spanpointX = 0;
	//spawnAnimatedEntity(game,this.items, 20, 20, 0, 0.2);
	//this.itemSpawner = new ObjectSpawner(this, "cones", randomInterval, spawnCone);
}, function(elapsedMillis) {
	// simulation

//=============================================================
	//TODO: add letter pool to choose from
	//TODO: add game logic
	//TODO: add lives
	//TODO: add letter sprites
	//TODO: fine tune spawn generation variables
	//TODO: create game timer
	//TODO: fine tune physics
	//TODO: fine tune word display at bottom
	//TODO: Add word load functionality
//=============================================================
	this.spawnpointX = rand(0,canvas.width);
	if(rand(1,100) > 97){
		var vxd = this.spawnpointX >canvas.width/2?  -1: 1; 
		
		spawnAnimatedEntity(game,this.items,this.spawnpointX,this.spawnpointY,vxd*rand(this.spawnpointX-canvas.width/2 ,canvas.width/2 -this.spawnpointX)/1000,-1*rand(6.5,7.8)/10);
	}
	if (game.mouse.isPressed(0)){
		slice(this.items,game.mouse);
	}
	for(var i = 0; i< this.items.length; i++){
		applyGravity(this.items[i],this.gravity,elapsedMillis);
        this.items[i].move(elapsedMillis);
        if(this.items[i].x < (0-this.items[i].width) || this.items[i].x > canvas.width || this.items[i].y < (0-this.items[i].height)|| this.items[i].y > (canvas.height)){
        	this.items.splice(i,1);
        }
    }
	/* for( var x = 0; x < this.obstacles.length; x++){
        if(this.obstacles[x] && this.obstacles[x].y > this.player.y + canvas.height * (1/8)){
            this.obstacles.splice(x,1);
            
        }

        if(this.obstacles[x] && this.obstacles[x].collides(this.player)){
            this.obstacles.splice(x,1);

            this.hearts-=1;
            console.log(this.hearts);
            if (this.hearts <1){
                this.player.sprite = game.animations.get("death");
                this.deathtimer.start();
                for (var i =0; i < this.spawners.length; i++) {
                    this.spawners[i].timer.stop();
                }
                this.player.vy = 0;
                game.scenes.switchTo("death");
            }

            this.player.collision = true;
            this.timers.playerCollision = new Splat.Timer(undefined, 1000, disablePlayerCollisions);
            this.timers.playerCollision.start();
            console.log("player hit");
        }
    }*/
}, function(context) {
	// draw
	context.fillStyle = "#092227";
	context.fillRect(0, 0, canvas.width, canvas.height);

	context.fillStyle = "#fff";
	context.font = "50px helvetica";
	
	for(var i = 0; i< this.items.length; i++){
        this.items[i].draw(context);
    }
    context.fillStyle = "#000000";
    context.fillRect(0, canvas.height-100, canvas.width,100);
    context.fillStyle = "#ffffff";
    //TODO: replace with loaded word
    centerText(context, "word to spell", 0, canvas.height-25);
    //TODO: replace with timer variable
    context.fillText("00:00",5,50)

}));
game.scenes.add("wordList", new Splat.Scene(canvas, function() {
	// initialization
	var input = new CanvasInput({
	  canvas: document.getElementById("canvas")
	});
	
}, function() {
	// simulation
	
}, function(context) {
	// draw
	/*context.fillStyle = "#092227";
	context.fillRect(0, 0, canvas.width, canvas.height);

	context.fillStyle = "#fff";
	context.font = "25px helvetica";
	centerText(context, "This is the word list", 0, canvas.height / 2 - 13);*/
}));
game.scenes.switchTo("loading");