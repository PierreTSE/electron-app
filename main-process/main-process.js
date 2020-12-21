const {ipcMain, dialog} = require('electron')
const fs = require('fs')

ipcMain.on('open-image-dialog', (event) => {
    dialog.showOpenDialog({
        properties: ['openFile', 'multiSelections'],
        filters: [
            {name: 'Images', extensions: ['bmp']}
        ]
    }).then(res => event.sender.send('selected-image', res.filePaths.map(path => fs.readFileSync(path).toString('base64'))))
})

ipcMain.on('process-image-dialog', (event) => {
    dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
            {name: 'Images', extensions: ['bmp', 'jpg', 'png']}
        ]
    }).then(res => event.sender.send('selected-process-image', res))
})

