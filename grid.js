class Cenario {
    constructor(tamanhoBloco, numLinhas, numColunas) {
        this.tamanhoBloco = tamanhoBloco;
        this.numLinhas = numLinhas;
        this.numColunas = numColunas;
        this.grid = this.gerarGrid(); // Gera a grid com blocos e obstáculos fixos
    }

    // Função para gerar a grid com caminho (0) e obstáculos (objetos que contêm tipo)
    gerarGrid() {
        let grid = [];
        for (let i = 0; i < this.numLinhas; i++) {
            let linha = [];
            for (let j = 0; j < this.numColunas; j++) {
                let tipoBloco = this.sortearTipoBloco();
                if (tipoBloco === 0) {
                    linha.push(0); // Caminho
                } else {
                    let obstaculoSorteado = this.obterObstaculoAleatorio();
                    linha.push({ tipo: obstaculoSorteado }); // Obstáculo
                }
            }
            grid.push(linha);
        }
        return grid;
    }

    sortearTipoBloco() {
        return random() < 0.8 ? 0 : 1; // 80% de chance de ser caminho
    }

    // Obstáculos
    obstaculos = {
        buraco: (x, y, tamanhoBloco) => {
            fill("#4A4A4A"); // Preto Pastel para buraco
            noStroke();
            ellipse(x + tamanhoBloco / 2, y + tamanhoBloco / 2, tamanhoBloco * 0.8, tamanhoBloco * 0.8); // Buraco principal
        },
        cone: (x, y, tamanhoBloco) => {
            fill("#F3E5AB"); // Amarelo Pastel para o cone
            stroke("#4A4A4A"); // Preto Pastel para a borda do cone
            strokeWeight(2);
            triangle(
                x + tamanhoBloco / 2, y + tamanhoBloco * 0.2, // Topo do cone
                x + tamanhoBloco * 0.3, y + tamanhoBloco * 0.8, // Base esquerda
                x + tamanhoBloco * 0.7, y + tamanhoBloco * 0.8  // Base direita
            );
        },
        arvore: (x, y, tamanhoBloco) => {
            fill("#A8D5BA"); // Verde Menta Pastel para a copa
            noStroke();
            ellipse(x + tamanhoBloco / 2, y + tamanhoBloco * 0.4, tamanhoBloco * 0.6, tamanhoBloco * 0.6); // Copa da árvore
            
            fill("#4A4A4A"); // Preto Pastel para o tronco
            rect(x + tamanhoBloco * 0.4, y + tamanhoBloco * 0.6, tamanhoBloco * 0.2, tamanhoBloco * 0.4); // Tronco da árvore
        }
    };

    obterObstaculoAleatorio() {
        const tiposObstaculos = ['buraco', 'cone', 'arvore'];
        const indiceAleatorio = Math.floor(Math.random() * tiposObstaculos.length);
        return tiposObstaculos[indiceAleatorio];
    }

    exibirCenario() {
        let offsetX = 540; // Largura da UI à esquerda
        for (let i = 0; i < this.numLinhas; i++) {
            for (let j = 0; j < this.numColunas; j++) {
                let x = j * this.tamanhoBloco + offsetX; // Ajustar para desenhar a partir da direita
                let y = i * this.tamanhoBloco;
                let tipoBloco = this.grid[i][j];
    
                // Define as cores para o caminho e a borda
                let corFundo = "#e8e8e8"; // Usando o dark-30 da paleta
                let corBorda = "#f7fafc"; // Usando o dark-40 para uma borda bem sutil
    
                // Aplicando o fundo para todas as células (caminho e obstáculos)
                fill(corFundo);
                stroke(corBorda);
                strokeWeight(1); // Borda bem fina e sutil
                rect(x, y, this.tamanhoBloco, this.tamanhoBloco);
    
                if (tipoBloco !== 0) {
                    // Desenha o obstáculo sobre o fundo
                    let tipoObstaculo = tipoBloco.tipo;
                    if (tipoObstaculo === 'buraco') {
                        this.obstaculos.buraco(x, y, this.tamanhoBloco);
                    } else if (tipoObstaculo === 'cone') {
                        this.obstaculos.cone(x, y, this.tamanhoBloco);
                    } else if (tipoObstaculo === 'arvore') {
                        this.obstaculos.arvore(x, y, this.tamanhoBloco);
                    }
                }
            }
        }
    
        // Linha divisória vertical (azul)
        stroke("#3E7FC1"); // Cor azul
        strokeWeight(3); // Peso da linha maior para destacá-la
        let xInicial = offsetX; // Posição ajustada para a borda esquerda do primeiro bloco
        let yInicial = 0; // Começa no topo
        let yFinal = this.numLinhas * this.tamanhoBloco; // Vai até a última célula
        line(xInicial, yInicial, xInicial, yFinal);
    
        // Linha divisória horizontal da UI
        strokeWeight(3);
        line(0, 225, 539, 225);
    
        strokeWeight(2); // Resetar o peso da linha para o padrão
    }
    

    verificarColisao(robot) {
        let colunaAtual = floor((robot.x - 540) / this.tamanhoBloco); // Ajuste para a área do cenário
        let linhaAtual = floor(robot.y / this.tamanhoBloco);

        // Verifica se está dentro dos limites da grid
        if (linhaAtual >= 0 && linhaAtual < this.numLinhas && colunaAtual >= 0 && colunaAtual < this.numColunas) {
            if (this.grid[linhaAtual][colunaAtual] !== 0) {
                console.log("Colisão com obstáculo!");
                return true; // Colidiu com obstáculo
            }
        }
        return false; // Não colidiu
    }
}
