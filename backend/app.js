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

app.post('/login', (req, res) => {
    const { userID, password, userType } = req.body;

    const query = 'SELECT * FROM users WHERE userID = ? AND password = ? AND user_type = ?';

    db.query(query, [userID, password, userType], (err, results) => {
        if (err) {
            console.error('Database error: ' + err.message);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        if (results && results.length === 1) {
            if (userType === 'Candidate') {
                const canFetchQuery = 'SELECT passport_id, verified FROM candidate WHERE passport_id = ?';
                db.query(canFetchQuery, [userID], (err, results1) => {
                    if (err) {
                        console.error('Database error: ' + err.message);
                        res.status(500).json({ error: 'Internal server error' });
                        return;
                    }
                    results1 = JSON.parse(JSON.stringify(results1));
                    if (results1 && results1.length == 1) {
                        if (results1[0].verified) {
                            res.json({
                                data: results,
                                accountVerified: 1,
                                message: 'Login successful'
                            });
                        } else {
                            res.json({
                                data: results,
                                accountVerified: 0,
                                message: "Login successful"
                            });
                        }
                    } else {
                        res.json({
                            error: 'Invalid credentials'
                        });
                    }
                });
            } else {
                res.json({ data: results, message: 'Login successful' });
            }
        } else {
            res.json({ error: 'Invalid credentials' });
        }
    });
});

app.post('/addNewElection', (req, res) => {
    const { electionID, electionName, electionDate } = req.body;

    const query = 'SELECT * FROM Elections WHERE electionID = ?';

    db.query(query, [electionID], (err, results) => {
        if (err) {
            console.error('Database error: ' + err.message);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        if (results && results.length && results.length == 1) {
            res.json({
                res: false,
                message: "Election with this election id already exists!"
            });
        } else {
            const insertElection = 'INSERT INTO Elections VALUES (?, ?, ?)';

            db.query(insertElection, [electionID, electionName, electionDate], (err, results) => {
                if (err) {
                    console.error('Database error: ' + err.message);
                    res.status(500).json({ error: 'Internal server error' });
                    return;
                }

                res.json({
                    res: true,
                    message: "Election created successfully!"
                });
                
            });

        }
    });
});

app.get('/fetchAllElections', (req, res) => {

    const query = 'SELECT * FROM elections';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error: ' + err.message);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        results = JSON.parse(JSON.stringify(results));
        res.json({ data: results });
    });

});

