// A classe 'bloco' permanece a mesma que você já tem (a versão mais nova)
class bloco {
    constructor(x, y, text) {
        this.x = x;
        this.y = y;
        this.w = 180;
        this.h = 40;
        this.text = text;
        this.tam = 80; // Para o bloco While
        this.complemento = 0; // Para o bloco While
        this.next = null; // Ponteiro para o próximo bloco na LinkedBlocos
    }

    display() {
        // Seu código de display existente aqui...
        // É importante que ele use this.x e this.y
        //background(255);
        // Desenhar o bloco principal (retângulo com bordas arredondadas)
        if(this.text == "While"){
            fill("#F7C6D5");
            noStroke();
            rect(this.x, this.y, this.w + this.complemento, this.h, 0, 0, 0, 0); // (x, y, largura, altura, raio de bordas arredondadas)
            rect(this.x - this.x/10, this.y, this.h - 12, this.tam, 20, 0, 0, 0);
            rect(this.x - this.x/10, this.y+this.tam, this.w + this.x/10 + this.complemento, this.h/2, 0, 0, 0, 20); // (x, y, largura, altura, raio de bordas arredondadas)

            circle(this.x +this.w/5, this.y, 20);
            
            fill(255); // Cor branca do texto
            circle(this.x + this.w/5 , this.y + this.h , 20)
            circle(this.x + this.w/5 , this.y + this.tam + this.h/2 , 20)
        
        } else if(this.text === "EndWhile") {
            fill("#3E7FC1");
            rect(this.x - this.x/10, this.y, this.w + this.x/10 + this.complemento, this.h, 0, 0, 0, 20); // (x, y, largura, altura, raio de bordas arredondadas)
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
            case "While": displayText = "Repetir até que"; break;
            default: displayText = ""; // Caso tenha outros blocos
        }
        fill(255); // Cor do texto
        text(displayText, this.x + this.w / 2, this.y + this.h / 2 - 2);
    }

    isInside(px, py) {
        // Ajuste para blocos 'While' se a área clicável for diferente
        let checkWidth = this.w;
        let checkHeight = this.h;
        if (this.text === "While") {
             // Considere a área total do bloco While se necessário
             // checkWidth = this.w + this.complemento;
             // checkHeight = this.h + this.tam + this.h/2; // Aproximado
        }
        return px >= this.x && px <= this.x + checkWidth && py >= this.y && py <= this.y + checkHeight;
    }
}