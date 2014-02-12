/***
 * Classe que implementa o Sudoku
 * @author Balhau
 * @classDescription O objecto Sudoku contém funções para geração de sudokus e respectivas soluções
 * @requires Este ficheiro necessita do ficheiro js.js como requisito devido a funções utilitárias
 */
var Sudoku=function(){
	var dx=Sudoku.DIMX;
	var dy=Sudoku.DIMY;
	this._mat=[];
	this.clear();
};

Sudoku.getPosXY=function(pos){
	var x=pos%9;
	var y=Math.floor(pos/9);
	return {"x":x,"y":y};
};

Sudoku.toPos=function(x,y){
	var dx=Sudoku.DIMX;
	var dy=Sudoku.DIMY;
	if(x>=dx)
		x=dx-1;
	if(y>=dy)
		y=dy-1;
	return y*9+x;
};
/**
 * Verifica se a coluna contem valores todos diferentes
 * @param pos Posição no vector
 * @param val Valor a colocar no vector
 * @return Boolean
 */
Sudoku.prototype.checkColum=function(pos,val){
	var dx=Sudoku.DIMX;
	var dy=Sudoku.DIMY;
	var p=Sudoku.getPosXY(pos);
	for(var i=0;i<dy;i++){
		if(this._mat[p.x+i*dy]==val)
			return false;
	}
	return true;
};

/**
 * Verifica se a linha contem valores todos diferentes
 * @param pos Posição no vector
 * @param val Valor a colocar no vector
 * @return Boolean
 */
Sudoku.prototype.checkLine=function(pos,val){
	var dx=Sudoku.DIMX;
	var dy=Sudoku.DIMY;
	var p=Sudoku.getPosXY(pos);
	for(var i=0;i<dx;i++){
		if(this._mat[p.y*dy+i]==val)
			return false;
	}
	return true;
};

/**
 * Método que verifica se o valor é válido para o bloco
 * @param pos Indice do vector
 * @param val Valor a atribuir
 * @return
 */
Sudoku.prototype.checkBlock=function(pos,val){
	var p=Sudoku.getPosXY(pos);
	var pi,pj;//variaveis que identificam o bloco
	if(p.x<3)pi=0;else if(p.x>=3 && p.x<6)pi=1;else	pi=2; 
	if(p.y<3)pj=0;else if(p.y>=3 && p.y<6)pj=1;else	pj=2;
	var ci=0;
	var pii=pi*3;
	var li=pj*9*3;
	for(var i=0;i<9;i++){
		if(i%3==0 && i!=0){
			ci=0;
			li+=9;
		}
		//var p=Sudoku.getPosXY(li+ci+pii);
		//console.log("PosA: "+p.x+","+p.y);
		if(this._mat[li+ci+pii]==val)
			return false;
		ci++;
	}
	return true;
};

/**
 * Método que reinicia o vector com os valores do sudoku
 * @return 
 */
Sudoku.prototype.clear=function(){
	var dx=Sudoku.DIMX;
	var dy=Sudoku.DIMY;
	for(var i=0;i<dx*dy;i++){
		this._mat[i]=-1;
	}
};

/**
 * Método que efectua uma limpeza nos n valores anteriores à posição pos
 * @param pos Posição para a qual se pretende iniciar o reset de valores
 * @param n Número de celulas que irão ser limpas
 * @return 
 */
Sudoku.prototype.clearLastValues=function(pos,n){
	var min=Math.max(0,n);
	for(var i=min;i<=pos;i++){
		this._mat[i]=-1;
	}
};

Sudoku.DIMX=9;
Sudoku.DIMY=9;
Sudoku.BACK_TRACK_STEP=9;
Sudoku.EASY=1;
Sudoku.NORMAL=2;
Sudoku.HARD=3;

/**
 * Método que gera uma instância do sudoku;
 * @return
 */
Sudoku.prototype.buildSudoku=function(){
	this.clear();
	var dx=Sudoku.DIMX;
	var dy=Sudoku.DIMY;
	var num;
	var maxit=100;
	var maxitt=1000;
	var it=0;
	var step;
	var itt=0;
	for(var i=0;i<dx*dy;){
		it++;
		num=Math.floor(Math.random()*9)+1;
		if(this.checkLine(i,num) && this.checkColum(i,num) && this.checkBlock(i, num)){//
			it=0;
			this._mat[i]=num;
			i++;
		}
		if(it>maxit){
			pos=Math.max(0,i-Sudoku.BACK_TRACK_STEP);
			this.clearLastValues(i, pos);									//backtrack
			i=pos;															//retorna atrás nas iteracções
			it=0;																				//inicia o contador
			itt++;
		}
		if(itt>maxitt){
			i=maxitt;
		}
	}
	if(i==maxitt)
		return false;
	return true;
};

/**
 * Método que devolve os blocos do sudoku sob a forma de HTML
 * @param x Ponto x do bloco
 * @param y Ponto y do bloco  
 * @return String com o código em HTML do bloco
 */
Sudoku.prototype.getHTMLBlock=function(x,y){
	var pi,pj;//variaveis que identificam o bloco
	if(x<3)pi=0;else if(x>=3 && x<6)pi=1;else pi=2; 
	if(y<3)pj=0;else if(y>=3 && y<6)pj=1;else pj=2;
	var ci=0;
	var pii=pi*3;
	var li=pj*9*3;
	var ncl=((x+y)%2==0)?"par":"impar";
	var str="<table class=\""+ncl+"\">\n\t<tr>";
	for(var i=0;i<9;i++){
		if(i%3==0 && i!=0){
			ci=0;
			li+=9;
			str+="\n\t</tr>\n\t<tr>";
		}
		str+="\n\t\t<td>"+this._mat[li+ci+pii]+"</td>";
		ci++;
	}
	str+="\n\t</tr>\n</table>";
	return str;
};

/**
 * Método que devolve uma instância do sudoku em função do seu nível de dificuldade
 * @param level 
 * @return
 */
Sudoku.prototype.getSudoku=function(level){
	if(BLauLib.isUndefined(level))
		level=Sudoku.EASY;
	var comp=this._mat.length;
	var pb=0.5-level*0.12;
	var ninst=new Sudoku();
	var mclone=this._mat.clone();
	for(var i=0;i<comp;i++){
		if(Math.random()<pb){
			mclone[i]=this._mat[i];
		}
		else{
			mclone[i]="_";
		}
	}
	ninst._mat=mclone;
	return ninst.toHTML();
};

/**
 * Método que converte o sudoku para a sua representação sob a forma de código em HTML
 * @return String em HTML
 */
Sudoku.prototype.toHTML=function(){
	var dx=Sudoku.DIMX;
	var dy=Sudoku.DIMY;
	var str="<table class='sudo_table'>";
	for(var i=0;i<3;i++){
		str+="<tr>";
		for(var j=0;j<3;j++){
			str+="<td>"+this.getHTMLBlock(1+j*3,1+i*3)+"</td>";
		}
		str+="</tr>";
	}
	str+="</table>";
	return str;
};

/**
 * Método que devolve uma descrição do sudoku em forma de string
 * @return String
 */
Sudoku.prototype.toString=function(){
	var st="";
	var cmp=this._mat.length;
	var pl=1;
	for(var i=0;i<cmp;i++){
		if(i%3==0)
			st+="|";
		st+=this._mat[i]>0?this._mat[i]:" ";
		if((i+1)%9==0){
			pl++;
			st+="|\n";
		}
		if(pl%4==0){
			for(var j=0;j<9;j++){
				st+="___";
			}
			st+="\n";
			pl=1;
		}
	}
	return st;
};

