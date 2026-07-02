export function registrarServiceWorker() {
  if ("serviceWorker" in navigator && import.meta.env.PROD) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("Service Worker registrado con éxito:", reg.scope);
        })
        .catch((err) => {
          console.error("Fallo al registrar el Service Worker:", err);
        });
    });
  }
}
