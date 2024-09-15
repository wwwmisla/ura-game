function drawButton(x, y, w, h, label) {
    fill("#3E7FC1");
    stroke("#f6f6f6");
    rect(x, y, w, h, 10);
    textAlign(CENTER, CENTER);
    text(label, x + w/2, y + h/2);
}

function isClickInside(x, y, w, h) {
    return mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h;
}