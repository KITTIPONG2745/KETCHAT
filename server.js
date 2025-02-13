const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// ให้ Express ใช้ไฟล์ static
app.use(express.static('public'));

// ตั้งค่าการใช้ EJS
app.set('view engine', 'ejs');

// เปิดหน้าแรก
app.get('/', (req, res) => {
    res.render('index');
});

// เมื่อมีการเชื่อมต่อ Socket
io.on('connection', (socket) => {
    console.log('มีผู้ใช้งานเชื่อมต่อ: ' + socket.id);

    // รับข้อความจากผู้ใช้
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg); // ส่งข้อความให้ทุกคน
    });

    socket.on('disconnect', () => {
        console.log('ผู้ใช้ตัดการเชื่อมต่อ: ' + socket.id);
    });
});

// เปิดเซิร์ฟเวอร์
server.listen(3000, () => {
    console.log('Server เปิดที่ http://localhost:3000');
});
