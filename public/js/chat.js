const socket = io();
let userName = '';

function joinChat() {
    userName = document.getElementById('nameInput').value.trim();
    if (userName) {
        document.getElementById('login').style.display = 'none';
        document.getElementById('chatArea').style.display = 'block';
    }
}

// ส่งข้อความ
document.getElementById('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('input');
    if (input.value) {
        socket.emit('chat message', { name: userName, text: input.value });
        input.value = '';
    }
});

// รับข้อความ
socket.on('chat message', (msg) => {
    const item = document.createElement('li');
    item.innerHTML = `<strong>${msg.name}</strong> [${msg.time}]: ${msg.text}`;
    document.getElementById('messages').appendChild(item);
});

// โหลดแชทเก่าเมื่อเข้าเว็บ
socket.on('chat history', (history) => {
    history.forEach((msg) => {
        const item = document.createElement('li');
        item.innerHTML = `<strong>${msg.name}</strong> [${msg.time}]: ${msg.text}`;
        document.getElementById('messages').appendChild(item);
    });
});
