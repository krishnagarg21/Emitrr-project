import React, { useEffect, useState } from 'react';

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/leaderboard')
            .then(res => res.json())
            .then(data => setLeaders(data))
            .catch(err => console.error('Error fetching leaderboard', err));
    }, []);

    return (
        <div className="leaderboard-container">
            <h3>Leaderboard</h3>
            <table className="leaderboard">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Player</th>
                        <th>Wins</th>
                        <th>Losses</th>
                        <th>Draws</th>
                    </tr>
                </thead>
                <tbody>
                    {leaders.map((p, idx) => (
                        <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td>{p.username}</td>
                            <td>{p.wins}</td>
                            <td>{p.losses}</td>
                            <td>{p.draws}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Leaderboard;
