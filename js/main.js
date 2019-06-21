//selecteur cvs
const cvs = document.getElementById("Bird");
const ctx = cvs.getContext("2d");

//jeux contstantes et variables
let frames = 0;

// sprite et img
const sprite = new Image();
sprite.src = "img/sprite.png";

// les phases de jeux
const state = {
    current : 0,
    getReady : 0,
    game : 1,
    over : 2,
}

//controles du jeux
cvs.addEventListener("click", function(evt){
    switch(state.current){
        //aller au phase de jeux necessaire apres cahque event
        case state.getReady :
            state.current = state.game;
            break;
        case state.game :
            bird.flap();
            break;
        case state.over :
            state.current = state.getReady;
            break;
    }
});

//background
const bg = {
    sX : 0,
    sY : 0,
    w : 275,
    h : 226,
    x : 0,
    y : cvs.height - 226,

    draw : function(){
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        // avec un this.w en plus pour doubler l'image
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    }

}
//bas du fond
const fg= {
    sX:276,
    sY: 0,
    w: 224,
    h: 112,
    x: 0,
    y: cvs.height - 112,

    draw : function(){
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        // avec un this.w en plus pour doubler l'image
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);

    }
}
//bird
const bird = {
    animation : [
        {sX: 276, sY : 112},
        {sX: 276, sY : 139},
        {sX: 276, sY : 164},
        {sX: 276, sY : 139},
    ],
    x : 50,
    y : 150,
    w : 34,
    h : 26,

    frame : 0,

    draw : function(){
        let bird = this.animation[this.frame];
         //pour centrer l'oiseau  on soustrait la moitié
        ctx.drawImage(sprite, bird.sX, bird.sY, this.w, this.h, this.x - this.w/2, this.y - this.h/2, this.w, this.h);
    },
    //flap methode
    flap : function(){

    },
}
// message ready
const getReady = {
    sX: 0,
    sY: 228,
    w: 173,
    h: 152,
    x: cvs.width/2 - 173/2,// diviser pour centrer le message
    y: 80,
    draw: function(){
        if(state.current == state.getReady){//deplacement entre les phases de jeux
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        }
    }
}
// message game over
const gameOver = {
    sX: 174,
    sY: 272,
    w: 250,
    h: 225,
    x: cvs.width - 270 - 2,
    y: 110,

    draw: function(){
        if(state.current == state.over){
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
    
        }
    }
}


//apel des methodes pour afficher les dessins
function draw(){
    ctx.fillStyle = "#69BDD1";
    ctx.fillRect(0, 0, cvs.width, cvs.height );

    bg.draw();
    // pipes.draw();
    fg.draw();
    bird.draw();
    getReady.draw();
    gameOver.draw();
    // score.draw();
}
//update
function update(){

}
//pour recahger le jeux tt les secones loop
function loop(){
    update();
    draw();
    frames++;

    requestAnimationFrame(loop);
}
loop();