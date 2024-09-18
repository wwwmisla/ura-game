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
                    // Obstáculo, define qual tipo será: buraco, cone ou árvore
                    let obstaculoSorteado = this.obterObstaculoAleatorio();
                    linha.push({ tipo: obstaculoSorteado });
                }
            }
            grid.push(linha);
        }
        return grid;
    }

    // Sorteia se o bloco será caminho ou obstáculo
    sortearTipoBloco() {
        // 0 é caminho, 1 é obstáculo
        return random() < 0.8 ? 0 : 1; // 80% chance de ser caminho
    }

    // Objeto de obstáculos com diferentes tipos (buraco, cone, árvore)
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

    // Função para sortear o tipo de obstáculo (buraco, cone, árvore)
    obterObstaculoAleatorio() {
        const tiposObstaculos = ['buraco', 'cone', 'arvore'];
        const indiceAleatorio = Math.floor(Math.random() * tiposObstaculos.length);
        return tiposObstaculos[indiceAleatorio];
    }

    // Função que desenha o cenário na tela
    exibirCenario() {
        let offsetX = 540; // Largura da UI à esquerda
        for (let i = 0; i < this.numLinhas; i++) {
            for (let j = 0; j < this.numColunas; j++) {
                let x = j * this.tamanhoBloco + offsetX; // Ajustar para desenhar a partir da direita
                let y = i * this.tamanhoBloco;
                let tipoBloco = this.grid[i][j];

                if (tipoBloco === 0) {
                    // Desenha o caminho
                    fill("#FFF"); // Branco Pastel para o caminho
                    stroke("#3E7FC1"); // Azul Pastel Médio
                    strokeWeight(2);
                    rect(x, y, this.tamanhoBloco, this.tamanhoBloco);
                } else {
                    // Desenha o obstáculo armazenado
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

        // Desenha a linha divisória da UI
        stroke("#3E7FC1");
        strokeWeight(3);
        line(0, 225, 539, 225); // Continua até a borda da grid
        strokeWeight(2); // Resetar o peso da linha para o padrão
    }

    // Função para verificar colisões com obstáculos
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
