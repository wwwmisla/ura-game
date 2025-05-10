let instrucoes = {
    // Função de inicialização - configura cores e elementos
    init: function () {
        // Primeiro reseta o estado do canvas
        this.resetCanvasState();

        // Define cores usando a função color() (do p5.js)
        // Cores são armazenadas como propriedades do objeto para reutilização
        this.corFundo = color(204, 229, 255);    // Azul pastel claro para o fundo
        this.corPrincipal = color(70, 100, 140); // Azul escuro para textos importantes
        this.corSecundaria = color(90, 120, 160); // Azul médio para elementos secundários
        this.corBorda = color(120, 150, 190);    // Azul para bordas
        this.corBotao = color(240, 248, 255, 200); // Branco gelo semitransparente para botões

        // Configuração do botão Voltar como um objeto com propriedades
        this.botaoVoltar = {
            x: width / 2,   // Posição X centralizada
            y: 800,         // Posição Y fixa
            w: 200,         // Largura
            h: 50,          // Altura
            texto: "Voltar"  // Texto do botão
        };
    },

    // Função para resetar o estado gráfico do canvas
    resetCanvasState: function () {
        // Remove efeitos de sombra
        drawingContext.shadowColor = 'transparent';
        drawingContext.shadowBlur = 0;

        // Configurações padrão de desenho
        noStroke();         // Sem contorno
        fill(255);          // Preenchimento branco
        textSize(12);       // Tamanho de texto pequeno
        textAlign(LEFT, TOP); // Alinhamento de texto
        textStyle(NORMAL);  // Estilo de texto normal (não negrito/itálico)
    },

    // Função principal que desenha toda a tela de instruções
    draw: function () {
        // 1. Prepara o canvas
        this.resetCanvasState();
        background(this.corFundo); // Pinta o fundo com a cor definida

        // 2. Configurações de layout
        const margem = width * 0.15; // Margem de 15% da largura
        let yPos = 80;               // Posição Y inicial

        // 3. Desenha o cabeçalho
        fill(this.corPrincipal);     // Usa a cor principal
        textSize(48);               // Texto grande
        textAlign(CENTER, CENTER);  // Centralizado
        text("📚 Instruções", width / 2, yPos); // Texto com emoji
        yPos += 80;                 // Avança a posição Y

        // 4. Linha divisória decorativa
        this.desenharDivisor(width / 2 - 150, yPos);
        yPos += 50;

        // 5. Container das instruções
        // Lista de instruções com ícones e textos
        const instrucoesList = [
            { icon: "🖱️", text: "Arraste blocos de comando para a área de sequência" },
            { icon: "🧩", text: "Monte a ordem de movimentos do robô" },
            { icon: "🔄", text: "Use loops (While) para repetir ações" },
            { icon: "▶️", text: "Clique em EXECUTAR para testar sua solução" },
            { icon: "🎯", text: "Ajuste e repita até chegar ao tesouro!" }
        ];

        // Define as dimensões do container retangular
        const container = {
            x: margem,              // Posição X com margem
            y: yPos,                // Posição Y atual
            w: width - 2 * margem,  // Largura (largura total - margens)
            h: 350                  // Altura fixa
        };

        // Desenha o retângulo do container
        fill(this.corBotao);        // Cor de fundo do container
        stroke(this.corBorda);      // Cor da borda
        strokeWeight(2);            // Espessura da borda
        rect(container.x, container.y, container.w, container.h, 15); // Retângulo com bordas arredondadas

        // Configurações para os itens de instrução
        textSize(24);               // Tamanho do texto
        fill(this.corPrincipal);    // Cor do texto
        textAlign(LEFT, CENTER);    // Alinhamento à esquerda e centralizado vertical

        // Posicionamento dos itens
        const espacamento = 60;    // Espaço entre cada item
        const xIcone = container.x + 40; // Posição X dos ícones
        const xTexto = xIcone + 50;      // Posição X dos textos (50px depois dos ícones)

        // Loop para desenhar cada item da lista
        for (let i = 0; i < instrucoesList.length; i++) {
            const yItem = container.y + 60 + (i * espacamento); // Calcula posição Y de cada item

            // Desenha o ícone
            textSize(30);           // Tamanho maior para ícones
            text(instrucoesList[i].icon, xIcone, yItem);

            // Desenha o texto
            textSize(22);           // Tamanho menor para textos
            text(instrucoesList[i].text, xTexto, yItem);
        }

        yPos += container.h + 40;   // Ajusta posição Y após o container

        // 6. Linha divisória final
        this.desenharDivisor(width / 2 - 150, yPos);

        // 7. Desenha o botão Voltar
        this.desenharBotao();
    },

    // Função para desenhar uma linha divisória decorativa
    desenharDivisor: function (x, y) {
        push(); // Salva o estado atual do canvas

        // Configurações da linha
        stroke(this.corBorda);      // Cor da linha
        strokeWeight(1.5);          // Espessura
        drawingContext.setLineDash([8, 4]); // Linha tracejada (8px traço, 4px espaço)
        line(x, y, x + 300, y);    // Desenha a linha

        drawingContext.setLineDash([]); // Volta ao padrão (linha contínua)
        pop();  // Restaura o estado anterior do canvas
    },

    // Função para desenhar o botão Voltar
    desenharBotao: function () {
        push(); // Salva o estado atual do canvas

        // Verifica se o mouse está sobre o botão
        const hover = this.isMouseOver(this.botaoVoltar);
        const botao = this.botaoVoltar; // Referência ao botão

        // Configura o preenchimento (muda de cor no hover)
        fill(hover ? color(160, 200, 240) : this.corBotao);
        stroke(this.corBorda);      // Cor da borda
        strokeWeight(2);            // Espessura da borda
        rectMode(CENTER);           // O retângulo é desenhado a partir do centro
        rect(botao.x, botao.y, botao.w, botao.h, 15); // Retângulo arredondado

        // Configurações do texto do botão
        noStroke();                 // Sem borda no texto
        fill(this.corPrincipal);    // Cor do texto
        textSize(24);               // Tamanho
        textAlign(CENTER, CENTER);  // Centralizado
        text(botao.texto, botao.x, botao.y); // Desenha o texto

        pop();  // Restaura o estado anterior do canvas
    },

    // Função chamada quando o mouse é clicado
    mouseClicked: function () {
        // Verifica se o clique foi no botão Voltar
        if (this.isMouseOver(this.botaoVoltar)) {
            mudanca_tela(menu); // Chama função para mudar para a tela de menu
            return true;         // Indica que o clique foi tratado
        }
        return false; // Clique não foi no botão
    },

    // Função para verificar se o mouse está sobre um elemento
    isMouseOver: function (botao) {
        // Verifica se as coordenadas do mouse estão dentro dos limites do botão
        return mouseX > botao.x - botao.w / 2 &&  // À direita da borda esquerda
            mouseX < botao.x + botao.w / 2 &&  // À esquerda da borda direita
            mouseY > botao.y - botao.h / 2 &&  // Abaixo da borda superior
            mouseY < botao.y + botao.h / 2;     // Acima da borda inferior
    }
};