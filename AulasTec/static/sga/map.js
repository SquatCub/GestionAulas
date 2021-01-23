document.addEventListener('DOMContentLoaded', function() {
    listener();
});


function listener() {
    document.querySelectorAll('.listen').forEach(btn => {
        btn.onclick = function () {
            fetch('/edificio', {
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

function buscar() {
    
    input = document.getElementById('texto').value;
    if(!input) {
        alert("Ingresa al menos una letra")
    } else {
        fetch('/buscar', {
            method: 'POST',
            body: JSON.stringify({value: input})
        })
        .then(response => response.json())
        .then(result => {
            table = document.getElementById('content-table');
            table.innerHTML = `<div id="accordion">
            <div class="card text-center">
              
            </div>`;
            result.edificios.forEach( el => {
            ed = document.createElement('div');
            aul = document.createElement('div');
            ed.innerHTML = `<div class="card-header" id="headingOne">
                    <h5 class="mb-0">
                    <button class="btn btn-link" data-toggle="collapse" data-target="#collapseOne${el.nombre}" aria-expanded="true" aria-controls="collapseOne${el.nombre}">
                        ${el.nombre}
                    </button>
                    </h5>
                </div>`;
                table.append(ed);
                result.aulas.forEach( au => {
                    if(au.edificio.nombre == el.nombre) {
                        aul.innerHTML = `<div id="collapseOne${el.nombre}" class="collapse" aria-labelledby="headingOne" data-parent="#accordion">
                        <div class="card-body">
                              <a href="">${au.nombre}</a>
                        </div>
                      </div>`;
                      table.append(aul);
                    }
                });
                
            })
            
        })
    }
    
}