// Check for browser compatibility
if ("webkitSpeechRecognition" in window && "speechSynthesis" in window) {
  const recognition = new webkitSpeechRecognition();
  const synth = window.speechSynthesis;
  recognition.continuous = false;
  recognition.interimResults = false;

  const startButton = document.getElementById("start");
  const resultDiv = document.getElementById("result");
  const toggleDarkModeButton = document.getElementById("toggleDarkMode");
  let isDarkMode = localStorage.getItem("darkMode") === "true"; // Retrieve saved preference

  // Set the initial theme
  setTheme(isDarkMode);

  // Start listening when the button is clicked
  startButton.addEventListener("click", () => {
    recognition.start();
    resultDiv.innerHTML = "Listening...";
    speak("Listening...");
    startButton.classList.add("listening");
  });

  // Process the result
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    resultDiv.innerHTML = `You said: "${transcript}"`;
    executeCommand(transcript);
    startButton.classList.remove("listening");
  };

  // Handle errors
  recognition.onerror = (event) => {
    resultDiv.innerHTML = `Error occurred in recognition: ${event.error}`;
    speak(`Error occurred: ${event.error}. Please try again.`);
    startButton.classList.remove("listening");
  };

  // Define commands based on speech
  function executeCommand(command) {
    if (command.includes("hello")) {
      const response = "Hello! How can I help you?";
      resultDiv.innerHTML += `<br/>${response}`;
      speak(response);
    } else if (command.includes("open google")) {
      window.open("https://www.google.com", "_blank");
      const response = "Opening Google now.";
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
      const audio = new Audio(
        "in-y2mate.com - max   STUPID IN LOVE Lyrics feat HUH YUNJIN of LE SSERAFIM.mp3"
      ); // Replace with your audio file
      audio.play();
      const response = "Playing a song.";
      speak(response);
    } else if (command.includes("scroll down")) {
      window.scrollBy(0, 100);
      const response = "Scrolling down.";
      speak(response);
    } else if (command.includes("scroll up")) {
      window.scrollBy(0, -100);
      const response = "Scrolling up.";
      speak(response);
    } else if (command.includes("tell me a joke")) {
      const jokes = [
        "Why don't scientists trust atoms? Because they make up everything!",
        "Why did the scarecrow win an award? Because he was outstanding in his field!",
        "What do you call fake spaghetti? An impasta!",
      ];
      const joke = jokes[Math.floor(Math.random() * jokes.length)];
      resultDiv.innerHTML += `<br/>${joke}`;
      speak(joke);
    } else if (command.includes("what's the time")) {
      const now = new Date();
      const time = now.toLocaleTimeString();
      const response = `The current time is ${time}.`;
      resultDiv.innerHTML += `<br/>${response}`;
      speak(response);
    } else if (command.startsWith("open ")) {
      const website = command.split("open ")[1].trim();
      window.open(`https://${website}`, "_blank");
      const response = `Opening ${website}.`;
      speak(response);
    } else if (command.startsWith("search for ")) {
      const query = command.split("search for ")[1].trim();
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
      const response = `Searching for ${query}.`;
      speak(response);
    } else if (command.includes("show me a fact")) {
      const facts = [
        "Honey never spoils.",
        "Bananas are berries, but strawberries aren't.",
        "A group of flamingos is called a 'flamboyance.'",
        "I love my girlfriend",
      ];
      const fact = facts[Math.floor(Math.random() * facts.length)];
      resultDiv.innerHTML += `<br/>${fact}`;
      speak(fact);
    } else if (command.includes("toggle dark mode")) {
      toggleDarkMode();
    } else if (command.includes("set a timer for")) {
      const minutes = command.match(/(\d+)/);
      if (minutes) {
        const time = parseInt(minutes[0]) * 60;
        const response = `Setting a timer for ${minutes[0]} minutes.`;
        resultDiv.innerHTML += `<br/>${response}`;
        speak(response);
        setTimeout(() => {
          speak("Time is up!");
        }, time * 1000);
      } else {
        const response = "Please specify the number of minutes for the timer.";
        resultDiv.innerHTML += `<br/>${response}`;
        speak(response);
      }
    } else if (command.includes("what's the weather like")) {
      getLocationAndWeather(); // Call location-based weather function
    } else {
      const response = "Command not recognized.";
      resultDiv.innerHTML += `<br/>${response}`;
      speak(response);
    }
  }

  // Function to get weather by location
  function getWeatherByLocation(lat, lon) {
    const apiKey = "1af1dd95978e9f13891a4e550bfea80f";
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const weather = `The weather at your location is ${data.weather[0].description} with a temperature of ${data.main.temp}°C.`;
        resultDiv.innerHTML += `<br/>${weather}`;
        speak(weather);
      })
      .catch((error) => {
        const errorMessage = "Unable to retrieve weather data.";
        resultDiv.innerHTML += `<br/>${errorMessage}`;
        speak(errorMessage);
      });
  }

  // Function to get location and then fetch weather
  function getLocationAndWeather() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        getWeatherByLocation(latitude, longitude);
      });
    } else {
      const errorMessage = "Geolocation is not supported by this browser.";
      resultDiv.innerHTML += `<br/>${errorMessage}`;
      speak(errorMessage);
    }
  }

  // Function to toggle dark mode
  function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    localStorage.setItem("darkMode", isDarkMode); // Save preference
    setTheme(isDarkMode);
  }

  // Function to set the theme
  function setTheme(darkMode) {
    document.body.classList.toggle("dark-mode", darkMode);
    const mode = darkMode ? "dark" : "light";
    const response = `Switching to ${mode} mode.`;
    resultDiv.innerHTML += `<br/>${response}`;
    speak(response);
  }

  // Function for speech synthesis
  function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  }

  // Touch event listeners for mobile
  document.addEventListener("touchstart", (e) => {
    const touchY = e.touches[0].clientY;

    document.addEventListener(
      "touchmove",
      (e) => {
        const newTouchY = e.touches[0].clientY;
        if (touchY < newTouchY) {
          window.scrollBy(0, 10); // Scroll down
        } else {
          window.scrollBy(0, -10); // Scroll up
        }
      },
      { once: true }
    );
  });

  // Event listener for dark mode toggle button
  toggleDarkModeButton.addEventListener("click", toggleDarkMode);
} else {
  alert(
    "Your browser does not support the Web Speech API or Speech Synthesis API."
  );
}
