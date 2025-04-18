const sendButton = document.getElementById("sendMessage");
const output = document.getElementById("responseOutput");

sendButton.addEventListener("click", async () => {
  const input = document.getElementById("userInput").value.trim();
  console.log("User input:", input);

  if (!input) {
    appendMessage("bot", "Please type something first.");
    return;
  }

  appendMessage("user", input);
  appendMessage("bot", "Thinking...");

  const api_Url = "https://deepseek-v31.p.rapidapi.com/";

  try {
    const res = await fetch(api_Url, {
      method: "POST",
      headers: {
        "x-rapidapi-key": "none",
        "x-rapidapi-host": "deepseek-v31.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-v3",
        messages: [
          {
            role: "user",
            content: input,
          },
        ],
      }),
    });

    if (!res.ok) {
      throw new Error("API request failed with status " + res.status);
    }

    const data = await res.json();
    console.log("API Response:", data);

    removeLastBotMessage();

    const reply =
      data.choices?.[0]?.message?.content || "No response received.";
    appendMessage("bot", reply);
  } catch (err) {
    console.error(err);
    removeLastBotMessage();
    appendMessage(
      "bot",
      "Pls clone the code and use your own API key if you encounter this error. Sorry techies 🙏. Error: " +
        err.message
    );
  }
});

function appendMessage(sender, message) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);
  messageDiv.textContent = `${
    sender === "user" ? "🧑 You" : "🤖 Bot"
  }: ${message}`;
  output.appendChild(messageDiv);
  output.scrollTop = output.scrollHeight;
}

function removeLastBotMessage() {
  const botMessages = [...output.querySelectorAll(".message.bot")];
  if (botMessages.length > 0) {
    output.removeChild(botMessages[botMessages.length - 1]);
  }
}
