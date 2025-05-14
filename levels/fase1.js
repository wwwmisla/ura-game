// Assumindo que este código está dentro de um arquivo sketch.js ou similar
// e que p5.js está sendo usado.

let fase1 = {
    cenario: null,
    robot: null,
    // blocos: null, // Substituído por blocosList e templateBlocks
    blocosList: null, // Nossa lista ligada para a sequência
    templateBlocks: [], // Array para guardar os blocos padrão (templates)

    // Variáveis de estado para arrastar/soltar
    draggingTemplateType: null, // Guarda o 'text' do template sendo arrastado
    draggingSequenceBlock: null, // Guarda a REFERÊNCIA ao bloco da sequência sendo arrastado
    offsetX: 0, // Para manter a posição relativa do mouse dentro do bloco ao arrastar
    offsetY: 0,

    // ======= assets =======
    sprite_andar_direita: [],
    sprite_andar_baixo: [],
    sprite_andar_cima: [],
    sprite_rotate_baixo: [],
    sprite_rotate_cima: [],
    sprite_rotate_direita_esquerda: [],
    sprite_idle: [],

    //textura
    textura_background: null,
    textura_lateral_background: null,


    //blocos

    blocoDireita: null,
    blocoEsquerda: null,
    blocoAvancar: null,
    blocoWhile_cima: null,
    blocoWhile_vertical: null,
    blocoWhile_horizontal: null,

    // isDrawing: false, // Substituído por draggingTemplateType !== null

    // ... (outras propriedades como img*, bau, tela_win, etc. permanecem)
    // === Variáveis das imagens dos botões ===
    imgSombratar: null,
    imgExecutarSombra: null,
    imgLimpar: null,
    imgLimparSombra: null,
    imgSair: null,
    imgSairSombra: null,
    bau: null,
    tela_win: null,
    win_sound: null,
    somTocando: false,
    tolerancia: [4, 16],
    eixoX: 0,
    eixoY: 0,
    // Propriedades relacionadas à execução (whileDetected, etc.)
    whileDetected: false,
    movimento: null,
    sequenciaDeMovimentos: null,
    whileRep: 0,
    contBlocoWhile: 0,
    quantRept: 0,

    init: function () {
        let tamanhoBloco = 75;
        let numLinhas = 12;
        let numColunas = 12;
        this.cenario = new Cenario(tamanhoBloco, numLinhas, numColunas);

        const posicaoLivre = () => { /* ... sua função posicaoLivre ... */
            let x, y;
            do {
                x = Math.floor(Math.random() * numColunas);
                y = Math.floor(Math.random() * numLinhas);
            } while (this.cenario.grid[y][x] !== 0);
            return [x * tamanhoBloco + 35 + 540, y * tamanhoBloco + 35];
        };

        let [roboX, roboY] = posicaoLivre();
        this.robot = new Robot(roboX + 2, roboY - 5, 75); // Assumindo que Robot e Cenario existem

        // --- Inicialização da Lista Ligada e Templates ---
        this.blocosList = new LinkedBlocos(); // Cria a instância da lista ligada
        this.criarBlocosPadrao();              // Cria os blocos template

        [this.eixoX, this.eixoY] = posicaoLivre();
        console.log("Fase 1 inicializada.");
    },

    // --- NOVO MÉTODO: Cria os blocos template ---
    criarBlocosPadrao: function () {
        this.templateBlocks = []; // Limpa antes de adicionar
        // Adiciona instâncias de 'bloco' ao array de templates
        // As posições (x, y) são fixas na área de templates (topo da tela)
        this.templateBlocks.push(new bloco(20, 40, "Avançar"));
        this.templateBlocks.push(new bloco(270, 40, "Direita"));
        this.templateBlocks.push(new bloco(20, 140, "Esquerda"));
        this.templateBlocks.push(new bloco(270, 120, "While"));
        console.log("Blocos padrão criados:", this.templateBlocks);
    },

    draw: function () {
        background("#fff");
        console.log("Lateral bg dimensions:",
            this.textura_lateral_background.width,
            this.textura_lateral_background.height);
        image(this.textura_lateral_background, 270, 450, 540, 900); // Desenha a textura de fundo | parametros: (imagem, x, y, largura, altura)
        this.cenario.exibirCenario(this.textura_background);
        this.robot.display();
        image(this.bau, this.eixoX, this.eixoY, 75, 70); // Use image() para p5.js

        // --- Desenhar Blocos ---
        // 1. Desenha os blocos template
        for (let i = 0; i < this.templateBlocks.length; i++) {
            this.templateBlocks[i].display();
        }

        // 2. Desenha os blocos da sequência (usando o método da lista)
        this.blocosList.display();
        imageMode(CENTER);

        // --- Desenhar Preview (Arrastando Template) ---
        if (this.draggingTemplateType !== null) {
            // Desenha uma pré-visualização simples do bloco sendo arrastado
            fill(200, 200, 200, 150); // Cor semi-transparente
            noStroke();
            // Usar as dimensões padrão do bloco
            let previewW = 180;
            let previewH = 40;
            rect(mouseX - previewW / 2, mouseY - previewH / 2, previewW, previewH, 10); // Centralizado no mouse, bordas arredondadas
            fill(0); // Cor do texto
            textAlign(CENTER, CENTER);
            textSize(24);
            text(this.draggingTemplateType, mouseX, mouseY); // Texto no centro
        }


        fill(0);
        textSize(14);
        text("MouseX: " + mouseX, 70, 20);
        text("MouseY: " + mouseY, 70, 40);

        // --- Desenhar Arrastando Bloco da Sequência ---
        // O bloco em si já será desenhado em sua posição atual pela blocosList.display().
        // Se você quiser que ele siga o mouse *durante* o arrasto, você precisaria
        // atualizar o this.draggingSequenceBlock.x e this.draggingSequenceBlock.y aqui no draw.
        if (this.draggingSequenceBlock !== null) {
            this.draggingSequenceBlock.x = mouseX - this.offsetX;
            this.draggingSequenceBlock.y = mouseY - this.offsetY;
            // Nota: Isso fará o bloco se mover visualmente. A lógica de
            // reordenar na lista só acontece no mouseReleased com realocarBlocos.
        }


        // this.blocos.drawWhileRepeat(); // Precisa ser adaptado se quiser manter
        this.displayUI();

        //mostrando as coodernadas do mouse para debug

        if (this.robot.isMoving) {
            this.robot.move(false);
            if (this.cenario.verificarColisao(this.robot)) {
                console.log("O robô colidiu com um obstáculo!");
                this.sequenciaDeMovimentos = [];
                this.whileDetected = false;
                this.reinitialize(); // Reinicializa se houver colisão
                this.robot.move(true); // Reseta posição do robô
                return;
            }
        }
    },

    preload: function () {
        // Seu código de preload existente...
        // Certifique-se que robotImage e font estão carregados
        robotImage = loadImage('assets/urinha/urinha_rotate_cima/urinha_rotate_c1.png');
        font = loadFont('fonts/Silkscreen-Bold.ttf'); // Exemplo
        this.bau = loadImage('assets/colisoes/bau_chest.png'); // Exemplo
        this.win_sound = loadSound('audio/winsound.wav'); // Exemplo
        //carregando textura
        this.textura_background = loadImage('assets/background/background_180x180.png');
        this.textura_lateral_background = loadImage('assets/background/lateral_background.png');
        //carregando sprites
        for (let i = 1; i <= 10; i++) {
            this.sprite_idle[i] = loadImage('assets/urinha/urinha_idle/urinha_idle' + i + '.png');
        }
        //serve para andar para o urinha para a direita e esquerda(espelhado)
        for (let i = 1; i <= 6; i++) {
            this.sprite_andar_direita[i] = loadImage('assets/urinha/urinha_andar_direita/urinha_andar_d' + (i + 3) + '.png');
        }
        for (let i = 1; i <= 6; i++) {
            this.sprite_andar_baixo[i] = loadImage('assets/urinha/urinha_baixo_andar(x32)/pixil-frame-' + i + '.png');
        }
        for (let i = 1; i <= 6; i++) {
            this.sprite_andar_cima[i] = loadImage('assets/urinha/urinha_cima_andar/andar_cima' + i + '.png');
        }
        for (let i = 1; i <= 10; i++) {
            this.sprite_rotate_baixo[i] = loadImage('assets/urinha/urinha_rotate_baixo/urinha_rotate_b' + i + '.png');
        }
        for (let i = 1; i <= 10; i++) {
            this.sprite_rotate_cima[i] = loadImage('assets/urinha/urinha_rotate_cima/urinha_rotate_c' + i + '.png');
        }
        //serve para rotacionar a urinha para direita e esquerda(espelhado)
        for (let i = 1; i <= 3; i++) {
            this.sprite_rotate_direita_esquerda[i] = loadImage('assets/urinha/urinha_andar_direita/urinha_andar_d' + i + '.png');
        }

        //carregando imagem dos blocos
        this.blocoDireita = loadImage('assets/botoes/botoes_comando/button_direita.png');
        this.blocoEsquerda = loadImage('assets/botoes/botoes_comando/button_esquerda.png');
        this.blocoAvancar = loadImage('assets/botoes/botoes_comando/button_frente.png');
        this.blocoWhile_cima = loadImage('assets/botoes/botoes_comando/button_repetir1.png');
        this.blocoWhile_vertical = loadImage('assets/botoes/botoes_comando/button_repetir2.png');
        this.blocoWhile_horizontal = loadImage('assets/botoes/botoes_comando/button_repetir3.png');

        // Botões de comando normais
        this.imgExecutar = loadImage('assets/botoes/botoes_comando/button_executar.png');
        this.imgExecutarSombra = loadImage('assets/botoes/botoes_comando/button_executar_sombra.png');
        this.imgLimpar = loadImage('assets/botoes/botoes_comando/button_limpar.png');
        this.imgLimparSombra = loadImage('assets/botoes/botoes_comando/button_limpar_sombra.png');
        this.imgSair = loadImage('assets/botoes/botoes_comando/button_sair.png');
        this.imgSairSombra = loadImage('assets/botoes/botoes_comando/button_sair_sombra.png');

    },

    mouseClicked: function () {
        this.ButtonClicks();
        // Adicionar lógica para clicar no bloco While para mudar repetições, se necessário
        // Ex:
        let clickedBlock = this.blocosList.SearchBloco(mouseX, mouseY);
        if (clickedBlock && clickedBlock.text === "While") {
            // Lógica para incrementar whileRep, talvez mostrar um prompt?
            clickedBlock.isInside(mouseX, mouseY);
            console.log("Clicou no bloco While!");
        }
    },

    mousePressed: function () {
        // 1. Verificar clique em Templates (os blocos padrão)
        // Aqui você pode usar o método isInside para verificar se o clique foi dentro de um template
        for (let i = 0; i < this.templateBlocks.length; i++) {
            let template = this.templateBlocks[i];
            if (template.isInside(mouseX, mouseY)) {
                this.draggingTemplateType = template.text; // Guarda o TIPO
                // Não precisa de offset aqui, pois vamos desenhar um preview genérico
                console.log("Iniciando arrasto do template:", this.draggingTemplateType);
                return; // Encontrou um template, não precisa checar a sequência
            }
        }

        // 2. Verificar clique em Blocos da Sequência
        // Só checa se não estiver arrastando um template
        if (this.draggingTemplateType === null) {
            let blocoClicado = this.blocosList.SearchBloco(mouseX, mouseY);
            if (blocoClicado !== null) {
                this.draggingSequenceBlock = blocoClicado; // Guarda a REFERÊNCIA
                if (this.draggingSequenceBlock.text === "EndWhile" || this.draggingSequenceBlock.text === "While") {
                    console.log("Clicou no bloco EndWhile, não pode arrastar.");
                    this.draggingSequenceBlock = null; // Reseta o estado
                    return; // Não faz nada se clicou no EndWhile
                }
                // Calcula o offset para o bloco não pular para o cursor
                this.offsetX = mouseX - this.draggingSequenceBlock.x;
                this.offsetY = mouseY - this.draggingSequenceBlock.y;
                console.log("Iniciando arrasto do bloco da sequência:", this.draggingSequenceBlock.text);
                // Opcional: Remover temporariamente da lista para desenhar por cima?
                // Ou apenas garantir que ele seja desenhado por último/com destaque.
                // A abordagem de atualizar x,y no draw() é mais simples.
                return;
            }
        }
    },

    mouseReleased: function () {
        // 1. Soltando um Template
        if (this.draggingTemplateType !== null) {
            if (mouseY < 220) {
                console.log("Soltou na área de templates, não faz nada.");
                this.draggingTemplateType = null; // Reseta o estado
                return; // Não faz nada se soltou na área de templates
            }
            console.log("Soltando template:", this.draggingTemplateType, "em", mouseX, mouseY);
            // Adiciona um NOVO bloco à lista na posição Y do mouse
            this.blocosList.addNovoBlocoNaPosicao(mouseX, mouseY, this.draggingTemplateType);
            this.draggingTemplateType = null; // Reseta o estado
        }
        // 2. Soltando um Bloco da Sequência
        else if (this.draggingSequenceBlock !== null) {
            console.log("Soltando bloco da sequência:", this.draggingSequenceBlock.text, "em", mouseX, mouseY);
            if (mouseY < 220) {
                console.log("Soltou na área de templates, removendo bloco da sequência.");
                // Se soltou na área de templates, remove o bloco da sequência
                this.blocosList.removeBloco(this.draggingSequenceBlock);
            }
            // Realoca o bloco existente na lista, baseado na posição do mouse
            // A função realocarBlocos vai procurar o bloco 'before' onde soltou
            // e inserir o 'draggingSequenceBlock' antes dele.
            this.blocosList.realocarBlocos(this.draggingSequenceBlock, mouseY, mouseX); // Atenção: a função original espera (bloco, my, mx)
            this.draggingSequenceBlock = null; // Reseta o estado
            this.offsetX = 0;
            this.offsetY = 0;
        }
    },

    displayUI: function () {
        const btnY = 830;
        const btnHeight = 50;
        const btnWidth = 120;

        // Posições horizontais centralizadas
        const limpar = { x: 40, y: btnY, w: btnWidth, h: btnHeight };
        const executar = { x: 200, y: btnY, w: btnWidth, h: btnHeight };
        const sair = { x: 400, y: btnY, w: btnWidth, h: btnHeight };

        // Salva o contexto gráfico atual
        push();

        // Desenha a linha vermelha acima dos botões
        stroke(162, 162, 162); // Cor das trilhas
        strokeWeight(10); // Espessura da linha
        strokeCap(PROJECT);
        noFill(); // Sem preenchimento
        // Linha de 540px de largura (mesma largura da área lateral)
        // Posicionada 10px acima dos botões (btnY - 10)
        line(0, btnY - 20, 510, btnY - 20);

        // Garante que as imagens serão desenhadas no modo CORNER
        imageMode(CORNER);

        // Desenha os botões com hover
        this.drawButton(limpar, this.imgLimpar, this.imgLimparSombra);
        this.drawButton(executar, this.imgExecutar, this.imgExecutarSombra);
        this.drawButton(sair, this.imgSair, this.imgSairSombra);

        // Restaura o contexto gráfico (incluindo imageMode)
        pop();

        // Armazena as coordenadas para uso no clique
        this.botoesUI = { limpar, executar, sair };
    },

    // Função auxiliar para desenhar botões
    drawButton: function (pos, imgNormal, imgHover) {
        if (this.isMouseOverButton(pos)) {
            image(imgHover, pos.x, pos.y, pos.w, pos.h);
        } else {
            image(imgNormal, pos.x, pos.y, pos.w, pos.h);
        }
    },

    ButtonClicks: function () {
        // Usa as mesmas coordenadas do displayUI
        const { limpar, executar, sair } = this.botoesUI || {};
        if (!limpar || !executar || !sair) return;

        // Verifica cliques com a mesma lógica que funcionava antes
        if (this.isMouseOverButton(limpar)) {
            console.log("Botão Limpar clicado");
            this.reinitialize();
            this.whileDetected = false;
            this.robot.move(true);
        }
        else if (this.isMouseOverButton(executar)) {
            console.log("Botão Executar clicado");
            this.habilitarMovimento();
            this.somTocando = false;
        }
        else if (this.isMouseOverButton(sair)) {
            console.log("Botão Sair clicado");
            mudanca_tela(menu);
        }
    },

    // Função unificada de detecção (igual na versão antiga)
    isMouseOverButton: function (botao) {
        return mouseX >= botao.x &&
            mouseX <= botao.x + botao.w &&
            mouseY >= botao.y &&
            mouseY <= botao.y + botao.h;
    },

    habilitarMovimento: function () {
        // Obtem a sequência da lista ligada
        this.sequenciaDeMovimentos = this.blocosList.getMovementSequence();
        // Você pode precisar obter contagens ou outras informações aqui também
        // [this.sequenciaDeMovimentos, this.contBlocoWhile] = this.blocosList.getMovementSequence(); // Se retornar mais dados
        this.executeMovementSequence();
    },

    executeMovementSequence: function () {
        if (!this.sequenciaDeMovimentos || this.sequenciaDeMovimentos.length === 0) {
            console.log("Sequência concluída ou vazia.");
            this.verificarVitoria();
            // Não chamar reinitialize aqui automaticamente, talvez o usuário queira ver o resultado
            return;
        }

        this.movimento = this.sequenciaDeMovimentos.shift(); // Pega o próximo movimento

        console.log("Executando:", this.movimento);

        if (this.movimento.type === "move") {
            this.robot.moverPara(this.movimento.steps); // Assumindo que Robot tem moverPara
            setTimeout(() => this.executeMovementSequence(), 1505 * this.movimento.steps); // Ajustar delay
        } else if (this.movimento.type === "rotate") {
            this.robot.rotacionar(this.movimento.direction); // Assumindo que Robot tem rotacionar
            setTimeout(() => this.executeMovementSequence(), 602); // Ajustar delay
        } else {
            console.warn("Tipo de movimento desconhecido:", this.movimento.type);
            this.executeMovementSequence(); // Pula para o próximo
        }
    },

    verificarVitoria: function () {
        // Sua lógica de verificação de vitória existente...
        console.log("Verificando vitória...");
        console.log("Robô:", this.robot.x, this.robot.y, " Baú:", this.eixoX, this.eixoY);
        if (!this.robot.isMoving && Math.abs(this.robot.x - this.eixoX) <= this.tolerancia[0] && Math.abs(this.robot.y - this.eixoY) <= this.tolerancia[1]) {
            console.log("VITÓRIA!");
            this.robot.robotSound(true);
            this.tela_vitoria();
        } else {
            console.log("Ainda não chegou ao baú.");
        }
    },

    tela_vitoria: function () {
        // Sua função tela_vitoria existente...
        if (!this.somTocando && this.win_sound) {
            this.win_sound.play();
            this.somTocando = true;
        }
        mudanca_tela(tela_winner); // Função para mudar de tela/estado
        console.log("----- PARABÉNS! VOCÊ VENCEU! -----");
        // Poderia desenhar algo na tela aqui
    },

    reinitialize: function () {
        console.log("Reinicializando fase...");
        // Limpa a sequência de blocos na lista ligada

        this.blocosList.clear();
        this.robot.move(true);
        this.robot.robotSound(true);

        // Reseta variáveis de estado da execução
        this.whileRep = 0;
        this.contBlocoWhile = 0;
        this.quantRept = 0;
        this.sequenciaDeMovimentos = [];
        this.whileDetected = false;
        this.movimento = null;
        this.somTocando = false;

        console.log("Fase reinicializada.");
    }
};