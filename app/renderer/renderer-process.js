const {ipcRenderer} = require('electron')

// open images

const selectDirBtn = document.getElementById('select-images')

selectDirBtn.addEventListener('click', (event) => {
    ipcRenderer.send('open-image-dialog')
})

ipcRenderer.on('selected-image', (event, images) => {
    const container = document.querySelector('#image_container')
    while (container.hasChildNodes()) container.removeChild(container.lastChild); // clear children
    for (let image of images) {
        let img = document.createElement('img')
        img.style = 'max-width:100%;max-height:100vh;margin:auto;'
        img.src = `data:image/bmp;base64,${image}`
        container.appendChild(img)
    }
})

// process images

const processImageButton = document.getElementById('process-image')
processImageButton.addEventListener('click', (event) => {
    ipcRenderer.send('process-image-dialog')
})

const {createWorker} = require('tesseract.js');

const worker = createWorker({
    // logger: m => console.log(m), // pour obtenir des infos sur le chargement du worker
    cachePath: 'lang-data',
});

ipcRenderer.on('selected-process-image', (event, res) => {
    console.log(res.filePaths)
    // return
    if (!res.canceled) {
        (async () => {
            await worker.load();
            await worker.loadLanguage('eng');
            await worker.initialize('eng');
            const {data: {text}} = await worker.recognize(res.filePaths[0]);
            console.log(text);
        })();
    }
})