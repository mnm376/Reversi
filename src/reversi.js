// reversi.js
function repeat(value, n) {
	let arr = [];
	for ( i = 0; i < n; i++){
		arr.push(value);
	}
	return arr;
} 
    
function generateBoard(rows, cols, initialValue) {
	//since we assume "a board's rows and columns will always be equal"...
    if (rows !== cols){ 
    	console.log("rows and columns should be the same, please try again");
    }
    //once a correct rows/cols is received...
    return repeat(initialValue, rows*cols); 
} 

function rowColToIndex(board, rowNumber, columnNumber){
	//fill arr with values
	let arr = [...board];
	for (i = 0; i < board.length; i++){
		arr[i] = i; 
	}
	//index is a formula to get the correct index to return
	let index = arr[columnNumber] + (rowNumber * Math.sqrt(board.length));
	return index;
}

function indexToRowCol(board, index){
	//fill arr with values
	let arr = Object.assign({}, board);
	for (i = 0; i < board.length; i++){
		arr[i] = i; 
	}
	//set values using floor/mod division
	let max = Math.sqrt(board.length);
	let col = index%max;
	let row = Math.floor(index/max);
	//assign to an object
	let RowCol = {
		row: row,
		col: col
	};
	return RowCol;
}

function setBoardCell(board, letter, row, col){
	//create shallow copy
	let newBoard = [...board];
	//finds index using rowColToIndex()
	let index = rowColToIndex(newBoard, row, col);
	//assigns then returns 
	newBoard[index] = letter;
	return newBoard; 
}

function algebraicToRowCol(algebraicNotation){
	//check if length is not 2
	if (algebraicNotation.length != 2) {
		return undefined;
	}
	//check if first index is not a letter
	if (algebraicNotation.charAt(0).match(/[a-z]/i) == null){
		return undefined;
	}
	//check if second index is not a number
	if(parseInt(algebraicNotation.charAt(1)) == NaN){
		return undefined;
	}
	//if all tests pass, assign column and row by converting both to integers
	else{
		let col = algebraicNotation.charCodeAt(0) - 65;
		let row = parseInt(algebraicNotation[1]) - 1;
		let RowCol = {
			row: row,
			col: col
		};
		return RowCol;
	}
}

function placeLetters(board, letter, ...algebraicNotation){
	//assign values
	let newBoard = [...board];
	let arr = algebraicNotation;

	for (let i = 0; i < arr.length; i++){
		let RowCol = algebraicToRowCol(arr[i]);
		let row = RowCol.row;
		let col = RowCol.col;
		//set values on newBoard
		newBoard = setBoardCell(newBoard, letter, row, col);
	}
	return newBoard;
}

function boardToString(board){
	let border = '---+';
	let divider = '   |';
	let letter = 'A'.codePointAt(0); //65
	let max = Math.sqrt(board.length);
	let drawing = "     ";
	let margin = "   ";
	//draw letter
	for (i = 0; i < max; i++, letter++){
		drawing += String.fromCodePoint(letter);
		drawing += "   ";
	}
	//remove space to satisfy test
	drawing = drawing.slice(0, -1);
	let number = 1;
	let index = 0;
	for (j = 0; j < max; j++, number++){
		drawing += "\n"
		//loop to create border for one straight line
		for (k = 0, drawing += margin + "+"; k < max; k++){
			drawing += border;
		}
		//draw number in new line
		drawing += "\n";
		drawing += " " + number + " ";
		//draw X or O if exist
		for(drawing += "|"; index < board.length; index++){
			if (board[index] === " "){
				drawing += divider;
			}
			if (board[index] !== " "){
				drawing += " " + board[index] + " |";
			}
			if ((index + 1)%max === 0){
				index++;
				break;
			}
		}
	}
	//final border; this can be coded better by making the border to be calculated once and attached anytime
	for (k = 0, drawing += "\n", drawing += margin + "+"; k < max; k++){
		drawing += border;
	}
	drawing += "\n";
	return drawing;
}

function isBoardFull(board){
	//returns false if any increment of array carries initial empty " "
	for (i = 0; i < board.length; i++){
		if (board[i] === " "){
			return false;
		}
		else {
			return true;
		}
	}
}

