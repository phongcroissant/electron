// Processus principal

const {app, BrowserWindow, ipcMain} = require("electron")

// Créer la fenetre principal
const path= require("path")
function createWindow(){
    const window = new BrowserWindow({
        width: 800,
        height : 600,
        webPreferences : {
            nodeIntegration : false, // Acces au API Node depuis notre processus de rendu
            contextIsolation : true,
            sandbox: true,
            preload: path.join(__dirname,'src/js/preload.js')
        }
    })

    window.loadFile('src/pages/index.html')

}

// Attendre l'initialisation de l'application au démarrage
app.whenReady().then( () => {

        createWindow()

    app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0){
        createWindow()
        }
     })
}
)

app.on('window-all-closed',() => {
    if (process.platform !== 'darwin'){
        app.quit()
    }
})

// Ecouter sur le canal "get-version"
ipcMain.handle("get-version",() => {
    // Envoyer un objet contenant les versions des outils
    return {
        electron:process.versions.electron,
        node:process.versions.node,
        chrome:process.versions.chrome
    }
})