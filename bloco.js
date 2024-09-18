class bloco {
    constructor(x, y, w, h, text) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.text = text;
        this.tam = 80;
        this.complemento = 0;
    }

    display() {
        //background(255);
        // Desenhar o bloco principal (retângulo com bordas arredondadas)
        if(this.text == "While"){
            fill("#F7C6D5");
            noStroke();
            rect(this.x, this.y, this.w + this.complemento, this.h, 0, 0, 0, 0); // (x, y, largura, altura, raio de bordas arredondadas)
            rect(this.x - this.x/10, this.y, this.h, this.tam, 20, 0, 0, 0); // (x, y, largura, altura, raio de bordas arredondadas)
            rect(this.x - this.x/10, this.y+this.tam, this.w + this.x/10 + this.complemento, this.h/2, 0, 0, 0, 20); // (x, y, largura, altura, raio de bordas arredondadas)


            circle(this.x + this.w/3 , this.y + this.h , 20)
            circle(this.x + this.w/5 , this.y + this.tam + this.h/2 , 20)
            fill(255); // Cor branca do texto
                
            circle(this.x +this.w/5, this.y, 20);
        
        } else {
            fill("#3E7FC1");
            noStroke();
            rect(this.x, this.y, this.w, this.h, 20, 0, 0, 20); // (x, y, largura, altura, raio de bordas arredondadas)
        
            circle(this.x + this.w/5 , this.y + this.h , 20)
            fill(255); // Cor branca do texto
            
            circle(this.x +this.w/5, this.y , 20);
            
        }

        textAlign(CENTER, CENTER);
        textSize(12);
        textFont(font);
        
        if(this.text == "Avançar"){
            text("seguir em frente", this.x+this.w/2, this.y+this.h/2 - 2); // Posicionamento do texto centralizado no bloco
        }
        if(this.text == "Direita"){
            text("virar à direita", this.x+this.w/2, this.y+this.h/2 - 2); // Posicionamento do texto centralizado no bloco
        }
        if(this.text == "Esquerda"){
            text("virar à esquerda", this.x+this.w/2, this.y+this.h/2 - 2); // Posicionamento do texto centralizado no bloco
        }
        if(this.text == "While"){
            text("Repetir até que", this.x+this.w/2, this.y+this.h/2 - 2); // Posicionamento do texto centralizado no bloco
        }
        
    }

    isInside(px, py) {
        return px >= this.x && px <= this.x + this.w && py >= this.y && py <= this.y + this.h;
    }
}

class blocoManager {
    constructor() {
        this.blocos = {
            "Avançar": [],
            "Direita": [],
            "Esquerda": [],
            "While": []
        };
        this.tiposBlocos = ["Avançar", "Direita", "Esquerda","While"];
        this.blocoAtual = null;
        this.sequence = [];
        this.inicializacao = false;
        this.movements = [];
        this.novoX = 30;
        this.novoY = 250;
        this.whileBloco = null;
        this.addInWhile = true;
        this.contador = 40;
    }

    addbloco(x, y, w, h, text) {
        if (this.tiposBlocos.includes(text)) {
            let novoBloco = new bloco(x, y, w, h, text);
            this.blocos[text].push(novoBloco);
            
            if (this.inicializacao) {
                // Armazena a referência ao bloco se for "While"
                if (text === "While") {
                    this.whileBloco = novoBloco;
                }

                // Guarda o tipo e o próprio bloco no sequence
                
            }
        }
    }

    displayblocos() {
        for(let tipo of this.tiposBlocos){
            for(let bloco of this.blocos[tipo]){
                bloco.display();
            }
        }
        this.displayConnectors();
    }

    displayConnectors() {
        for (let i = this.sequence.length - 1; i >= 0; i--) {
            let bloco = this.sequence[i];
            if(bloco.tipo === "While"){
                let x = bloco.x + 180/3;
                let y = bloco.y + 40;

                fill("#F7C6D5"); // Cor rosa para o conector inferior
                circle(x+1, y, 20);
                circle(x+1, y + this.whileBloco.tam - 40, 20);
                circle(x-24, y + this.whileBloco.tam - 20, 20);
            
                fill(255); // Cor branca para o conector superior
                circle(x-24, y-40, 20);

            } else {
                let x = bloco.x + 180/5;
                let y = bloco.y;

                fill("#3E7FC1"); // Cor azul para o conector inferior
                circle(x, y + 40, 20);
            
                fill(255); // Cor branca para o conector superior
                circle(x, y, 20);
            }
            
        }
    }