function flip(board, row, col){
	//find index of piece to flip and flip it
	let index = rowColToIndex(board, row, col);
	switch(board[index]){
		case " ": 
			break;
		case "X":
			board[index] = "O";
			break;
		case "O":
			board[index] = "X";
			break;
	}
	return board;
	//Alt method:
		// if (board[index] === " "){
		// 	return board;
		// }
		// if (board[index] === "X"){
		// 	board[index] = "O";
		// 	return board;
		// }
		// if (board[index] === "O"){
		// 	board[index] = "X";
		// 	return board;
		// }
}

function flipCells(board, cellsToFlip){
	let row;
	let col;
	let arr = [...board];
	for (let i = 0; i < cellsToFlip.length; i++){
		for (let j = 0; j < cellsToFlip[i].length; j++){
			row = cellsToFlip[i][j][0];
			col = cellsToFlip[i][j][1];
			arr = flip(arr, row, col);
		}
	}
	return arr;
}

function isValidMove(board, letter, row, col){
	let max = Math.sqrt(board.length);
	let index = rowColToIndex(board, row, col);
	//determine opposing letter
	let oppLetter;
	if (letter == "X"){
		oppLetter = "O";
	}
	else{
		oppLetter = "X";
	}
	if (row >= max || col >= max){
		return false;
	}
	//check upwards
	let neighbors = findAdjacent(board, index, row, col);
		// console.log("neighbors.up: " + neighbors.up)
	if (neighbors.up != undefined){
		if (board[neighbors.up] == " "){
		}
		else if (ifLettersDoNotMatch(letter, board[neighbors.up])){
			let newIndex = neighbors.up;
			let newRowCol = Object.assign({}, indexToRowCol(board, newIndex));
			let newRow = newRowCol.row;
			let newCol = newRowCol.col; 
			let newNeighbor = findAdjacent(board, newIndex, newRow, newCol);
			do{
				//returns true if original letter is found sandwiching opposite letter
				//console.log(letter, board[newNeighbor.up])
				if (ifLettersMatch(letter, board[newNeighbor.up])){
					return true;
				}
				//increments to the next neighbor if current letter matches letter above
				if (ifLettersMatch(board[newIndex], board[newNeighbor.up])){
					newIndex = newNeighbor.up;
					newRowCol = indexToRowCol(board, newIndex);	
					newRow = newRowCol.row;
					newCol = newRowCol.col; 
					newNeighbor = findAdjacent(board, newIndex, newRow, newCol);
				}
				//if empty " ", then there was no same letter to sandwich the opposing letter
				if (board[newNeighbor.up] == " "){
					break;
				}
			} while (newNeighbor.up != undefined);
		}
	}
	//check downwards
	// console.log("neighbors.down: " + neighbors.down)
	if (neighbors.down != undefined){
		if (board[neighbors.down] == " "){
		}
		else if (ifLettersDoNotMatch(letter, board[neighbors.down])){
			let newIndex = neighbors.down;
			let newRowCol = Object.assign({}, indexToRowCol(board, newIndex));
			let newRow = newRowCol.row;
			let newCol = newRowCol.col; 
			let newNeighbor = findAdjacent(board, newIndex, newRow, newCol);
			do{
				//returns true if original letter is found sandwiching opposite letter
				//console.log(letter, board[newNeighbor.down])
				if (ifLettersMatch(letter, board[newNeighbor.down])){
					return true;
				}
				//increments to the next neighbor if current letter matches letter above
				if (ifLettersMatch(board[newIndex], board[newNeighbor.down])){
					newIndex = newNeighbor.down;
					newRowCol = indexToRowCol(board, newIndex);	
					newRow = newRowCol.row;
					newCol = newRowCol.col; 
					newNeighbor = findAdjacent(board, newIndex, newRow, newCol);
				}
				//if empty " ", then there was no same letter to sandwich the opposing letter
				if (board[newNeighbor.down] == " "){
					break;
				}
			} while (newNeighbor.down != undefined);
		}
	}
	//check left
	// console.log("neighbors.left: " + neighbors.left)
	if (neighbors.left != undefined){
		if (board[neighbors.left] == " "){
		}
		else if (ifLettersDoNotMatch(letter, board[neighbors.left])){
			let newIndex = neighbors.left;
			let newRowCol = Object.assign({}, indexToRowCol(board, newIndex));
			let newRow = newRowCol.row;
			let newCol = newRowCol.col; 
			let newNeighbor = findAdjacent(board, newIndex, newRow, newCol);
			// console.log("newIndex: " + newIndex + "|| newNeighbor.left: " + newNeighbor.left)
			do{
				//returns true if original letter is found sandwiching opposite letter
				if (ifLettersMatch(letter, board[newNeighbor.left])){
					return true;
				}
				//increments to the next neighbor if current letter matches letter above
				if (ifLettersMatch(board[newIndex], board[newNeighbor.left])){
					newIndex = newNeighbor.left;
					newRowCol = indexToRowCol(board, newIndex);	
					newRow = newRowCol.row;
					newCol = newRowCol.col; 
					newNeighbor = findAdjacent(board, newIndex, newRow, newCol);
				}
				//if empty " ", then there was no same letter to sandwich the opposing letter
				if (board[newNeighbor.left] == " "){
					break;
				}
			} while (newNeighbor.left != undefined);
		}
	}
	//check right
	if (neighbors.right != undefined){
		if (board[neighbors.right] == " "){
		}
		else if (ifLettersDoNotMatch(letter, board[neighbors.right])){
			let newIndex = neighbors.right;
			let newRowCol = Object.assign({}, indexToRowCol(board, newIndex));
			let newRow = newRowCol.row;
			let newCol = newRowCol.col; 
			let newNeighbor = findAdjacent(board, newIndex, newRow, newCol);
			do{
				//returns true if original letter is found sandwiching opposite letter
				if (ifLettersMatch(letter, board[newNeighbor.right])){
					return true;
				}
				//increments to the next neighbor if current letter matches letter above
				if (ifLettersMatch(board[newIndex], board[newNeighbor.right])){
					newIndex = newNeighbor.right;
					newRowCol = indexToRowCol(board, newIndex);	
					newRow = newRowCol.row;
					newCol = newRowCol.col; 
					newNeighbor = findAdjacent(board, newIndex, newRow, newCol);
				}
				//if empty " ", then there was no same letter to sandwich the opposing letter
				if (board[newNeighbor.right] == " "){
					break;
				}
			} while (newNeighbor.right != undefined);
		}
	}
	//check upLeft
	if (neighbors.upLeft != undefined){
		if (board[neighbors.upLeft] == " "){
		}
		else if (ifLettersDoNotMatch(letter, board[neighbors.upLeft])){
			let newIndex = neighbors.upLeft;
			let newRowCol = Object.assign({}, indexToRowCol(board, newIndex));
			let newRow = newRowCol.row;
			let newCol = newRowCol.col; 
			let newNeighbor = findAdjacent(board, newIndex, newRow, newCol);
			do{
				//returns true if original letter is found sandwiching opposite letter
				if (ifLettersMatch(letter, board[newNeighbor.upLeft])){
					return true;
				}
				//increments to the next neighbor if current letter matches letter above
				if (ifLettersMatch(board[newIndex], board[newNeighbor.upLeft])){
					newIndex = newNeighbor.upLeft;
					newRowCol = indexToRowCol(board, newIndex);	
					newRow = newRowCol.row;
					newCol = newRowCol.col; 
					newNeighbor = findAdjacent(board, newIndex, newRow, newCol);
				}
				//if empty " ", then there was no same letter to sandwich the opposing letter
				if (board[newNeighbor.upLeft] == " "){
					break;
				}
			} while (newNeighbor.upLeft != undefined);
		}
	}
	//check upRight
	if (neighbors.upRight != undefined){
		if (board[neighbors.upRight] == " "){
		}
		else if (ifLettersDoNotMatch(letter, board[neighbors.upRight])){
			let newIndex = neighbors.upRight;
			let newRowCol = Object.assign({}, indexToRowCol(board, newIndex));
			let newRow = newRowCol.row;
			let newCol = newRowCol.col; 
			let newNeighbor = findAdjacent(board, newIndex, newRow, newCol);
			do{
				//returns true if original letter is found sandwiching opposite letter
				if (ifLettersMatch(letter, board[newNeighbor.upRight])){
					return true;
				}
				//increments to the next neighbor if current letter matches letter above
				if (ifLettersMatch(board[newIndex], board[newNeighbor.upRight])){
					newIndex = newNeighbor.upRight;
					newRowCol = indexToRowCol(board, newIndex);	
					newRow = newRowCol.row;
					newCol = newRowCol.col; 
					newNeighbor = findAdjacent(board, newIndex, newRow, newCol);
				}
				//if empty " ", then there was no same letter to sandwich the opposing letter
				if (board[newNeighbor.upRight] == " "){
					break;
				}
			} while (newNeighbor.upRight != undefined);
		}
	}
	//check bottomLeft
	if (neighbors.bottomLeft != undefined){
		if (board[neighbors.bottomLeft] == " "){
		}
		else if (ifLettersDoNotMatch(letter, board[neighbors.bottomLeft])){
			let newIndex = neighbors.bottomLeft;
			let newRowCol = Object.assign({}, indexToRowCol(board, newIndex));
			let newRow = newRowCol.row;
			let newCol = newRowCol.col; 
			let newNeighbor = findAdjacent(board, newIndex, newRow, newCol);
			do{
				//returns true if original letter is found sandwiching opposite letter
				if (ifLettersMatch(letter, board[newNeighbor.bottomLeft])){
					return true;
				}
				//increments to the next neighbor if current letter matches letter above
				if (ifLettersMatch(board[newIndex], board[newNeighbor.bottomLeft])){
					newIndex = newNeighbor.bottomLeft;
					newRowCol = indexToRowCol(board, newIndex);	
					newRow = newRowCol.row;
					newCol = newRowCol.col; 
					newNeighbor = findAdjacent(board, newIndex, newRow, newCol);
				}
				//if empty " ", then there was no same letter to sandwich the opposing letter
				if (board[newNeighbor.bottomLeft] == " "){
					break;
				}
			} while (newNeighbor.bottomLeft != undefined);
		}
	}
	//check bottomRight
	if (neighbors.bottomRight != undefined){
		if (board[neighbors.bottomRight] == " "){
		}
		else if (ifLettersDoNotMatch(letter, board[neighbors.bottomRight])){
			let newIndex = neighbors.bottomRight;
			let newRowCol = Object.assign({}, indexToRowCol(board, newIndex));
			let newRow = newRowCol.row;
			let newCol = newRowCol.col; 
			let newNeighbor = findAdjacent(board, newIndex, newRow, newCol);
			do{
				//returns true if original letter is found sandwiching opposite letter
				if (ifLettersMatch(letter, board[newNeighbor.bottomRight])){
					return true;
				}
				//increments to the next neighbor if current letter matches letter above
				if (ifLettersMatch(board[newIndex], board[newNeighbor.bottomRight])){
					newIndex = newNeighbor.bottomRight;
					newRowCol = indexToRowCol(board, newIndex);	
					newRow = newRowCol.row;
					newCol = newRowCol.col; 
					newNeighbor = findAdjacent(board, newIndex, newRow, newCol);
				}
				//if empty " ", then there was no same letter to sandwich the opposing letter
				if (board[newNeighbor.bottomRight] == " "){
					break;
				}
			} while (newNeighbor.bottomRight != undefined);
		}
	}
	return false;
}

