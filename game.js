const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

canvas.width = 800
canvas.height = 500

let canvasPosition = canvas.getBoundingClientRect();

let score = 0;
let frames = 0;

ctx.font = "50px Georgia";

window.addEventListener("deviceorientation", this.handleOrientation, true);

const controller = {
    x:0,
    y:0,
}

 function handleOrientation(e) {
    // Device Orientation API
    controller.x = e.gamma ; // range [-90,90], left-right
    controller.y = e.beta ;  // range [-180,180], top-bottom
}

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
        this.x = Math.random() * canvas.width;
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

animate();