class Robot {
    #x;
    #y;
    constructor(x, y, size) {
        this.#x = x;
        this.#y = y;
        this.x = x;
        this.y = y;
        this.size = size;
        this.image = robotImage; // Única imagem do robô (mantido por compatibilidade)
        this.currentRotation = 0; // Armazena o ângulo de rotação atual
        this.isMoving = false;
        this.targetPosition = 0;
        this.sentido = 0; // Ângulo de direção
        this.speed = 1;
        
        // Novas propriedades para animação
        this.currentFrame = 1; // Frame atual da animação (começando em 1 conforme os arrays)
        this.frameCount = 0; // Contador para controlar a velocidade da animação
        this.isRotating = false; // Indica se está rotacionando
        this.rotationDirection = null; // Direção da rotação (clockwise ou counterclockwise)
        this.previousSentido = 0; // Guarda a direção anterior para determinar a animação de rotação
    }

    display() {
        imageMode(CENTER);
        push(); // Salva o estado atual do canvas
        translate(this.x, this.y); // Move o ponto de origem para a posição do robô
        
        // Escolhe a sprite correta baseada na direção e estado
        if (this.isRotating) {
            // Determina o tipo de rotação com base nas direções anterior e atual
            if (this.previousSentido === 0 && this.sentido === 90) {
                // Rotação de direita para baixo
                image(fase1.sprite_rotate_baixo[this.currentFrame], 0, 0, 95, 80);
            } else if (this.previousSentido === 0 && this.sentido === 270) {
                // Rotação de direita para cima
                image(fase1.sprite_rotate_cima[this.currentFrame], 0, 0, 95, 80);
            } else if (this.previousSentido === 180 && this.sentido === 90) {
                // Rotação de esquerda para baixo
                scale(-1, 1); // Espelha horizontalmente
                image(fase1.sprite_rotate_baixo[this.currentFrame], 0, 0, 95, 80);
            } else if (this.previousSentido === 180 && this.sentido === 270) {
                // Rotação de esquerda para cima
                scale(-1, 1); // Espelha horizontalmente
                image(fase1.sprite_rotate_cima[this.currentFrame], 0, 0, 95, 80);
            } else if (this.previousSentido === 90 && this.sentido === 0) {
                // Rotação de baixo para direita
                image(fase1.sprite_rotate_direita_esquerda[this.currentFrame], 0, 0, 95, 80);
            } else if (this.previousSentido === 90 && this.sentido === 180) {
                // Rotação de baixo para esquerda
                scale(-1, 1); // Espelha horizontalmente
                image(fase1.sprite_rotate_direita_esquerda[this.currentFrame], 0, 0, 95, 80);
            } else if (this.previousSentido === 270 && this.sentido === 0) {
                // Rotação de cima para direita
                image(fase1.sprite_rotate_direita_esquerda[this.currentFrame], 0, 0, 95, 80);
            } else if (this.previousSentido === 270 && this.sentido === 180) {
                // Rotação de cima para esquerda
                scale(-1, 1); // Espelha horizontalmente
                image(fase1.sprite_rotate_direita_esquerda[this.currentFrame], 0, 0, 95, 80);
            } else {
                // Rotação genérica ou não implementada - usa o sprite baseado apenas na direção
                console.error("Rotação não implementada ou não reconhecida");
                if (this.rotationDirection === "clockwise") {
                    image(fase1.sprite_rotate_baixo[this.currentFrame], 0, 0, 95, 80);
                } else {
                    image(fase1.sprite_rotate_cima[this.currentFrame], 0, 0, 95, 80);
                }
            }
        } else {
            // Animação de movimento ou parado
            if (this.sentido === 0) { // Direita
                image(fase1.sprite_andar_direita[this.currentFrame], 0, 0, 95, 80);
            } else if (this.sentido === 180 || this.sentido === -180) { // Esquerda
                // Espelha a sprite da direita horizontalmente
                scale(-1, 1);
                image(fase1.sprite_andar_direita[this.currentFrame], 0, 0, 95, 80);
            } else if (this.sentido === 90 || this.sentido === -270) { // Baixo
                image(fase1.sprite_andar_baixo[this.currentFrame], 0, 0, 95, 80);
            } else if (this.sentido === 270 || this.sentido === -90) { // Cima
                image(fase1.sprite_andar_cima[this.currentFrame], 0, 0, 95, 80);
            }
        }
        
        pop(); // Restaura o estado anterior do canvas
        
        // Atualiza o frame da animação se estiver se movendo ou rotacionando
        this.updateAnimation();
    }

