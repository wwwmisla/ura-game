// A classe 'bloco' permanece a mesma que você já tem (a versão mais nova)
class bloco {
    constructor(x, y, text) {
        this.x = x;
        this.y = y;
        this.w = 180;
        this.h = 40;
        this.text = text;
        this.tam = 80; // Para o bloco While
        this.next = null; // Ponteiro para o próximo bloco na LinkedBlocos
        this.whileCont = 1;
        this.whileSequence = false;
    }
    //ssssss
    //lopdiwds
    //ff
    display() {
        // Seu código de display existente aqui...
        // É importante que ele use this.x e this.y
        //background(255);
        // Desenhar o bloco principal (retângulo com bordas arredondadas)
        if(this.text == "While"){
            fill("#F7C6D5");
            
            noStroke();
            rect(this.x - this.x/10, this.y, this.w + 2 , this.h, 0, 0, 0, 0); // (x, y, largura, altura, raio de bordas arredondadas)
            rect(this.x - this.x/10, this.y, this.h - 12, this.tam, 20, 0, 0, 0);
            rect(this.x - this.x/10, this.y+this.tam, this.w, this.h/2, 0, 0, 0, 20); // (x, y, largura, altura, raio de bordas arredondadas)

            circle(this.x +this.w/5, this.y, 20);

            if(this.whileSequence){
                fill("#FFFF00");
                circle(this.x + 15, this.y + this.h/2, 20)
                fill("#3E7FC1");
                text(this.whileCont, this.x + 16, this.y + this.h/2 - 2);
            }
            
            fill(255); // Cor branca do texto
            circle(this.x + this.w/5 , this.y + this.h , 20)
            circle(this.x + this.w/5 , this.y + this.tam + this.h/2 , 20)
        
        } else if(this.text === "EndWhile") {
            fill("#F7C6D5");
            rect(this.x - this.x/10, this.y, this.w + this.x/10, this.h, 0, 0, 0, 20); // (x, y, largura, altura, raio de bordas arredondadas)
            circle(this.x + this.w/5 , this.y, 20)
            fill(255);
            circle(this.x + this.w/5 , this.y + this.h/2 + 10 , 20)
        } else {
            fill("#3E7FC1");
            noStroke();
            rect(this.x, this.y, this.w, this.h, 20, 0, 0, 20); // (x, y, largura, altura, raio de bordas arredondadas)
            circle(this.x +this.w/5, this.y , 20);
            
            fill(255); // Cor branca do texto
            circle(this.x + this.w/5 , this.y + this.h , 20)
            

        }

        textAlign(CENTER, CENTER);
        textSize(12);
        textFont(font); // Certifique-se que 'font' está carregada e definida globalmente ou passada

        // Adaptação para usar this.text diretamente
        let displayText = "";
        switch(this.text) {
            case "Avançar": displayText = "seguir em frente"; break;
            case "Direita": displayText = "virar à direita"; break;
            case "Esquerda": displayText = "virar à esquerda"; break;
            case "While": displayText = "Repetir"; break;
            default: displayText = ""; // Caso tenha outros blocos
        }
        fill(255); // Cor do texto
        if(this.text == "While"){
            text(displayText, this.x + this.w / 2 - this.x/10, this.y + this.h / 2 - 2);
        } else {
            text(displayText, this.x + this.w / 2, this.y + this.h / 2 - 2);
        }
        
    }

    isInside(px, py) {
        // Ajuste para blocos 'While' se a área clicável for diferente
        let checkWidth = this.w;
        let checkHeight = this.h;
        //verificando se houve click dentro do bloco de contagem do while
        if (this.text == "While" && this.whileSequence) {
            checkWidth = this.w + 2;
            checkHeight = this.h + this.tam;
            if (px >= this.x + 5 && px <= this.x + 25 && py >= this.y + this.h/2 - 10 && py <= this.y + this.h/2 + 10) {
                this.whileCont++;
                console.log("Ciclicou no círculo");
                return true; // Clicou no círculo
            }
        }	
        return px >= this.x && px <= this.x + checkWidth && py >= this.y && py <= this.y + checkHeight;
    }
}