import React, { useEffect, useState } from 'react';

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);

    useEffect(() => {
        const apiBase = import.meta.env.VITE_BACKEND_URL || '';
        const apiUrl = apiBase ? apiBase.replace(/\/$/, '') + '/leaderboard' : '/leaderboard';

        fetch(apiUrl)
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
