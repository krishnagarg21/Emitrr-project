class Bot {
    decideMove(board) {
        // Simple heuristic:
        // 1. Can I win now? -> do it
        // 2. Will opponent win next? -> block it
        // 3. Pick center if available (heuristically good)
        // 4. Random valid move

        const validMoves = this.getValidMoves(board);
        if (validMoves.length === 0) return -1; // Should not happen in active game

        // 1. Check for winning move
        for (const col of validMoves) {
            const tempBoard = this.simulateMove(board, col, 2);
            if (this.checkWin(tempBoard, 2)) return col;
        }

        // 2. Check for blocking move (if opponent plays here, do they win?)
        for (const col of validMoves) {
            const tempBoard = this.simulateMove(board, col, 1);
            if (this.checkWin(tempBoard, 1)) return col;
        }

        // 3. Center preference (col 3)
        if (validMoves.includes(3)) return 3;

        // 4. Random
        return validMoves[Math.floor(Math.random() * validMoves.length)];
    }

    getValidMoves(board) {
        const moves = [];
        for (let c = 0; c < 7; c++) {
            if (board[0][c] === 0) moves.push(c);
        }
        return moves;
    }

    simulateMove(board, col, player) {
        // Deep copy board
        const newBoard = board.map(row => [...row]);
        for (let r = 5; r >= 0; r--) {
            if (newBoard[r][col] === 0) {
                newBoard[r][col] = player;
                break;
            }
        }
        return newBoard;
    }

    // Duplicating checkWin logic here for autonomy or make it static utility
    checkWin(board, player) {
        // Horizontal
        for (let r = 0; r < 6; r++) {
            for (let c = 0; c < 4; c++) {
                if (board[r][c] === player && board[r][c + 1] === player && board[r][c + 2] === player && board[r][c + 3] === player) return true;
            }
        }
        // Vertical
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 7; c++) {
                if (board[r][c] === player && board[r + 1][c] === player && board[r + 2][c] === player && board[r + 3][c] === player) return true;
            }
        }
        // Diagonal /
        for (let r = 3; r < 6; r++) {
            for (let c = 0; c < 4; c++) {
                if (board[r][c] === player && board[r - 1][c + 1] === player && board[r - 2][c + 2] === player && board[r - 3][c + 3] === player) return true;
            }
        }
        // Diagonal \
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 4; c++) {
                if (board[r][c] === player && board[r + 1][c + 1] === player && board[r + 2][c + 2] === player && board[r + 3][c + 3] === player) return true;
            }
        }
        return false;
    }
}

module.exports = Bot;
