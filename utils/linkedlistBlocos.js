// File: linkedlistBlocos.js

class LinkedBlocos {
    constructor() {
        this.head = null;
        this.initialX = 30; // Posição X padrão para blocos na sequência
            // initialY não é mais tão relevante aqui, pois a posição Y
            // será determinada pela inserção ou realocação.
        this.size = 0;
    }

    // --- MÉTODO NOVO: Limpar a lista ---
    /**
     * @description Remove todos os blocos da lista ligada.
     * Define a cabeça como null e o tamanho como 0.
     */
    clear() {
        this.head = null;
        this.size = 0;
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
            // Poderíamos adicionar a lógica de desenhar conectores aqui se necessário,
            // iterando pela lista e desenhando linhas/círculos entre current e current.next.
            // Exemplo simples de conector (ajustar coordenadas e estilo):
            /*
            if (current.next !== null) {
                stroke(0); // Cor do conector
                strokeWeight(2);
                line(current.x + current.w / 2, current.y + current.h,
                     current.next.x + current.next.w / 2, current.next.y);
                noStroke();
            }
            */
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
    addNovoBlocoNaPosicao(mouseY, text) {

        // 2. Cria o novo bloco (posição Y será ajustada)
        // Usamos uma Y temporária (pode ser mouseY ou 0) pois será recalculada.
        const newBloco = new bloco(this.initialX, 0, text);

        // 3. Encontra a posição de inserção
        let current = this.head;
        let prev = null;

        // Percorre a lista até encontrar um bloco cuja posição Y seja MAIOR que mouseY
        // ou até o final da lista.
        //tambem precisamos verificar se o mouse esta na segunda coluna, que vai ocorrer quando estiver cheio de blocos na primeira coluna
        
        while (current !== null && current.y + current.h / 2 < mouseY) {
             // Usamos o centro do bloco (y + h/2) para uma melhor sensação de "encaixe"
            prev = current;
            current = current.next;
        }

        // 4. Insere o bloco na lista
        if (prev === null) {
            // Inserir no início da lista
            newBloco.next = this.head;
            this.head = newBloco;
        } else {
            // Inserir após 'prev'
            newBloco.next = prev.next;
            prev.next = newBloco;
        }
        this.size++;

        // 5. Atualiza as posições Y a partir do bloco inserido
        // Define a posição Y inicial do novo bloco com base no anterior ou no início
        newBloco.y = (prev === null) ? 250 : prev.y + prev.h; // 250 é um valor inicial para o primeiro bloco
        this.updateSubsequentPositions(this.head);

        console.log(`Bloco "${text}" adicionado.`);
    }

    /**
     * @description Atualiza as posições Y dos blocos subsequentes a partir de startBloco.
     * Garante que os blocos fiquem um abaixo do outro sem sobreposição.
     * @param {startBloco} startBloco - O bloco a partir do qual as posições serão atualizadas.
     */
    updateSubsequentPositions(startBloco) {
        let current = startBloco;
        while (current !== null && current.next !== null) {
            //verifica se os blocos ultrapassam o limite da tela
            //se sim, uma nova coluna é criada
            console.log("Current y + h "+ (current.y + current.h));
            if (current.y + current.h > 700){
                console.log("Criando nova coluna");
                current.next.x = this.initialX + 200; // Cria nova coluna
                current.next.y = 250; // Reinicia a posição Y na nova coluna
            } else {
                current.next.y = current.y + current.h; // Mantém a posição Y ajustada
                current.next.x = current.x;
            }
            
            current = current.next;
        }
    }

    // --- Métodos existentes (SearchBloco, removeBloco, realocarBlocos, _collectYs, _applyYs) ---
    // Mantidos como estão no seu código original, pois lidam com
    // a busca, remoção e REORDENAÇÃO de blocos JÁ EXISTENTES na lista.

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

        //aaaaa
        //bbbb
        //cccc

         //--- Alternativa: Fazer os blocos se ajustarem verticalmente ---
         //Em vez de _applyYs(ys), você poderia recalcular todas as posições:
         if (this.head) {
            this.head.x = this.initialX; // Define a posição X inicial
            this.head.y = 250; // Define a posição do primeiro
            this.updateSubsequentPositions(this.head); // Ajusta os seguintes
         }
        // Escolha o comportamento que preferir!
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

    // --- Método para obter a sequência de movimentos (Adaptar do antigo blocoManager) ---
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

