import React from 'react';

const Board = ({ board, onMove, myPlayerNum, turn, winner }) => {
    // board is 6 rows, 7 cols
    return (
        <div className="board">
            {board.map((row, rIdx) => (
                row.map((cell, cIdx) => (
                    <div
                        key={`${rIdx}-${cIdx}`}
                        className={`cell ${cell === 1 ? 'player1' : (cell === 2 ? 'player2' : '')}`}
                        onClick={() => {
                            if (!winner && turn === myPlayerNum && cell === 0) {
                                onMove(cIdx);
                            }
                        }}
                    >
                    </div>
                ))
            ))}
        </div>
    );
};

export default Board;
