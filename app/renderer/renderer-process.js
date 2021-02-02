const {ipcRenderer} = require('electron')
const {createWorker, PSM, OEM} = require('tesseract.js')
const fs = require('fs')

const processImageButton = document.getElementById('process-image')
processImageButton.addEventListener('click', (event) => {
    ipcRenderer.send('process-image-dialog')
})

const worker = createWorker({
    // logger: m => console.log(m), // pour obtenir des infos sur le chargement du worker
    cachePath: 'lang-data',
    cacheMethod: 'readOnly',
    gzip: false,
    errorHandler: e => console.error(e)
});

ipcRenderer.on('selected-process-image', (event, res) => {
    console.log(res.filePaths)
    // return
    if (!res.canceled) {
        (async () => {
            await worker.load();
            await worker.loadLanguage('eng');
            await worker.initialize('eng', OEM.TESSERACT_LSTM_COMBINED);
            await worker.setParameters({
                tessedit_pageseg_mode: PSM.SPARSE_TEXT,
                preserve_interword_spaces: '1',
                tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
            })
            const data = (await worker.recognize(res.filePaths[0])).data;

            // mise en place du feedback
            let ocr_data = []
            data.blocks.forEach(e => {
                ocr_data.push({
                    bbox: e.bbox,
                    text: e.text,
                    confidence: e.confidence
                })
            })
            window.ocr_data_unfiltered = data;
            window.ocr_data = ocr_data;
            let img = document.querySelector("#processed-image")
            img.src = `data:image/bmp;base64,${res.filePaths.map(path => fs.readFileSync(path).toString('base64'))[0]}`
            img.style.display = 'block'
        })();
    }
})

let popup = document.querySelector("#popup-2")
document.querySelector("#processed-image").addEventListener("mousemove", function (e) {
    let found = false
    for (let i = 0; i < window.ocr_data.length; ++i) {
        let datum = window.ocr_data[i]
        if (datum.bbox.x0 <= e.offsetX && e.offsetX <= datum.bbox.x1 && datum.bbox.y0 <= e.offsetY && e.offsetY <= datum.bbox.y1) {
            popup.innerHTML = datum.text /*+ '\n' + datum.confidence*/ // oh le beau XSS
            popup.style.left = e.pageX + 'px'
            popup.style.top = e.pageY + 'px'
            popup.style.display = 'block'
            found = true
            break
        }
    }
    if (!found) {
        popup.style.display = 'none'
    }
})
