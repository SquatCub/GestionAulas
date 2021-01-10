document.addEventListener('DOMContentLoaded', function() {
    listener();
});


function listener() {
    document.querySelectorAll('.listen').forEach(btn => {
        btn.onclick = function () {
            aula = btn.id;
            alert(aula);
        }
    });
};