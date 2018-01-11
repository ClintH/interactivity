function onDocumentReady() {
  

  document.getElementById("goFullscreen").addEventListener("click", function() {
    if (screenfull.enabled) {
      screenfull.request();
    }
  });
  
}

if (document.readyState != 'loading'){
  onDocumentReady();
} else {
  document.addEventListener('DOMContentLoaded', onDocumentReady);
}