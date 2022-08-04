const socket = io();

const messageText = document.getElementById('message-to-send');
const sendButton = document.getElementById('send-button');
const usernameText = document.getElementById('username');

const addNewMessage = (sentTime, username, message, isRecipient) => {
    const messagesList = document.getElementById('messagesList');

    const messageDiv = document.createElement('div');
    const newMessage = document.createElement('li');
    const messageInfo = document.createElement('div');
    const nameSpan = document.createElement('span');
    const timeSpan = document.createElement('span');
    nameSpan.classList.add('message-data-name');
    nameSpan.textContent = username;
    timeSpan.classList.add('message-data-time');
    timeSpan.textContent = sentTime;
    messageDiv.textContent = message;

    if (isRecipient) {
        messageDiv.classList.add('message', 'other-message', 'float-right');
        messageInfo.classList.add('message-data', 'align-right');
    } else {
        messageDiv.classList.add('message', 'my-message');
        messageInfo.classList.add('message-data');
    }

    messageInfo.appendChild(nameSpan);
    messageInfo.appendChild(timeSpan);
    newMessage.appendChild(messageInfo);
    newMessage.appendChild(messageDiv);
    messagesList.appendChild(newMessage);
    messagesList.scrollIntoView(false);
};

sendButton.addEventListener('click', () => {
    const currentDate = new Date();
    socket.emit('chat message', {
        date: currentDate,
        username: usernameText.value,
        message: messageText.value,
    });
    const time = `${currentDate.getHours()} : ${currentDate.getMinutes()}`;
    addNewMessage(time, usernameText.value, messageText.value, false);
    messageText.value = '';
});

socket.on('chat message', (data) => {
    addNewMessage(data.username, data.sentTime, data.message, true);
});
