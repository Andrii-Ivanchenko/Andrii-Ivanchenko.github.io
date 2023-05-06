const fileUploadButton = document.querySelector(".fileSelector");
fileUploadButton.addEventListener("change",(event)=>{
    file = event.target.files[0];
    reader.readAsText(file);
});
const reader = new FileReader();
reader.addEventListener('load',(event)=>{
    const result = reader.result;
    console.log(result);
})
