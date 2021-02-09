const {ipcRenderer} = require('electron')

const selectDirBtn = document.getElementById('select-images')

selectDirBtn.addEventListener('click', (event) => {
    ipcRenderer.send('open-image-dialog')
})

ipcRenderer.on('selected-image', (event, images) => {
    const container = document.querySelector('#selected-image-container')
    // while (container.hasChildNodes()) container.removeChild(container.lastChild); // clear children
    for (let image of images) {
        // let img = document.createElement('img')
        // img.style = 'max-width:100%;max-height:100vh;margin:auto;'
        // img.src = `data:image/bmp;base64,${image}`
        // container.appendChild(img)
        let img = document.querySelector("#selected-image")
        img.src = `data:image/bmp;base64,${image}`
        img.style.display = 'block'
    }
})
