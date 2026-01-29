const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'db/game.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    console.log('Clearing users table...');
    db.run("DELETE FROM users", (err) => {
        if (err) console.error("Error clearing users:", err);
        else console.log("Users table cleared.");
    });

    console.log('Clearing games table...');
    db.run("DELETE FROM games", (err) => {
        if (err) console.error("Error clearing games:", err);
        else console.log("Games table cleared.");
    });
});

db.close();
