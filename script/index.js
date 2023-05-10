const reader = new FileReader();
const mainContentSection = document.querySelector(".main-content-container")
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
          mainContentSection.querySelector(".file-upload-button").classList.add("inactive");
          document.querySelector(".loading-spinner").classList.remove("inactive");
          setTimeout(() => {
            document.querySelector(".loading-spinner").classList.add("inactive");
          }, 3000);

            const readFile = reader.result;
            const parsedJson = JSON.parse(readFile) //converting string into JS object
        const resultArray = (deepCheck(parsedJson)) //function call to process the JSON
        let resultString ="NUMBER;EVSEID;EVSESTATUS\n";//completing the CSV format
        let counter=0;
        resultArray.forEach(obj => {
          counter++;
          let entries = Object.entries(obj)
let data = entries.map( ([key, val] = entry) => {
    if(key==="EvseID"){
    resultString = resultString + `${counter};${val};`
  }
  else{
    resultString = resultString + `${val}\n`;}
});

        });
        console.log (resultString)
        console.log (deepCheck(parsedJson))
        function download(data, filename, type) {
          var file = new Blob([data], {type: type});
          if (window.navigator.msSaveOrOpenBlob) // IE10+
              window.navigator.msSaveOrOpenBlob(file, filename);
          else { // Others
              var a = document.createElement("a"),
                      url = URL.createObjectURL(file);
              a.href = url;
              a.download = filename;
              document.body.appendChild(a);
              a.click();
              setTimeout(function() {
                  document.body.removeChild(a);
                  window.URL.revokeObjectURL(url);  
              }, 0); 
          }
      }
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