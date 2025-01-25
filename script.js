//obter a última modificação do documento
const lastModified = new Date(document.lastModified);

//exibir a data formatada no rodapé
document.getElementById('lastModified').textContent = 
    lastModified.toLocaleDateString() + ' at ' + lastModified.toLocaleTimeString();
