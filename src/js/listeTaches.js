
async function listeTache() {
    const todos = document.querySelector("#todos")
    const taches = await todoapi.getAll()
    console.log(taches)

    try {
        todos.innerHTML = taches
            .map(tache =>
                `
<div class="border m-3">
<p>Titre : ${tache.titre}</p> <p>${tache.createdAt.toLocaleString()} <p>${(tache.termine===1) ? 'Terminé':'En cours'}</p> </p>
</div>


`)
            .join("")

    } catch (error) {
        console.log("non")
    }

}
const refresh = document.querySelector('#refreshJS');
refresh.addEventListener('click', () => location.reload());
listeTache()