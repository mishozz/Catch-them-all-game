const controller = {
    x:0,
    y:0,
}

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 800
canvas.height = 500
const BALL_START_X = canvas.width/2;
const BALL_START_Y = canvas.height/2;
const RADIUS = 10;
const BUBBLE_START_Y = canvas.height;
const OBSTACLE_START_X = canvas.width
const RECTANGLE_WIDTH = 40
const RECTANGLE_HEIGHT = 30
const Y = "y"
const X = "x"

let canvasPosition = canvas.getBoundingClientRect();

let score = 0;
let frames = 0;
let isGameOver = false

ctx.font = "50px Georgia";




class Ball {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.radius = RADIUS;
    }
    update() {
        this.x += controller.x*0.1
        this.y += controller.y*0.1
        if (this.y <= this.radius && this.x >= canvas.width-this.radius){
            this.y=this.radius;
            this.x=canvas.width-this.radius
        } 
        else if (this.y >= canvas.height-this.radius && this.x >= canvas.width-this.radius){
            this.y=canvas.height-this.radius;
            this.x=canvas.width-this.radius
        } 
        else if (this.y >=canvas.height-this.radius && this.x <= this.radius){
            this.y=canvas.height-this.radius;
            this.x=this.radius;
        } 
        else if (this.y <= this.radius && this.x <= this.radius) {
            this.x = this.radius;
            this.y = this.radius;
        } 
        else if (this.x <= this.radius) {
            this.x = this.radius;
        } 
        else if (this.y <= this.radius) {
            this.y = this.radius
        }
        else if (this.x >= canvas.width-this.radius) {
            this.x = canvas.width-this.radius;      
        } 
        else if (this.y >= canvas.height-this.radius) {
            this.y =canvas.height-this.radius;
        }
   
    }
    draw(fillColor) {
        ctx.beginPath();
        ctx.moveTo(this.x,this.y);
        ctx.stroke();
        ctx.fillStyle = fillColor;
        ctx.arc(this.x,this.y, this.radius, 0 , Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
}

class Bubble extends Ball{
    constructor(x,y){
        super(x,y)
        this.speed = Math.random() * 4 + 1;
        this.distance = 0;
        this.counted = false
    }
    update(direction) {
        this[direction] -= this.speed
        
        const dx = this.x - ball.x
        const dy = this.y - ball.y
         
        this.distance = Math.sqrt(dx*dx + dy*dy)
    }
}

class Obstacle extends Bubble {
    constructor(x,y,width,height) {
        super(x,y)
        this.w = width
        this.h = height

    }
    draw(fillColor) {
        ctx.beginPath();
        ctx.moveTo(this.x,this.y);
        ctx.stroke();
        ctx.fillStyle = fillColor;
        ctx.rect(this.x,this.y, this.w, this.h);
        ctx.fill();
        ctx.closePath();
    }
}

let bubbles = [];
let obstacles = []

function probability(n){
    return Math.random() < n;
}  

function rectCircleColliding(circle,rect){
    var distX = Math.abs(circle.x - rect.x-rect.w/2);
    var distY = Math.abs(circle.y - rect.y-rect.h/2);

    if (distX > (rect.w/2 + circle.radius)) { return false; }
    if (distY > (rect.h/2 + circle.radius)) { return false; }

    if (distX <= (rect.w/2)) { return true; } 
    if (distY <= (rect.h/2)) { return true; }

    var dx=distX-rect.w/2;
    var dy=distY-rect.h/2;
    return (dx*dx+dy*dy<=(circle.radius*circle.radius));
}

function spawnBubbles() {
    const BUBBLE_START_X = Math.random() * canvas.width;
    const OBSTACLE_START_Y = Math.random() * canvas.height; 
    if (frames % 50 == 0) {
        bubbles.push(new Bubble(BUBBLE_START_X,BUBBLE_START_Y));
        if (probability((score + 50)/100)){
            obstacles.push(new Obstacle(OBSTACLE_START_X,OBSTACLE_START_Y,40,30))
        }
    }
    bubbles.forEach(x => {
        x.update(Y);
        x.draw("blue");
    })
    for (i = 0 ; i < bubbles.length ; i++){
        if(typeof bubbles[i] !== "undefined"){    
            if (bubbles[i].distance < bubbles[i].radius + ball.radius && !bubbles[i].counted) {
                bubbles[i].counted = true
                score++;
                bubbles.splice(i,1)
            }
            else if (bubbles[i].y < 0) {
                bubbles.splice(i,1)
            }
        }
    }
    obstacles.forEach(x => {
        x.update(X);
        x.draw("green");
    })
    for (i = 0 ; i < obstacles.length ; i++){
        if (typeof obstacles[i] !== "undefined") {
            if (rectCircleColliding(ball,obstacles[i])) {
                score=0;
                console.log("game over obstacle")
                obstacles.splice(i,1)
                obstacles = []
                bubbles = []
                isGameOver = true

            }
            else if (obstacles[i].x < -40) {
                obstacles.splice(i,1)
            }
        }
    }
}

const ball = new Ball(BALL_START_X,BALL_START_Y);

function animate() {
    if (isGameOver) {
       console.log("game over")
    } else {
        frames++;
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = "black"
        ctx.fillText(`score ${score}`,10, 50)
        ball.update();
        ball.draw("red");
        spawnBubbles();
        requestAnimationFrame(animate);
    }
}


var ip = 'localhost', // Your ip
		port = ':8080',
		io = io.connect(),
		current_url = window.location.href;

io.on('connect', function() {
	// Game setup
	var game = function(ip){

		var QR_code_element,
		create_QR = function(){

			var QR_code,
					url = "http://" + ip + port + "?id=" + io.id;

			// Create the container for the QR code to be created in
			QR_code_element = document.createElement('div');

			// Assign an id to the element
			QR_code_element.id = "QR_code";

			// Append QR code element to the body
			document.body.appendChild(QR_code_element);

			// Assign the actual DOM element
			QR_code_element = document.getElementById('QR_code');

			// Create a QRCode
			QR_code = new QRCode("QR_code");
			QR_code.makeCode(url);
            alert(url)
		},
		game_connected = function(){

			create_QR();
            canvas.style.display="none"

			io.removeListener('game_connected', game_connected);
		};
		
		// Tell the server that the client is connecting as a game
		io.emit('game_connect');

		// When the server has registered this client as a game
		// Create a QR code which will be a url with this game id as a parameter
		io.on('game_connected', game_connected);

		// When a controller has connected/disconnected to this game
		io.on('controller_connected', function(connected){

			if(connected){

				// Hide the QR code
				QR_code_element.style.display = "none";
                canvas.style.display="block"
                animate();

			}else{

				// Show the QR code
                canvas.style.display="none"
				QR_code_element.style.display = "block";
                score = 0;
			}

		});

		// When the server sends a changed controller state update it in the game
		io.on('controller_state_change', function(state){
			controller.x = state.x;
            controller.y = state.y
		});

        io.on("game_state_change", function(newGame){
            console.log("new game "+ newGame)
            if (newGame){
                isGameOver = false
                console.log("new game starting")
                animate()
            }
        })

	}
    setup_controller_outlook = function() {
        canvas.style.display='none'
            
            img_element = document.createElement('img')
            img_element.src = 'controller.png';
            img_element.style.width = '100%';
            img_element.style.height = '75%';

            paragraph_element = document.createElement('div')
            paragraph_element.style.height = '15%';
            paragraph_element.style.fontSize = 'x-large';
            paragraph_element.innerHTML = 'Control the game with you device motion sensors'
            paragraph_element.style.textAlign = 'center'

            info_wrapper = document.createElement('div');
            info_wrapper.style.width = '95%'
            info_wrapper.style.height = '100%'
            info_wrapper.style.display = 'flex';
            info_wrapper.style.justifyContent = 'center';
            info_wrapper.style.alignItems = 'center'
            info_wrapper.style.flexDirection = 'column'
            
           // info_wrapper.innerHTML = "Control the game with you divice motion sensors";

            info_wrapper.appendChild(paragraph_element)
            info_wrapper.appendChild(img_element)
            document.body.appendChild(info_wrapper); 
    }

	// If the url has an id in it
	if(current_url.indexOf('?id=') > 0){

        io.emit('controller_connect', current_url.split('?id=')[1]);

        // Server will send back a connected boolean
        io.on('controller_connected', function(connected){

            if(connected){             
                setup_controller_outlook()
                alert("Connected!");

                emit_controller_updates = function(){
					io.emit('controller_state_change', controller);
				}
                handleOrientation = function(e) {
                    // Device Orientation API
                    controller.x = e.gamma ; // range [-90,90], left-right
                    controller.y = e.beta ;  // range [-180,180], top-bottom
                    emit_controller_updates();
                }

                window.addEventListener("deviceorientation", handleOrientation, true);

                
                var newGame = false
                console.log("game lost ")
                emit_new_game_update = function() {
                    io.emit("game_state_change", newGame)
                }
                handleGameState = function(e) {
                    console.log("game lost clicked ")
                    newGame = true
                    emit_new_game_update()
                }
                window.addEventListener("click", handleGameState)             
            }else{
                // Failed connection
                alert("Not connected!");
            }
        });
	} else {
		// Set up the game using ip
		game(ip);
	}
});


