let instrucoes = {
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

        // Define botão Voltar
        this.botaoVoltar = {
            x: width / 2,
            y: 800,
            w: 200,
            h: 50,
            texto: "Voltar"
        };

        // Carrega fonte e imagens 
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
        //background(this.corFundo);

        // Desenha o fundo
        // Aplica opacidade na imagem de fundo
        tint(220, 200); // O valor 200 define a opacidade (255 é opaco, 0 é transparente)
        imageMode(CORNER);
        image(this.backgroundImage, 0, 0, width, height);
        // Restaura a imagem para sem opacidade para outros elementos (se necessário)
        noTint();

        const margem = width * 0.15;
        let yPos = 80;

        // Exibe o emoji com a fonte padrão (para garantir que ele não quebre)
        textFont("sans-serif"); // Fonte padrão para emoji
        textSize(48);
        textAlign(CENTER, CENTER);
        text("📚", width / 2 - 180, yPos + 10);  // Exibe o emoji na posição (x, y)
        fill(this.corPrincipal);
        // Exibe o texto com a fonte personalizada
        textFont(this.fonte); // Fonte personalizada para o texto
        textSize(48);
        textAlign(CENTER, CENTER);
        text("Tutorial", width / 2, yPos);  // Coloca o texto ao lado do emoji
        yPos += 80;

        this.desenharDivisor(width / 2 - 150, yPos);

        yPos += 50;

        const instrucoesList = [
            { icon: "🖱️", text: "Arraste blocos de comando para a área de sequência" },
            { icon: "🧩", text: "Monte a ordem de movimentos do robô" },
            { icon: "🔄", text: "Use loops (While) para repetir ações" },
            { icon: "▶️", text: "Clique em EXECUTAR para testar sua solução" },
            { icon: "🎯", text: "Ajuste e repita até chegar ao tesouro!" }
        ];

        const container = {
            x: margem,
            y: yPos,
            w: width - 2 * margem,
            h: 350
        };

        fill(this.corSecundaria);
        stroke(this.corBorda);
        strokeWeight(2);
        rect(container.x, container.y, container.w, container.h, 15);

        textFont(this.fonte);
        textSize(24);
        fill(this.corPrincipal);
        textAlign(LEFT, CENTER);

        const espacamento = 60;
        const xIcone = container.x + 40;
        const xTexto = xIcone + 50;

        for (let i = 0; i < instrucoesList.length; i++) {
            const yItem = container.y + 60 + (i * espacamento);

            // Emojis com fonte padrão do sistema
            textFont("sans-serif");
            textSize(30);
            text(instrucoesList[i].icon, xIcone, yItem);

            // Texto com a fonte pixelada
            textFont(this.fonte);
            textSize(22);
            text(instrucoesList[i].text, xTexto, yItem);
        }


        yPos += container.h + 40;
        this.desenharDivisor(width / 2 - 150, yPos);
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
        const img = hover ? this.imgVoltarHover : this.imgVoltar;

        imageMode(CENTER);
        image(img, this.botaoVoltar.x, this.botaoVoltar.y, this.botaoVoltar.w, this.botaoVoltar.h);

        pop();
    },

    mouseClicked: function () {
        if (!this.botaoVoltar) return false;
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
