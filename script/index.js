const reader = new FileReader();
if (window.FileList && window.File && window.FileReader) {
const fileUploadButton = document.querySelector(".file-selector");
fileUploadButton.addEventListener("change",(event)=>{
    file = event.target.files[0];
    reader.readAsText(file);
    readContent();
});
}
    function readContent (){
        reader.addEventListener('load',()=>{
            const readFile = reader.result;
            const parsedJson = JSON.parse(readFile)
        const resultArray = (deepCheck(parsedJson))
        let resultString ="";
        resultArray.forEach(obj => {
        });
        console.log (deepCheck(parsedJson))
        })
        }
        function deepCheck(parsedJson, results) {
            // Initialize the results array if it is not passed as a parameter
            results = results || [];
          
            // Check if the object is null or undefined
            if (parsedJson == null || typeof parsedJson !== 'object') {
              return results;
            }
          
            // Check if the object is an array
            if (Array.isArray(parsedJson)) {
              // If the object is an array, recursively check all its elements
              for (let i = 0; i < parsedJson.length; i++) {
                deepCheck(parsedJson[i], results);
              }
            } else {
              // If the object is not an array, recursively check all the keys and values of the object
              for (let key in parsedJson) {
                if (parsedJson.hasOwnProperty(key)) {
                  deepCheck(parsedJson[key], results);
                  // Check if the key is "EvseStatus" and its value is not "Available" or "Occupied"
                  if (key === 'EvseStatus' && parsedJson[key] !== 'Available' && parsedJson[key] !== 'Occupied') {
                    // If the value is not "Available" or "Occupied", add an object with "EvseID" and "EvseStatus" to the results array
                    results.push({
                      EvseID: parsedJson.EvseID,
                      EvseStatus: parsedJson.EvseStatus
                    });
                  }
                }
              }
            }
            
            return results;
          }