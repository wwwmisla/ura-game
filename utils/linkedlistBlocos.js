// File: linkedlistBlocos.js

class LinkedBlocos {
    constructor() {
        this.head = null;
        this.initialX = 30; // Posição X padrão para blocos na sequência
        this.size = 0; // Tamanho da lista ligada
        this.hasMultipleColumns = false; // Flag para indicar se há múltiplas colunas
    }

    // --- MÉTODO NOVO: Limpar a lista ---
    /**
     * @description Remove todos os blocos da lista ligada.
     * Define a cabeça como null e o tamanho como 0.
     */
    clear() {
        this.head = null;
        this.size = 0;
        this.hasMultipleColumns = false; // Reseta a flag de múltiplas colunas
        console.log("Lista de blocos limpa.");
    }

    // --- MÉTODO NOVO: Desenhar todos os blocos da lista ---
    /**
     * @description Percorre a lista ligada e chama o método display() de cada bloco.
     */
    display() {
        let current = this.head;
        while (current !== null) {
            current.display();
            current = current.next;
        }
    }
    // --- MÉTODO NOVO/ADAPTADO: Adicionar um NOVO bloco baseado na posição do mouse ---
    /**
     * @description Adiciona um NOVO bloco com o texto especificado na posição Y mais próxima
     * de onde o mouse foi solto (mouseY), mantendo o X fixo (initialX).
     * Insere o bloco na posição correta e atualiza as posições dos blocos subsequentes.
     * @param {number} mouseY - A coordenada Y onde o mouse foi solto.
     * @param {string} text - O texto (tipo) do bloco a ser adicionado.
     */
    addNovoBlocoNaPosicao(mouseX, mouseY, text) {
        // Verifica se já existem múltiplas colunas
        const multipleColumns = this.hasMultipleColumns

        // Define a coluna alvo (targetX) com base em mouseX apenas se múltiplas colunas existirem
        let targetX = this.initialX;
        if (multipleColumns && mouseX > this.initialX + 100) { // 100 é a metade da largura entre colunas
            targetX = this.initialX + 200; // Assume que a segunda coluna está a 200 unidades
        }

        // Cria o novo bloco
        const newBloco = new bloco(targetX, 0, text);

        // Encontra a posição de inserção na coluna alvo
        let current = this.head;
        let prev = null;

        while (current !== null && (current.x !== targetX || current.y + current.h / 2 < mouseY)) {
            prev = current;
            current = current.next;
        }

        // Insere o bloco na lista
        if (prev === null) {
            newBloco.next = this.head;
            this.head = newBloco;
        } else {
            newBloco.next = prev.next;
            prev.next = newBloco;
        }
        this.size++;

        if(text == "While"){
            this.addNovoBlocoNaPosicao(mouseX, mouseY+50, "EndWhile");
        }

        // Define a posição Y do novo bloco
        newBloco.y = (prev === null || prev.x !== targetX) ? 250 : prev.y + prev.h;
        this.updateSubsequentPositions(this.head);

        console.log(`Bloco "${text}" adicionado.`);
    }

    // Função auxiliar para calcular a altura total de um grupo While
    getWhileGroupHeight(startBloco) {
        let current = startBloco;
        let height = 0;
        let whileCount = 0;
        while (current !== null) {
            if (current.text === "While") {
                whileCount++;
            } else if (current.text === "EndWhile") {
                whileCount--;
                if (whileCount === 0) {
                    height += current.h;
                    break;
                }
            }
            height += current.h;
            current = current.next;
        }
        return height;
    }

    //logica para verificar os blocos que estão entre o while e o endwhile
    verificarBlocosWhile(){
        let current = this.head;
        let contadorWhile = 0;
        let whileBloco = null;

        while (current !== null) {
            if (current.text === "While") {
                contadorWhile++;
                whileBloco = current;
                whileBloco.tam = 80;
            } else if (current.text === "EndWhile" && contadorWhile > 0) {
                current.h = 20;
                return;
            } else  if (contadorWhile > 0) {
                console.log("Bloco entre While e EndWhile encontrado:", current.text);
                if (contadorWhile > 1) {
                    whileBloco.tam += 40;
                }
                contadorWhile++;
            }
            current = current.next;
        }

    
    }

