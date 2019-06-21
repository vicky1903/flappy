const cvs= document.getElementById('mycanvas');
const ctx= cvs.getContext('2d');

function draw(){
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, cvs.clientWidth, cvs.height );
}
//pour recahger le jeux tt les seocnes
function loop(){

    draw();

    requestAnimationFrame(loop);
}
loop();