let fase1 = {
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

    init: function () {
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
        background("#F6F6F6");
        drawGrid();
        this.robot.display(); //função que exibe o robo
        image(this.bau, this.eixoX, this.eixoY, 75, 70); //exibe o bau
        this.blocos.displayblocos(); //função que exibe os blocos
        this.displayUI(); //função que exibe a interface do usuário

        if (this.isDrawing) {
            this.blocos.previewbloco(mouseX, mouseY);
        }

        if (this.robot.isMoving) {
            this.robot.move(false);
        }
    },

    preload: function () {
        robotFront = loadImage('images/robot/draft1.svg'); // frente
        robotLeft = loadImage('images/robot/robot02.svg'); //esquerda
        robotRight = loadImage('images/robot/robot04.svg'); // direita
        robotBack = loadImage('images/robot/robot03.svg'); // tras

        this.imgAvancar = loadImage('images/blocos/avancar.png');
        this.imgEsquerda = loadImage('images/blocos/esquerda.png');
        this.imgDireita = loadImage('images/blocos/direita.png');
        this.imgExecutar = loadImage('images/botoes/executar.png');
        this.imgLimpar = loadImage('images/botoes/limpar.png');
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
        textSize(20);
        text(`x: ${mouseX}, y: ${mouseY}`, 400, 20);
        text(`isDrawing: ${this.isDrawing}`, 100, 20);
        text(`tam: ${this.robot.targetPosition}`, 300, 150);
        text(`move: ${this.robot.isMoving}`, 300, 200);

        strokeWeight(3);
        line(0, 225, 539, 225);
        strokeWeight(2);

        drawButton(350, 830, 100, 50, "Executar");
        drawButton(50, 830, 100, 50, "Limpar");
    },

    ButtonClicks: function () {
        //verifica se o click foi dentro do botão limpar
        if (isClickInside(50, 830, 100, 50)) {
            this.reinitialize();
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
        this.blocos.addbloco(20, 30, 150, 80, "Avançar"); // Forward
        this.blocos.addbloco(210, 30, 150, 80, "Direita"); // Rot 90h | Girar 90° Horário
        this.blocos.addbloco(20, 130, 150, 80, "Esquerda"); // Rot 90ah | Girar 90° Anti-Horário
    },
    habilitarMovimento: function () {
        let sequenciaDeMovimentos = this.blocos.getMovementSequence();
        this.executeMovementSequence(sequenciaDeMovimentos);
    },

    executeMovementSequence: function (sequenciaDeMovimentos) {
        //sequencia completa ou vazia
        if (sequenciaDeMovimentos.length == 0) {
            console.log(this.robot.x, this.robot.y);
            console.log(this.eixoX, this.eixoY);
            this.verificarVitoria();
            this.reinitialize();
            return;
        }

        let movimento = sequenciaDeMovimentos.shift();
        console.log(movimento);
        if (movimento.type == "move") {
            this.robot.moverPara(movimento.steps);
            //espera o movimento terminar para passar para o proximo
            setTimeout(() => {
                this.executeMovementSequence(sequenciaDeMovimentos);
            }, 1400 * movimento.steps); // talvez necessario ajustar o delay?
        } else if (movimento.type == "rotate") {
            this.robot.rotacionar(movimento.direction);
            //espera a rotação terminar para passsar para a proxima
            setTimeout(() => {
                this.executeMovementSequence(sequenciaDeMovimentos);
            }, 500); // talvez necessario ajustar o delay?
        }
    },

    verificarVitoria: function () {
        if ((Math.abs(this.robot.x - this.eixoX) <= this.tolerancia[0] && Math.abs(this.robot.y - this.eixoY) <= this.tolerancia[1]) && this.robot.isMoving == false) {
            console.log("Chegou aqui");
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
        this.blocos.inicializacao = false; //para entender melhor o bloco de inicialização, ver bloco.js e o README
        this.blocos.clear();
        this.blocoPadrao();
        this.blocos.concluirInicializacao();
    }
}
