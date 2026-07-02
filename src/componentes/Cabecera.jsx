import React from "react";

export default function Cabecera() {
  return (
    <header className="cabecera-app" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "18px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <img 
          src="/iconos/opticaja_logo.png" 
          alt="OptiCaja Logo" 
          style={{ height: "72px", width: "auto", objectFit: "contain" }} 
        />
        <h1 style={{ fontSize: "32px", margin: 0 }}>Optimizador de volumen de cajas de cartón</h1>
      </div>
    </header>
  );
}
