//The Game Project - Part 6

var gameChar_x;
var gameChar_y;
var floory_pos;
var cameraPosX;

var isLeft;
var isFalling;
var isRight;
var isPlummeting;

var canyons;
var collectables;
var mountains;
var trees_x;
var clouds;

var game_score;
var flagpole;
var lives;
var heart;

var jumpSound;
var coinSound;
var flightSound;
var victorySound;

var platforms;
var enemies;
var enem_img;


function preload(){
	//Life token image
	heart = loadImage('media/heart.png');
	enem_img = loadImage('media/enemy.png');

	///////////
	//SOUNDS
	///////////
	soundFormats('mp3','wav');
    //load sounds here
    jumpSound = loadSound('media/jump.mp3');
    jumpSound.setVolume(0.4);
	coinSound = loadSound('media/coin.wav');
	coinSound.setVolume(0.3);
	flightSound = loadSound('media/mid-flight.wav');
	flightSound.setVolume(0.01);
	victorySound = loadSound('media/victory.wav');
	victorySound.setVolume(0.4);
	
}

function setup()
{
	createCanvas(1024, 576);
	floory_pos = height * 3/4;
	lives = 3;
	startGame();
}

function draw()
{	
	cameraPosX = gameChar_x - width/2;
	///////////DRAWING CODE//////////

	//Sky
	background(251, 231, 142);

	//Green ground
	noStroke();
	stroke(61, 120, 44, 150);
	strokeWeight(3);
	fill(0,155,0);
	rect(0, floory_pos, width, height - floory_pos); 

	//parallax effect part 1
	push();
	translate(-cameraPosX, 0);

	//Clouds
	drawClouds();

	// Mountains
    drawMountains();
	
	//trees
	drawTrees();

	//Canyons
	for(var i=0; i<canyons.length; i++){
		drawCanyon(canyons[i]);
		checkCanyon(canyons[i]);
	}
	
	//Platforms
	for(var i=0; i<platforms.length; i++){
		platforms[i].draw();
	}
	
	//Collectables
	for(var i=0; i<collectables.length; i++){
		drawCollectable(collectables[i]);
		checkCollectable(collectables[i]);
	}

	//Game Character
	drawGameChar();

	//Flagpole
	renderFlagpole();

	//Enemies
	for(var i=0; i < enemies.length; i++)
		{
			enemies[i].draw();

			var isContact = enemies[i].checkContact(gameChar_x, gameChar_y);

			if(isContact)
			{
				if(lives > 0)
				{
					startGame();
					break;
				}
			}
		}

	//parallax effect part 2
	pop();

	//Score
	fill(0);
	stroke(255);
	strokeWeight(3);
	textSize(18);
	text("Score: " + game_score, 35, 30);

	// Life Tokens
	lifeTokens();

	//Condition for game over text
	if(lives < 1){
		fill(255,0,0);
		stroke(255);
		strokeWeight(5);
		textSize(40);
  		textAlign(CENTER);
		text("Game over. Press space to continue.", width / 1.8, height /2 );
		return;
	}

	//Condition for game completion text
	if(flagpole.isReached == true){
		fill(0,255,0);
		stroke(255);
		strokeWeight(5);
		textSize(40);
  		textAlign(CENTER);
		text("Level complete. Press space to continue.", width / 1.8, height /2 );
		return;
	}


	///////////INTERACTION CODE//////////
	//Conditional statements to move the game character
	if(isLeft == true){
		gameChar_x -= 5;

	}
	if(isRight == true){
		gameChar_x += 5;
	}
    //gravity mechanic
    if(gameChar_y<floory_pos)
	{
		var isContact = false;
		for(var i=0; i< platforms.length; i++){
			if(platforms[i].checkContact(gameChar_x, gameChar_y) == true){
				isContact = true;
				break;
			};
		}
		if (isContact == false)
		{
        gameChar_y += 2;
        isFalling = true;
		flightSound.play();
		}
    } else{
        isFalling = false;
        }

	if(flagpole.isReached == false){
		checkFlagpole();
	}

	//check player life status
	checkPlayerDie();
	
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed()
{
	// if statements to control the animation of the character when keys are pressed.
	//open up the console to see
	console.log("keyPressed: " + key);
	console.log("keyPressed: " + keyCode);

	if(!isPlummeting){
		if(keyCode == 37 || keyCode == 65){
			console.log("left arrow");
			isLeft = true;	
		}
		if(keyCode == 39 || keyCode == 68){
			console.log("right arrow");
			isRight = true;
		}
		
		if((keyCode == 38 || keyCode == 87) && isFalling == false){
			console.log("up arrow");
			gameChar_y -= 100;
			jumpSound.play();
		}
	}
}

function keyReleased()
{
	// if statements to control the animation of the character when keys are released.
	console.log("keyReleased: " + key);
	console.log("keyReleased: " + keyCode);

	if(keyCode == 37 || keyCode == 65){
		console.log("left arrow");
		isLeft = false;
	}
	else if(keyCode == 39 || keyCode == 68){
		console.log("right arrow");
		isRight = false;
	} 
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds(){
	for(var i = 0; i < clouds.length; i++)
        {
            noStroke();
            fill(255, 220);
			//centre cloud portion
            ellipse(clouds[i].x_pos, clouds[i].y_pos, clouds[i].size +25);
			//left cloud portion
            ellipse(clouds[i].x_pos-50, clouds[i].y_pos, clouds[i].size + 25);
			//right cloud portion
            ellipse(clouds[i].x_pos+50, clouds[i].y_pos-10, clouds[i].size + 10);
			//anchor point
			// fill(255,0,0);
    		// ellipse(clouds[i].x_pos,clouds[i].y_pos,10,10);
			//slow rightward cloud animation
            clouds[i].x_pos += 0.25;
        }

}

// Function to draw mountains objects.
function drawMountains(){
	for(var i = 0; i < mountains.length; i++)
        {
            //back mountain
			stroke(91, 220, 245, 170);
			strokeWeight(3);
            fill(115, 73, 42);
            triangle(mountains[i].x_pos-100, mountains[i].y_pos, mountains[i].x_pos, (mountains[i].y_pos - 350)*mountains[i].size, mountains[i].x_pos+100, mountains[i].y_pos);
			//forward mountain
			stroke(61, 120, 44, 230);
			strokeWeight(2);
			fill(54, 34, 20);
            triangle(mountains[i].x_pos+25,mountains[i].y_pos, mountains[i].x_pos+75, (mountains[i].y_pos - 200)*mountains[i].size, mountains[i].x_pos+125, mountains[i].y_pos);
			noStroke();
			//anchor point
			// fill(255,0,0);
    		// ellipse(mountains[i].x_pos,mountains[i].y_pos,10,10);
		}
}

// Function to draw trees objects.
function drawTrees(){
	for(var i=0; i<trees_x.length; i++){
		// console.log("tress loop" + i);
		noStroke();
		//tree trunk
		stroke(107, 53, 15);
		strokeWeight(4);
		fill(139,69,19);
		rectMode(CENTER);
		rect(trees_x[i].x_pos, trees_x[i].y_pos,40,100);
		//setback to default mode
		rectMode(CORNER);
		//tree leaves
		noStroke();
		fill(0,153,0, 235);
		ellipse(trees_x[i].x_pos, trees_x[i].y_pos - 100,100,150);
		//anchor point
		// fill(255,0,0);
		// ellipse(trees_x[i].x_pos,trees_x[i].y_pos,10,10);
	}
}

// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.
function drawGameChar(){
	if(isLeft && isFalling)
	{
		//jumping-left code
		fill(218, 165, 32);
		ellipse(gameChar_x,gameChar_y - 50, 30);
		fill(0);
		ellipse(gameChar_x,gameChar_y - 50, 6);
		rect(gameChar_x - 4,gameChar_y - 37, 10, 30);
		fill(228,108,4);
		triangle(gameChar_x + 20,gameChar_y - 10,gameChar_x - 4,gameChar_y - 20,gameChar_x-4,gameChar_y);
	}
	else if(isRight && isFalling)
	{
		//jumping-right code
		fill(218, 165, 32);
		ellipse(gameChar_x,gameChar_y - 50, 30);
		fill(0);
		ellipse(gameChar_x,gameChar_y - 50, 6);
		rect(gameChar_x - 6,gameChar_y - 37, 10, 30);
		fill(228,108,4);
		triangle(gameChar_x - 20,gameChar_y - 10,gameChar_x +4,gameChar_y - 20,gameChar_x+4,gameChar_y);
	}
	else if(isLeft)
	{
		//walking left code
		fill(218, 165, 32);
		ellipse(gameChar_x,gameChar_y - 50, 30);
		fill(0);
		ellipse(gameChar_x,gameChar_y - 50, 6);
		rect(gameChar_x - 4,gameChar_y - 37, 10, 30);
		fill(63,203,175);
		triangle(gameChar_x + 20,gameChar_y - 10,gameChar_x - 4,gameChar_y - 20,gameChar_x-4,gameChar_y);
	}
	else if(isRight)
	{
		//walking right code
		fill(218, 165, 32);
		ellipse(gameChar_x,gameChar_y - 50, 30);
		fill(0);
		ellipse(gameChar_x,gameChar_y - 50, 6);
		rect(gameChar_x - 6,gameChar_y - 37, 10, 30);
		fill(63,203,175);
		triangle(gameChar_x - 20,gameChar_y - 10,gameChar_x +4,gameChar_y - 20,gameChar_x+4,gameChar_y);
	}
	else if(isFalling || isPlummeting)
	{
		//jumping facing forwards code
		fill(218, 165, 32);
		ellipse(gameChar_x,gameChar_y - 50, 30);
		fill(0);
		ellipse(gameChar_x,gameChar_y - 50, 6);
		rect(gameChar_x - 5,gameChar_y - 37, 10, 15);
		triangle(gameChar_x - 15,gameChar_y - 30,gameChar_x +15,gameChar_y - 30,gameChar_x,gameChar_y-15);
		fill(228,108,4);
		triangle(gameChar_x - 5,gameChar_y - 10,gameChar_x +5,gameChar_y - 10,gameChar_x,gameChar_y);
	}
	else
	{
		//standing front facing code
		fill(218, 165, 32);
		ellipse(gameChar_x,gameChar_y - 50, 30);
		fill(0);
		ellipse(gameChar_x,gameChar_y - 50, 6);
		rect(gameChar_x - 5,gameChar_y - 37, 10, 30);
		fill(100);
		triangle(gameChar_x - 15,gameChar_y - 15,gameChar_x +15,gameChar_y - 15,gameChar_x,gameChar_y);
	}
}



// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.
function drawCanyon(t_canyon){
	stroke(0);
	strokeWeight(2);
	fill(36, 18, 5);
	quad(t_canyon.x_pos, t_canyon.y_pos, t_canyon.x_pos + (120 * t_canyon.size), t_canyon.y_pos, t_canyon.x_pos + 95 , t_canyon.y_pos +145, t_canyon.x_pos + 25, t_canyon.y_pos + 145);
	noStroke();
	//anchor point
	// fill(255,0,0);
	// ellipse(t_canyon.x_pos,t_canyon.y_pos,10,10);

}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
	if(gameChar_x > t_canyon.x_pos && gameChar_x < t_canyon.x_pos + (120 * t_canyon.size) && gameChar_y >= t_canyon.y_pos){
		isPlummeting = true;
	}
	if(isPlummeting == true){
		gameChar_y += 25;
	}
}


// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

function drawCollectable(t_collectable){
	if(!t_collectable.isFound){
		fill(255, 215, 0);
		strokeWeight(6);
		stroke(random(10,150));
		ellipse(t_collectable.x_pos, t_collectable.y_pos, t_collectable.diameter);
		noStroke();}
		//anchor point
		// fill(255,0,0);
		// ellipse(t_collectable.x_pos,t_collectable.y_pos,10,10);
}

// Function to check character has collected an item.

function checkCollectable(t_collectable){
	if(dist(gameChar_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos)<35){
		if(!t_collectable.isFound){
			game_score += 1;
			coinSound.play();
		}
		t_collectable.isFound = true;
	}
}


// ----------------------------------
// Flagpole render and check functions
// ----------------------------------

//Function to draw flagpole

function renderFlagpole()
{
	push();
	strokeWeight(5);
	stroke(10);
	line(flagpole.x_pos, floory_pos, flagpole.x_pos, floory_pos -250);
	noStroke();

	if(flagpole.isReached){
		fill(60, 255 , 0);
		rect(flagpole.x_pos, floory_pos - 250, 75, 60);
		noLoop(victorySound.play());
	}

	else{
		fill(229, 250 , 33);
		rect(flagpole.x_pos, floory_pos - 60, 75, 60);
		fill(0);
		text("win?", flagpole.x_pos + 15, floory_pos - 40, 30, 30);
	}
	

	pop();
}

//Function to check if character has reached flagpole

function checkFlagpole(){
	var flagDist = abs(gameChar_x - flagpole.x_pos);
	if (flagDist < 15){
		flagpole.isReached = true;

	}
}


// ----------------------------------
// Check function for player alive status
// ----------------------------------

function checkPlayerDie()
{
	if(gameChar_y > height){
		lives -= 1;
		console.log("player died")
		if(lives > 0){
			startGame();
		}
	}
}
	

//Start Game Function

function startGame(){
	gameChar_x = width/2;
	gameChar_y = floory_pos;
    isLeft = false;
    isRight = false;
    isFalling = false;
    isPlummeting = false;
	cameraPosX = 0;

	//defining objects
	clouds = [{x_pos: 100, y_pos: 180, size:50},{x_pos: 300, y_pos: 80, size:75},{x_pos: 500, y_pos: 180, size:50},{x_pos: 700, y_pos: 180, size:60}];
	mountains = [{x_pos: 200, y_pos: floory_pos, size:1.5},{x_pos: 500, y_pos: floory_pos, size:0.8},{x_pos: 800, y_pos: floory_pos, size: 0.9},{x_pos: 1000, y_pos: floory_pos, size:0.6}]
	collectables= [{x_pos: width - 850, y_pos: floory_pos - 30, diameter:50, isFound: false}, {x_pos: width - 630, y_pos: floory_pos - 30, diameter:50, isFound: false}, {x_pos: width - 150, y_pos: floory_pos - 30, diameter:50, isFound: false}];
    trees_x =  [{x_pos:width/2,y_pos:floory_pos-50}, {x_pos:width/3,y_pos:floory_pos-50}, {x_pos:width/8,y_pos:floory_pos-50}, {x_pos:width - 50,y_pos:floory_pos-50}];
	canyons = [{x_pos:350, y_pos: floory_pos, size: 0.9},{x_pos:800, y_pos: floory_pos, size: 1.2}];

	game_score = 0;

	flagpole = {isReached: false, x_pos: 1250};

	platforms = [];
	platforms.push(createPlatforms(0, floory_pos - 100, 100));
	platforms.push(createPlatforms(600, floory_pos - 100, 120));
	platforms.push(createPlatforms(900, floory_pos - 100, 150));

	enemies = [];
	enemies.push(new enemy(100, floory_pos -10,100));
	enemies.push(new enemy(1200, floory_pos -10,200));
	enemies.push(new enemy(1050, floory_pos -10,75));
}


//Life Token Function
function lifeTokens(){
	for( i=0; i<lives; i++){
		image(heart,850 + 40*i,30, 30, 30);
	}
}

//Function to create platforms
function createPlatforms(x, y, length){
	var p = {
		x: x,
		y: y,
		length: length,
		draw: function(){
			fill(0,239,255);
			stroke(220);
			rect(this.x, this.y, this.length, 20);
		},
		checkContact: function(gc_x, gc_y)
		{
			if(gc_x > this.x && gc_x <this.x + this.length){

				var d = this.y - gc_y;
				if(d >=0 && d < 5){
					return true;
				}
			}

			return false;
		}
	}

	return p;
}


//Function to create enemies
function enemy(x,y, range)
{
	this.x = x;
	this.y = y;
	this.range = range;

	this.currentX = x;
	this.inc = 1;

	this.update = function()
	{
		this.currentX += this.inc;

		if(this.currentX >= this.x + this.range)
		{
			this.inc -= 1;

		}
		else if(this.currentX < this.x)
		{
			this.inc = 1;

		}
	}
	this.draw = function()
	{
		this.update();
		image(enem_img,this.currentX,this.y, 30, 30);
	}

	this.checkContact = function(gc_x, gc_y)
	{
		var d = dist(gc_x, gc_y, this.currentX, this.y)

		if( d < 29)
			{
				return true;
			}
		return false;
	}

}
