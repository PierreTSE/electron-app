const path = require('path')
const glob = require('glob')
const {app, BrowserWindow, Menu} = require('electron')

let mainWindow = null

function initialize() {
    makeSingleInstance()

    loadDemos()

    function createWindow() {
        const windowOptions = {
            width: 1280,
            height: 720,
            title: app.getName(),
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            }
        }

        mainWindow = new BrowserWindow(windowOptions)
        // mainWindow.loadFile('./app/index.html')
        mainWindow.loadFile('./app/index.html')

        mainWindow.on('closed', () => {
            mainWindow = null
        })

        mainWindow.webContents.on('before-input-event', (event, input) => {
            if (input.key === 'F12') {
                mainWindow.webContents.toggleDevTools()
                event.preventDefault()
            }
        })
    }

    app.on('ready', () => {
        createWindow()
    })

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    })

    app.on('activate', () => {
        if (mainWindow === null) {
            createWindow()
        }
    })
}

// Make this app a single instance app.
//
// The main window will be restored and focused instead of a second window
// opened when a person attempts to launch a second instance.
//
// Returns true if the current version of the app should quit instead of
// launching.
function makeSingleInstance() {
    if (process.mas) return

    app.requestSingleInstanceLock()

    app.on('second-instance', () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore()
            mainWindow.focus()
        }
    })
}

// Require each JS file in the main-process dir
function loadDemos() {
    const files = glob.sync(path.join(__dirname, 'main-process/**/*.js'))
    files.forEach((file) => {
        require(file)
    })
}

initialize()

const template = [
    // { role: 'fileMenu' }
    {
        label: 'Fichier',
        submenu: [
            {role: 'quit', label: 'Quitter'}
        ]
    },
    // { role: 'viewMenu' }
    {
        label: 'Vue',
        submenu: [
            {role: 'reload', label: 'Recharger'},
            {role: 'forceReload', label: 'Recharger (forcé)'},
            {role: 'toggleDevTools', label: 'Console'},
            {type: 'separator'},
            {role: 'resetZoom', label: 'Zoom initial'},
            {role: 'zoomIn', label: 'Zoom -'},
            {role: 'zoomOut', label: 'Zoom +'},
            {type: 'separator'},
            {role: 'togglefullscreen', label: 'Plein écran'}
        ]
    },
    // { role: 'windowMenu' }
    {
        label: 'Fenêtre',
        submenu: [
            {role: 'minimize', label: 'Minimiser'},
            {role: 'zoom', label: 'Zoomer'}
        ]
    },
    {
        label: 'Aide',
        role: 'help',
        submenu: [
            {
                label: 'À propos'
            }
        ]
    }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