    Arrastar(x, y) {
        for(let tipo of this.tiposBlocos){
            if(this.blocos[tipo][0] && this.blocos[tipo][0].isInside(x, y)){
                this.blocoAtual = tipo;
                return true;
            }
        }
        return false;
    }

    previewbloco(x, y) {
        if(this.blocoAtual){
            rect(x, y, 200, 40);
            textSize(14);
            textAlign(CENTER, CENTER);
            text(this.blocoAtual, x + 180/2, y + 40/2);
        }
    }

    addblocoAtPosition(x, y) {
        console.log(x, y);
        if(y > 225){
            if(!this.whileBloco || !this.addInWhile){
                if (x < 540 - 150 && this.blocoAtual) {
                    if (this.sequence.length > 0) {
                        let ultimoBloco = this.sequence[this.sequence.length - 1];
                        if(ultimoBloco.y + 80 >= 750){
                            this.novoX += 220;
                            this.novoY = 250;
                        } else {
                            this.novoY = ultimoBloco.y + 40;
                        }
                    }

                    console.log("primeiro")
                    this.addbloco(this.novoX, this.novoY, 180, 40, this.blocoAtual);
                    this.sequence.push({tipo: this.blocoAtual, x: this.novoX, y: this.novoY});
                }
                
            } else {
                this.whileBloco.complemento = 25;
                if ((y > this.whileBloco.y && y < this.whileBloco.y  + this.whileBloco.tam) && x < 540 - 150 && this.blocoAtual && this.addInWhile) {
                    let ultimoBloco = this.sequence[this.sequence.length - 1];
                    if(ultimoBloco.y + 80 >= 750){
                        this.novoX += 220;
                        this.novoY = 250;
                    } else {
                        this.novoY = ultimoBloco.y + 40;
                    }
                    
                    this.addbloco(this.novoX+25, this.novoY, 180, 40, this.blocoAtual);
                    this.sequence.push({tipo: this.blocoAtual, x: this.novoX+25, y: this.novoY});
                    this.whileBloco.tam = 40 + this.contador;
                    this.contador += 40;
                    console.log("segundo")
                } else if(y > this.whileBloco.y + this.whileBloco.tam && x < 540 - 150){
                    this.addInWhile = false;
                    console.log("terceiro")
                    let ultimoBloco = this.sequence[this.sequence.length - 1];
                    if(ultimoBloco.y + 80 >= 750){
                        this.novoX += 220;
                        this.novoY = 250;
                    } else {
                        this.novoY = ultimoBloco.y + 60;
                    }
                    this.addbloco(this.novoX, this.novoY, 180, 40, this.blocoAtual);
                    this.sequence.push({tipo: this.blocoAtual, x: this.novoX, y: this.novoY});
                }
                

            }
        }
        
    }

    concluirInicializacao(){
        this.inicializacao = true;
    }

    clear() {
        for(let tipo of this.tiposBlocos){
            this.blocos[tipo] = [];
        }
        this.contador = 40;
        this.whileBloco = null;
        this.blocoAtual = null;
        this.sequence = [];
        this.movements = [];
        this.novoX = 30;
        this.novoY = 250;
        this.addInWhile = true;
    }

    getMovementSequence(){
        this.movements = [];
        let forwardCount = 0;
        
        for(let action of this.sequence){
            let tipo = action.tipo;
            if(tipo == "While"){
                if(forwardCount > 0){
                    this.movements.push({type: "move", steps: forwardCount});
                    forwardCount = 0;
                }
                this.movements.push({type: "while", whiletrue: "enquanto"});
            } else if(tipo == "Avançar"){
                forwardCount++;
            } else {
                if(forwardCount > 0){
                    this.movements.push({type: "move", steps: forwardCount});
                    forwardCount = 0;
                }
                this.movements.push({type: "rotate", direction: tipo === "Direita" ? "clockwise" : "counterclockwise"});
            }
        }

        if(forwardCount > 0){
            this.movements.push({type: "move", steps: forwardCount});
        }

        return this.movements;
    }
}