let fase1 = {
    cenario: null,
    robot: null,
    blocos: null,
    isDrawing: false,
    imgAvancar: null,
    imgEsquerda: null,
    imgDireita: null,
    imgExecutar: null,
    imgLimpar: null,
    bau: null,
    tela_win: null,
    win_sound: null,
    somTocando: false,
    tolerancia: [3, 12],
    eixoX: 0,
    eixoY: 0,
    whileDetected: false,
    movimento: null,
    sequenciaDeMovimentos: null,

    init: function () {
        // Tamanho dos blocos e dimensões do grid
        let tamanhoBloco = 75;
        let numLinhas = Math.floor(900 / tamanhoBloco); // ajusta para o tamanho da tela
        let numColunas = Math.floor(1440 / tamanhoBloco); // ajusta para o tamanho da tela

        // Inicializa o cenário
        this.cenario = new Cenario(tamanhoBloco, numLinhas, numColunas);

        //posição aleatória do robo
        roboX = Math.floor((Math.random() * 12)) * 75 + 35 + 540;
        roboY = Math.floor((Math.random() * 12)) * 75 + 35 - 9;
        this.robot = new Robot(roboX, roboY, 75);
        this.blocos = new blocoManager();

        this.blocoPadrao();

        this.blocos.concluirInicializacao();

        //posição aleatória do bau
        this.eixoX = Math.floor((Math.random() * 12)) * 75 + 540 + 35;
        this.eixoY = Math.floor((Math.random() * 12)) * 75 + 35;
    },

    draw: function () {
        background(255);
        this.cenario.exibirCenario(); // Desenha o cenário
        this.robot.display(); //função que exibe o robo
        image(this.bau, this.eixoX, this.eixoY, 75, 70); //exibe o bau
        this.blocos.displayblocos(); //função que exibe os blocos
        this.displayUI(); //função que exibe a interface do usuário

        if (this.isDrawing) {
            this.blocos.previewbloco(mouseX, mouseY);
        }

        if (this.robot.isMoving) {
            this.robot.move(false);
            if (this.cenario.verificarColisao(this.robot)) {
                console.log("O robô colidiu com um obstáculo!");
                this.sequenciaDeMovimentos = [];
                this.whileDetected = false;
                this.reinitialize(); // Reinicializa se houver colisão
                this.robot.move(true);
                return;
            }
        }
    },

    preload: function () {
        robotFront = loadImage('images/robot/draft1.svg'); // frente
        robotLeft = loadImage('images/robot/robot02.svg'); //esquerda
        robotRight = loadImage('images/robot/robot04.svg'); // direita
        robotBack = loadImage('images/robot/robot03.svg'); // tras
        font = loadFont('fonts/Silkscreen-Bold.ttf');

        //this.imgAvancar = loadImage('images/blocos/avancar.png');
        //this.imgEsquerda = loadImage('images/blocos/esquerda.png');
        //this.imgDireita = loadImage('images/blocos/direita.png');
       //this.imgExecutar = loadImage('images/botoes/executar.png');
        //this.imgLimpar = loadImage('images/botoes/limpar.png');
        this.bau = loadImage('images/bau.png');
        this.win_sound = loadSound('audio/winsound.wav');
    },

    mouseClicked: function () {
        this.ButtonClicks(); //verifica que botão foi clicado
    },

    mousePressed: function () {
        this.isDrawing = this.blocos.Arrastar(mouseX, mouseY); //retorna valor booleano para determinar criação de bloco provisorio;
    },

    mouseReleased: function () {
        if (this.isDrawing) {
            this.blocos.addblocoAtPosition(mouseX, mouseY);
            this.isDrawing = false;
        }
    },

    displayUI: function () {
        textSize(12);
        text(`x: ${mouseX}, y: ${mouseY}`, 400, 20);
        text(`isDrawing: ${this.isDrawing}`, 100, 20);
        //text(`tam: ${this.robot.targetPosition}`, 300, 150);
        //text(`move: ${this.robot.isMoving}`, 300, 200);

        drawButton(350, 830, 100, 50, "Executar");
        drawButton(50, 830, 100, 50, "Limpar");
    },

    ButtonClicks: function () {
        //verifica se o click foi dentro do botão limpar
        if (isClickInside(50, 830, 100, 50)) {
            this.reinitialize();
            this.whileDetected = false;
            //possivel mudança de nome para evitar confusões, o "true" não significa que o robô está se movendo e sim que está resetando a posição
            this.robot.move(true);
        }
        //verifica se o click foi dentro do botão executar
        if (isClickInside(350, 830, 100, 50)) {
            this.habilitarMovimento();
            this.somTocando = false;
        }
    },

    blocoPadrao: function () {
        this.blocos.addbloco(20, 40, 180, 40, "Avançar"); // Forward
        this.blocos.addbloco(240, 40, 180, 40, "Direita"); // Rot 90h | Girar 90° Horário
        this.blocos.addbloco(20, 140, 180, 40, "Esquerda"); // Rot 90ah | Girar 90° Anti-Horário
        this.blocos.addbloco(240, 140-20, 180, 40, "While"); // While
    },
    habilitarMovimento: function () {
        this.sequenciaDeMovimentos = this.blocos.getMovementSequence();
        this.executeMovementSequence();
    },

    executeMovementSequence: function () {
        //sequencia completa ou vazia
        if (this.sequenciaDeMovimentos.length == 0) {
            console.log(this.robot.x, this.robot.y);
            console.log(this.eixoX, this.eixoY);
            this.verificarVitoria();
            this.reinitialize();
            return;
        }
        
        
        this.movimento = this.sequenciaDeMovimentos.shift();

        //repete o movimento quando while é detectado
        if(this.whileDetected == true && this.movimento.type != "while"){
            console.log("While detected");
            this.sequenciaDeMovimentos.push(this.movimento);
            this.verificarVitoria();
        }

        //detecta o while
        if(this.movimento.type == "while"){
            this.whileDetected = true;
        }
        
        console.log(this.movimento);

        // Verifica se o robô colide com um obstáculo antes de se mover
        

        if (this.movimento.type == "move") {
            this.robot.moverPara(this.movimento.steps);
            //espera o movimento terminar para passar para o proximo
            setTimeout(() => {
                this.executeMovementSequence(this.sequenciaDeMovimentos);
            }, 1400 * this.movimento.steps); // talvez necessario ajustar o delay?
        } else if (this.movimento.type == "rotate") {
            this.robot.rotacionar(this.movimento.direction);
            //espera a rotação terminar para passsar para a proxima
            setTimeout(() => {
                this.executeMovementSequence(this.sequenciaDeMovimentos);
            }, 500); // talvez necessario ajustar o delay?
        }
        if(this.movimento.type == "while"){
            this.executeMovementSequence(this.sequenciaDeMovimentos);
        }
    },

    verificarVitoria: function () {
        if ((Math.abs(this.robot.x - this.eixoX) <= this.tolerancia[0] && Math.abs(this.robot.y - this.eixoY) <= this.tolerancia[1]) && this.robot.isMoving == false) {
            console.log("Chegou aqui");
            this.whileDetected = false;
            this.tela_vitoria();
        }
    },

    tela_vitoria: function () {
        if (!this.somTocando) {
            this.win_sound.play();
            this.somTocando = true;
        }
        mudanca_tela(tela_winner);
    },
    reinitialize: function () {
        this.sequenciaDeMovimentos = [];
        this.blocos.inicializacao = false; //para entender melhor o bloco de inicialização, ver bloco.js e o README
        this.blocos.clear();
        this.blocoPadrao();
        this.blocos.concluirInicializacao();
    }
}
