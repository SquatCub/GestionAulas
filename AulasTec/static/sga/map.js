let counter=0;
let myRandom = Math.floor(Math.random()*(10-5))+5;
var intervalId = null;
var misPreguntas = []
var i = 0;
var valor = 0;

var listenerShowEncuesta = function(){
     if(counter == myRandom) {
        renderEncuesta();
        clearInterval(intervalId);
     } else {
         counter++; 
     }
};

// Listener MAIN
document.addEventListener('DOMContentLoaded', function() {
    listener();
    fetchDataEncuesta();
    $("#sad").click(function() 
    {
      
      document.getElementById('sad').style.background = "#99AA99";
      document.getElementById('neutral').style.background = "#fff";
      document.getElementById('happy').style.background = "#fff";

      valor = 1;

    });

    $("#neutral").click(function() 
    {
      
      document.getElementById('sad').style.background = "#fff";
      document.getElementById('neutral').style.background = "#99AA99";
      document.getElementById('happy').style.background = "#fff";

      valor = 2;

    });

    $("#happy").click(function() 
    {
      
      document.getElementById('sad').style.background = "#fff";
      document.getElementById('neutral').style.background = "#fff";
      document.getElementById('happy').style.background = "#99AA99";

      valor = 3;

    });

    $("#cerrar").click(function() 
    {
      document.getElementById('sad').style.background = "#fff";
      document.getElementById('neutral').style.background = "#fff";
      document.getElementById('happy').style.background = "#fff";

      if ( i < misPreguntas.length && i > 0)
      {
        i--;
      }
      else
      {
        if (i == misPreguntas.length)
        {
          i--;
        }
      }

      valor = 0;
    });
});


function restartCounter(){
    counter = 0
    myRandom = Math.floor(Math.random()*(10-5))+5;

    valor = 0;
    runRandomEncuesta();
}

function re()
{
    for (var o = 0; o < 20; o++) {

        for (var l = 0; l < misPreguntas.length; l++) {

                  fetch('puntar/'+misPreguntas[l].id+'/3', {
                    method: 'GET'
                })
                  .then(response => response.json())
                  .then(result => {

                 });
        }
        
    }
}

function fetchPuntuacion(id)
{   
    if(valor != 0)
    {
        var k = id-1
        if(k >= 0)
        {
            try
            {

                fetch('puntar/'+misPreguntas[k].id+'/'+valor, {
                    method: 'GET'
                })
                  .then(response => response.json())
                  .then(result => {

                 });
            }
            catch (e)
            {
                console.log(e);
            }
        }
    }
    
    valor = 0;
}

function fetchDataEncuesta()
{
    try
    {

        fetch('/encuesta', {
            method: 'GET'
        })
          .then(response => response.json())
          .then(result => {

            if (result.length > 0) 
            {
                runRandomEncuesta();
                misPreguntas = result;
            }

         });
    }
    catch (e)
    {
        console.log(e);
    }
}

function renderEncuesta()
{
    $('#myEncuesta').modal('show');
}

function nextP() 
{
      document.getElementById('sad').style.background = "#fff";
      document.getElementById('neutral').style.background = "#fff";
      document.getElementById('happy').style.background = "#fff";

      fetchPuntuacion(i);
      if ( i < misPreguntas.length)
      {
        document.getElementById("miPregunta").textContent = misPreguntas[i].pregunta+" : ID="+ misPreguntas[i].id;
        i++;
      }
      else
      {
        document.getElementById("miPregunta").textContent = "Gracias";
        i = 0;
      }
}


function runRandomEncuesta()
{
    intervalId = setInterval(listenerShowEncuesta, 1000);
}


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