function drawGrid() {
    stroke("#3E7FC1"); // Cor das linhas da grid | Azul URA
    strokeWeight(2); // Espessura das linhas
    fill("#F6F6F6"); // Cor de preenchimento das células da grid | Branco URA

    for (let i = 540; i < tela_width; i += 75) {
        for (let j = 0; j < tela_height; j += 75) {
            square(i, j, 75);
        }
    }
}