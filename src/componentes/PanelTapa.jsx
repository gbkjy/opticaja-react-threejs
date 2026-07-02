import React, { useContext } from "react";
import { ContextoCaja } from "../contexto/ContextoCaja";

export default function PanelTapa() {
  const { 
    unidad, 
    tapaLargo, 
    tapaAncho, 
    tapaAlto, 
    tapaLaminaLargo, 
    tapaLaminaAncho, 
    tapaArea, 
    holguraTapa 
  } = useContext(ContextoCaja);

  const esMetros = unidad === "m";
  const dec = esMetros ? 3 : 1;
  const decArea = esMetros ? 4 : 1;
  const unidadArea = esMetros ? "m²" : "cm²";

  return (
    <div className="panel-tapa" style={{ marginTop: "20px" }}>
      <h2>Tapa telescópica complementaria</h2>
      <p style={{ fontSize: "12px", color: "var(--tinta-suave)", marginBottom: "14px" }}>
        Especificaciones técnicas para cortar y fabricar la tapa superior compatible con la base optimizada.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontFamily: "var(--fuente-mono)", fontSize: "12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(18, 35, 63, 0.1)", paddingBottom: "6px" }}>
          <span>Holgura aplicada:</span>
          <b>{holguraTapa.toFixed(dec)} {unidad} (4 mm)</b>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(18, 35, 63, 0.1)", paddingBottom: "6px" }}>
          <span>Base de la tapa:</span>
          <b>{tapaLargo.toFixed(dec)} × {tapaAncho.toFixed(dec)} {unidad}</b>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(18, 35, 63, 0.1)", paddingBottom: "6px" }}>
          <span>Altura de la tapa:</span>
          <b>{tapaAlto.toFixed(dec)} {unidad}</b>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(18, 35, 63, 0.1)", paddingBottom: "6px" }}>
          <span>Lámina requerida (A_t × B_t):</span>
          <b style={{ color: "var(--acento)" }}>{tapaLaminaLargo.toFixed(dec)} × {tapaLaminaAncho.toFixed(dec)} {unidad}</b>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "2px" }}>
          <span>Superficie de cartón:</span>
          <b>{tapaArea.toFixed(decArea)} {unidadArea}</b>
        </div>
      </div>

      <div style={{ 
        marginTop: "14px", 
        padding: "10px", 
        background: "rgba(18, 35, 63, 0.05)", 
        borderRadius: "4px", 
        borderLeft: "3px solid var(--tinta)",
        fontSize: "11px",
        color: "var(--tinta)"
      }}>
        💡 <b>Nota de manufactura:</b> Se ha configurado una holgura estándar para asegurar el deslizamiento telescópico de la tapa por sobre la base sin atascarse.
      </div>
    </div>
  );
}
