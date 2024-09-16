class Cenario {
    constructor(tamanhoBloco, numLinhas, numColunas) {
        this.tamanhoBloco = tamanhoBloco;
        this.numLinhas = numLinhas;
        this.numColunas = numColunas;
        this.grid = this.gerarGrid(); // Gera a grid com blocos aleatórios
    }

    // Função para gerar a grid com caminho (0) e obstáculos (1)
    gerarGrid() {
        let grid = [];
        for (let i = 0; i < this.numLinhas; i++) {
            let linha = [];
            for (let j = 0; j < this.numColunas; j++) {
                let tipoBloco = this.sortearTipoBloco();
                linha.push(tipoBloco);
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

    // Função que desenha o cenário na tela
    exibirCenario() {
        // Ajuste para desenhar apenas a área da grid no lado direito da tela
        let offsetX = 540; // Largura da UI à esquerda
        for (let i = 0; i < this.numLinhas; i++) {
            for (let j = 0; j < this.numColunas; j++) {
                let x = j * this.tamanhoBloco + offsetX; // Ajustar para desenhar a partir da direita
                let y = i * this.tamanhoBloco;
                let tipoBloco = this.grid[i][j];

                if (tipoBloco === 0) {
                    // Desenha o caminho
                    fill("#F6F6F6"); // Cor para o caminho
                    stroke("#3E7FC1");
                    rect(x, y, this.tamanhoBloco, this.tamanhoBloco); // Com bordas arredondadas
                } else {
                    // Desenha os obstáculos
                    fill("#F7C6D5"); // Cor para obstáculos
                    stroke("#3E7FC1");
                    rect(x, y, this.tamanhoBloco, this.tamanhoBloco); // Com bordas arredondadas
                }
            }
        }
    }

    // Função para verificar colisões com obstáculos
    verificarColisao(robot) {
        let colunaAtual = floor((robot.x - 540) / this.tamanhoBloco); // Ajuste para a área do cenário
        let linhaAtual = floor(robot.y / this.tamanhoBloco);

        // Verifica se está dentro dos limites da grid
        if (linhaAtual >= 0 && linhaAtual < this.numLinhas && colunaAtual >= 0 && colunaAtual < this.numColunas) {
            if (this.grid[linhaAtual][colunaAtual] === 1) {
                console.log("Colisão com obstáculo!");
                return true; // Colidiu com obstáculo
            }
        }
        return false; // Não colidiu
    }
}
