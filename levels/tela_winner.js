let tela_winner = {
    // Configurações básicas
    corFundo: [204, 229, 255],    // Azul pastel
    corPrincipal: [70, 100, 140],  // Azul escuro
    corBotao: [240, 248, 255],     // Branco gelo
    corTexto: [70, 100, 140],      // Azul escuro
    
    // Robô animado
    robot: {
        x: 0,
        y: 300,
        largura: 75,
        altura: 75,
        velocidade: 3,
        direcao: 1, // 1 = direita, -1 = esquerda
        spriteAtual: 1,
        totalSprites: 6,
        tempoAnimacao: 0
    },
    
    // Botões
    botoes: [
        { texto: "Jogar Novamente", x: 300, y: 450, largura: 200, altura: 50 },
        { texto: "Menu Principal", x: 300, y: 530, largura: 200, altura: 50 }
    ],
    
    // Imagens pré-carregadas (serão preenchidas no preload)
    spritesRobo: [],
    
    init: function() {
        // Posição inicial do robô (começa fora da tela à esquerda)
        this.robot.x = -this.robot.largura;
        this.robot.y = height / 2;
    },
    
    preload: function() {
        // Carrega os sprites do robô andando para a direita
        for (let i = 1; i <= 6; i++) {
            this.spritesRobo[i] = loadImage(`assets/urinha/urinha_andar_direita/urinha_andar_d${i+3}.png`);
        }
        
        // Carrega som de vitória
        this.somVitoria = loadSound('audio/winsound.wav');
        
        // Toca o som quando a tela é carregada
        if (this.somVitoria) {
            this.somVitoria.play();
        }
    },
    
    draw: function() {
        // Fundo azul pastel
        background(this.corFundo[0], this.corFundo[1], this.corFundo[2]);
        
        // Texto de parabéns
        this.desenharTexto();
        
        // Atualiza e desenha o robô
        this.atualizarRobo();
        this.desenharRobo();
        
        // Desenha os botões
        this.desenharBotoes();
    },
    
    desenharTexto: function() {
        fill(this.corPrincipal[0], this.corPrincipal[1], this.corPrincipal[2]);
        textSize(40);
        textAlign(CENTER, CENTER);
        text("🎉 Parabéns! 🎉", width/2, 100);
        
        textSize(24);
        text("Você encontrou o tesouro!", width/2, 160);
    },
    
    atualizarRobo: function() {
        // Move o robô
        this.robot.x += this.robot.velocidade * this.robot.direcao;
        
        // Inverte direção quando chega nas bordas
        if (this.robot.x > width) {
            this.robot.direcao = -1;
        } else if (this.robot.x < -this.robot.largura) {
            this.robot.direcao = 1;
        }
        
        // Atualiza animação (muda sprite a cada 10 frames)
        if (frameCount % 10 === 0) {
            this.robot.spriteAtual = (this.robot.spriteAtual % this.robot.totalSprites) + 1;
        }
    },
    
    desenharRobo: function() {
        // Verifica se tem sprites carregados
        if (this.spritesRobo.length > 0 && this.spritesRobo[this.robot.spriteAtual]) {
            // Se estiver indo para esquerda, inverte a imagem
            if (this.robot.direcao === -1) {
                push();
                translate(this.robot.x + this.robot.largura, this.robot.y);
                scale(-1, 1);
                image(this.spritesRobo[this.robot.spriteAtual], 0, 0, this.robot.largura, this.robot.altura);
                pop();
            } else {
                image(this.spritesRobo[this.robot.spriteAtual], this.robot.x, this.robot.y, this.robot.largura, this.robot.altura);
            }
        }
    },
    
    desenharBotoes: function() {
        for (let botao of this.botoes) {
            // Verifica se mouse está sobre o botão
            let sobreBotao = (
                mouseX > botao.x && 
                mouseX < botao.x + botao.largura && 
                mouseY > botao.y && 
                mouseY < botao.y + botao.altura
            );
            
            // Cor do botão (muda quando mouse está sobre)
            fill(
                this.corBotao[0] + (sobreBotao ? -30 : 0),
                this.corBotao[1] + (sobreBotao ? -30 : 0),
                this.corBotao[2] + (sobreBotao ? -30 : 0)
            );
            
            // Desenha retângulo do botão
            rect(botao.x, botao.y, botao.largura, botao.altura, 10);
            
            // Texto do botão
            fill(this.corTexto[0], this.corTexto[1], this.corTexto[2]);
            textSize(20);
            textAlign(CENTER, CENTER);
            text(botao.texto, botao.x + botao.largura/2, botao.y + botao.altura/2);
        }
    },
    
    mouseClicked: function() {
        for (let botao of this.botoes) {
            if (
                mouseX > botao.x && 
                mouseX < botao.x + botao.largura && 
                mouseY > botao.y && 
                mouseY < botao.y + botao.altura
            ) {
                // Para o som se estiver tocando
                if (this.somVitoria && this.somVitoria.isPlaying()) {
                    this.somVitoria.stop();
                }
                
                // Executa ação do botão
                if (botao.texto === "Jogar Novamente") {
                    mudanca_tela(fase1);
                } else if (botao.texto === "Menu Principal") {
                    mudanca_tela(menu);
                }
                
                return true; // Indica que o clique foi tratado
            }
        }
        return false; // Clique não foi em nenhum botão
    }
};