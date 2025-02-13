const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const CHAT_FILE = './data/chat.json';

// โหลดแชทที่เคยบันทึกไว้
let chatHistory = [];
if (fs.existsSync(CHAT_FILE)) {
    try {
        const data = fs.readFileSync(CHAT_FILE, 'utf8');
        chatHistory = data ? JSON.parse(data) : [];
    } catch (err) {
        console.error('โหลดแชทเก่าไม่ได้:', err.message);
        chatHistory = [];
    }
}

// เสิร์ฟไฟล์ static
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

// จัดการการเชื่อมต่อของ socket.io
io.on('connection', (socket) => {
    console.log('มีผู้ใช้ใหม่เชื่อมต่อ: ' + socket.id);
    
    // ส่งแชทเก่าให้ user ใหม่
    socket.emit('chat history', chatHistory);

    // รับข้อความจาก user
    socket.on('chat message', (data) => {
        const message = {
            name: data.name,
            text: data.text,
            time: new Date().toLocaleTimeString()
        };

        chatHistory.push(message);

        // ถ้ามีมากกว่า 20 แชท ให้ลบของเก่า
        if (chatHistory.length > 20) {
            chatHistory.shift();
        }

        // บันทึกลงไฟล์
        try {
            fs.writeFileSync(CHAT_FILE, JSON.stringify(chatHistory, null, 2));
        } catch (err) {
            console.error('บันทึกแชทไม่ได้:', err.message);
        }

        io.emit('chat message', message);
    });

    socket.on('disconnect', () => {
        console.log('ผู้ใช้ตัดการเชื่อมต่อ: ' + socket.id);
    });
});

server.listen(3000, () => {
    console.log('เซิร์ฟเวอร์ทำงานที่ http://localhost:3000');
});
