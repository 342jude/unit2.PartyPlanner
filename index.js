const partiesList = document.getElementById("parties-list");
const addPartyForm = document.getElementById("add-party-form");

async function fetchParties() {
  try {
    const response = await fetch(
      "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2310-FSA-ET-WEB-PT-SF/events"
    );
    const data = await response.json();
    const parties = data.data;

    for (const party of parties) {
      const partyElement = createPartyElement(party);
      partyElement.setAttribute("data-id", party.id); // Add a data-id attribute to each party element
      partiesList.appendChild(partyElement);
    }
  } catch (error) {
    console.error("Error fetching parties:", error);
  }
}

function createPartyElement(party) {
  const partyElement = document.createElement("div");
  partyElement.classList.add("party");

  const partyName = document.createElement("h3");
  partyName.textContent = party.name;

  const partyDetails = document.createElement("p");
  partyDetails.textContent = `Date: ${party.date} | Time: ${party.time} | Location: ${party.location} | Description: ${party.description}`;

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", async () => {
    try {
      const partyId = partyElement.getAttribute("data-id"); // Get the party ID from the data-id attribute
      await deleteParty(partyId);
    } catch (error) {
      console.error("Error deleting party:", error);
      alert("Failed to delete party.");
    }
  });

  partyElement.appendChild(partyName);
  partyElement.appendChild(partyDetails);
  partyElement.appendChild(deleteButton);

  return partyElement;
}

async function addParty(newParty) {
  try {
    const response = await fetch(
      "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2310-FSA-ET-WEB-PT-SF/events",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newParty), // Stringify the new party object
      }
    );
    const data = await response.json();
    const newPartyData = data.data;

    const newPartyElement = createPartyElement(newPartyData);
    partiesList.appendChild(newPartyElement);

    addPartyForm.reset(); // Clear the form after submitting

    alert("Party added successfully!");
  } catch (error) {
    console.error("Error adding party:", error);
    alert("Failed to add party.");
  }
}

async function deleteParty(partyId) {
  try {
    const response = await fetch(
      `https://fsa-crud-2aa9294fe819.herokuapp.com/api/2310-FSA-ET-WEB-PT-SF/events/${partyId}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      const partyElement = partiesList.querySelector(
        `.party[data-id="${partyId}"]`
      );
      partiesList.removeChild(partyElement);

      alert("Party deleted successfully!");
    } else {
      console.error("Error deleting party:", response.status);
      alert("Failed to delete party.");
    }
  } catch (error) {
    console.error("Error deleting party:", error);
    alert("Failed to delete party.");
  }
}

fetchParties(); // Fetch parties on page load

addPartyForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const newParty = {
    name: event.target.elements.name.value,
    date: event.target.elements.date.value,
    time: event.target.elements.time.value,
    location: event.target.elements.location.value,
    description: event.target.elements.description.value,
  };

  addParty(newParty);
});
