console.log("script.js: JavaScript file loaded successfully!");

// Collapsible Sections
const collapsibles = document.getElementsByClassName("collapsible");
for (let i = 0; i < collapsibles.length; i++) {
    collapsibles[i].addEventListener("click", function() {
        this.classList.toggle("active");
        const content = this.nextElementSibling;
        content.style.display = content.style.display === "block" ? "none" : "block";
    });
}

// Chatbot with Gemini API
const chatOutput = document.getElementById("chat-output");
const chatInput = document.getElementById("chat-input");
const apiKey = "AIzaSyAuJ_OIy81PngLS_5OEJzTaZWT9Xav8cMw"; // Your Gemini API key
const chatbot = document.getElementById("chatbot");
const minimizeBtn = document.getElementById("minimize-btn");
const closeBtn = document.getElementById("close-btn");
const askAiLink = document.getElementById("ask-ai-link");
const chatbotToggle = document.getElementById("chatbot-toggle");

chatInput.addEventListener("keypress", async function(e) {
    if (e.key === "Enter" && chatInput.value.trim()) {
        const userQuestion = chatInput.value.trim();
        chatOutput.innerHTML += `<p><strong>You:</strong> ${userQuestion}</p>`;
        chatOutput.scrollTop = chatOutput.scrollHeight;

        const response = await fetchGeminiResponse(userQuestion);
        setTimeout(() => {
            chatOutput.innerHTML += `<p><strong>AI:</strong> ${response}</p>`;
            chatOutput.scrollTop = chatOutput.scrollHeight;
        }, 500);
        chatInput.value = "";
    }
});

minimizeBtn.addEventListener("click", function() {
    chatbot.classList.toggle("minimized");
    minimizeBtn.textContent = chatbot.classList.contains("minimized") ? "+" : "-";
});

closeBtn.addEventListener("click", function() {
    chatbot.classList.add("hidden");
    chatbotToggle.style.display = "block"; // Show floating button when chatbot is closed
});

askAiLink.addEventListener("click", function(e) {
    e.preventDefault(); // Prevent default anchor behavior
    if (chatbot.classList.contains("hidden")) {
        chatbot.classList.remove("hidden");
        chatbot.classList.remove("minimized"); // Ensure it’s fully open
        minimizeBtn.textContent = "-";
        chatbotToggle.style.display = "none"; // Hide floating button
    }
});

chatbotToggle.addEventListener("click", function() {
    chatbot.classList.remove("hidden");
    chatbot.classList.remove("minimized"); // Ensure it’s fully open
    minimizeBtn.textContent = "-";
    chatbotToggle.style.display = "none"; // Hide floating button
});

async function fetchGeminiResponse(question) {
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Answer this investment-related question: ${question}`
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const generatedText = data.candidates[0].content.parts[0].text;
        return generatedText || "Sorry, I couldn’t generate a response. Try again!";
    } catch (error) {
        console.error("Error fetching Gemini API:", error);
        return "Oops! Something went wrong with the AI. Please try again later.";
    }
}