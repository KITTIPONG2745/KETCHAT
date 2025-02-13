const socket = io(); // เรียกใช้งาน socket.io

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

// ส่งข้อความเมื่อกดส่ง
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value); // ส่งข้อความไปที่เซิร์ฟเวอร์
        input.value = '';
    }
});

// แสดงข้อความที่ได้รับจาก server
socket.on('chat message', (msg) => {
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});
