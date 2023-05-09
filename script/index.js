const reader = new FileReader();
if (window.FileList && window.File && window.FileReader) {
const fileUploadButton = document.querySelector(".fileSelector");
fileUploadButton.addEventListener("change",(event)=>{
    file = event.target.files[0];
    reader.readAsText(file);
    readContent();
});
}
    function readContent (){
        reader.addEventListener('load',()=>{
            const result = reader.result;
            
        })
        }
        function deepCheck(obj, results) {
            // Initialize the results array if it is not passed as a parameter
            results = results || [];
          
            // Check if the object is null or undefined
            if (obj == null || typeof obj !== 'object') {
              return results;
            }
          
            // Check if the object is an array
            if (Array.isArray(obj)) {
              // If the object is an array, recursively check all its elements
              for (let i = 0; i < obj.length; i++) {
                deepCheck(obj[i], results);
              }
            } else {
              // If the object is not an array, recursively check all the keys and values of the object
              for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                  deepCheck(obj[key], results);
                  // Check if the key is "EvseStatus" and its value is not "Available" or "Occupied"
                  if (key === 'EvseStatus' && obj[key] !== 'Available' && obj[key] !== 'Occupied') {
                    // If the value is not "Available" or "Occupied", add an object with "EvseID" and "EvseStatus" to the results array
                    results.push({
                      EvseID: obj.EvseID,
                      EvseStatus: obj.EvseStatus
                    });
                  }
                }
              }
            }
          
            // Return the results array
            return results;
          }