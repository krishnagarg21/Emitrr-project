import React, { useState } from 'react';

const Lobby = ({ onJoin }) => {
    const [username, setUsername] = useState('');

    const handleJoin = () => {
        if (username.trim()) {
            onJoin(username);
        }
    };

    return (
        <div className="lobby">
            <h1>4 in a Row</h1>
            <div className="input-group">
                <input
                    type="text"
                    placeholder="Enter Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <button onClick={handleJoin}>Find Game</button>
            </div>
        </div>
    );
};

export default Lobby;
