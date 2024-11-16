// Function to create a new party
function CreateGame() {
    const NameInput = document.querySelector(".NameInput");
    const playerName = NameInput?.value.trim();

    if (!playerName) {
        alert("Please enter your name!");
        return;
    }

    // Generate a random 6-digit pin code
    const GamePinCode = Math.floor(Math.random() * 900000) + 100000;

    console.log(`Game Pin Code: ${GamePinCode}`);

    // Initialize the player list with the creator's name
    const playerList = [playerName];

    // Store GamePinCode and player list in localStorage
    localStorage.setItem("GamePinCode", GamePinCode);
    localStorage.setItem("PlayerList", JSON.stringify(playerList));
    localStorage.setItem("CreatorName", playerName);

    // Redirect to GamePage.html with the creator as the first player
    window.location.href = `GamePage.html?name=${encodeURIComponent(
        playerName
    )}&pinCode=${encodeURIComponent(GamePinCode)}`;
}

// Function to save user-entered variables and attempt to join a game
function SaveVariable() {
    const NameInput = document.querySelector(".NameInput");
    const PinCodeInput = document.querySelector(".PinCodeInput");

    // Get user inputs
    const Name = NameInput.value.trim();
    const PinCode = PinCodeInput.value.trim();

    // Validation
    if (!Name) {
        alert("Please enter your name!");
        return;
    }
    if (!PinCode) {
        alert("Please enter the pin code!");
        return;
    }

    // Debugging Logs
    console.log(`Name: ${Name}`);
    console.log(`Entered Pin Code: ${PinCode}`);

    // Call JoinGame to validate and redirect
    JoinGame(PinCode, Name);
}

// Function to validate the pin code and redirect to GamePage.html
function JoinGame(PinCode, Name) {
    // Retrieve the GamePinCode and player list from localStorage
    const GamePinCode = localStorage.getItem("GamePinCode");
    let playerList = JSON.parse(localStorage.getItem("PlayerList")) || [];

    if (!GamePinCode) {
        alert("No game in progress. Please create a game first.");
        return;
    }

    if (parseInt(PinCode, 10) === parseInt(GamePinCode, 10)) {
        console.log("Successfully Joined!");

        // Add the new player to the player list
        if (!playerList.includes(Name)) {
            playerList.push(Name);
            localStorage.setItem("PlayerList", JSON.stringify(playerList));
        }

        // Redirect to GamePage.html with query parameters
        window.location.href = `GamePage.html?name=${encodeURIComponent(
            Name
        )}&pinCode=${encodeURIComponent(PinCode)}`;
    } else {
        console.log("Failed to Join - Incorrect Pin Code");
        alert("Incorrect Pin Code. Please try again.");
    }
}