function ifLettersMatch(first, second){
	if (first == second){
		return true;
	}
	else{
		return false;
	}
}

function ifLettersDoNotMatch(first, second){
	if (first == second){
		return false;
	}
	else{
		return true;
	}
}

function findAdjacent(board, index, row, col){
	let max = Math.sqrt(board.length);
	let topMost = 0;
	let bottomMost = max - 1;
	let rightMost = max - 1;
	let leftMost = 0;
	let up, down, left, right, upLeft, upRight, bottomLeft, bottomRight;
	if (row != topMost){
		up = index - max;
	}
	if (row != bottomMost){
		down = index + max;
	}
	if (col != leftMost){
		left = index - 1;
	}
	if (col != rightMost){
		right = index + 1;
	}
	if (up != undefined && right != undefined){
		upRight = index - (max - 1);
	}
	if (up != undefined && left != undefined){
		upLeft = index - (max + 1);
	}
	if (down != undefined && right != undefined){
		bottomRight = index + (max + 1);
	}
	if (down != undefined && left != undefined){
		bottomLeft = index + (max - 1);
	}
	let neighbors = {
		up: up,
		down: down,
		left: left,
		right: right,
		upLeft: upLeft,
		upRight: upRight,
		bottomLeft: bottomLeft,
		bottomRight: bottomRight
	};
	return neighbors;
}

