function drawBoard() {
   for (r=0; r<8; r++) {
      for(c=0; c<8; c++) {
         if (whiteTile) {
            square.setAttribute('class', 'ws')
         } else {
            square.setAttribute('class', 'bs')
         }
         canvas.appendChild(square)
         console.log(square)
      }
   }
}