    // Novo método para atualizar a animação
    updateAnimation() {
        // Só atualiza se estiver se movendo ou rotacionando
        if (this.isMoving || this.isRotating) {
            this.frameCount++;
            
            // Atualiza o frame a cada 5 contagens (ajuste conforme necessário para velocidade)
            if (this.frameCount >= 5) {
                this.frameCount = 0;
                
                // Determina o número máximo de frames com base no tipo de animação
                let maxFrames;
                if (this.isRotating) {
                    // Verificar qual tipo de rotação está sendo feita
                    if (this.previousSentido === 0 || this.previousSentido === 180 || 
                        this.sentido === 0 || this.sentido === 180) {
                        // Rotação envolvendo direita/esquerda
                        maxFrames = 3; // sprite_rotate_direita_esquerda tem 3 frames
                    } else {
                        maxFrames = 10; // sprite_rotate_cima/baixo tem 10 frames
                    }
                } else if (this.sentido === 0 || this.sentido === 180 || this.sentido === -180) {
                    maxFrames = 6; // sprite_andar_direita tem 6 frames
                } else {
                    maxFrames = 6; // sprite_andar_baixo e sprite_andar_cima têm 6 frames
                }
                
                // Avança o frame e reinicia se necessário
                this.currentFrame++;
                if (this.currentFrame > maxFrames) {
                    this.currentFrame = 1;
                    
                    // Se estiver rotacionando e completou a animação, finaliza a rotação
                    if (this.isRotating) {
                        this.isRotating = false;
                    }
                }
            }
        } else {
            // Se não estiver se movendo ou rotacionando, volta para o primeiro frame
            this.currentFrame = 1;
            this.frameCount = 0;
        }
    }

    move(reset) {
        if ((this.isMoving && this.x <= 1440-(this.size/2) && this.x <= this.targetPosition) && this.sentido == 0) {
            this.x += this.speed;
        } else if ((this.isMoving && this.x >= 540+(this.size/2) && this.x >= this.targetPosition) && (this.sentido == 180 || this.sentido == -180)) {
            this.x -= this.speed;
        } else if ((this.isMoving && this.y <= 900-(this.size/2) && this.y <= this.targetPosition) && (this.sentido == 90 || this.sentido == -270)) {
            this.y += this.speed;
        } else if ((this.isMoving && this.y >= 0+(this.size/2) && this.y >= this.targetPosition) && (this.sentido == 270 || this.sentido == -90)) {
            this.y -= this.speed;
        } else if (reset == true) {
            this.x = this.#x;
            this.y = this.#y;
            this.sentido = 0;
            this.isMoving = false;
            this.currentRotation = 0;
        } else {
            this.isMoving = false;
        }
    }

    KeyPress() {
        if (keyCode === LEFT_ARROW && this.x - this.size >= 540) {
            this.x -= this.size;
        } else if (keyCode === RIGHT_ARROW && this.x + this.size <= 1440) {
            this.x += this.size;
        } else if (keyCode === UP_ARROW && this.y - this.size >= 0) {
            this.y -= this.size;
        } else if (keyCode === DOWN_ARROW && this.y + this.size < 900) {
            this.y += this.size;
        }
    }

    moverPara(blocoCount) {
        if (blocoCount > 0) {
            console.log(blocoCount);
            if (this.sentido == 0) {
                this.targetPosition = this.x - 1 + (blocoCount * this.size);
            } else if (this.sentido == 90 || this.sentido == -270) {
                this.targetPosition = this.y - 1 + (blocoCount * this.size);
            } else if (this.sentido == 180 || this.sentido == -180) {
                this.targetPosition = this.x + 1 - (blocoCount * this.size);
            } else if (this.sentido == 270 || this.sentido == -90) {
                this.targetPosition = this.y + 1 - (blocoCount * this.size);
            }
            this.isMoving = true;
        } else {
            this.isMoving = false;
        }
    }

    rotacionar(sentido) {
        // Guarda a direção atual antes de mudar
        this.previousSentido = this.sentido;
        
        if (sentido == "clockwise") {
            this.sentido += 90;
            this.isRotating = true;
            this.rotationDirection = "clockwise";
        } else if (sentido == "counterclockwise") {
            this.sentido -= 90;
            this.isRotating = true;
            this.rotationDirection = "counterclockwise";
        }

        if (this.sentido == 360 || this.sentido == -360) {
            this.sentido = 0; // Zera o ângulo quando ele completa uma volta completa
        }
        console.log(`Rotacionando de ${this.previousSentido} para ${this.sentido}`);
    }
}
