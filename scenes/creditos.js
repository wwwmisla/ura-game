let creditos = {
    fonte: null,
    imgVoltar: null,
    imgVoltarHover: null,

    init: function () {
        this.resetCanvasState();

        this.backgroundImage = loadImage("assets/background/background_menu.png");

        this.corFundo = color(7, 161, 209);
        this.corPrincipal = color(14, 84, 89);
        this.corSecundaria = color(255);
        this.corBorda = color(14, 84, 89);

        this.botaoVoltar = {
            x: width / 2,
            y: 800,
            w: 200,
            h: 50,
            texto: "Voltar",
            imagem: null
        };

        this.fonte = loadFont("fonts/Silkscreen-Bold.ttf");
        this.imgVoltar = loadImage("assets/botoes/botoes_menu/button_voltar.png");
        this.imgVoltarHover = loadImage("assets/botoes/botoes_menu/button_voltar_sombra.png");
    },

    resetCanvasState: function () {
        drawingContext.shadowColor = 'transparent';
        drawingContext.shadowBlur = 0;

        noStroke();
        fill(255);
        textSize(12);
        textAlign(LEFT, TOP);
        textStyle(NORMAL);
    },

    draw: function () {
        this.resetCanvasState();

        // Fundo com opacidade
        tint(220, 200);
        imageMode(CORNER);
        image(this.backgroundImage, 0, 0, width, height);
        noTint();

        const margem = width * 0.15;
        const larguraUtil = width - 2 * margem;
        let yPos = 80;

        // Emoji título
        textFont("sans-serif");
        textSize(48);
        textAlign(CENTER, CENTER);
        text("📜", width / 2 - 180, yPos + 12);

        // Título
        textFont(this.fonte);
        fill(this.corPrincipal);
        text("Créditos", width / 2 + 20, yPos);

        yPos += 80;

        // Container
        fill(this.corSecundaria);
        stroke(this.corBorda);
        strokeWeight(2);
        rect(margem, yPos, larguraUtil, 520, 40);

        // Emoji título
        textFont("sans-serif");
        textSize(36);
        textAlign(CENTER, CENTER);
        text("👥", width / 2 - 260, yPos + 44);

        // Subtítulo
        textSize(36);
        fill(this.corPrincipal);
        textAlign(CENTER, CENTER);
        text("Equipe de Desenvolvimento:", width / 2, yPos + 50);

        // Desenvolvedores
        const desenvolvedores = [
            { icone: "👨‍💻", nome: "André Felipe;" },
            { icone: "👨‍💻", nome: "Daniel Moura;" },
            { icone: "👩‍💻", nome: "Misla Wislaine;" },
            { icone: "👨‍💻", nome: "Victor Lucas." }
        ];

        textSize(28);
        textAlign(LEFT, CENTER);

        const xBase = width / 2 - 180;
        desenvolvedores.forEach((dev, i) => {
            textFont("sans-serif");
            text(dev.icone, xBase, yPos + 120 + i * 60);
            textFont(this.fonte);
            text(dev.nome, xBase + 50, yPos + 120 + i * 60);
        });

        // Divisor
        this.desenharDivisor(width / 2 - 150, yPos + 340);

        // Descrição
        const descricao = [
            "Voluntários no projeto URA (Um Robô Por Aluno),",
            "uma iniciativa da Escola de Ciências e Tecnologia",
            "(ECT/UFRN) voltada para educação tecnológica e",
            "popularização da ciência por meio da Robótica Educacional."
        ];

        textSize(22);
        textStyle(ITALIC);
        fill(this.corPrincipal);
        textAlign(CENTER, TOP);
        descricao.forEach((linha, i) => {
            text(linha, width / 2, yPos + 360 + i * 32);
        });
        textStyle(NORMAL);

        // Botão Voltar
        this.desenharBotao();
    },

    desenharDivisor: function (x, y) {
        push();
        stroke(this.corBorda);
        strokeWeight(1.5);
        drawingContext.setLineDash([8, 4]);
        line(x, y, x + 300, y);
        drawingContext.setLineDash([]);
        pop();
    },

    desenharBotao: function () {
        push();
        const hover = this.isMouseOver(this.botaoVoltar);
        const botao = this.botaoVoltar;

        botao.imagem = hover ? this.imgVoltarHover : this.imgVoltar;

        imageMode(CENTER);
        image(botao.imagem, botao.x, botao.y, botao.w, botao.h);
        pop();
    },

    mouseClicked: function () {
        if (this.isMouseOver(this.botaoVoltar)) {
            mudanca_tela(menu);
            return true;
        }
        return false;
    },

    isMouseOver: function (botao) {
        return mouseX > botao.x - botao.w / 2 &&
            mouseX < botao.x + botao.w / 2 &&
            mouseY > botao.y - botao.h / 2 &&
            mouseY < botao.y + botao.h / 2;
    }
};
