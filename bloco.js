class bloco {
    constructor(x, y, w, h, img) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.img = img;
    }

    display() {
        // Calcula o fator de escala para garantir que a imagem se ajuste
        const scaleFactor = Math.min(this.w / this.img.width, this.h / this.img.height) * 1.4;

        // Largura e altura da imagem escalada
        const imgW = this.img.width * scaleFactor;
        const imgH = this.img.height * scaleFactor;

        // Calcula a posição da imagem para centralizá-la
        const imgX = this.x + (this.w) / 2;
        const imgY = this.y + (this.h) / 2;

        // Desenha a imagem no local calculado
        image(this.img, imgX, imgY, imgW, imgH);
    }

    isInside(px, py) {
        // Verifica se o ponto (px, py) está dentro da área do botão
        return px >= this.x && px <= this.x + this.w && py >= this.y && py <= this.y + this.h;
    }
}

class blocoManager {
    constructor() {
        this.blocos = {
            "Avançar": [],
            "Direita": [],
            "Esquerda": []
        };
        this.tiposBlocos = ["Avançar", "Direita", "Esquerda"];
        this.blocoAtual = null;
        this.sequence = [];
        this.inicializacao = false;
        this.movements = [];
        this.novoX = 30;
        this.novoY = 225;
    }

    addbloco(x, y, w, h, tipo) {
        let img;
        if (tipo === "Avançar") {
            img = fase1.imgAvancar;
        } else if (tipo === "Direita") {
            img = fase1.imgDireita;
        } else if (tipo === "Esquerda") {
            img = fase1.imgEsquerda;
        }

        if (this.tiposBlocos.includes(tipo)) {
            this.blocos[tipo].push(new bloco(x, y, w, h, img));
            if (this.inicializacao) {
                this.sequence.push(tipo);
            }
        }
    }

    displayblocos() {
        for (let tipo of this.tiposBlocos) {
            for (let bloco of this.blocos[tipo]) {
                bloco.display();
            }
        }
    }

    Arrastar(x, y) {
        for (let tipo of this.tiposBlocos) {
            if (this.blocos[tipo][0] && this.blocos[tipo][0].isInside(x, y)) {
                this.blocoAtual = tipo;
                return true;
            }
        }
        return false;
    }

    previewbloco(x, y) {
        if (this.blocoAtual) {
            rect(x, y, 150, 80);
            textSize(30);
            textAlign(CENTER, CENTER);
            text(this.blocoAtual, x + 150 / 2, y + 80 / 2);
        }
    }

    addblocoAtPosition(x, y) {
        if (y > 225 && x < 540 - 150 && this.blocoAtual) {
            // Encontra a posição Y do último bloco na sequência
            if (this.sequence.length > 0) {
                let ultimoBloco = this.blocos[this.sequence[this.sequence.length - 1]];
                if (ultimoBloco.length > 0) {
                    if (ultimoBloco[ultimoBloco.length - 1].y + 80 >= 750) {
                        this.novoX += 160;
                        this.novoY = 225;
                    } else {
                        this.novoY = ultimoBloco[ultimoBloco.length - 1].y + 35; // 80 (altura do bloco) + 10 (espaço entre blocos)
                    }
                }
            }
            this.addbloco(this.novoX, this.novoY, 150, 80, this.blocoAtual);
        }
    }

    concluirInicializacao() {
        this.inicializacao = true;
    }

    clear() {
        for (let tipo of this.tiposBlocos) {
            this.blocos[tipo] = [];
        }
        this.blocoAtual = null;
        this.sequence = [];
        this.movements = [];
        this.novoX = 30;
        this.novoY = 225;
    }

    getMovementSequence() {
        this.movements = [];
        let forwardCount = 0;

        for (let action of this.sequence) {
            if (action == "Avançar") {
                forwardCount++;
            } else {
                if (forwardCount > 0) {
                    this.movements.push({ type: "move", steps: forwardCount });
                    forwardCount = 0;
                }
                this.movements.push({ type: "rotate", direction: action === "Direita" ? "clockwise" : "counterclockwise" });
            }

        }

        if (forwardCount > 0) {
            this.movements.push({ type: "move", steps: forwardCount });
        }

        return this.movements;
    }

}