function isValidMoveAlgebraicNotation(board, letter, algebraicNotation){
	let newRowCol = algebraicToRowCol(algebraicNotation);
	let newRow = newRowCol.row;
	let newCol = newRowCol.col;
	return isValidMove(board, letter, newRow, newCol);
}

function getValidMoves(board, letter){
	let max = Math.sqrt(board.length);
	let arr = [];
	let newRowCol; 
	let row, col;
	for (let index = 0; index < board.length; index++){
		if (board[index] == " "){
			newRowCol = Object.assign({}, indexToRowCol(board, index));
			// console.log("index: " + index);
			row = newRowCol.row;
			col = newRowCol.col;
			// console.log("row" + row);
			// console.log("col" + col);
			// console.log("doing");
			// console.log(findAdjacent(board, index, row, col));

			if (isValidMove(board, letter, row, col)){
				arr.push([row, col]);
			}
		}
	}
	return arr;
}

function getLetterCounts(board){
	let x = 0; 
	let o = 0;
	for ( let i = 0; i < board.length; i++){
		if (board[i] == "X"){
			//console.log("X found at: " + i + "\n")
			x++;
		}
		else if (board[i] == "O"){
			//console.log("Y found at: " + i + "\n")
			o++;
		}
	}
	let obj = {
		X: x,
		O: o
	}
	return obj;
}

