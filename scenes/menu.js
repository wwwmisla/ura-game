let menu = {
    init: function () {
        this.resetCanvasState();
        this.bgImg = loadImage('assets/background/background_menu.png');

        // Configuração do logo - agora com posicionamento mais centralizado
        this.logo = {
            img: loadImage('assets/logos/ura_title_white.png'),
            x: width / 2,
            y: height * 0.3,  // 30% da altura da tela
            w: 600,
            h: 240
        };

        // Posição dos botões baseada em porcentagem da altura
        const btnYStart = height * 0.5;  // Começa a 50% da altura
        const btnSpacing = height * 0.15; // Espaçamento de 15% entre botões

        this.botoes = [
            {   // Botão Jogar
                normalImg: loadImage('assets/botoes/botoes_menu/button_jogar.png'),
                hoverImg: loadImage('assets/botoes/botoes_menu/button_jogar_sombra.png'),
                x: width / 2,
                y: btnYStart,
                w: 250,
                h: 60
            },
            {   // Botão Tutorial
                normalImg: loadImage('assets/botoes/botoes_menu/button_tutorial.png'),
                hoverImg: loadImage('assets/botoes/botoes_menu/button_tutorial_sombra.png'),
                x: width / 2,
                y: btnYStart + btnSpacing,
                w: 250,
                h: 60
            },
            {   // Botão Créditos
                normalImg: loadImage('assets/botoes/botoes_menu/button_creditos.png'),
                hoverImg: loadImage('assets/botoes/botoes_menu/button_creditos_sombra.png'),
                x: width / 2,
                y: btnYStart + btnSpacing * 2,
                w: 250,
                h: 60
            }
        ];
    },

    resetCanvasState: function () {
        drawingContext.shadowColor = 'transparent';
        drawingContext.shadowBlur = 0;
        noStroke();
    },

    draw: function () {
        // Desenha o fundo
        imageMode(CORNER);
        image(this.bgImg, 0, 0, width, height);

        // Desenha o logo
        imageMode(CENTER);
        image(this.logo.img, this.logo.x, this.logo.y, this.logo.w, this.logo.h);

        // Desenha os botões
        for (let botao of this.botoes) {
            this.desenharBotao(botao);
        }
    },

    desenharBotao: function (botao) {
        push();
        imageMode(CENTER);
        if (this.isMouseOver(botao) && botao.hoverImg) {
            image(botao.hoverImg, botao.x, botao.y, botao.w, botao.h);
        } else {
            image(botao.normalImg, botao.x, botao.y, botao.w, botao.h);
        }
        pop();
    },

    mouseClicked: function () {
        if (this.isMouseOver(this.botoes[0])) mudanca_tela(fase1);
        else if (this.isMouseOver(this.botoes[1])) mudanca_tela(instrucoes);
        else if (this.isMouseOver(this.botoes[2])) mudanca_tela(creditos);
        return true;
    },

    isMouseOver: function (botao) {
        return mouseX > botao.x - botao.w / 2 &&
            mouseX < botao.x + botao.w / 2 &&
            mouseY > botao.y - botao.h / 2 &&
            mouseY < botao.y + botao.h / 2;
    }
};