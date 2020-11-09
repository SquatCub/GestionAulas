$(document).ready(function () 
{

    var misPreguntas = ["Que tan satisfecho estas con el resultado", "La información del Aula te es Útil.", 
                        "Como fue tu atención en la oficina?",
                           "Fue fácil llegar a tu Aula?",
                           "Se ve bien la página en tu celular? ",
                           "Tu satisfacción con el sistema?",
                           "Que tan útil te es la aplicación?",
                           "Recomendarías esta Pagina?",
                           "Estarías dispuesto a donar 100 varos a los desarrolladores?"];
    var i = 0;

    $("#sad").click(function() 
    {
      
      document.getElementById('sad').style.background = "#99AA99";
      document.getElementById('neutral').style.background = "#fff";
      document.getElementById('happy').style.background = "#fff";

    });

    $("#neutral").click(function() 
    {
      
      document.getElementById('sad').style.background = "#fff";
      document.getElementById('neutral').style.background = "#99AA99";
      document.getElementById('happy').style.background = "#fff";

    });

    $("#happy").click(function() 
    {
      
      document.getElementById('sad').style.background = "#fff";
      document.getElementById('neutral').style.background = "#fff";
      document.getElementById('happy').style.background = "#99AA99";

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
    });

    $("#next").click(function() 
    {
      document.getElementById('sad').style.background = "#fff";
      document.getElementById('neutral').style.background = "#fff";
      document.getElementById('happy').style.background = "#fff";


      if ( i < misPreguntas.length)
      {
        document.getElementById("miPregunta").textContent = misPreguntas[i];
        i++;
      }
      else
      {
        document.getElementById("miPregunta").textContent = "Gracias";
        i = 0;
      }

    });

    $("#launch").click(function() 
    {
      document.getElementById('sad').style.background = "#fff";
      document.getElementById('neutral').style.background = "#fff";
      document.getElementById('happy').style.background = "#fff";

      if ( i == misPreguntas.length)
      {
        i = 0;
        document.getElementById("miPregunta").textContent = misPreguntas[i];
        i++;
      }
      else
      {
        document.getElementById("miPregunta").textContent = misPreguntas[i];
        i++;
      }
    });
});