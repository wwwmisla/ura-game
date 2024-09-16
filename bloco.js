class bloco {
    constructor(x, y, w, h, text) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.text = text;
    }

    display() {
        //background(255);
        // Desenhar o bloco principal (retângulo com bordas arredondadas)
        fill("#3E7FC1");
        noStroke();
        rect(this.x, this.y, this.w, this.h, 20, 0, 0, 20); // (x, y, largura, altura, raio de bordas arredondadas)
    
        circle(this.x + this.w/5 , this.y + this.h , 20)
        fill(255); // Cor branca do texto
        
        circle(this.x +this.w/5, this.y , 20);
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
            text("enquanto", this.x+this.w/2, this.y+this.h/2 - 2); // Posicionamento do texto centralizado no bloco
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
    }

    addbloco(x, y, w, h, text) {
        if(this.tiposBlocos.includes(text)){
            this.blocos[text].push(new bloco(x, y, w, h, text));
            if(this.inicializacao){
                this.sequence.push({tipo: text, x: x, y: y});
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
            let x = bloco.x + 180/5;
            let y = bloco.y;

            fill("#3E7FC1"); // Cor azul para o conector inferior
            circle(x, y + 40, 20);
        
            fill(255); // Cor branca para o conector superior
            circle(x, y, 20);
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
        if (y > 225 && x < 540 - 150 && this.blocoAtual) {
            if (this.sequence.length > 0) {
                let ultimoBloco = this.sequence[this.sequence.length - 1];
                if(ultimoBloco.y + 80 >= 750){
                    this.novoX += 220;
                    this.novoY = 250;
                } else {
                    this.novoY = ultimoBloco.y + 40;
                }
            }
            this.addbloco(this.novoX, this.novoY, 180, 40, this.blocoAtual);
        }
    }

    concluirInicializacao(){
        this.inicializacao = true;
    }

    clear() {
        for(let tipo of this.tiposBlocos){
            this.blocos[tipo] = [];
        }
        this.blocoAtual = null;
        this.sequence = [];
        this.movements = [];
        this.novoX = 30;
        this.novoY = 250;
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