function pretvoriUKoordinate(mx, my){
	for(var i=0; i<n; i++)
		for(var j=0; j<krugovi[i].length; j++)
		    if(Math.abs(mx-krugovi[i][j].x)<15 && Math.abs(my-krugovi[i][j].y)<15){
				return [i,j];
			}
			return false;
		}

function nalaziSeU(oznacene,tacka){
	for(let i=0; i<oznacene.length; i++)
		if(oznacene[i][0]==tacka[0] && oznacene[i][1]==tacka[1])
			return i;
	return -1;
}

function obrisi(oznacene,index){
	oznacene.splice(index,1);
	brojOznacenih--;
}

function ukloniOznake(oznacene){
	for(let i=0; i<3; i++)
		krugovi[oznacene[i][0]][oznacene[i][1]].c = "grey";
}

function tackaNaDuzi(duz,x,y){
	let x1 = duz[0], y1 = duz[1], x2 = duz[2], y2 = duz[3];	
	if((y-y1)*(x2-x1) === (y2-y1)*(x-x1)){
		if(naSegmentu(x1,y1,x,y,x2,y2)){
		return true;
	}
}
	return false;
}

function tackaNaTrouglu(oznacene, x,y){
	for(let i=0; i<3; i++)
		if(tackaNaDuzi(duzi[duzi.length-1-i],x,y))
			return true;
	return false;
}

function naSegmentu(a1,a2, c1,c2, b1,b2){
    return (c1>=Math.min(a1, b1) && c1<=Math.max(a1,b1) && c2>=Math.min(a2, b2) && c2<=Math.max(a2,b2));
}

function orjentacija(a1,a2,b1,b2,c1,c2){

    let ort = (b2-a2)*(c1-b1)-(b1-a1)*(c2-b2);

    if(ort == 0) return 0;
    if(ort>0) return 1;
    return 2;
}

function sijekuLiSe(a1,a2,b1,b2,c1,c2,d1,d2){
    let o1 = orjentacija(a1,a2,b1,b2,c1,c2);
    let o2 = orjentacija(a1,a2,b1,b2,d1,d2);
    let o3 = orjentacija(c1,c2,d1,d2,a1,a2);
    let o4 = orjentacija(c1,c2,d1,d2,b1,b2);

    if(o1!=o2 && o3!=o4) return true;

    if(o1==0 && naSegmentu(a1,a2,c1,c2,b1,b2)) return true;
    if(o2==0 && naSegmentu(a1,a2,d1,d2,b1,b2)) return true;
    if(o3==0 && naSegmentu(c1,c2,a1,a2,d1,d2)) return true;
    if(o4==0 && naSegmentu(c1,c2,b1,b2,d1,d2)) return true;
    return false;
}

function validne(x1,y1,x2,y2,x3,y3){
	if(x2==x1){
		if(x2==x3){
			return false;
		}
		if(y2==y1)
			return false;
		return true; 
	} else {
		var k=(y2-y1)/(x2-x1);
		var l = y1 - k*x1;
		if(y3 == k*x3 + l)
			return false;
		return true;
	}
}

function dodajDuzi(oznacene){
	let a = oznacene[0];
    let b = oznacene[1];
    let c = oznacene[2];

	duzi.push([a[0],a[1],b[0],b[1]]);
	duzi.push([c[0],c[1],b[0],b[1]]);
	duzi.push([a[0],a[1],c[0],c[1]]);
	brojTrouglova++;
}

function obradi(oznacene){
	let a = oznacene[0];
    let b = oznacene[1];
    let c = oznacene[2];

	if(!validne(a[0],a[1],b[0],b[1],c[0],c[1])) return false;

    for(var i=0; i<duzi.length; i++)
    	if(sijekuLiSe(a[0],a[1],b[0],b[1],duzi[i][0],duzi[i][1],duzi[i][2],duzi[i][3]) ||
    		sijekuLiSe(b[0],b[1],c[0],c[1],duzi[i][0],duzi[i][1],duzi[i][2],duzi[i][3]) ||
    		sijekuLiSe(c[0],c[1],a[0],a[1],duzi[i][0],duzi[i][1],duzi[i][2],duzi[i][3]))
    		return false;
    
	return true;
}

function daLiSuSlobodne(x,y){
	if(krugovi[x][y].c ==="grey")
		return true;
	return false;
}
var brojac = 0;
function daLiJeKraj(){
	brojac++;
	for(let i=0; i<n; i++)
		for(let j=0; j<krugovi[i].length; j++)
			for(let p=0; p<n; p++)
				for(let q=0; q<krugovi[p].length; q++)
					for(let t=0; t<n; t++)
						for(let s=0; s<krugovi[t].length; s++)
							if(i!=t || i!=p || p!=t)
								if(daLiSuSlobodne(i,j) && daLiSuSlobodne(p,q) && daLiSuSlobodne(t,s))
									if(validne(i,j,p,q,t,s)){
										let niz = [[i,j],[p,q],[t,s]];
										if(obradi(niz)){
											return false;
										}
									}
	return true;
}

function resetujMatricu(){
	for(let i=0; i<n; i++)
		for(let j=0; j<krugovi[i].length; j++) 
			krugovi[i][j].c = "grey";
}

function pobjeda(){
	console.log("provjeta");
	if(naPotezu == 0)
		return "IGRAČ B";
	else
		return "IGRAČ A";
}