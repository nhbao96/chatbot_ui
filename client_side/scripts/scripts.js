//CONFIG
const QUESTION_END_POINT = "http://localhost:5000/question";  
const VOTING_END_POINT = "http://localhost:5000/voting";  
const RECOMMENDATION_QUESTIONS_FILE = "Sample_Eval_QaA.json";  


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
    hideSuggestions();
    hideHint();

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

    fetch(QUESTION_END_POINT, {
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

            const voteContainer = document.createElement('div');
            voteContainer.className = 'vote-container';

            const likeButton = document.createElement('span');
            likeButton.className = 'vote-button';
            likeButton.innerHTML = '👍';
            likeButton.onclick = () => voteFeedback(1, likeButton, dislikeButton);

            const dislikeButton = document.createElement('span');
            dislikeButton.className = 'vote-button';
            dislikeButton.innerHTML = '👎';
            dislikeButton.onclick = () => voteFeedback(0, dislikeButton, likeButton);

            voteContainer.appendChild(likeButton);
            voteContainer.appendChild(dislikeButton);
          
            botMessage.appendChild(voteContainer);

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

function voteFeedback(voteValue, selectedButton, otherButton) {
    fetch(VOTING_END_POINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vote: voteValue })
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.code === 200) {
            selectedButton.classList.add('selected');
            otherButton.classList.add('disabled');

            selectedButton.onclick = null;
            otherButton.onclick = null;
        }
    })
    .catch(error => {
        console.error('Error voting:', error);
    });
}

let allQuestions = []; 
let sessionQuestions = []; 
let currentHint = ''; 

document.addEventListener('DOMContentLoaded', () => {
    const sendButton = document.getElementById('send-button');
    const inputBox = document.getElementById('input-box');
    const fileInput = document.getElementById('file-input');
    const fileStatus = document.getElementById('file-status');
    const suggestionBox = document.getElementById('suggestion-box');
    const hintBox = document.createElement('span');
    hintBox.className = 'hint-box'; 
    inputBox.parentNode.insertBefore(hintBox, inputBox.nextSibling); 

    inputBox.disabled = false;
    sendButton.disabled = false;

    fetch(RECOMMENDATION_QUESTIONS_FILE)
    .then(response => response.json())  
    .then(data => {
        console.log("Dữ liệu đã nhận từ tệp JSON:", data);

        Object.keys(data).forEach(url => {

            const questionsAndAnswers = data[url];
            questionsAndAnswers.forEach((item, index) => {
                allQuestions.push(item.question);
            });
        });
    })
    .catch(error => console.error("error JSON:", error));


    inputBox.addEventListener('keydown', handleKeyDown);
    inputBox.addEventListener('input', adjustInputHeight);
    inputBox.addEventListener('input', handleInputChange); 
    sendButton.addEventListener('click', sendMessage);
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            hideSuggestions(); 
            hideHint();
        }
    });
});

function handleKeyDown(event) {
    const inputBox = document.getElementById('input-box');
    const suggestionBox = document.getElementById('suggestion-box');

    if (event.key === 'Shift') {
        showSuggestions();
    }

    if (event.key === 'Enter' && event.shiftKey) {
        event.preventDefault();
        inputBox.value += "\n";
    }

    if (event.key === 'Enter'  && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
        hideSuggestions();
        hideHint();
    }

    if (event.key === 'Tab' && currentHint !== '') {
        event.preventDefault(); 
        inputBox.value = currentHint; 
        hideHint(); 
    }
}

function handleInputChange(event) {
    const inputBox = document.getElementById('input-box');
    const hintBox = document.querySelector('.hint-box');

    const userInput = inputBox.value.trim().toLowerCase(); 

    if (userInput === '' || allQuestions.length === 0) {
        hideHint();
        return;
    }


    const matchingQuestion = allQuestions.find(question => question.toLowerCase().startsWith(userInput));

    if (matchingQuestion) {
        currentHint = matchingQuestion; 
        hintBox.textContent = matchingQuestion; 
        hintBox.style.display = 'inline'; 
    } else {
        hideHint(); 
    }
}

var isShow = false;
function showSuggestions() {
    const inputBox = document.getElementById('input-box');
    const suggestionBox = document.getElementById('suggestion-box');
    suggestionBox.innerHTML = ''; 
    const userInput = inputBox.value.trim().toLowerCase(); 

    if (userInput === '' || allQuestions.length === 0) {
        sessionQuestions = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 5);
    } else {
        const filteredQuestions = allQuestions.filter(question =>
            question.toLowerCase().includes(userInput)
        );

        sessionQuestions = filteredQuestions.length > 0
            ? filteredQuestions.slice(0, 5) 
            : [];


        if (sessionQuestions.length < 5) {
            const remainingQuestions = allQuestions
                .filter(question => !sessionQuestions.includes(question)) 
                .sort(() => 0.5 - Math.random()) 
                .slice(0, 5 - sessionQuestions.length); 

            sessionQuestions = sessionQuestions.concat(remainingQuestions); 
        }
    }

    sessionQuestions.forEach(question => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        suggestionItem.innerText = question;

        suggestionItem.onclick = () => {
            document.getElementById('input-box').value = question;
            hideSuggestions();
        };

        suggestionBox.appendChild(suggestionItem);
    });

    suggestionBox.style.display = 'block'; 
}



function hideSuggestions() {
    const suggestionBox = document.getElementById('suggestion-box');
    suggestionBox.style.display = 'none';
    sessionQuestions = []; 
    isShow = false;
}

function hideHint() {
    const hintBox = document.querySelector('.hint-box');
    hintBox.style.display = 'none';
    hintBox.textContent = '';
    currentHint = '';
}