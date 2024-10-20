// Check for browser compatibility
if ("webkitSpeechRecognition" in window && "speechSynthesis" in window) {
  const recognition = new webkitSpeechRecognition();
  const synth = window.speechSynthesis;
  recognition.continuous = false;
  recognition.interimResults = false;

  const startButton = document.getElementById("start");
  const resultDiv = document.getElementById("result");
  const toggleSwitch = document.getElementById("toggleDarkModeButton");
  let isDarkMode = false; // Track the current theme

  // Load dark mode preference from local storage
  if (localStorage.getItem("darkMode") === "true") {
    isDarkMode = true;
    toggleSwitch.checked = true; // Set toggle to checked
    setTheme(isDarkMode);
  }

  // Start listening when the button is clicked
  startButton.addEventListener("click", () => {
    recognition.start();
    resultDiv.innerHTML = "Listening...";
    speak("Listening...");
  });

  // Process the result
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    resultDiv.innerHTML = `You said: "${transcript}"`;
    executeCommand(transcript);
  };

  // Handle errors
  recognition.onerror = (event) => {
    resultDiv.innerHTML = `Error occurred in recognition: ${event.error}`;
    speak(`Error occurred: ${event.error}`);
  };

  // Define commands based on speech
  async function executeCommand(command) {
    if (command.includes("hello")) {
      const response = "Hello! How can I help you?";
      resultDiv.innerHTML += `<br/>${response}`;
      speak(response);
    } else if (command.includes("open google")) {
      window.open("https://www.google.com", "_blank");
      const response = "Opening Google now.";
      speak(response);
    } else if (command.includes("open ")) {
      const website = command.split("open ")[1].trim();
      const url = website.includes("http") ? website : `https://${website}`;
      window.open(url, "_blank");
      const response = `Opening ${website}.`;
      speak(response);
    } else if (command.includes("change colour")) {
      const colors = [
        "lightblue",
        "lightgreen",
        "lightcoral",
        "lightyellow",
        "lightpink",
      ];
      const newColor = colors[Math.floor(Math.random() * colors.length)];
      document.body.style.backgroundColor = newColor;
      const response = `Changing background colour to ${newColor}.`;
      speak(response);
    } else if (command.includes("play a song")) {
      const audio = new Audio("sample.mp3"); // Replace with your audio file
      audio.play();
      const response = "Playing a song.";
      speak(response);
    } else if (command.includes("scroll down")) {
      window.scrollBy(0, 100); // Scrolls down 100 pixels
      const response = "Scrolling down.";
      speak(response);
    } else if (command.includes("scroll up")) {
      window.scrollBy(0, -100); // Scrolls up 100 pixels
      const response = "Scrolling up.";
      speak(response);
    } else if (command.includes("tell me a joke")) {
      const joke =
        "Why did the scarecrow win an award? Because he was outstanding in his field!";
      resultDiv.innerHTML += `<br/>${joke}`;
      speak(joke);
    } else if (command.includes("what's the time")) {
      const now = new Date();
      const time = now.toLocaleTimeString();
      resultDiv.innerHTML += `<br/>The current time is ${time}.`;
      speak(`The current time is ${time}.`);
    } else if (command.includes("what's the weather like")) {
      const weatherResponse = await getWeather();
      resultDiv.innerHTML += `<br/>${weatherResponse}`;
      speak(weatherResponse);
    } else if (command.includes("toggle dark mode")) {
      toggleSwitch.checked = !toggleSwitch.checked; // Change state of switch
      toggleDarkMode();
    } else {
      const response = "Sorry, I didn't understand that.";
      resultDiv.innerHTML += `<br/>${response}`;
      speak(response);
    }
  }

  // Function to get weather data from a weather API
  async function getWeather() {
    const apiKey = "YOUR_WEATHER_API_KEY"; // Replace with your weather API key
    const city = "London"; // Replace with desired city
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Unable to fetch weather data");
      }
      const data = await response.json();
      const temp = data.main.temp;
      const description = data.weather[0].description;
      return `The current weather in ${city} is ${temp}°C with ${description}.`;
    } catch (error) {
      return `Error fetching weather data: ${error.message}`;
    }
  }

  // Speak function for feedback
  function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  }

  // Set theme based on dark mode preference
  function setTheme(darkMode) {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }

  // Event listener for dark mode toggle switch
  toggleSwitch.addEventListener("change", () => {
    toggleDarkMode();
  });

  function toggleDarkMode() {
    isDarkMode = toggleSwitch.checked;
    localStorage.setItem("darkMode", isDarkMode);
    setTheme(isDarkMode);
  }
} else {
  alert(
    "Sorry, your browser does not support speech recognition or synthesis."
  );
}
