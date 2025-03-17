// Processus principal

const {app, BrowserWindow,ipcMain, Menu, dialog} = require("electron")
const path = require('path');
const mysql = require('mysql2/promise')

let window;

// Configuration de l'accès à la base de données
const dbConfig = {
    host:"localhost",
    port:"3306",
    user:"root",
    password:"",
    database:"db_todos",
    connectionLimit:10, // Le nombre maximal de connexion simultané
    waitForConnections:true,
    queueLimit:0,
}

// Créer la pool de connexion
const pool =mysql.createPool(dbConfig)

// Tester la connexion
testConnexion()

async function  testConnexion() {
    try{
        // Demander une connexion au pool
        const connexion=await pool.getConnection()
        console.log("Connexion réussie")
        connexion.release()
    }catch (error) {
        console.log("Bonsoir non")
    }
}

// Créer la fenetre principal
function createWindow(){
    window = new BrowserWindow({
        width: 800,
        height : 600,
        webPreferences : {
            nodeIntegration : false, // Acces au API Node depuis notre processus de rendu
            contextIsolation : true,
            sandbox: true,
            preload : path.join(__dirname,'src/js/preload.js')
        }

    })
    window.webContents.openDevTools()
// Creation du menu
    createMenu()

    window.loadFile('src/pages/index.html')

}

// Fonction permettant de crée un menu personnalisé
function createMenu(){
    // Crée un tableau qui va representer le menu -> modele
    const template = [
        {
            label : 'App',
            submenu : [
                {
                    label : 'Versions',
                    click : () => window.loadFile('src/pages/index.html')
                },
                {
                  type:'separator'
                },
                {
                    label : "Quitter",
                    accelerator: process.platform==="darwin"? "Cmd+Q":"Ctrl+Q",
                    click : () => app.quit()
                }
            ]
        },
        {
            label : 'Taches',
            submenu: [
                {
                    label: "Lister",
                    click: () => window.loadFile('src/pages/list-taches.html')
                },
                {
                    label: "Ajouter",
                    click: ()=> window.loadFile('src/pages/ajout-taches.html')
                }
            ]

        }
    ]

    // Crée le menu a partir du modele
    const menu = Menu.buildFromTemplate(template)
    // Définir le menu comme etant le menu de l'application
    Menu.setApplicationMenu(menu)

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

// Ecouter sur le canal "get-versions"
ipcMain.handle('get-version', ()=> {
    // Renvoyer un objet contenant les versions des outils
    return{
        electron: process.versions.electron,
        node: process.versions.node,
        chrome: process.versions.chrome
    }
})
async function getAllTodos() {
    try{
        const resultat =await pool.query('SELECT * FROM todos ORDER BY createdAt DESC')
        return(resultat[0]) // Retourne une promesse
    }catch (error) {
        console.log('Erreur lors de la récupération des données')
        throw error // Retourner donc une promesse qui ne va pas être résolue
    }
}
ipcMain.handle('todos:getAll', async ()=> {
    // Récupérer la liste des taches dans la base de données avec mysql
    try {
        return await getAllTodos() // Retourne une promesse avec un résultat
    }catch (error) {
        dialog.showErrorBox('Erreur Technique','Impossible de récupérer le résultat')
        return [] // Retourne une promesse avec un tableau vide
    }
})

async function addTodos(titre) {
    try {
        const [resultat] = await pool.query('INSERT INTO todos(titre,termine) VALUES(?,?)',[titre,0])
        return;
    } catch (error){
        console.log('Erreur lors de l\'insertion de données')
        throw error // Retourner donc une promesse qui ne va pas être résolue
    }
}
ipcMain.handle('todos:addTodos', async (event,titre)=> {
    // Récupérer la liste des taches dans la base de données avec mysql
    try {
        await addTodos(titre) // Retourne une promesse avec un résultat
        return {success : true}
    }catch (error) {
        dialog.showErrorBox('Erreur Technique','Impossible d\'ajouter une tâche')
        throw error // Retourne une promesse avec un tableau vide
    }
})