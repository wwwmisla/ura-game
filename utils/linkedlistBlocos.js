// File: linkedlistBlocos.js
// essa linkedlist ira armazenar os blocos que o usuario arrasta para a tela, e ira ser usada para executar os movimentos do robo
// ou seja cada no dessa linkedlist ira ser um bloco, e cada bloco ira ter um ponteiro para o proximo bloco
// essa é um linkedlist simples, onde cada bloco tem um ponteiro para o proximo bloco, e o primeiro bloco é o head, não tem tail



class LinkedBlocos {
    constructor() {
        this.head = null;
        this.initialX = 30;
        this.initialY = 250;
        this.size = 0;
    }

    addBlocoAtPosition(x, y, text) {
        // Verificação do limite superior antes de qualquer coisa
        if (y < 225) {
            console.log("Posição y fora do limite superior (y < 225). Bloco não adicionado.");
            return;
        }
        

        // Caso especial: lista vazia ou inserção no início
        if (this.head === null || y < this.head.y) {
            const newBloco = new bloco(this.initialX, this.initialY, text);
            newBloco.next = this.head;
            this.head = newBloco;
            this.updateSubsequentPositions(newBloco);
            return;
        }

        // Percorrer a lista para encontrar a posição correta de inserção
        let current = this.head;
        while (current.next !== null && current.next.y < y) {
            current = current.next;
        }

        // Inserir o novo bloco, na posição do bloco atual

        const newBloco = new bloco(this.initialX, current.next.y, text);
        newBloco.next = current.next;
        current.next = newBloco;
        //adiciona tamanho
        this.size++;

        // Atualizar as posições dos blocos subsequentes
        //atualizando a posição dos blocos subsequentes devido a inserção do novo bloco
        this.updateSubsequentPositions(newBloco);
    }

    SearchBloco(x, y) {
        let current = this.head;
        while (current !== null) {
            //o verificação tem que considerar o tamanho do bloco, e não apenas a posição y e x
            if (current.x <= x && x <= current.x + current.w && current.y <= y && y <= current.y + current.h) {
                return current; // Retorna o bloco se a posição estiver dentro dos limites
            }
            current = current.next; // Move para o próximo bloco
            
        }
        return null; // Retorna null se não encontrar o bloco
    }

    removeBloco(bloco) {
        if (bloco == null) return; // Lista vazia
    
        // 1) guarda a sequência original de y
        const ys = this._collectYs();
    
        // Caso especial: o bloco a ser removido é o primeiro da lista
        if (this.head === bloco) {
            this.head = this.head.next;
        } else {
            // Percorrer a lista para encontrar o bloco anterior ao que será removido
            let current = this.head;
            while (current.next !== null && current.next !== bloco) {
                current = current.next;
            }
            // Se o bloco foi encontrado, removê-lo
            if (current.next === bloco) {
                current.next = current.next.next;
            } else {
                return; // bloco não pertence à lista
            }
        }
        
        this.size--;
        // 2) reaplica os y originais na nova ordem de nós
        this._applyYs(ys);
    }


    realocarBlocos(bloco, my, mx) {
        if (bloco === null) return; // Click em lugar nenhum
    
        // 1) guarda a sequência original de y
        const ys = this._collectYs();
    
        const before = this.SearchBloco(mx, my);
        // Se é o mesmo nó, nada a fazer
        if (bloco === before) return;
    
        // 2) Encontrar e destacar 'bloco' (move)
        let prevMove = null;
        let cur = this.head;
        let found = false;
        while (cur) {
            if (cur === bloco) {
                found = true;
                break;
            }
            prevMove = cur;
            cur = cur.next;
        }
        if (!found) return; // bloco não pertence à lista
    
        // Destaca 'bloco' da lista
        if (prevMove) {
            prevMove.next = bloco.next;
        } else {
            // bloco era head
            this.head = bloco.next;
        }
    
        // 3) Inserir 'bloco' antes de 'before'
        if (!before) {
            // Se before for null, insere no fim
            if (!this.head) {
                // lista ficou vazia
                this.head = bloco;
                bloco.next = null;
            } else {
                let last = this.head;
                while (last.next) last = last.next;
                last.next = bloco;
                bloco.next = null;
            }
        } else if (before === this.head) {
            // inserir na cabeça
            bloco.next = this.head;
            this.head = bloco;
        } else {
            // caso geral: encontrar quem aponta para 'before'
            let prevBefore = null;
            cur = this.head;
            while (cur && cur !== before) {
                prevBefore = cur;
                cur = cur.next;
            }
            if (!cur) return; // 'before' não pertence à lista
    
            // insere entre prevBefore e before
            prevBefore.next = bloco;
            bloco.next = before;
        }
    
        // 4) reaplica os y originais na nova ordem de nós
        this._applyYs(ys);
    }
    
    // Função privada para coletar todos os y, na ordem atual da lista
    _collectYs() {
        const ys = [];
        let cur = this.head;
        while (cur) {
            ys.push(cur.y);
            cur = cur.next;
        }
        return ys;
    }
    
    // Função privada para reatribuir y's a cada nó, na ordem dada pelo array
    _applyYs(ys) {
        let i = 0;
        let cur = this.head;
        while (cur && i < ys.length) {
            cur.y = ys[i++];
            cur = cur.next;
        }
    }

    clear(){
        this.head = null; // Limpa a lista de blocos
        this.size = 0; // Reinicia o tamanho da lista
    }
    
    updateSubsequentPositions(startBloco) {
        let current = startBloco;
        while (current.next !== null) {
            current.next.y = current.y + current.h; // Ajusta o y do próximo bloco
            current = current.next;
        }
    }
    
    
}