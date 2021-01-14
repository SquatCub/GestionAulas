document.addEventListener('DOMContentLoaded', function() {
    listener();
});


function listener() {
    document.querySelectorAll('.listen').forEach(btn => {
        btn.onclick = function () {
            fetch('/edificio/', {
                method: 'PUT',
                body: JSON.stringify({edificio_nombre: btn.id})
            })
            .then(response => response.json())
            .then(result => {
                if (result.error) {
                    console.log(`Error at like: ${result.error}`);
                } else { 
                    var modal = document.getElementById("myModal");
                    modal.innerHTML = `
                    <!-- Modal content -->
                    <div class="modal-content-map">
                        <div class="modal-header-map">
                            <span id="close" class="close">&times;</span>
                            <h2>Edificio ${result.json.nombre}</h2>
                        </div>
                        <div class="modal-body-map">
                            <h6>Departamento: ${result.json.especialidad}</h6>
                            <h5>${result.json.descripcion}</h5>
                        </div>
                        <div class="modal-footer-map">
                            <h7>Aulas: ${result.json.numAulas} - Pisos: ${result.json.numPisos}</h7>
                        </div>
                    </div>`;
                    var span = document.getElementById("close");
                    span.onclick = function() {
                        modal.style.display = "none";
                    }
                    setTimeout(() => {  modal.style.display = "block"; }, 250);
                }
            });
        }
    });
}