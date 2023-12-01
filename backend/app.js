const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '79Db7z3f~NYiv+e!',
    database: 'voting',
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.message);
    } else {
        console.log('Connected to MySQL');
    }
});

app.use(cors());

app.use(bodyParser.json());

app.post('/candidate-registration', (req, res) => {
    const { username, passport_id, educational_qualification, dob, residence, campaign_desc, electionID } = req.body;

    const checkCandidate = 'SELECT passport_id, verified FROM candidate WHERE passport_id = ?  AND electionID = ?';
    db.query(checkCandidate, [passport_id, electionID], (err, results) => {
        if (err) {
            console.error('Database error: ' + err.message);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        if (results && results.length && results.length == 1) {
            if (results[0].verified) {
                res.json({
                    candidateFound: true,
                    message: "Candidate already registered. Please goto login!"
                });
            } else {
                res.json({
                    candidateFound: true,
                    message: "Candidate already registered. Please contact admin to be verified!"
                });
            }
        } else {
            const intertUser = 'INSERT INTO users (username, password, user_type, userID, dob) VALUES (?, ?, ?, ?, ?)';

            db.query(intertUser, [username, 12345, 'Candidate', passport_id, dob], (err, results) => {
                if (err) {
                    console.error('Database error: ' + err.message);
                    res.status(500).json({ error: 'Internal server error' });
                    return;
                }
                
                
                const intertCandiate = 'INSERT INTO Candidate (passport_id, educational_qualification, residence, campaign_desc, verified, electionID) VALUES (?, ?, ?, ?, ?, ?)';
                db.query(intertCandiate, [passport_id, educational_qualification, residence, campaign_desc, 0, electionID], (err, results) => {
                    if (err) {
                        console.error('Database error: ' + err.message);
                        res.status(500).json({ error: 'Internal server error' });
                        return;
                    }
                    
                    res.json({ voterFound: false, message: "Candidate registered successfully! Please contact admin to be verified!" });
                });
            });

        }
    })
});

app.post('/voter-registration', (req, res) => {
    const { username, passport_id, dob } = req.body;

    const checkVR = 'SELECT * FROM Voter WHERE passport_id = ?';
    db.query(checkVR, [passport_id], (err, results) => {
        if (err) {
            console.error('Database error checkVR: ' + err.message);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        if (results.length && results.length >= 1) {
            res.json({ voterFound: true });
        } else {
            const intertUser = 'INSERT INTO users (username, password, user_type, userID, dob) VALUES (?, ?, ?, ?, ?)';
        
            db.query(intertUser, [username, 12345, 'Voter', passport_id, dob], (err, results) => {
                if (err) {
                    console.error('Database error - intertUser: ' + err.message);
                    res.status(500).json({ error: 'Internal server error' });
                    return;
                }
                
                const intertVoter = 'INSERT INTO Voter (passport_id) VALUES (?)';
                db.query(intertVoter, [passport_id], (err, results) => {
                    if (err) {
                        console.error('Database error -intertVoter: ' + err.message);
                        res.status(500).json({ error: 'Internal server error' });
                        return;
                    }
                    
                    res.json({ voterFound: false, message: "Voter registered successfully! Your User ID is your Passport Card No and your password is 12345" });
                });
            });
        }
    })
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});