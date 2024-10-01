const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000; 

app.use(cors());

app.use(express.json());

app.post('/question', (req, res) => {
    const userQuestion = req.body.question;

    console.log(`Received question: ${userQuestion}`);

    // simulate 3s
    setTimeout(() => {
        res.json({
            code: 200,
            data: {
                answer: `Mời độc giả đón đọc tin tức thời sự về chính trị, kinh tế, đời sống, xã hội, pháp luật, thể thao, văn hoá, giải trí... Xem truyền hình trực tuyến, TV Online các kênh VTV trên Internet.Mời độc giả đón đọc tin tức thời sự về chính trị, kinh tế, đời sống, xã hội, pháp luật, thể thao, văn hoá, giải trí... Xem truyền hình trực tuyến, TV Online các kênh VTV trên Internet.Mời độc giả đón đọc tin tức thời sự về chính trị, kinh tế, đời sống, xã hội, pháp luật, thể thao, văn hoá, giải trí... Xem truyền hình trực tuyến, TV Online các kênh VTV trên Internet.Mời độc giả đón đọc tin tức thời sự về chính trị, kinh tế, đời sống, xã hội, pháp luật, thể thao, văn hoá, giải trí... Xem truyền hình trực tuyến, TV Online các kênh VTV trên Internet.Mời độc giả đón đọc tin tức thời sự về chính trị, kinh tế, đời sống, xã hội, pháp luật, thể thao, văn hoá, giải trí... Xem truyền hình trực tuyến, TV Online các kênh VTV trên Internet.`
            }
        });
    }, 3000); 
});

app.listen(port, 'localhost', () => {
    console.log(`Server running at http://localhost:${port}/`);
});
