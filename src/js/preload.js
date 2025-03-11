// Le script sera exécuté avant le chargement de la page
// Acces aux API Node et Electron
const {contextBridge}=require("electron")

contextBridge.exposeInMainWorld('version',{
    electron:process.versions.electron,
    node:process.versions.node,
    chrome:process.versions.chrome
})
console.log("Preload chargé avec succès")