    /**
     * @description Atualiza as posições Y dos blocos subsequentes a partir de startBloco.
     * Garante que os blocos fiquem um abaixo do outro sem sobreposição.
     * @param {startBloco} startBloco - O bloco a partir do qual as posições serão atualizadas.
     */
    updateSubsequentPositions(startBloco) {
        let current = startBloco;
        while (current !== null && current.next !== null) {
            let nextY = current.y + current.h;
            let nextX = current.x;

            if (current.text === "While") {
                if (current.next.text === "EndWhile") {
                    nextY = current.y + current.tam;
                }
            }

            if (current.next.text === "While") {
                let groupHeight = this.getWhileGroupHeight(current.next);
                if (nextY + groupHeight > 700) {
                    console.log("Movendo grupo While para nova coluna");
                    this.hasMultipleColumns = true;
                    nextX = this.initialX + 230;
                    nextY = 250;
                }
            } else {
                if (nextY + current.next.h > 700) {
                    console.log("Criando nova coluna para bloco individual");
                    this.hasMultipleColumns = true;
                    nextX = this.initialX + 230;
                    nextY = 250;
                }
            }

            current.next.x = nextX;
            current.next.y = nextY;

            if (current.next.text === "While") {
                let whileCurrent = current.next;
                let internalY = whileCurrent.y + whileCurrent.h;
                while (whileCurrent !== null && whileCurrent.text !== "EndWhile") {
                    whileCurrent = whileCurrent.next;
                    if (whileCurrent) {
                        whileCurrent.x = nextX;
                        whileCurrent.y = internalY;
                        internalY += whileCurrent.h;
                    }
                }
                if (whileCurrent && whileCurrent.text === "EndWhile") {
                    whileCurrent.x = nextX;
                    whileCurrent.y = internalY;
                }
            }
            this.verificarBlocosWhile();
            current = current.next;
        }
        
    }

    // bbbyyy
    // lllllllllll

    /**
     * @description Busca um bloco na lista ligada que contém as coordenadas (x, y).
     * @param {bloco} blocoASerIgnorado - Bloco a ser ignorado na busca.
     */

    SearchBloco(x, y, blocoASerIgnorado) {
        let current = this.head;
        while (current !== null) {
            // Só verifica a colisão se 'current' NÃO FOR o 'blocoASerIgnorado'
            if (current !== blocoASerIgnorado) {
                if (current.x <= x && x <= current.x + current.w && current.y <= y && y <= current.y + current.h) {
                    return current; // Encontrou um bloco de destino válido
                }
            }
            current = current.next;
        }
        return null;
    }

    /**
     * @description Remove um bloco da lista ligada.
     * @param {bloco} bloco - O bloco a ser removido. 
     */

