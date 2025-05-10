let creditos = {
    // Função de inicialização (executa uma vez quando a tela é carregada)
    init: function () {
        // Reseta configurações gráficas para evitar vazamento de estilo
        this.resetCanvasState();

        // Paleta de cores (cores em formato RGB)
        this.corFundo = color(204, 229, 255);       // Azul pastel claro para o fundo
        this.corPrincipal = color(70, 100, 140);    // Azul escuro para textos importantes
        this.corSecundaria = color(90, 120, 160);   // Azul médio para textos secundários
        this.corBorda = color(120, 150, 190);       // Azul para bordas
        this.corBotao = color(240, 248, 255, 200);  // Branco gelo semi-transparente para botões

        // Configuração do botão Voltar (posição e tamanho)
        this.botaoVoltar = {
            x: width / 2,   // Centralizado horizontalmente
            y: 800,         // Posição vertical
            w: 200,         // Largura
            h: 50,          // Altura
            texto: "Voltar" // Texto do botão
        };
    },

    // Função para resetar o estado do canvas (importante para evitar vazamento de estilo entre telas)
    resetCanvasState: function () {
        drawingContext.shadowColor = 'transparent'; // Remove sombras
        drawingContext.shadowBlur = 0;              // Remove desfoque de sombra
        noStroke();                                 // Remove contorno
        fill(255);                                  // Cor padrão de preenchimento (branco)
        textSize(12);                               // Tamanho padrão de texto
        textAlign(LEFT, TOP);                       // Alinhamento padrão de texto
        textStyle(NORMAL);                          // Estilo normal (não negrito/itálico)
    },

    // Função principal de desenho (executada continuamente)
    draw: function () {
        // Limpa e prepara o canvas
        this.resetCanvasState();
        background(this.corFundo);  // Preenche o fundo com a cor definida

        // Configurações de layout
        const margem = width * 0.15;          // Margem lateral (15% da largura)
        const larguraUtil = width - 2 * margem; // Largura útil (descontando margens)
        let yPos = 80;                        // Posição vertical inicial

        // --- CABEÇALHO PRINCIPAL ---
        fill(this.corPrincipal);              // Cor do texto
        textSize(48);                         // Tamanho grande para título
        textAlign(CENTER, CENTER);            // Centralizado
        text("📜 Créditos", width / 2, yPos); // Texto com emoji
        yPos += 90;                           // Ajusta posição para próximo elemento

        // --- CONTAINER PRINCIPAL ---
        fill(this.corBotao);                  // Cor de fundo do container
        stroke(this.corBorda);                // Cor da borda
        strokeWeight(2);                      // Espessura da borda
        // Desenha retângulo com cantos arredondados:
        rect(margem, yPos, larguraUtil, 520, 40); // (x, y, largura, altura, raio-canto)

        // --- SEÇÃO "DESENVOLVEDORES" ---
        textSize(36);                         // Tamanho para subtítulo
        fill(this.corPrincipal);              // Cor do texto
        text("👥 Equipe de Desenvolvimento:", width / 2, yPos + 50);

        // Lista de desenvolvedores (array de objetos com ícone e nome)
        const desenvolvedores = [
            { icone: "👨‍💻", nome: "André Felipe;" },
            { icone: "👨‍💻", nome: "Daniel Moura;" },
            { icone: "👩‍💻", nome: "Misla Wislaine;" },
            { icone: "👨‍💻", nome: "Victor Lucas." }
        ];

        // Configurações para a lista de nomes
        textSize(28);                         // Tamanho para nomes
        fill(this.corSecundaria);             // Cor dos nomes
        textAlign(LEFT, CENTER);              // Alinhamento à esquerda e centralizado vertical

        const xBase = width / 2 - 100;        // Posição horizontal base
        // Loop para desenhar cada desenvolvedor
        desenvolvedores.forEach((dev, i) => {
            // Desenha ícone e nome com espaçamento vertical de 60px
            text(dev.icone, xBase, yPos + 120 + i * 60);
            text(dev.nome, xBase + 50, yPos + 120 + i * 60);
        });

        // --- DIVISOR ESTILIZADO ---
        this.desenharDivisor(width / 2 - 150, yPos + 340);

        // --- DESCRIÇÃO DO PROJETO ---
        const descricao = [  // Array com as linhas de texto
            "Voluntários no projeto URA (Um Robô Por Aluno),",
            "uma iniciativa da Escola de Ciências e Tecnologia",
            "(ECT/UFRN) voltada para educação tecnológica e",
            "popularização da ciência por meio da Robótica Educacional."
        ];

        textSize(22);                         // Tamanho para descrição
        textStyle(ITALIC);                    // Texto em itálico
        fill(this.corPrincipal);              // Cor do texto
        textAlign(CENTER, TOP);               // Centralizado horizontal, alinhado ao topo

        // Desenha cada linha da descrição com espaçamento de 32px
        descricao.forEach((linha, i) => {
            text(linha, width / 2, yPos + 360 + i * 32);
        });
        textStyle(NORMAL);                    // Volta ao estilo normal

        // --- BOTÃO VOLTAR ---
        this.desenharBotao();
    },

    // Função para desenhar divisor estilizado (linha tracejada)
    desenharDivisor: function (x, y) {
        push();  // Salva as configurações atuais
        stroke(this.corBorda);      // Cor da linha
        strokeWeight(1.5);          // Espessura
        drawingContext.setLineDash([8, 4]); // Padrão de tracejado (8px preenchido, 4px vazio)
        line(x, y, x + 300, y);     // Desenha a linha
        drawingContext.setLineDash([]); // Volta ao padrão sólido
        pop();   // Restaura as configurações
    },

    // Função para desenhar o botão Voltar
    desenharBotao: function () {
        push();  // Salva as configurações atuais

        const hover = this.isMouseOver(this.botaoVoltar); // Verifica se mouse está sobre o botão
        const botao = this.botaoVoltar;

        // Estilo do botão (muda cor quando hover)
        fill(hover ? color(160, 200, 240) : this.corBotao); // Cor de fundo
        stroke(this.corBorda);      // Cor da borda
        strokeWeight(2);            // Espessura da borda
        rectMode(CENTER);           // Posiciona pelo centro
        // Desenha retângulo arredondado:
        rect(botao.x, botao.y, botao.w, botao.h, 15);

        // Texto do botão
        noStroke();                 // Sem borda
        fill(this.corPrincipal);    // Cor do texto
        textSize(24);               // Tamanho
        textAlign(CENTER, CENTER);  // Centralizado
        text(botao.texto, botao.x, botao.y);

        pop();  // Restaura as configurações
    },

    // Função chamada quando há clique do mouse
    mouseClicked: function () {
        // Verifica se clique foi no botão Voltar
        if (this.isMouseOver(this.botaoVoltar)) {
            mudanca_tela(menu);     // Muda para a tela de menu
            return true;            // Indica que o clique foi tratado
        }
        return false;               // Clique não foi em área clicável
    },

    // Função auxiliar para verificar se mouse está sobre um elemento
    isMouseOver: function (botao) {
        return mouseX > botao.x - botao.w / 2 &&    // Verifica coordenada X
            mouseX < botao.x + botao.w / 2 &&
            mouseY > botao.y - botao.h / 2 &&       // Verifica coordenada Y
            mouseY < botao.y + botao.h / 2;
    }
};