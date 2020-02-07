var requestAnimatFrame = (function(){
    return window.requestAnimationFrame    ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();

// Definiranje koji dio html-a treba da se prikaže a koji da ostane hidden //

function pocetna() {
  document.getElementById("main").hidden = false;	
  document.getElementById("upute").hidden = true;
  document.getElementById("izaberiIgru").hidden = true;
  document.getElementById("igra").hidden = true;
  document.getElementById("info").hidden = true;
  document.getElementById("gameover").hidden = true;
  document.getElementById("dugme").hidden = true;}

function uputstva(){
	document.getElementById("uputstvaButton").addEventListener("click", function() {
  	document.getElementById("main").hidden = true;	
  	document.getElementById("upute").hidden = false;}, false);
}


function about() {
	document.getElementById("aboutButton").addEventListener("click", function() {
    document.getElementById("main").hidden = true;	
    document.getElementById("info").hidden = false;}, false);
}
	
function opcije() {
	document.getElementById("opcijeButton").addEventListener("click", function() {
	document.getElementById("main").hidden = true;	
    document.getElementById("izaberiIgru").hidden = false;}, false);
}

function nazad() {
	document.getElementById("main").hidden = false;	
  	document.getElementById("upute").hidden = true;
  	document.getElementById("izaberiIgru").hidden = true;
  	document.getElementById("igra").hidden = true;
  	document.getElementById("info").hidden = true;
  	document.getElementById("gameover").hidden = true
  	document.getElementById("dugme").hidden = true;
}

function gameOver(){
	let pobjednik = $("#pobjednik");
	pobjednik.html(pobjeda());
  	document.getElementById("gameover").hidden = false;
  	document.getElementById("dugme").hidden = true;
}

function igrajPonovo() {
	resetuj();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	document.getElementById("gameover").hidden = true;
	document.getElementById("dugme").hidden = false;
}

then = Date.now()

//Deklarisanje kanvasa i varijabli

var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
document.body.appendChild(canvas);
 
var n; var m;
var krugovi = [];
var prviIgrac = 1;
var naPotezu;
var krugovi = [];
var brojOznacenih = 0;
var brojTrouglova = 0;
var oznacene = [];
var duzi = [];
var igrac = prviIgrac;
var brojPobjedaA = 0;
var brojPobjedaB = 0; 

// Početak igre, kreiranje matrica i postavljanje dimenzija kanvasa

function startGameTrougaona(n1) {
	n = n1;
	document.getElementById("izaberiIgru").hidden = true;
	document.getElementById("dugme").hidden = false;
	osvjezi();
    then = Date.now();
    prviIgrac = (prviIgrac+1)%2;
    naPotezu = prviIgrac;
    postaviCanvas(n,n);
    napraviTrougaonu(n);
    main();
}

function startGame(n1,m1) {
	document.getElementById("izaberiIgru").hidden = true;
	document.getElementById("dugme").hidden = false;
	osvjezi();
	n=n1; m=m1;
    then = Date.now();
    prviIgrac = (prviIgrac+1)%2;
    naPotezu = prviIgrac;
    postaviCanvas(n,m);
    napraviMatricu(n,m);
    main();
}

function postaviCanvas(n,m){
	canvas.width = 70*n+400;
	canvas.height = 50*m+150;
}

function napraviTrougaonu(n1){
	for(let i=0; i<n; i++){
		var red = [];
		for(let j=0; j<i+1; j++)
		    red.push({
		  		x: i*70+225,
		  		y: j*50+130,
		  		c: "grey"
		  	});
		krugovi.push(red);
	}

}

function napraviMatricu(n,m){
	for(let i=0; i<n; i++){
		var red = [];
		for(let j=0; j<m; j++){
		    red.push({
		  		x: i*70+225,
		  		y: j*50+130,
		  		c: "grey"
		  	});
		}
		krugovi.push(red);
	}
}

//Prilikom ponovnog pokretanja igre potrebno je vratiti varijable na početne vrijednosti

function osvjezi(){
	prviIgrac = 1;
	krugovi = [];
	brojOznacenih = 0;
	brojTrouglova = 0;
	oznacene = [];
	duzi = [];
	igrac = prviIgrac;
	brojPobjedaA = 0;
	brojPobjedaB = 0; 
}

/*Prilikom ponovnog pokretanja igre nakon game-over sve varijable postavimo na pocetne,
  krugove postavimo da budu sivi i promijenimo pocetnog igraca
*/
function resetuj() {
	prviIgrac = (prviIgrac+1)%2;
	brojOznacenih = 0;
	brojTrouglova = 0;
	oznacene = [];
	duzi = [];
	naPotezu = prviIgrac;
	igrac = prviIgrac;
	resetujMatricu();
}

var main = function () {
    var now = Date.now();
    var delta = now - then;
    //	update();
    render();
    then = now;
    requestAnimatFrame(main);
}

// Uzimanje koordinata klika mišem

var mouseX;
var mouseY;

canvas.addEventListener('click', function (e) {
	getMousePosition(canvas, e);
    update();
});

function getMousePosition(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    mouseX = evt.clientX - rect.left;
    mouseY =  evt.clientY - rect.top;
}


function update(){
	
	var tacka = pretvoriUKoordinate(mouseX, mouseY);
	if(!tacka) return;

	let index = nalaziSeU(oznacene,tacka);
    if(index!=-1){
    	krugovi[tacka[0]][tacka[1]].c = "grey";
    	obrisi(oznacene,index);
    	return;
    } else {
    	if(!daLiSuSlobodne(tacka[0],tacka[1])) return;
	    oznacene.push(tacka);
		krugovi[tacka[0]][tacka[1]].c = "red";
		brojOznacenih++;

		if(brojOznacenih == 3){
			if(!obradi(oznacene)){
				ukloniOznake(oznacene);
			} else {
				dodajDuzi(oznacene);
				zauzmi(krugovi,oznacene);
				naPotezu = (naPotezu+1)%2;
				if(daLiJeKraj()){
					if(naPotezu==0){
						brojPobjedaB++;
					} else {
						brojPobjedaA++;
					}
					console.log("GGTOVOTO");
					gameOver();
				}
			}
			oznacene = [];
			brojOznacenih = 0;
		}
	}
}

function zauzmi(krugovi,oznacene){
	for(let i=0; i<n; i++){
		for(let j=0; j<krugovi[i].length; j++){
			if(krugovi[i][j].c === "grey" && tackaNaTrouglu(oznacene,i,j))
				krugovi[i][j].c = "darkred";
		}
	}
}

function nacrtajDuz([x1,y1,x2,y2]){

	let tacka1 = [x1,y1];
	let tacka2 = [x2,y2];

	ctx.beginPath();
	ctx.moveTo(krugovi[tacka1[0]][tacka1[1]].x, krugovi[tacka1[0]][tacka1[1]].y);
	ctx.lineTo(krugovi[tacka2[0]][tacka2[1]].x, krugovi[tacka2[0]][tacka2[1]].y);
	ctx.lineWidth = 2;
	if(igrac==0){
		ctx.strokeStyle = "yellow";
	} else {
		ctx.strokeStyle = "blue";
	}
	ctx.stroke();
}


function nacrtajTrougao(){
	igrac = prviIgrac;
	for(var i=0; i<duzi.length; i++) {
    	nacrtajDuz(duzi[i]);
    	if(i%3==2)
    		igrac = (igrac+1)%2;
	}	
}

function nacrtajLinije() {
	ctx.beginPath();
	ctx.moveTo(120, 160);
	ctx.lineTo(120, canvas.height-90);
	ctx.moveTo(canvas.width-120, 160);
	ctx.lineTo(canvas.width-120, canvas.height-90);
	if(naPotezu==0){
		ctx.strokeStyle = "yellow";
	} else {
		ctx.strokeStyle = "blue";
	}
	ctx.stroke();
}

function render() {

	ctx.font = "25px Monteserrat";
	ctx.fillStyle = "yellow";
	ctx.fillText("Igrač A "+brojPobjedaA, 35*n+80, 60);
	ctx.fillStyle = "grey";
	ctx.fillText(" : ", 35*n+175, 60);
	ctx.fillStyle = "blue";
	ctx.fillText(brojPobjedaB+" Igrač B", 35*n+195, 60);
	
    for(var i=0; i<n; i++) {
       	for(var j=0; j<krugovi[i].length; j++){
	        ctx.beginPath();
	        ctx.arc(krugovi[i][j].x, krugovi[i][j].y, 8, 0, 2 * Math.PI);
	        ctx.fillStyle = krugovi[i][j].c;
	        ctx.fill();
    	}
    }
   nacrtajLinije();
   nacrtajTrougao();

}

