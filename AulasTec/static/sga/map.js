document.addEventListener('DOMContentLoaded', function() {
    listener();
});


function listener() {
    document.querySelectorAll('.listen').forEach(btn => {
        btn.onclick = function () {
            var modal = document.getElementById("myModal");
            modal.innerHTML = `<!-- Modal content -->
            <div class="modal-content-map">
              <span id="close" class="close">&times;</span>
              <p>Seleccionaste el aula ${btn.id}</p>
            </div>`;
            var span = document.getElementById("close");
            span.onclick = function() {
                modal.style.display = "none";
            }
            setTimeout(() => {  modal.style.display = "block"; }, 500);
        }
    });
};