//selecteur cvs
const cvs = document.getElementById("Bird");
const ctx = cvs.getContext("2d");

//jeux=> contstantes et variables
let frames = 0;
//const pour la convertion de degré en radiant
const degree = Math.PI/180;

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
        //aller au phase de jeux necessaire apres chaque event
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
    sX : 276,
    sY : 0,
    w : 224,
    h : 112,
    x : 0,
    y : cvs.height - 112,

    dx : 2,
    draw : function(){
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        // avec un this.w en plus pour doubler l'image
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    },
    //mouvement du la partie base du background
    update: function(){
        if(state.current == state.game){//mouvement vers la gauche du decor uniquement pendant cette phase
            // decrement le bas et garde le mouvement jusqu'a revenir a 0 et creer une boucle
            this.x = (this.x - this.dx)%(this.w/2);
        }
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
    x : 50,//position en x
    y : 150,//position en y sur le sprite
    w : 34,//langeur de l'objet
    h : 26,//hauteur de l'objet

    frame : 0,
    radius : 12,
    gravity : 0.15,
    jump : 2,
    speed : 0,
    rotation : 0,

    draw : function(){
        let bird = this.animation[this.frame];

        ctx.save();//save l' etat initial  du canvas
        ctx.translate(this.x, this.y);//tranpose l'origine du canvas au centre du bird
        ctx.rotate(this.rotation);
         //pour centrer l'oiseau  on soustrait la moitié
        ctx.drawImage(sprite, bird.sX, bird.sY, this.w, this.h, - this.w/2, - this.h/2, this.w, this.h);

        ctx.restore();//restaure l'etat initial du canvas
    },
    //flap methode
    flap: function(){
        //maintien l'oiseau en l'air au click
        this.speed = - this.jump;
    },
    //animation de ailes: si c est la phase de jeux ready les ailes s animent lentement
    update: function(){
        this.period = state.current == state.getReady ? 10 : 5;
        //on increment de 1 la frame a chaque periode
        this.frame += frames%this.period == 0 ? 1 : 0;
        //la frame va de 0 a 4 puis revient a 0
        this.frame = this.frame%this.animation.length;

        //fait tomber l'oiseau (mouvement vertical)
        if(state.current == state.getReady){
            this.y = 150;//reset la position du bird apres game over
            this.rotation = 0 * degree;
        }else{
            this.speed += this.gravity;
            this.y += this.speed;
            //maintien la position au dessu du sol si la valeur est > que la hauteur du canvas - la hauteur du sol
            if(this.y + this.h/2 >= cvs.height-fg.h){
                this.y = cvs.height - fg.h - this.h/2;
                //phase courent du jeux
                if(state.current == state.game){
                    //phase gameover si tombe affiche message game over
                    state.current = state.over;
                }    
            }
            // si la vitesse est superieur au saut, le bird tombe a 90°
            if(this.speed >= this.jump){
                this.rotation = 90 * degree;
                this.frame = 1;
            }else{//sinon la rotation du bird est a -25°
                this.rotation = -25 * degree;
            }
        }
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
    sY: 228,
    w: 225,
    h: 202,
    x: cvs.width - 270 - 2,
    y: 110,

    draw: function(){
        if(state.current == state.over){
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
    
        }
    }
}
//tuyaux
const pipes = {
    position : [],
    top : {
        sX : 553,
        sY : 0
    },
    bottom : {
        sX : 502,
        sY : 0
    },
    w : 53,
    h : 400,
    gap : 85,
    maxYpos : -150,
    dx : 2,

    draw : function(){
        for(let i = 0; i < this.position.length; i++){
            let p = this.position[i];

            let topYpos = p.y;
            let bottomYpos = p.y + this.h + this.gap;
            //tuyau top
            ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, p.x, topYpos, this.w, this.h);
            //tuyau bottom
            ctx.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, p.x, bottomYpos, this.w, this.h);
        }
    },
    update: function(){
        if(state.current != state.game) return;

        if(frames%100 == 0){
            this.position.push({//affichage des tuyaux de façon aleatoire
                x : cvs.width,
                y : this.maxYpos * ( Math.random() + 1)
            });
        }
        for(let i = 0; i < this.position.length; i++){
            let p = this.position[i];


            let bottomYpos = p.y + this.h + this.gap;

            //detection de la collision (top)
            if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > p.y && bird.y -bird.radius < p.y + this.h){
                state.current =  state.over;
            }
            //collision bottom
            if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > bottomYpos && bird.y -bird.radius < bottomYpos + this.h){
                state.current =  state.over;
            }
            //bouge les tuyaus ver la gauche
            p.x -= this.dx;
            //quand les tuyaux sortent du canvas, elle s'effacent
            if(p.x + this.w <= 0){
                this.position.shift
            }
        } 
    }
}
//affichage du score
const score = {
    best : parseInt(localStorage.getItem("best")) || 0,
    value : 0,
    draw : function(){
        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#000";

        if(state.current == state.game){ 
            ctx.lineWidth = 2;
            ctx.font = "35px Teko";//typo et taille
            ctx.fillText(this.value, cvs.width/2, 50) //position de l'affichage du score centrer et a 50px du top
            ctx.strokeText(this.value, cvs.width/2, 50)//crée le style contour a la meme position que le texte
        }else if(state.current == state.over){
            //valeur du score
            ctx.font = "25px Teko";//typo et taille pour le score dans l et tabelau game over
            ctx.fillText(this.value, 225, 205) //position de l'affichage du score dans le cadre gameover
            ctx.strokeText(this.value, 225, 205)//crée le style contour a la meme position dans le cadre gameover
            //valeur du meilleur score
            ctx.font = "25px Teko";//typo et taille
            ctx.fillText(this.value, 225, 250) //position de l'affichage du score dans le cadre gameover
            ctx.strokeText(this.value, 225, 250)//crée le style contour a la meme position dans le cadre gameover
        }
    }
}
//apel des methodes pour afficher les dessins
function draw(){
    ctx.fillStyle = "#69BDD1";
    ctx.fillRect(0, 0, cvs.width, cvs.height );

    bg.draw();
    pipes.draw();
    fg.draw();
    bird.draw();
    getReady.draw();
    gameOver.draw();
    score.draw();
}
//update
function update(){
    bird.update();
    fg.update();
    pipes.update();
}
//pour recahger le jeux tt les secones loop
function loop(){
    update();
    draw();
    frames++;

    requestAnimationFrame(loop);
}
loop();