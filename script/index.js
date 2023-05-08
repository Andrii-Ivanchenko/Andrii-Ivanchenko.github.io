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
            return (result);
        })
        }
console.log(result);