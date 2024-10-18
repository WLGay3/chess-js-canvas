// waits for page to load before creating canvas
window.addEventListener('DOMContentLoaded', () => {
   let canvas = document.getElementById("canvasChessboard");
   let ctx = canvas.getContext("2d");
   let img = document.querySelector('#source')
   let imgX;
   let imgY;
   let gameOver = false;
   let possibleMoves = [];
   let wTurn = true;
   let showMoves = false;
   let currentPiece = 0;
   let prevX = 0;
   let prevY = 0;
   let wCastle = true;
   let bCastle = true;

// size of each square on the board
   const squareSize = 75;

// piece layout
   let board = [
      [12, 13, 14, 15, 16, 14, 13, 12],
      [11, 11, 11, 11, 11, 11, 11, 11],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [2, 3, 4, 5, 6, 4, 3, 2]
   ]

   function drawChessboard() {
      // position of board's top left
      for(let i=0; i<8; i++) {
         for(let j=0; j<8; j++) {
            //alternates color of board squares
            ctx.fillStyle = ((i+j)%2==0) ? "white":"#050031";
            let xOffset = j*squareSize;
            let yOffset = i*squareSize;
            ctx.fillRect(xOffset, yOffset, squareSize, squareSize);
            let piece = board[i][j];
            //grabs the correct piece from chess-pieces.png
            if (piece > 0 && piece < 7) {
               //finds the white pieces
               imgX = (piece - 1)*squareSize;
               imgY = 0;
               ctx.drawImage(img, imgX, imgY, squareSize, squareSize, xOffset, yOffset, squareSize, squareSize);
            } else if (piece > 10) {
               //finds the black pieces
               imgX = (piece - 11)*squareSize;
               imgY = squareSize;
               ctx.drawImage(img, imgX, imgY, squareSize, squareSize, xOffset, yOffset, squareSize, squareSize);
            } 
         } 
      }
   }

   drawChessboard();



   
///////////////////////////////// Definitions of all possible moves ////////////////////////////////////////////


   function checkMoves(currentPiece, squareX, squareY, boardY, boardX) {
      //used to add multiple squares to possibleMoves
      let squareMultiplier = 1;
/////white pawn moves
      if (currentPiece === 1) {
         //1st move
         if(boardY === 6) {
            if(board[boardY-2][boardX] === 0 && board[boardY-1][boardX] === 0) {
               possibleMoves.push( squareX, (squareY - squareSize*2));
            }
         //other moves
         }if (board[boardY-1][boardX] === 0){
            possibleMoves.push(squareX, (squareY -squareSize));
         }
         //attack top left piece
         if(board[boardY-1][boardX-1] >10) {
            possibleMoves.push(squareX - squareSize, squareY - squareSize);
         }
         //attack top right piece
         if(board[boardY-1][boardX+1] >10) {
            possibleMoves.push(squareX + squareSize, squareY - squareSize);
         }
/////black pawn moves
      }  else if (currentPiece === 11) {
         
         //1st move
         if(boardY === 1) {
            if(board[boardY+2][boardX] === 0 && board[boardY+1][boardX] === 0) {
               possibleMoves.push( squareX, (squareY + squareSize*2));
            }
         //other moves
         }if (board[boardY+1][boardX] === 0){
            possibleMoves.push(squareX, (squareY +squareSize));
         }
         //attack bottom left piece
         if(board[boardY+1][boardX-1] >0 && board[boardY+1][boardX-1] < 7) {
            possibleMoves.push(squareX-squareSize, squareY + squareSize);
         }
         //attack bottom right piece
         if(board[boardY+1][boardX+1] >0 && board[boardY+1][boardX+1] < 7) {
            possibleMoves.push(squareX + squareSize, squareY + squareSize);
         }

/////rook and moves
      } else if (currentPiece === 2 || currentPiece === 12){

         //up moves
         for(i=boardY-1;i>-1; i--){
            if(board[i][boardX] === 0){
               possibleMoves.push(squareX, squareY - (squareSize*squareMultiplier));
               squareMultiplier ++;
            } else {
               if(currentPiece === 2 && board[i][boardX] > 10){
                  possibleMoves.push(squareX, squareY - (squareSize*squareMultiplier));
               } else if(currentPiece === 12 && board[i][boardX] > 0 && board[i][boardX] < 7) {
                  possibleMoves.push(squareX, squareY - (squareSize*squareMultiplier));
               }
               squareMultiplier = 1;
               break;
            }
         }
         squareMultiplier = 1;

         //down moves
         for(i=boardY+1;i<8; i++){
            if(board[i][boardX] === 0){
               possibleMoves.push(squareX, squareY + (squareSize*squareMultiplier));
               squareMultiplier ++;
            } else {
               if(currentPiece === 2 && board[i][boardX] > 10){
                  possibleMoves.push(squareX, squareY + (squareSize*squareMultiplier));
               } else if(currentPiece === 12 && board[i][boardX] > 0 && board[i][boardX] < 7) {
                  possibleMoves.push(squareX, squareY + (squareSize*squareMultiplier));
               }
               squareMultiplier = 1;
               break;
            }
         }
         squareMultiplier = 1;

         // left moves
         for(i=boardX-1;i>-1; i--){
            if(board[boardY][i] === 0){
               possibleMoves.push(squareX - (squareSize*squareMultiplier), squareY);
               squareMultiplier ++;
            } else {
               if(currentPiece === 2 && board[i][boardX] > 10){
                  possibleMoves.push(squareX - (squareSize*squareMultiplier), squareY);
               } else if(currentPiece === 12 && board[i][boardX] > 0 && board[i][boardX] < 7) {
                  possibleMoves.push(squareX - (squareSize*squareMultiplier), squareY);
               }
               squareMultiplier = 1;
               break;
            }
         }
         squareMultiplier = 1;

         //right moves
         for(i=boardX+1;i<8; i++){
            if(board[boardY][i] === 0){
               possibleMoves.push(squareX + (squareSize*squareMultiplier), squareY);
               squareMultiplier ++;
            } else {
               if(currentPiece === 2 && board[i][boardX] > 10){
                  possibleMoves.push(squareX + (squareSize*squareMultiplier), squareY);
               } else if(currentPiece === 12 && board[i][boardX] > 0 && board[i][boardX] < 7) {
                  possibleMoves.push(squareX + (squareSize*squareMultiplier), squareY);
               }
               squareMultiplier = 1;
               break;
            }
         }
         squareMultiplier = 1;

/////knight moves
      }else if(currentPiece === 3 || currentPiece === 13){
         let knightCoordinates = [-2,-1,-2,1,-1,2,1,2,2,1,2,-1,1,-2,-1,-2];
         let i = 0;
         for (i; i< knightCoordinates.length-1; i +=2) {
            let col = knightCoordinates[i];
            let row = knightCoordinates[i+1];
            let xMult = (boardX + row)
            let yMult = (boardY + col)
            if( yMult< 0 || yMult> 7 || xMult < 0 || xMult > 7 ) {
               console.log('not a valid square')
            } else {
               if ((board[yMult][xMult] === 0) || (currentPiece === 3 && board[yMult][xMult] >10) || (currentPiece === 13 && (board[yMult][xMult] >0 && board[yMult][xMult] < 7) )) {
                  possibleMoves.push(squareSize*xMult, squareSize*yMult);            
            } 
         } 
      }
      drawChessboard();
      
/////bishop moves   
      } else if (currentPiece === 4 || currentPiece === 14) {
         //top left moves
         for(y=boardY-1, x=boardX-1;y>-1; y--, x--){
            console.log(board[y][x]);
            if(board[y][x] === 0){
               possibleMoves.push(squareX - (squareSize*squareMultiplier), squareY - (squareSize*squareMultiplier));
               squareMultiplier ++;
            } else {
               if(currentPiece === 4 && board[y][x] > 10){
                  possibleMoves.push(squareX - (squareSize*squareMultiplier), squareY - (squareSize*squareMultiplier));
               } else if(currentPiece===14 && board[y][x]>0 && board[y][x] < 7){
                  possibleMoves.push(squareX - (squareSize*squareMultiplier), squareY - (squareSize*squareMultiplier));
               }
               squareMultiplier = 1;
               break;
            }
         }
         squareMultiplier = 1;

          //top right moves
         for(y=boardY-1, x=boardX+1;y>-1; y--, x++){
            if(board[y][x] === 0){
               possibleMoves.push(squareX + (squareSize*squareMultiplier), squareY - (squareSize*squareMultiplier));
               squareMultiplier ++;
            } else {
               if(currentPiece === 4 && board[y][x] > 10){
                  possibleMoves.push(squareX + (squareSize*squareMultiplier), squareY - (squareSize*squareMultiplier));
               } else if(currentPiece===14 && board[y][x]>0 && board[y][x] < 7){
                  possibleMoves.push(squareX + (squareSize*squareMultiplier), squareY - (squareSize*squareMultiplier));
               }
               squareMultiplier = 1;
               break;
            }
         }
         squareMultiplier = 1;
         // bottom right moves
         for(y=boardY+1, x=boardX+1;y<8; y++, x++){
            console.log(board[y][x]);
            if(board[y][x] === 0){
               possibleMoves.push(squareX + (squareSize*squareMultiplier), squareY + (squareSize*squareMultiplier));
               squareMultiplier ++;
            } else {
               if(currentPiece === 4 && board[y][x] > 10){
                  possibleMoves.push(squareX + (squareSize*squareMultiplier), squareY + (squareSize*squareMultiplier));
               } else if(currentPiece===14 && board[y][x]>0 && board[y][x] < 7){
                  possibleMoves.push(squareX + (squareSize*squareMultiplier), squareY + (squareSize*squareMultiplier));
               }
               squareMultiplier = 1;
               break;
            }
         }

         //bottom left moves
         for(y=boardY+1, x=boardX-1;y<8; y++, x--){
            if(board[y][x] === 0){
               possibleMoves.push(squareX - (squareSize*squareMultiplier), squareY + (squareSize*squareMultiplier));
               squareMultiplier ++;
            } else {
               if(currentPiece === 4 && board[y][x] > 10){
                  possibleMoves.push(squareX - (squareSize*squareMultiplier), squareY + (squareSize*squareMultiplier));
               } else if(currentPiece===14 && board[y][x]>0 && board[y][x] < 7){
                  possibleMoves.push(squareX - (squareSize*squareMultiplier), squareY + (squareSize*squareMultiplier));
               }
               squareMultiplier = 1;
               break;
            }
         }
      
/////Queen Moves
      } else if(currentPiece=== 5 || currentPiece === 15){
         //up moves
         for(i=boardY-1;i>-1; i--){
            if(board[i][boardX] === 0){
               possibleMoves.push(squareX, squareY - (squareSize*squareMultiplier));
               squareMultiplier ++;
            } else {
               if(currentPiece === 5 && board[i][boardX] > 10){
                  possibleMoves.push(squareX, squareY - (squareSize*squareMultiplier));
               } else if(currentPiece === 15 && board[i][boardX] > 0 && board[i][boardX] < 7) {
                  possibleMoves.push(squareX, squareY - (squareSize*squareMultiplier));
               }
               squareMultiplier = 1;
               break;
            }
         }
         squareMultiplier = 1;

         //down moves
         for(i=boardY+1;i<8; i++){
            if(board[i][boardX] === 0){
               possibleMoves.push(squareX, squareY + (squareSize*squareMultiplier));
               squareMultiplier ++;
            } else {
               if(currentPiece === 5 && board[i][boardX] > 10){
                  possibleMoves.push(squareX, squareY + (squareSize*squareMultiplier));
               } else if(currentPiece === 15 && board[i][boardX] > 0 && board[i][boardX] < 7) {
                  possibleMoves.push(squareX, squareY + (squareSize*squareMultiplier));
               }
               squareMultiplier = 1;
               break;
            }
         }
         squareMultiplier = 1;

         // left moves
         for(i=boardX-1;i>-1; i--){
            if(board[boardY][i] === 0){
               possibleMoves.push(squareX - (squareSize*squareMultiplier), squareY);
               squareMultiplier ++;
            } else {
               if(currentPiece === 5 && board[boardY][i] > 10){
                  possibleMoves.push(squareX - (squareSize*squareMultiplier), squareY);
               } else if(currentPiece === 15 && board[boardY][i] > 0 && board[boardY][i] < 7) {
                  possibleMoves.push(squareX - (squareSize*squareMultiplier), squareY);
               }
               squareMultiplier = 1;
               break;
            }
         }
         squareMultiplier = 1;

         //right moves
         for(i=boardX+1;i<8; i++){
            if(board[boardY][i] === 0){
               possibleMoves.push(squareX + (squareSize*squareMultiplier), squareY);
               squareMultiplier ++;
            } else {
               if(currentPiece === 5 && board[boardY][i] > 10){
                  possibleMoves.push(squareX + (squareSize*squareMultiplier), squareY);
               } else if(currentPiece === 15 && board[boardY][i] > 0 && board[boardY][i] < 7) {
                  possibleMoves.push(squareX + (squareSize*squareMultiplier), squareY);
               }
               squareMultiplier = 1;
               break;
            }
         }
         squareMultiplier = 1;

          //top left moves
          for(y=boardY-1, x=boardX-1;y>-1; y--, x--){
            console.log(board[y][x]);
            if(board[y][x] === 0){
               possibleMoves.push(squareX - (squareSize*squareMultiplier), squareY - (squareSize*squareMultiplier));
               squareMultiplier ++;
            } else {
               if(currentPiece === 5 && board[y][x] > 10){
                  possibleMoves.push(squareX - (squareSize*squareMultiplier), squareY - (squareSize*squareMultiplier));
               } else if(currentPiece===15 && board[y][x]>0 && board[y][x] < 7){
                  possibleMoves.push(squareX - (squareSize*squareMultiplier), squareY - (squareSize*squareMultiplier));
               }
               squareMultiplier = 1;
               break;
            }
         }
         squareMultiplier = 1;

          //top right moves
         for(y=boardY-1, x=boardX+1;y>-1; y--, x++){
            if(board[y][x] === 0){
               possibleMoves.push(squareX + (squareSize*squareMultiplier), squareY - (squareSize*squareMultiplier));
               squareMultiplier ++;
            } else {
               if(currentPiece === 5 && board[y][x] > 10){
                  possibleMoves.push(squareX + (squareSize*squareMultiplier), squareY - (squareSize*squareMultiplier));
               } else if(currentPiece===15 && board[y][x]>0 && board[y][x] < 7){
                  possibleMoves.push(squareX + (squareSize*squareMultiplier), squareY - (squareSize*squareMultiplier));
               }
               squareMultiplier = 1;
               break;
            }
         }
         squareMultiplier = 1;
         // bottom right moves
         for(y=boardY+1, x=boardX+1;y<8; y++, x++){
            console.log(board[y][x]);
            if(board[y][x] === 0){
               possibleMoves.push(squareX + (squareSize*squareMultiplier), squareY + (squareSize*squareMultiplier));
               squareMultiplier ++;
            } else {
               if(currentPiece === 5 && board[y][x] > 10){
                  possibleMoves.push(squareX + (squareSize*squareMultiplier), squareY + (squareSize*squareMultiplier));
               } else if(currentPiece===15 && board[y][x]>0 && board[y][x] < 7){
                  possibleMoves.push(squareX + (squareSize*squareMultiplier), squareY + (squareSize*squareMultiplier));
               }
               squareMultiplier = 1;
               break;
            }
         }
         squareMultiplier = 1;
         //bottom left moves
         for(y=boardY+1, x=boardX-1;y<8; y++, x--){
            if(board[y][x] === 0){
               possibleMoves.push(squareX - (squareSize*squareMultiplier), squareY + (squareSize*squareMultiplier));
               squareMultiplier ++;
            } else {
               if(currentPiece === 5 && board[y][x] > 10){
                  possibleMoves.push(squareX - (squareSize*squareMultiplier), squareY + (squareSize*squareMultiplier));
               } else if(currentPiece===15 && board[y][x]>0 && board[y][x] < 7){
                  possibleMoves.push(squareX - (squareSize*squareMultiplier), squareY + (squareSize*squareMultiplier));
               }
               squareMultiplier = 1;
               break;
            }
         }

/////King moves
      } else if (currentPiece === 6) {
      //White king
         for(y=-1; y<2; y++) {
            let yMove = boardY+y;
            if (yMove > 0 && yMove < 8) {
               for(x=-1; x<2; x++){
                  let xMove = boardX+x;
                  if(xMove > 0 && xMove < 8){
                     if(board[yMove][xMove] === 0 || board[yMove][xMove] >10) {
                        possibleMoves.push(squareX + (squareSize*x), squareY + (squareSize*y))
                     }
                  }
               }
            }
            
         }
         if(wCastle) {
            if(board[7][5] === 0 && board[7][6] === 0 && board[7][7] === 2) {
               possibleMoves.push(squareX + (squareSize*2), squareY);
            }

         } 
      } else if (currentPiece === 16) {
         //Black king
         for(y=-1; y<2; y++) {
            let yMove = boardY+y;
            if (yMove > 0 && yMove < 8) {
               for(x=-1; x<2; x++){
                  let xMove = boardX+x;
                  if(xMove > 0 && xMove < 8){
                     if(board[yMove][xMove] === 0 || (board[yMove][xMove] >0 && board[yMove][xMove] < 7)) {
                        possibleMoves.push(squareX + (squareSize*x), squareY + (squareSize*y))
                     }
                  }
               }
            }
            
         }
         if(bCastle) {
            if(board[0][5] === 0 && board[0][6] === 0 && board[0][7] === 12) {
               possibleMoves.push(squareX + (squareSize*2), squareY);
            }

         } 
      }
   }



   ////////////////////////////////  End of Definition of moves ////////////////////////////////////////////




   
   function drawMoves() {
      for (i=0;i<possibleMoves.length; i+=2){
         ctx.beginPath();
         ctx.lineWidth = "6";
         ctx.strokeStyle = "lime";
         ctx.rect(possibleMoves[i], possibleMoves[i+1], 75, 75);
         ctx.stroke();
      }
   }
   // checking to see if new square is in possibleMoves[]
   function isValid(squareX, squareY) {
      let valid = false;
      for(i=0; i<possibleMoves.length; i+=2) {
         if(possibleMoves[i] == squareX && possibleMoves[(i+1)] == squareY){
            valid = true;
            return valid
         }
      }
      return valid
   }
   
   
   // Runs when the canvas is clicked on
   function movePiece(x, y) {
      //get event position
      let squareX = Math.floor(x/squareSize)*squareSize;
      let squareY = Math.floor(y/squareSize)*squareSize;
      let boardX = Math.floor(x/squareSize);
      let boardY = Math.floor(y/squareSize);
      
   //Player Turn
      //selecting a white piece
      if (wTurn && !showMoves) {
         if (board[boardY][boardX] >0 && board[boardY][boardX] < 7) {
            currentPiece = board[boardY][boardX];
            prevX = boardX;
            prevY = boardY;
            checkMoves(currentPiece, squareX, squareY, boardY, boardX);
            if(possibleMoves.length === 0) {
               alert('no possible moves')
            } else {
               showMoves = true;
            }
            drawMoves();
         }
      //selecting a black piece
      } else if (!wTurn && !showMoves) {
         if (board[boardY][boardX] > 10) {
            currentPiece = board[boardY][boardX];
            prevX = boardX;
            prevY = boardY;
            checkMoves(currentPiece, squareX, squareY, boardY, boardX);
            if(possibleMoves.length === 0) {
               alert('no possible moves')
            } else {
               showMoves = true;
            }
            drawMoves();
         }
      //placing player's piece
      } else if(showMoves) {
         if(isValid(squareX,squareY)){
            //turns pawn into queen when reaching other side of the board
            if (currentPiece === 1 && squareY === 0){
               currentPiece = 5;
            } else if (currentPiece === 11 && squareY === 525){
               currentPiece = 15;
            }
            if (currentPiece <7 && board[boardY][boardX] === 16) {
               console.log('White Wins')
            } else if(currentPiece > 10 && board[boardY][boardX] === 6) {
               console.log('Black Wins')
            }
            //castles the king
            if (currentPiece === 6 && wCastle) {
               if (squareY === 525){
                  board[7][7] = 0;
                  board[7][5] = 2;
               }
               wCastle = false;
            } else if (currentPiece === 16 && bCastle) {
               if (squareY === 0){
                  board[0][7] = 0;
                  board[0][5] = 12;
               }
               bCastle = false;
            }
            board[boardY][boardX] = currentPiece;
            board[prevY][prevX] = 0;
            currentPiece = 0
            wTurn = !wTurn;
            showMoves = false;
            possibleMoves = [];
            drawChessboard();
         //allows player to choose another piece
         } else if (boardX === prevX && boardY === prevY) {
            possibleMoves = [];
            showMoves = false;
            drawChessboard();
         } else {
            alert('Invalid Move');
         }
      }
   }

   //Event listener that handles the click event
   let canvasLeft = canvas.offsetLeft + canvas.clientLeft;
   let canvasTop = canvas.offsetTop + canvas.clientTop;
   canvas.addEventListener('click', (e) => {
      let xPos = e.pageX - canvasLeft;
      let yPos = e.pageY - canvasTop;
      movePiece(xPos, yPos);
      
   });
})