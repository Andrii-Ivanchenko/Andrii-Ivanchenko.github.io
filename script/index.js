const reader = new FileReader();
const statusText = document.querySelector(".status-text");
const mainContentSection = document.querySelector(".main-content-container");

if (window.FileList && window.File && window.FileReader) {
  const fileUploadButton = document.querySelector(".file-selector");

  fileUploadButton.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file.type !== "application/json") {
      const errorMessage = "Error: Invalid file type. Please upload a JSON file.";
      console.log(errorMessage);
      showError(errorMessage);
      return;
    }

    // Validate if the file is not empty
    if (file.size === 0) {
      const errorMessage = "Error: Empty file. Please upload a non-empty JSON file.";
      console.log(errorMessage);
      showError(errorMessage);
      return;
    }

    statusText.classList.add("status-done");
    statusText.classList.remove("waiting-for-input");
    statusText.innerText = "Upload is done";

    reader.readAsText(file);
    readContent();
  });
}

function showError(errorMessage) {
  statusText.innerText = errorMessage;
  statusText.classList.add("status-error");
  statusText.classList.remove("waiting-for-input");
}

function readContent() {
  reader.addEventListener("load", () => {
    const readFile = reader.result;
    let parsedJson;
    try {
      parsedJson = JSON.parse(readFile); // Convert string into JS object
    } catch (error) {
      const errorMessage = "Error: Invalid JSON format. Please upload a file in the specified format.";
      console.log(errorMessage);
      showError(errorMessage);
      return;
    }

    // Validate if the uploaded JSON has the expected Hubject structure
    if (!parsedJson || !parsedJson.EvseStatuses || !parsedJson.EvseStatuses.OperatorEvseStatus) {
      const errorMessage = "Error: Invalid JSON format. Please upload a file in the specified format.";
      console.log(errorMessage);
      showError(errorMessage);
      return;
    }

    mainContentSection.querySelector(".file-upload-button").classList.add("inactive");
    statusText.innerText = "Processing...";
    document.querySelector(".loading-spinner").classList.remove("inactive");

    setTimeout(() => {
      document.querySelector(".loading-spinner").classList.add("inactive");
      document.querySelector(".download-button").classList.remove("inactive");
      statusText.innerText = "Done, file is ready for download";
    }, 3000);

    const resultArray = deepCheck(parsedJson); // Function call to process the JSON
    let resultString = "NUMBER;EVSEID;EVSESTATUS\n"; // Completing the CSV format
    let counter = 0;

    resultArray.forEach((obj) => {
      counter++;
      let entries = Object.entries(obj);
      entries.forEach(([key, val]) => {
        if (key === "EvseID") {
          resultString += `${counter};${val};`;
        } else {
          resultString += `${val}\n`;
        }
      });
    });

    console.log(resultString);
    console.log(deepCheck(parsedJson));

    document.querySelector(".download-button").addEventListener("click", (event) => {
      const blob = new Blob([resultString], { type: "text/csv" });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);

      link.download = "Wrong EvseValues Result.csv";
      link.target = "_blank";

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
    });
  });
}

function deepCheck(parsedJson, results) {
  results = results || [];


  if (parsedJson == null || typeof parsedJson !== "object") {
    return results;
  }


  if (Array.isArray(parsedJson)) {
    for (let i = 0; i < parsedJson.length; i++) {
      deepCheck(parsedJson[i], results);
    }
  } else {
    for (let key in parsedJson) {
      if (parsedJson.hasOwnProperty(key)) {
        deepCheck(parsedJson[key], results);
        if (key === "EvseStatus" && parsedJson[key] !== "Available" && parsedJson[key] !== "Occupied") {
          results.push({
            EvseID: parsedJson.EvseID,
            EvseStatus: parsedJson.EvseStatus,
          });
        }
      }
    }
  }

  return results;
}