const controller = {
    x:0,
    y:0,
}

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

canvas.width = 800
canvas.height = 500

let canvasPosition = canvas.getBoundingClientRect();

let score = 0;
let frames = 0;

ctx.font = "50px Georgia";

class Ball {
    constructor() {
        this.x = canvas.width/2;
        this.y = canvas.height/2;
        this.radius = 10;
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
    draw() {
        ctx.lineWidth = 0.1;
        ctx.beginPath();
        ctx.moveTo(this.x,this.y);
        ctx.stroke();
        ctx.fillStyle = "red";
        ctx.arc(this.x,this.y, this.radius, 0 , Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
}

class Bubble {
    constructor(){
        this.x = Math.random() * canvas.width - 1;
        this.y = canvas.height;
        this.radius = 10;
        this.speed = Math.random() * 4 + 1;
        this.distance = 0;
        this.counted = false
    }
    update() {
        this.y -= this.speed
        
        const dx = this.x - ball.x
        const dy = this.y - ball.y
         
        this.distance = Math.sqrt(dx*dx + dy*dy)
    }
    draw() {
        ctx.fillStyle = "blue"
        ctx.beginPath();
        ctx.arc(this.x,this.y, this.radius, 0 , Math.PI * 2);
        ctx.moveTo(this.x,this.y)
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
    }

}

let bubbles = [];

function spawnBubbles() {
    if (frames % 50 == 0) {
        bubbles.push(new Bubble());
    }
    bubbles.forEach(x => {
        x.update();
        x.draw();
    })
    for (i = 0 ; i < bubbles.length ; i++){
        if (bubbles[i].y < 0) {
        bubbles.splice(i,1)
        }
        if (bubbles[i].distance < bubbles[i].radius + ball.radius && !bubbles[i].counted) {
            bubbles[i].counted = true
            score++;
            bubbles.splice(i,1)
        }
    }
}

const ball = new Ball();
const b = new Bubble();

function animate() {
    frames++;
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "black"
    ctx.fillText(`score ${score}`,10, 50)
    ball.update();
    ball.draw();
    spawnBubbles();
    requestAnimationFrame(animate);
}


var ip = '192.168.0.107', // Your ip
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

		})

		// When the server sends a changed controller state update it in the game
		io.on('controller_state_change', function(state){
			controller.x = state.x;
            controller.y = state.y
		});

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

                emit_updates = function(){
					io.emit('controller_state_change', controller);
				}
                handleOrientation = function(e) {
                    // Device Orientation API
                    controller.x = e.gamma ; // range [-90,90], left-right
                    controller.y = e.beta ;  // range [-180,180], top-bottom
                    emit_updates();
                }

                window.addEventListener("deviceorientation", handleOrientation, true);
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


