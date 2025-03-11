// Le script sera exécuté avant le chargement de la page
// Acces aux API Node et Electron
const {contextBridge, ipcRenderer}=require("electron")

contextBridge.exposeInMainWorld('version',{
    // Fonction qui récupère les version via IPC
    getVersion: () => ipcRenderer.invoke('get-version')
})
console.log("Preload chargé avec succès")