app.post('/fetchCandidateForElections', async (req, res) => {

    const { electionID, verified } = req.body;

    const fetchCandidateQuery = "SELECT passport_id, campaign_desc, educational_qualification, residence, username, dob FROM candidate JOIN users ON candidate.passport_id = users.userID WHERE candidate.electionID = ? AND users.user_type = 'Candidate' AND candidate.verified = ?;";
    db.query(fetchCandidateQuery, [electionID, verified], (err, results) => {
        if (err) {
            console.error('Database error: ' + err.message);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        results = JSON.parse(JSON.stringify(results));
        res.json({ data: results });
    });

});

app.post('/fetchElectionResults', (req, res) => {

    const { electionID } = req.body;

    const fetchCandidateQuery = "SELECT passport_id, campaign_desc, educational_qualification, residence, username, dob FROM candidate JOIN users ON candidate.passport_id = users.userID WHERE candidate.electionID = ? AND users.user_type = 'Candidate' AND candidate.verified = 1;";
    db.query(fetchCandidateQuery, [electionID], async (err, results) => {
        if (err) {
            console.error('Database error: ' + err.message);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        results = JSON.parse(JSON.stringify(results));
        let candidateIDs = [];
        if (results && results.length) {
            results.forEach(element => {
                candidateIDs.push(element.passport_id);
            });
            const fetchVotingCount = "SELECT candidateID from election_voting WHERE electionID = ? AND candidateID IN (?)";
            db.query(fetchVotingCount, [electionID, candidateIDs], (err, results1) => {
                if (err) {
                    console.error('Database error: ' + err.message);
                    res.status(500).json({ error: 'Internal server error' });
                    return;
                }
                results1 = JSON.parse(JSON.stringify(results1));
                results.forEach(eachCandidate => {
                    eachCandidate.votes = 0;
                    results1.forEach(eachVoting => {
                        if(eachCandidate.passport_id == eachVoting.candidateID) {
                            eachCandidate.votes++;
                        }
                    });
                });
                res.json({ data: results });
            });
        } else {
            res.json({ data: results });
        }
    });

});

app.post('/fetchCandidateData', (req, res) => {

    const { userID } = req.body;

    const fetchCandidateQuery = "SELECT passport_id, campaign_desc, educational_qualification, residence, username, dob, elections.electionID AS electionID, electionName FROM candidate JOIN users ON candidate.passport_id = users.userID JOIN elections ON candidate.electionID = elections.electionID WHERE candidate.passport_id = ? AND users.user_type = 'Candidate' AND candidate.verified = 1;";
    db.query(fetchCandidateQuery, [userID], (err, results) => {
        if (err) {
            console.error('Database error: ' + err.message);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        results = JSON.parse(JSON.stringify(results));
        res.json({ data: results });
    });

});

app.get('/fetchAllVoters', (req, res) => {

    const fetchVotersQuery = "SELECT passport_id, username, dob FROM voter JOIN users ON voter.passport_id = users.userID;";
    db.query(fetchVotersQuery, (err, results) => {
        if (err) {
            console.error('Database error: ' + err.message);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        results = JSON.parse(JSON.stringify(results));
        res.json({ data: results });
    });

});

app.post('/voteForACandidate', (req, res) => {

    const { electionID, candidateID, voterID } = req.body;

    const voteForACandidateQuery = "INSERT INTO election_voting (electionID, candidateID, voterID) VALUES(?, ?, ?);";
    db.query(voteForACandidateQuery, [electionID, candidateID, voterID], (err, results) => {
        if (err) {
            console.error('Database error: ' + err.message);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json({ voting: true, message: "Voting registered successfully!" });
    });

});

app.post('/updateCondidateStatus', (req, res) => {

    const { electionID, passport_id, verified } = req.body;

    const updateCandidateQuery = "UPDATE candidate SET verified = ? WHERE electionID = ? AND passport_id = ?";
    db.query(updateCandidateQuery, [verified, electionID, passport_id], (err, results) => {
        if (err) {
            console.error('Database error: ' + err.message);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json({
            res: true,
            message: "Candidate status updated successfully!"
        });
    });

});

app.post('/saveCandidateDetails', (req, res) => {

    const payload = req.body;
    const promiseArray = [];
    promiseArray.push(new Promise((resolve, reject) => {
        const updateUserQuery = "UPDATE users SET dob = ? WHERE userID = ?";
        db.query(updateUserQuery, [payload.dob, payload.userID], (err, results) => {
            if (err) {
                reject(err);
            }
            resolve(true);
        });
    }));
    promiseArray.push(new Promise((resolve, reject) => {
        const updateCandidateQuery = "UPDATE candidate SET residence = ?, educational_qualification = ?, campaign_desc = ? WHERE passport_id = ?";
        db.query(updateCandidateQuery, [payload.residence, payload.educational_qualification, payload.campaign_desc, payload.userID], (err, results) => {
            if (err) {
                reject(err);
            }
            resolve(true);
        });
    }));

    Promise.all(promiseArray).then((result1, result2) => {
        res.json({
            res: true,
            message: "Candidate details updated successfully!"
        });
    }).catch((err) => {
        console.error('Database error: ' + err.message);
        res.status(500).json({ error: 'Internal server error' });
        return;
    });
    
});

app.post('/fetchUnVotedElection', (req, res) => {

    const { userID } = req.body;

    const fetchElectionVotingData = "SELECT electionID FROM election_voting WHERE voterID = ?";
    db.query(fetchElectionVotingData, [userID], (err, results) => {
        if (err) {
            console.error('Database error: ' + err.message);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        results = JSON.parse(JSON.stringify(results));
        let electionIds = [];
        if (results && results.length == 0) {
            electionIds = [''];
        } else {
            results.forEach(element => {
                electionIds.push(element.electionID);
            });
        }
        const fetchAllUnVotedElection = "SELECT * FROM elections WHERE electionID NOT IN (?)";
        db.query(fetchAllUnVotedElection, [electionIds], (err, results1) => {
            if (err) {
                console.error('Database error: ' + err.message);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            results1 = JSON.parse(JSON.stringify(results1));
            res.json({ data: results1 });
        });
    });

});

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