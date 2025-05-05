class bloco {
    constructor(x, y, text) {
        this.x = x;
        this.y = y;
        this.w = 180;
        this.h = 40;
        this.text = text;
        this.tam = 80;
        this.complemento = 0;

        this.next = null; // Ponteiro para o próximo bloco
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

