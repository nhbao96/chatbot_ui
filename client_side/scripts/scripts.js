const END_POINT = "http://localhost:3000/question";         //change here

document.addEventListener('DOMContentLoaded', () => {
    const sendButton = document.getElementById('send-button');
    const inputBox = document.getElementById('input-box');

    inputBox.disabled = false;
    sendButton.disabled = false;

    inputBox.addEventListener('keydown', handleKeyDown);
    inputBox.addEventListener('input', adjustInputHeight); 
    sendButton.addEventListener('click', sendMessage);
});

function handleKeyDown(event) {
    const inputBox = document.getElementById('input-box');

    if (event.key === 'Enter' && event.shiftKey) {
        event.preventDefault();
        inputBox.value += "\n";
    }
    else if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
}

function adjustInputHeight() {
    const inputBox = document.getElementById('input-box');
    inputBox.style.height = 'auto'; 
    inputBox.style.height = (inputBox.scrollHeight) + 'px'; 
}

function sendMessage() {
    const inputBox = document.getElementById('input-box');
    const chatWindow = document.getElementById('chat-window');
    const typingIndicator = document.getElementById('typing-indicator');
    const sendButton = document.getElementById('send-button');

    if (inputBox.value.trim() === '') return;

    inputBox.disabled = true;
    sendButton.disabled = true;

    const userMessageContainer = document.createElement('div');
    userMessageContainer.className = 'message-container user';

    const userMessage = document.createElement('div');
    userMessage.className = 'message user-message';
    userMessage.innerText = inputBox.value.trim();

    userMessageContainer.appendChild(userMessage);
    chatWindow.appendChild(userMessageContainer);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    typingIndicator.classList.add('show');

    fetch(END_POINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: inputBox.value.trim() })
    })
    .then(response => response.json())
    .then(data => {
        typingIndicator.classList.remove('show');

        if (data && data.data && data.data.answer) {
            const botMessageContainer = document.createElement('div');
            botMessageContainer.className = 'message-container bot';

            const botAvatar = document.createElement('img');
            botAvatar.src = 'assets/avatar.png'; 
            botAvatar.alt = 'Bot Avatar';
            botAvatar.className = 'bot-avatar';

            const botMessage = document.createElement('div');
            botMessage.className = 'message bot-message';
            botMessage.innerText = data.data.answer;

            botMessageContainer.appendChild(botAvatar);
            botMessageContainer.appendChild(botMessage);
            chatWindow.appendChild(botMessageContainer);
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }

        inputBox.style.height = 'auto'; 
        inputBox.disabled = false;
        sendButton.disabled = false;
        inputBox.focus();
    })
    .catch(error => {
        typingIndicator.classList.remove('show');
        console.error('Error:', error);
        inputBox.disabled = false;
        sendButton.disabled = false;
    });

    inputBox.value = '';
}
