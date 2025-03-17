const ajoutTachesForm = document.querySelector('#todosForm');
let titre

async function addTodos(titre){
    titre = document.querySelector('#titre').value;
    await todoapi.addTodos(titre)
}

ajoutTachesForm.addEventListener('submit', (e) => {
    addTodos()
})