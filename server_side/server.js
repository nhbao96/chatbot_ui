const express = require('express');
const cors = require('cors');
const fs = require('fs'); 
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.post('/question', (req, res) => {
    const userQuestion = req.body.question;

    console.log(`Received question: ${userQuestion}`);

    // simulate 3s processing time
    setTimeout(() => {
        res.json({
            code: 200,
            data: {
                answer: `hehe`
            }
        });
    }, 3000);
});

// Endpoint /voting
app.post('/voting', (req, res) => {
    const vote = req.body.vote;

    if (vote === undefined || (vote !== 1 && vote !== 0)) {
        res.status(400).json({
            code: 400,
            msg: 'Invalid vote value. Vote should be 1 (like) or 0 (dislike).'
        });
    } else {
        console.log(`Received vote: ${vote}`);
        res.json({
            code: 200
        });
    }
});


app.listen(port, 'localhost', () => {
    console.log(`Server running at http://localhost:${port}/`);
});
