"use strict";

var Splat = require("splatjs");
var canvas = document.getElementById("canvas");

var manifest = {
	"images": {
		"title-bg": "images/lined-background.png",
		"title-play-btn" : "images/play.png",
		"spellninja-title": "images/spellninja-title.png",
		"wordlist-btn": "images/wordlist.png"
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
/*function applyPhysics(object, blocks,time){
	var gravityAccel = 0.003;
	var jumpSpeed = -0.04;
	var moveForce = 0.03;
	//var minJump = -0.3;
	var maxVelocity = 1.2;
	//var oldY = object.x;
	//var oldY = object.y
	applyGravity(object,gravityAccel,frictionFactor,time);
	moveObject(object,time);
}
function applyGravity(object, gravity,frictionFactor, time){
	object.vy += gravity*time;
	if(grounded){//is grounded
		if (object.vx > 0.01){
			//frictionFactor = frictionFactor*-1;
			object.vx =  object.vx *frictionFactor;
		}else if (object.vx < -0.01){
			//frictionFactor = frictionFactor * 1;
			object.vx =  object.vx *frictionFactor;
		}else{
			object.vx = 0;
		}
	}
	else{
		object.vx = object.vx*0.98 ;
	}
}
function moveObject(object, time){
	
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
	//this.items = [];
	//this.itemSpawner = new ObjectSpawner(this, "cones", randomInterval, spawnCone);
}, function() {
	// simulation
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
	context.font = "25px helvetica";
	centerText(context, "This is the game", 0, canvas.height / 2 - 13);
}));
game.scenes.add("wordList", new Splat.Scene(canvas, function() {
	// initialization
	
}, function() {
	// simulation
	
}, function(context) {
	// draw
	context.fillStyle = "#092227";
	context.fillRect(0, 0, canvas.width, canvas.height);

	context.fillStyle = "#fff";
	context.font = "25px helvetica";
	centerText(context, "This is the word list", 0, canvas.height / 2 - 13);
}));
game.scenes.switchTo("loading");