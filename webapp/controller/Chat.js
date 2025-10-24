sap.ui.define([
    
], function() {
    "use strict";
    return {

        _chatHTMLContentAppended: false,

        _chatInitialized: false,

        _chatId: "",

        _getContext: function(){
            return "";
        },

        setContextProvider: function(fContext) {
            this._getContext = fContext;
        },

        setChatHTMLContent: function() {

            if(this._chatHTMLContentAppended){
                return;
            }

            this._chatHTMLContentAppended = true;
            
            // Create and append the script element for marked.js
            const script = document.createElement('script');
            //script.src = 'https://cdn.jsdelivr.net/npm/marked/lib/marked.umd.js';
            script.src = '../../libs/marked.umd.js';
            
            document.head.appendChild(script);

            script.onload = function() {
            
                console.log('marked.js loaded successfully');
            
                // Create the main chat container
                const chatContainer = document.createElement('div');
                chatContainer.id = 'aaic-chat-container';
                chatContainer.style.height = '100%';

                // Create the logo container
                const logoContainer = document.createElement('div');
                logoContainer.style.textAlign = 'center';

                const logo = document.createElement('img');
                logo.id = 'aaic-chat-logo';
                logo.src = 'https://yaai-tools.github.io/images/abapAI.svg';
                logo.alt = 'ABAP AI Logo';
                logo.style.height = '35px';
                logo.style.marginBottom = '10px';

                logoContainer.appendChild(logo);

                // Create message container
                const messageContainer = document.createElement('div');
                messageContainer.className = 'aaic-chat-message-container';

                // Create form container
                const formContainer = document.createElement('div');
                formContainer.className = 'aaic-chat-form-container';
                formContainer.style.display = 'flex';
                formContainer.style.justifyContent = 'center';

                // Create form
                const form = document.createElement('form');
                form.id = 'aaic-chat-form';
                form.method = 'post';

                // Create the select element
                const selectElement = document.createElement('select');
                selectElement.name = 'aaic-chat-api';
                selectElement.id = 'aaic-chat-api';
                selectElement.style.marginBottom = '10px';
                selectElement.style.display = 'block';
                selectElement.style.width = '100%';

                // Create and add OPENAI option
                const option1 = document.createElement('option');
                option1.value = 'OPENAI';
                option1.textContent = 'Open AI';
                option1.selected = true;
                selectElement.appendChild(option1);

                // Create and add GOOGLE option
                const option2 = document.createElement('option');
                option2.value = 'GOOGLE';
                option2.textContent = 'Google';
                selectElement.appendChild(option2);

                // Create and add ANTHROPIC option
                const option3 = document.createElement('option');
                option3.value = 'ANTHROPIC';
                option3.textContent = 'Anthropic';
                selectElement.appendChild(option3);

                // Create and add MISTRAL option
                const option4 = document.createElement('option');
                option4.value = 'MISTRAL';
                option4.textContent = 'Mistral';
                selectElement.appendChild(option4);

                // Create API key input
                const apiKeyInput = document.createElement('input');
                apiKeyInput.type = 'password';
                apiKeyInput.id = 'aaic-chat-api-key';
                apiKeyInput.name = 'aaic-chat-api-key';
                apiKeyInput.maxLength = 200;
                apiKeyInput.placeholder = 'Enter your API key';
                apiKeyInput.autocomplete = 'off';
                apiKeyInput.style.marginBottom = '10px';
                apiKeyInput.style.display = 'block';
                apiKeyInput.style.width = '100%';

                // Create textarea
                const textarea = document.createElement('textarea');
                textarea.id = 'aaic-chat-user-text';
                textarea.name = 'aaic-chat-user-text';
                textarea.maxLength = 2000;
                textarea.placeholder = 'Enter your message here...';

                // Create button container
                const buttonContainer = document.createElement('div');
                buttonContainer.style.display = 'flex';
                buttonContainer.style.flexDirection = 'row';

                // Create buttons
                const sendButton = document.createElement('button');
                sendButton.id = 'aaic-chat-send-btn';
                sendButton.type = 'button';
                sendButton.textContent = 'Send';

                const clearButton = document.createElement('button');
                clearButton.id = 'aaic-chat-clear-btn';
                clearButton.type = 'button';
                clearButton.textContent = 'Clear';

                const closeButton = document.createElement('button');
                closeButton.id = 'aaic-chat-close-btn';
                closeButton.type = 'button';
                closeButton.textContent = 'Close';

                // Assemble the structure
                buttonContainer.appendChild(sendButton);
                buttonContainer.appendChild(clearButton);
                buttonContainer.appendChild(closeButton);

                form.appendChild(selectElement);
                form.appendChild(apiKeyInput);
                form.appendChild(textarea);
                form.appendChild(buttonContainer);

                formContainer.appendChild(form);

                chatContainer.appendChild(logoContainer);
                chatContainer.appendChild(messageContainer);
                chatContainer.appendChild(formContainer);

                // Append everything to the body
                document.body.appendChild(chatContainer);

            };

        },

        addUserMessage: function(message, timestamp) {
            const container = document.querySelector('.aaic-chat-message-container');
            const div = document.createElement('div');
            div.className = 'aaic-chat-message aaic-chat-user-message';
            div.innerHTML = `
            <div class="aaic-chat-message-bubble">
                <p>${message}</p>
            </div>
            <div class="aaic-chat-message-timestamp">${timestamp}</div>
            `;
            container.appendChild(div);

            // Render markdown for the new message
            const p = div.querySelector('.aaic-chat-message-bubble p');
            p.innerHTML = window.marked.parse(p.textContent);

            // Optionally scroll to the new message
            setTimeout(() => {
            div.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 300);
        },

        addLlmMessage: function (message, timestamp) {
            const container = document.querySelector('.aaic-chat-message-container');
            const div = document.createElement('div');
            div.className = 'aaic-chat-message aaic-chat-llm-message';
            div.innerHTML = `
            <div class="aaic-chat-message-bubble">
                <div class="markdown-content">${message}</div>
            </div>
            <div class="aaic-chat-message-timestamp">${timestamp}</div>
            `;
            container.appendChild(div);

            // Render markdown for the new message
            const markdownDiv = div.querySelector('.markdown-content');
            markdownDiv.innerHTML = window.marked.parse(markdownDiv.textContent);

            // Optionally scroll to the new message
            setTimeout(() => {
            div.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 300);
        },

        /**
       * Appends the LLM typing indicator to the message-container
       */
        showLlmTyping: function() {
            // Prevent multiple indicators
            if (document.getElementById("aaic-chat-llm-typing")) return;
            const container = document.querySelector(".aaic-chat-message-container");
            const typingDiv = document.createElement("div");
            typingDiv.id = "aaic-chat-llm-typing";
            typingDiv.className = "aaic-chat-message aaic-chat-llm-message";
            typingDiv.innerHTML = `
            <div class="aaic-chat-message-bubble">
                <div class="aaic-chat-llm-typing">
                <div class="aaic-llm-typing-dot"></div>
                <div class="aaic-llm-typing-dot"></div>
                <div class="aaic-llm-typing-dot"></div>
                </div>
            </div>
            <div class="aaic-chat-message-timestamp"></div>
            `;
            container.appendChild(typingDiv);
            setTimeout(() => {
                typingDiv.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
        },

        /**
         * Removes the LLM typing indicator from the message-container
         */
        removeLlmTyping: function() {
            const typingDiv = document.getElementById("aaic-chat-llm-typing");
            if (typingDiv) {
                typingDiv.remove();
            }
        },

        onChatSend: function() {
            
            let that = this;

            const apiKey = document.getElementById("aaic-chat-api-key").value.trim();
            const userPrompt = document.getElementById("aaic-chat-user-text").value.trim();

            if (userPrompt) {
                
                const timestamp = new Date().toLocaleString();
                this.addUserMessage(userPrompt, timestamp);
                this.showLlmTyping();

                let context = this._getContext();

                this.sendUserPrompt(userPrompt, context, apiKey);

                document.getElementById("aaic-chat-user-text").value = ''; // Clear the textarea

            }
        },

        onChatClear: function() {
            const container = document.querySelector('.aaic-chat-message-container');
            container.innerHTML = '';
        },

        onToggleChat: function() {

            var chatEl = document.getElementById("aaic-chat-container");

            if (chatEl) {

                chatEl.classList.toggle("open");

                if (this._chatInitialized) {
                    return;
                }

                document.getElementById("aaic-chat-send-btn").onclick = this.onChatSend.bind(this);

                document.getElementById("aaic-chat-clear-btn").onclick = this.onChatClear.bind(this);

                document.getElementById("aaic-chat-close-btn").onclick = this.onToggleChat.bind(this);

                document.getElementById("aaic-chat-container").ondblclick = this.onToggleChat.bind(this);
                
                this.addLlmMessage("Welcome to the **ABAP AI Chat!** How can I assist you today? 😊", new Date().toLocaleString());

                this._chatInitialized = true;

            }
        },

        sendUserPrompt: function(userPrompt, context, apikey) {
            
            const that = this;

            let selectedIndex = 0;
            let selectedValue = '';
            let url = '';

            const oSelect = document.getElementById('aaic-chat-api');

            if (oSelect) {
                selectedIndex = oSelect.selectedIndex;
                selectedValue = oSelect.options[selectedIndex].value;
            }

            switch (selectedValue) {
                case 'OPENAI':
                    url = '/sap/bc/http/sap/YAAIC_HTTP_SERVICE_OPENAI?sap-client=100'; // Replace with your actual endpoint
                    break;
                
                case 'GOOGLE':
                    url = '/sap/bc/http/sap/YAAIC_HTTP_SERVICE_GOOGLE?sap-client=100'; // Replace with your actual endpoint
                    break;
                
                case 'ANTHROPIC':
                    url = '/sap/bc/http/sap/YAAIC_HTTP_SERVICE_ANTHROPIC?sap-client=100'; // Replace with your actual endpoint
                    break;
                
                case 'MISTRAL':
                    url = '/sap/bc/http/sap/YAAIC_HTTP_SERVICE_MISTRAL?sap-client=100'; // Replace with your actual endpoint
                    break;
            }
            
            const data = {
                chatId: this._chatId,
                apikey: apikey,
                prompt: userPrompt,
                context: context
            };

            fetch(url, {
                method: "POST",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                throw new Error("HTTP error! Status: ${response.status}");
                }
                return response.json();
            })
            .then(result => {

                console.log("Server response:", result);

                const timestamp = new Date().toLocaleString("en-GB", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false
                });

                that._chatId = result.chatid;
                
                that.removeLlmTyping();
                
                that.addLlmMessage(result.message, timestamp);

            })
            .catch(error => {
                console.error("Request failed:", error);
            });
        }

    };
});