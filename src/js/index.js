// Processus de rendu

const electronVersion = document.querySelector("#electron-version")
const nodeVersion = document.querySelector("#node-version")
const chromiumVersion = document.querySelector("#chromium-version")

electronVersion.textContent = version.electron
nodeVersion.textContent = version.node
chromiumVersion.textContent = version.chrome