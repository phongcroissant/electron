// Le script sera exécuté avant le chargement de la page
// Acces aux API Node et Electron
const {contextBridge, ipcRenderer}=require("electron")

contextBridge.exposeInMainWorld('version',{
    // Fonction qui récupère les version via IPC
    getVersion: () => ipcRenderer.invoke('get-version')
})

contextBridge.exposeInMainWorld('todoapi',{
    // Fonction qui récupère la liste des taches via IPC
    getAll: () => ipcRenderer.invoke('todos:getAll'),
    addTodos:(titre) =>ipcRenderer.invoke('todos:addTodos',titre)
})

console.log("Preload chargé avec succès")