let menu = {
    /**
     * Inicializa o menu com configurações padrão
     * - Define cores do esquema visual
     * - Carrega elementos gráficos
     * - Configura botões do menu
     */
    init: function () {
        // Reseta o estado gráfico para garantir consistência
        this.resetCanvasState();

        // Paleta de cores (azul pastel como tema principal)
        this.corFundo = color(204, 229, 255);    // Fundo azul claro
        this.corPrincipal = color(70, 100, 140);  // Textos principais
        this.corBotaoNormal = color(240, 248, 255, 200); // Botões - estado normal
        this.corBotaoHover = color(180, 210, 255);       // Botões - mouse sobre
        this.corTexto = color(70, 100, 140);     // Cor do texto dos botões
        this.corBorda = color(120, 150, 190);    // Bordas dos elementos

        // Configuração do logo
        this.logo = {
            img: loadImage('assets/menu/logo.png'), // Carrega imagem
            x: width / 2,   // Centralizado horizontalmente
            y: 150,         // Posição vertical fixa
            w: 600,         // Largura da imagem
            h: 240          // Altura da imagem
        };

        // Array de botões do menu
        this.botoes = [
            {   // Botão Jogar
                texto: "Jogar",
                icone: "🎮",  // Emoji de controle
                x: width / 2, // Centralizado
                y: 400,       // Posição vertical
                w: 250,       // Largura
                h: 60         // Altura
            },
            {   // Botão Instruções
                texto: "Instruções",
                icone: "📚",  // Emoji de livros
                x: width / 2,
                y: 500,
                w: 300,       // Ligeiramente mais largo
                h: 60
            },
            {   // Botão Créditos
                texto: "Créditos",
                icone: "👥",  // Emoji de pessoas
                x: width / 2,
                y: 600,
                w: 250,
                h: 60
            }
        ];
    },

    /**
     * Reseta o estado do canvas para configurações padrão
     * - Remove efeitos especiais
     * - Define valores padrão para desenho
     */
    resetCanvasState: function () {
        drawingContext.shadowColor = 'transparent'; // Sem sombra
        drawingContext.shadowBlur = 0;             // Sem blur
        noStroke();              // Sem contorno
        fill(255);               // Preenchimento branco
        textSize(12);            // Tamanho de texto pequeno
        textAlign(LEFT, TOP);    // Alinhamento padrão
        textStyle(NORMAL);       // Estilo normal (não negrito)
    },

    /**
     * Função principal de desenho do menu
     * - Chamada repetidamente para renderizar a tela
     */
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

        // 3. Desenha todos os botões em loop
        for (let botao of this.botoes) {
            this.desenharBotao(botao);
        }
    },

    /**
     * Desenha um botão individual com ícone e texto
     * @param {Object} botao - Objeto contendo configurações do botão
     */
    desenharBotao: function (botao) {
        push(); // Salva o estado atual de configuração gráfica

        // Verifica se mouse está sobre o botão (para efeito hover)
        const hover = this.isMouseOver(botao);

        // Configura estilo do retângulo do botão
        fill(hover ? this.corBotaoHover : this.corBotaoNormal); // Cor muda no hover
        stroke(this.corBorda);  // Cor da borda
        strokeWeight(2);        // Espessura da borda
        rectMode(CENTER);       // Coordenadas do centro do retângulo
        rect(
            botao.x,           // Posição X
            botao.y,           // Posição Y
            botao.w,           // Largura
            botao.h,           // Altura
            20                 // Borda arredondada (raio)
        );

        // Configura estilo do texto/ícone
        noStroke();            // Sem borda no texto
        fill(this.corTexto);   // Cor do texto
        textSize(30);          // Tamanho do texto
        textAlign(CENTER, CENTER); // Centralizado

        // Posiciona ícone à esquerda do texto
        const espacoIcone = 30; // Espaço entre ícone e texto
        text(
            botao.icone,                  // Emoji do ícone
            botao.x - botao.w / 4,        // Posição X (esquerda do centro)
            botao.y                       // Mesma posição Y
        );
        text(
            botao.texto,                  // Texto do botão
            botao.x + espacoIcone / 2,    // Posição X (direita do ícone)
            botao.y                       // Mesma posição Y
        );

        pop(); // Restaura configurações gráficas anteriores
    },

    /**
     * Trata cliques do mouse na tela
     * @returns {boolean} True se o clique foi tratado
     */
    mouseClicked: function () {
        // Verifica qual botão foi clicado e muda de tela
        if (this.isMouseOver(this.botoes[0])) {      // Botão Jogar
            mudanca_tela(fase1);                    // Muda para tela de jogo
        }
        else if (this.isMouseOver(this.botoes[1])) { // Botão Instruções
            mudanca_tela(instrucoes);               // Muda para tela de instruções
        }
        else if (this.isMouseOver(this.botoes[2])) { // Botão Créditos
            mudanca_tela(creditos);                 // Muda para tela de créditos
        }
        return true; // Indica que o clique foi tratado
    },

    /**
     * Verifica se o mouse está sobre um botão
     * @param {Object} botao - Objeto do botão a verificar
     * @returns {boolean} True se mouse está sobre o botão
     */
    isMouseOver: function (botao) {
        // Calcula limites do botão (considerando rectMode CENTER)
        return mouseX > botao.x - botao.w / 2 &&  // À direita da borda esquerda
            mouseX < botao.x + botao.w / 2 &&  // À esquerda da borda direita
            mouseY > botao.y - botao.h / 2 &&  // Abaixo do topo
            mouseY < botao.y + botao.h / 2;    // Acima da base
    }
};