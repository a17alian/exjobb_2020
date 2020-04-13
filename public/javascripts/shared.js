function showInput(){
    var x = document.getElementById("fab-input");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
}


// Close window in esc press
window.onkeydown = function( event ) {
    if ( event.keyCode == 27 ) {
        showInput();
    }
};