function goToTheNextPage() {
    window.location.href = "HHSimulate/HHSimulate.html";
}

const lastModified = new Date(document.lastModified);

//exibir a data formatada no rodapé
document.getElementById('lastModified').textContent = 
    lastModified.toLocaleDateString() + ' at ' + lastModified.toLocaleTimeString();