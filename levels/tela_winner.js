let tela_winner = {

    // Função de inicialização
    init: function () {
        // Reseta o estado gráfico para garantir consistência
        this.resetCanvasState();
        this.funcione = true;
        // Paleta de cores (azul pastel como tema principal)
        this.corFundo = color(204, 229, 255);    // Fundo azul claro
        this.corPrincipal = color(70, 100, 140);  // Textos principais
        this.corBotaoNormal = color(240, 248, 255, 200); // Botões - estado normal
        this.corBotaoHover = color(100, 150, 255);       // Botões - mouse sobre
        this.corTexto = color(70, 100, 140);     // Cor do texto dos botões
        this.corBorda = color(120, 150, 190);    // Bordas dos elementos

        // Configuração do logo
        this.logo = {
            img: loadImage('assets/logos/ura_title.png'), // Carrega imagem
            x: width / 2,   // Centralizado horizontalmente
            y: 150,         // Posição vertical fixa
            w: 600,         // Largura da imagem
            h: 240          // Altura da imagem
        };
        this.sequenciaDeMovimentos = [
            { type: "rotate", direction: "counterclockwise" },
            { type: "move", steps: 17 },

            { type: "rotate", direction: "clockwise" },

            { type: "move", steps: 3 },
            { type: "rotate", direction: "clockwise" },
            { type: "move", steps: 17 },
            { type: "rotate", direction: "clockwise" },
            { type: "move", steps: 3 },
            { type: "rotate", direction: "clockwise" },
            { type: "rotate", direction: "clockwise" }

        ]
        this.copia = this.sequenciaDeMovimentos.slice();
        this.robot = new Robot(50, 450, 75); // Assumindo que Robot e Cenario existem
        this.robot.telawin = true;
        this.robot.speed = 5;


    },

    // Função para desenhar a tela
    draw: function () {
        // 1. Desenha o fundo com a cor definida
        background(this.corFundo);

        // 2. Configura e desenha o logo centralizado
        imageMode(CENTER); // Imagem ancorada no centro
        image(
            this.logo.img,
            this.logo.x,
            this.logo.y,
            this.logo.w,
            this.logo.h
        );

        textSize(50);
        textAlign(CENTER, CENTER);
        text('Parabéns, você chegou ao tesouro!', width / 2, 400);
        this.robot.display();
        if (this.funcione) {
            this.executeMovementSequence();
            this.funcione = false; // Desabilita a execução automática após o primeiro movimento
        }

        if (this.robot.isMoving) {
            this.robot.move(false);
        }

        // Desenhar os botões diretamente no canvas
        textSize(20);
        this.drawButton(1150, 830, 100, 60, "MENU");
        this.drawButton(100, 830, 300, 60, "JOGAR NOVAMENTE");
    },

    // Função para desenhar um botão
    drawButton: function (x, y, w, h, label) {
        let isHover = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;

        fill(isHover ? this.corBotaoHover : this.corBotaoNormal);
        stroke(this.corBorda);
        rect(x, y, w, h, 10); // Desenha o botão com borda arredondada

        fill(this.corTexto);
        textSize(20);
        textAlign(CENTER, CENTER);
        text(label, x + w / 2, y + h / 2);

    },

    // Função de clique do mouse
    mouseClicked: function () {
        this.ButtonClicks();
    },

    // Função para detectar clique nos botões
    ButtonClicks: function () {
        if (this.isClickInside(1150, 830, 100, 60)) {
            mudanca_tela(menu);
        } else if (this.isClickInside(100, 830, 300, 60)) {
            mudanca_tela(fase1);
        }
    },

    // Função para verificar se o clique está dentro da área do botão
    isClickInside: function (x, y, w, h) {
        return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
    },

    executeMovementSequence: function () {
        if (!this.sequenciaDeMovimentos || this.sequenciaDeMovimentos.length === 0) {
            this.sequenciaDeMovimentos = this.copia.slice();
            this.funcione = true; // Reinicia a sequência
            // Não chamar reinitialize aqui automaticamente, talvez o usuário queira ver o resultado
            return;
        }

        this.movimento = this.sequenciaDeMovimentos.shift(); // Pega o próximo movimento

        console.log("Executando:", this.movimento);

        if (this.movimento.type === "move") {
            this.robot.moverPara(this.movimento.steps); // Assumindo que Robot tem moverPara
            setTimeout(() => this.executeMovementSequence(), 1505 * this.movimento.steps * (1 / 4)); // Ajustar delay
        } else if (this.movimento.type === "rotate") {
            this.robot.rotacionar(this.movimento.direction); // Assumindo que Robot tem rotacionar
            setTimeout(() => this.executeMovementSequence(), 602 * (1 / 4)); // Ajustar delay
        } else {
            console.warn("Tipo de movimento desconhecido:", this.movimento.type);
            this.executeMovementSequence(); // Pula para o próximo
        }
    },

    // Função para resetar o estado gráfico (se necessário)
    resetCanvasState: function () {
        // Aqui você pode adicionar funções para limpar ou resetar o canvas, se necessário.
        clear();
    }
}