function getCellsToFlip(board, lastRow, lastCol){
	let index = rowColToIndex(board, lastRow, lastCol);
	let arr = [];
	let row = lastRow;
	let col = lastCol;
	if (isValidMove(board, board[index], row, col)){
		let max = Math.sqrt(board.length);
		let index = rowColToIndex(board, row, col);
		//determine letter
		let letter = board[index]; 
		let oppLetter;
		if (letter == "X"){
			oppLetter = "O";
		}
		else{
			oppLetter = "X";
		}
		//check upwards
		let neighbors = findAdjacent(board, index, row, col);
			// console.log("neighbors.up: " + neighbors.up)
		// console.log("up\n");
		if (neighbors.up != undefined){
			// console.log("-598-")
			if (board[neighbors.up] == " "){
							// console.log("-600-")
			}
			else if (ifLettersDoNotMatch(letter, board[neighbors.up])){
							// console.log("-603-")
				let newIndex = neighbors.up;
				let newRowCol = Object.assign({}, indexToRowCol(board, newIndex));
				let newRow = newRowCol.row;
				let newCol = newRowCol.col;
				let newNeighbor = findAdjacent(board, newIndex, newRow, newCol);
				do{
					// console.log("-610-")
					//returns true if original letter is found sandwiching opposite letter
					//console.log(letter, board[newNeighbor.up])
					if (ifLettersMatch(letter, board[newNeighbor.up])){
						arr.push([newRow, newCol]); 
						// console.log("-615-");
					}
					//increments to the next neighbor if current letter matches letter above
					if (ifLettersMatch(board[newIndex], board[newNeighbor.up])){
						// console.log("-619-")
						newIndex = newNeighbor.up;
						newRowCol = indexToRowCol(board, newIndex);	
						newRow = newRowCol.row;
						newCol = newRowCol.col; 
						newNeighbor = findAdjacent(board, newIndex, newRow, newCol);
					}
					if (ifLettersDoNotMatch(board[newIndex], board[newNeighbor.up])){
						break;
					}
					//if empty " ", then there was no same letter to sandwich the opposing letter
					if (board[newNeighbor.up] == " "){
						// console.log("-628")
						break;
					}
				} while (newNeighbor.up != undefined);
			}
			// console.log("-633-")
		}
		//check downwards
		// console.log("neighbors.down: " + neighbors.down)
		// console.log("down\n");
		if (neighbors.down != undefined){
			if (board[neighbors.down] == " "){
			}
			else if (ifLettersDoNotMatch(letter, board[neighbors.down])){
				let newIndex = neighbors.down;
				let newRowCol = Object.assign({}, indexToRowCol(board, newIndex));
				let newRow = newRowCol.row;
				let newCol = newRowCol.col; 
				let newNeighbor = findAdjacent(board, newIndex, newRow, newCol);
				do{
					//returns true if original letter is found sandwiching opposite letter
					//console.log(letter, board[newNeighbor.down])
					if (ifLettersMatch(letter, board[newNeighbor.down])){
						arr.push([newRow, newCol]);
					}
					//increments to the next neighbor if current letter matches letter above
					if (ifLettersMatch(board[newIndex], board[newNeighbor.down])){
						newIndex = newNeighbor.down;
						newRowCol = indexToRowCol(board, newIndex);	
						newRow = newRowCol.row;
						newCol = newRowCol.col; 
						newNeighbor = findAdjacent(board, newIndex, newRow, newCol);
					}
					if (ifLettersDoNotMatch(board[newIndex], board[newNeighbor.down])){
						break;
					}
					//if empty " ", then there was no same letter to sandwich the opposing letter
					if (board[newNeighbor.down] == " "){
						break;
					}
				} while (newNeighbor.down != undefined);
			}
		}
		//check left
		console.log("neighbors.left: " + neighbors.left)
		// console.log("left\n")
		// if (neighbors.left != undefined){
		// 	if (board[neighbors.left] == " "){
		// 	}
		// 	else if (ifLettersDoNotMatch(letter, board[neighbors.left])){
		// 		let newIndex = neighbors.left;
		// 		let newRowCol = Object.assign({}, indexToRowCol(board, newIndex));
		// 		let newRow = newRowCol.row;
		// 		let newCol = newRowCol.col; 
		// 		let newNeighbor = findAdjacent(board, newIndex, newRow, newCol);
		// 		// console.log("newIndex: " + newIndex + "|| newNeighbor.left: " + newNeighbor.left)
		// 		do{
		// 			//returns true if original letter is found sandwiching opposite letter
		// 			//console.log(index, letter, newIndex, board[newNeighbor.left])
		// 			if (ifLettersMatch(letter, board[newIndex])){
		// 				arr.push([newRow, newCol]); 
		// 			}
		// 			//increments to the next neighbor if current letter matches letter above
		// 			if (ifLettersMatch(board[newIndex], board[newNeighbor.left])){
		// 				newIndex = newNeighbor.left;
		// 				newRowCol = indexToRowCol(board, newIndex);	
		// 				newRow = newRowCol.row;
		// 				newCol = newRowCol.col; 
		// 				newNeighbor = findAdjacent(board, newIndex, newRow, newCol);
		// 			}
		// 			if (ifLettersDoNotMatch(board[newIndex], board[newNeighbor.left])){
		// 				break;
		// 			}
		// 			//if empty " ", then there was no same letter to sandwich the opposing letter
		// 			if (board[newNeighbor.left] == " "){
		// 				break;
		// 			}
		// 		} while (newNeighbor.left != undefined);
		// 	}
		// }
		if (neighbors.left != undefined){
			if (board[neighbors.left] == " "){
			}
			else if (ifLettersDoNotMatch(letter, board[neighbors.left])){
				let newIndex = neighbors.left;
				let newRowCol = Object.assign({}, indexToRowCol(board, newIndex));
				let newRow = newRowCol.row;
				let newCol = newRowCol.col; 
				let newNeighbor = findAdjacent(board, newIndex, newRow, newCol);
				// console.log("newIndex: " + newIndex + "|| newNeighbor.left: " + newNeighbor.left)
				do{
					//returns true if original letter is found sandwiching opposite letter
					//console.log(index, letter, newIndex, board[newNeighbor.left])
					if (ifLettersMatch(letter, board[newIndex])){
						arr.push([newRow, newCol]); 
					}
					//increments to the next neighbor if current letter matches letter above
					if (ifLettersMatch(board[newIndex], board[newNeighbor.left])){
						newIndex = newNeighbor.left;
						newRowCol = indexToRowCol(board, newIndex);	
						newRow = newRowCol.row;
						newCol = newRowCol.col; 
						newNeighbor = findAdjacent(board, newIndex, newRow, newCol);
					}
					if (ifLettersDoNotMatch(board[newIndex], board[newNeighbor.left])){
						break;
					}
					//if empty " ", then there was no same letter to sandwich the opposing letter
					if (board[newNeighbor.left] == " "){
						break;
					}
				} while (newNeighbor.left != undefined);
			}
		}
		// console.log("right\n")
		//check right
		if (neighbors.right != undefined){
			if (board[neighbors.right] == " "){
			}
			else if (ifLettersDoNotMatch(letter, board[neighbors.right])){
				let newIndex = neighbors.right;
				let newRowCol = Object.assign({}, indexToRowCol(board, newIndex));
				let newRow = newRowCol.row;
				let newCol = newRowCol.col; 
				let newNeighbor = findAdjacent(board, newIndex, newRow, newCol);
				do{
					//returns true if original letter is found sandwiching opposite letter
					if (ifLettersMatch(letter, board[newNeighbor.right])){
						arr.push([newRow, newCol]);
					}
					//increments to the next neighbor if current letter matches letter above
					if (ifLettersMatch(board[newIndex], board[newNeighbor.right])){
						newIndex = newNeighbor.right;
						newRowCol = indexToRowCol(board, newIndex);	
						newRow = newRowCol.row;
						newCol = newRowCol.col; 
						newNeighbor = findAdjacent(board, newIndex, newRow, newCol);
					}
					if (ifLettersDoNotMatch(board[newIndex], board[newNeighbor.right])){
						break;
					}
					//if empty " ", then there was no same letter to sandwich the opposing letter
					if (board[newNeighbor.right] == " "){
						break;
					}
				} while (newNeighbor.right != undefined);
			}
		}
		// console.log("upLeft\n")
		//check upLeft
		if (neighbors.upLeft != undefined){
			if (board[neighbors.upLeft] == " "){
			}
			else if (ifLettersDoNotMatch(letter, board[neighbors.upLeft])){
				let newIndex = neighbors.upLeft;
				let newRowCol = Object.assign({}, indexToRowCol(board, newIndex));
				let newRow = newRowCol.row;
				let newCol = newRowCol.col; 
				let newNeighbor = findAdjacent(board, newIndex, newRow, newCol);
				do{
					//returns true if original letter is found sandwiching opposite letter
					if (ifLettersMatch(letter, board[newNeighbor.upLeft])){
						arr.push([newRow, newCol]);
					}
					//increments to the next neighbor if current letter matches letter above
					if (ifLettersMatch(board[newIndex], board[newNeighbor.upLeft])){
						newIndex = newNeighbor.upLeft;
						newRowCol = indexToRowCol(board, newIndex);	
						newRow = newRowCol.row;
						newCol = newRowCol.col; 
						newNeighbor = findAdjacent(board, newIndex, newRow, newCol);
					}
					if (ifLettersDoNotMatch(board[newIndex], board[newNeighbor.upLeft])){
						break;
					}
					//if empty " ", then there was no same letter to sandwich the opposing letter
					if (board[newNeighbor.upLeft] == " "){
						break;
					}
				} while (newNeighbor.upLeft != undefined);
			}
		}
		//check upRight
		// console.log("upRight\n")
		if (neighbors.upRight != undefined){
			if (board[neighbors.upRight] == " "){
			}
			else if (ifLettersDoNotMatch(letter, board[neighbors.upRight])){
				let newIndex = neighbors.upRight;
				let newRowCol = Object.assign({}, indexToRowCol(board, newIndex));
				let newRow = newRowCol.row;
				let newCol = newRowCol.col; 
				let newNeighbor = findAdjacent(board, newIndex, newRow, newCol);
				do{
					//returns true if original letter is found sandwiching opposite letter
					if (ifLettersMatch(letter, board[newNeighbor.upRight])){
						arr.push([newRow, newCol]); 
					}
					//increments to the next neighbor if current letter matches letter above
					if (ifLettersMatch(board[newIndex], board[newNeighbor.upRight])){
						newIndex = newNeighbor.upRight;
						newRowCol = indexToRowCol(board, newIndex);	
						newRow = newRowCol.row;
						newCol = newRowCol.col; 
						newNeighbor = findAdjacent(board, newIndex, newRow, newCol);
					}
					if (ifLettersDoNotMatch(board[newIndex], board[newNeighbor.upRight])){
						break;
					}
					//if empty " ", then there was no same letter to sandwich the opposing letter
					if (board[newNeighbor.upRight] == " "){
						break;
					}
				} while (newNeighbor.upRight != undefined);
			}
		}
		//check bottomLeft
		//console.log("bottomleft\n")
		if (neighbors.bottomLeft != undefined){
			if (board[neighbors.bottomLeft] == " "){
			}
			else if (ifLettersDoNotMatch(letter, board[neighbors.bottomLeft])){
				let newIndex = neighbors.bottomLeft;
				let newRowCol = Object.assign({}, indexToRowCol(board, newIndex));
				let newRow = newRowCol.row;
				let newCol = newRowCol.col; 
				let newNeighbor = findAdjacent(board, newIndex, newRow, newCol);
				do{
					//returns true if original letter is found sandwiching opposite letter
					if (ifLettersMatch(letter, board[newNeighbor.bottomLeft])){
						arr.push([newRow, newCol]); 
					}
					//increments to the next neighbor if current letter matches letter above
					if (ifLettersMatch(board[newIndex], board[newNeighbor.bottomLeft])){
						newIndex = newNeighbor.bottomLeft;
						newRowCol = indexToRowCol(board, newIndex);	
						newRow = newRowCol.row;
						newCol = newRowCol.col; 
						newNeighbor = findAdjacent(board, newIndex, newRow, newCol);
					}
					if (ifLettersDoNotMatch(board[newIndex], board[newNeighbor.bottomLeft])){
						break;
					}
					//if empty " ", then there was no same letter to sandwich the opposing letter
					if (board[newNeighbor.bottomLeft] == " "){
						break;
					}
				} while (newNeighbor.bottomLeft != undefined);
			}
		}
		//check bottomRight
		// console.log("bottomRight\n")
		if (neighbors.bottomRight != undefined){
			if (board[neighbors.bottomRight] == " "){
			}
			else if (ifLettersDoNotMatch(letter, board[neighbors.bottomRight])){
				let newIndex = neighbors.bottomRight;
				let newRowCol = Object.assign({}, indexToRowCol(board, newIndex));
				let newRow = newRowCol.row;
				let newCol = newRowCol.col; 
				let newNeighbor = findAdjacent(board, newIndex, newRow, newCol);
				do{
					//returns true if original letter is found sandwiching opposite letter
					if (ifLettersMatch(letter, board[newNeighbor.bottomRight])){
						arr.push([newRow, newCol]);
					}
					//increments to the next neighbor if current letter matches letter above
					if (ifLettersMatch(board[newIndex], board[newNeighbor.bottomRight])){
						newIndex = newNeighbor.bottomRight;
						newRowCol = indexToRowCol(board, newIndex);	
						newRow = newRowCol.row;
						newCol = newRowCol.col; 
						newNeighbor = findAdjacent(board, newIndex, newRow, newCol);
					}
					if (ifLettersDoNotMatch(board[newIndex], board[newNeighbor.bottomRight])){
						break;
					}
					//if empty " ", then there was no same letter to sandwich the opposing letter
					if (board[newNeighbor.bottomRight] == " "){
						break;
					}
				} while (newNeighbor.bottomRight != undefined);
			}
		}
	}
	//console.log(arr);
	return arr;
}

module.exports = {
    repeat: repeat,
    generateBoard: generateBoard,
    rowColToIndex: rowColToIndex,
    indexToRowCol: indexToRowCol,
    setBoardCell: setBoardCell,
    algebraicToRowCol: algebraicToRowCol,
    placeLetters: placeLetters,
    boardToString: boardToString,
    isBoardFull: isBoardFull,
    flip: flip,
    flipCells: flipCells,
    isValidMove: isValidMove,
    findAdjacent: findAdjacent,
    ifLettersMatch: ifLettersMatch,
    ifLettersDoNotMatch: ifLettersDoNotMatch,
    isValidMoveAlgebraicNotation: isValidMoveAlgebraicNotation,
    getValidMoves: getValidMoves,
    getLetterCounts: getLetterCounts,
    getCellsToFlip: getCellsToFlip
    // ...
};