    removeBloco(bloco) {
        console.log("Removendo bloco:", bloco.text);
        if (!bloco || !this.head) return;

        

        if (this.head === bloco) {
            this.head = this.head.next;
        } else {
            let current = this.head;
            while (current.next !== null && current.next !== bloco) {
                current = current.next;
            }
            if (current.next === bloco) {
                current.next = current.next.next;
            } else {
                return; // Bloco não encontrado
            }
        }
        this.size--;
        if (this.head) {
            this.head.y = 250; // Define a posição do primeiro
            this.updateSubsequentPositions(this.head); // Ajusta os seguintes
        }
        
    }
    // --- Método para realocar blocos na lista ligada ---
    /** 
     * @description Realoca um bloco na lista ligada, mantendo a ordem correta.
     * @param {bloco} bloco - O bloco a ser realocado.
     * @param {number} my - A coordenada Y onde o bloco foi solto.
     * @param {number} mx - A coordenada X onde o bloco foi solto.
     * @var {bloco} before - a referencia do bloco a qual queremos colocar o novo bloco no local do qual o bloco será inserido.
    */
    realocarBlocos(bloco, my, mx) {

        if (!bloco || !this.head) return;

        const before = this.SearchBloco(mx, my, bloco);

        if (bloco === before) return; // Soltou sobre si mesmo

        // Remove 'bloco' da lista (lógica similar a removeBloco, mas sem aplicar Ys ainda)
        let prevMove = null;
        let cur = this.head;
        while (cur && cur !== bloco) {
            prevMove = cur;
            cur = cur.next;
        }
        if (!cur) return; // Bloco não estava na lista? Improvável se veio de SearchBloco.

        if (prevMove) {
            prevMove.next = bloco.next;
        } else {
            this.head = bloco.next; // Era o head
        }

        // Encontra onde inserir 'bloco' (antes de 'before')
        let prevBefore = null;
        cur = this.head;
        while (cur && cur !== before) {
            prevBefore = cur;
            cur = cur.next;
        }
        // Nota: Se 'before' for null, precisa inserir no fim.

        // Insere 'bloco'
        if (!before) { // Inserir no fim
            if (!this.head) { // Lista ficou vazia após remover?
                this.head = bloco;
                bloco.next = null;
            } else {
                // Encontra o último nó atual
                 let last = this.head;
                 while (last.next) last = last.next;
                 last.next = bloco; // Adiciona no fim
                 bloco.next = null;
            }
            
        } else if (!prevBefore) { // Inserir no início (before era o head)
            bloco.next = this.head;
            this.head = bloco;
        } else { // Inserir no meio (entre prevBefore e before.next)
            if(before.y > bloco.y){
                bloco.next = before.next
                before.next = bloco;
            } else {
                bloco.next = before;
                prevBefore.next = bloco;
            }

        }

        //atualiza a lista para manter a ordem correta de visualização
         if (this.head) {
            this.head.x = this.initialX; // Define a posição X inicial
            this.head.y = 250; // Define a posição do primeiro
            this.updateSubsequentPositions(this.head); // Ajusta os seguintes
         }
    }


     // --- Método GET (Opcional, mas pode ser útil) ---
    /**
     * @description Retorna o bloco em um índice específico (0-based).
     * Útil se precisar acessar um bloco pela sua ordem na sequência.
     * @param {number} index - O índice do bloco desejado.
     * @returns {bloco|null} O bloco encontrado ou null se o índice for inválido.
     */
    getBlocoByIndex(index) {
        if (index < 0 || index >= this.size) {
            return null; // Índice fora dos limites
        }
        let current = this.head;
        for (let i = 0; i < index; i++) {
            if (current === null) return null; // Segurança extra
            current = current.next;
        }
        return current;
    }


    // --- Método para obter a sequência de movimentos ---
    /**
     * @description Percorre a lista ligada e gera a sequência de movimentos para o robô.
     * @returns {Array} Uma lista de objetos representando os movimentos.
     * Ex: [{type: "move", steps: 1}, {type: "rotate", direction: "clockwise"}]
     */
    getMovementSequence() {
        const movements = [];
        let current = this.head;
        // Adapte esta lógica baseada na sua implementação anterior em blocoManager.getMovementSequence
        // A ideia é iterar pela lista ligada em vez do array 'sequence'.
        while (current !== null) {
            let tipo = current.text; // Usar o texto do bloco atual

            if (tipo === "While") {
                movements.push({ type: "while", whiletrue: "enquanto" }); // Adapte conforme necessário
                 // Precisará de lógica adicional para contar blocos dentro do while se isso for relevante
            } else if (tipo === "Avançar") {
                movements.push({ type: "move", steps: 1 });
            } else if (tipo === "Direita") {
                movements.push({ type: "rotate", direction: "clockwise" });
            } else if (tipo === "Esquerda") {
                movements.push({ type: "rotate", direction: "counterclockwise" });
            }
            // Adicione outros tipos de blocos se houver

            current = current.next;
        }
        console.log("Sequência de movimentos gerada:", movements);
        // Você pode precisar retornar informações adicionais, como a contagem de blocos 'While',
        // se a sua lógica de execução depender disso.
        // return [movements, contadorWhile]; // Exemplo
        return movements;
    }
}

