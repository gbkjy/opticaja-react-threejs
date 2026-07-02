import React, { useContext } from "react";
import { ContextoCaja } from "../contexto/ContextoCaja";

export default function LecturaFormula({ compacto }) {
  const { largo, ancho, corte, baseLargo, baseAncho, volumen, corteOptimo, volumenMaximo, unidad } = useContext(ContextoCaja);

  const esMetros = unidad === "m";
  const decimales = esMetros ? 3 : 2;
  const unidadVolumen = esMetros ? "m³" : "cm³";

  if (compacto) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <div style={{ fontSize: "9px", fontFamily: "var(--fuente-mono)", textAlign: "center", marginBottom: "2px", borderBottom: "1px solid rgba(18, 35, 63, 0.08)", paddingBottom: "2px", fontWeight: "bold" }}>
          Lectura en vivo
        </div>
        <div style={{ fontFamily: "var(--fuente-mono)", fontSize: "9.5px", lineHeight: "1.4", background: "var(--tinta)", color: "var(--papel)", padding: "6px", borderRadius: "2px" }}>
          <span style={{ color: "var(--acento-suave)", fontWeight: "bold" }}>V(x)</span> = x·(A-2x)·(B-2x)
          <br />
          A = <span style={{ color: "var(--optimo)" }}>{esMetros ? largo.toFixed(2) : largo}</span> | B = <span style={{ color: "var(--optimo)" }}>{esMetros ? ancho.toFixed(2) : ancho}</span>
          <br />
          x = <span style={{ color: "var(--optimo)" }}>{corte.toFixed(decimales)}</span> {unidad}
          <br />
          V(x) = <span style={{ color: "var(--optimo)" }}>{volumen.toFixed(esMetros ? 4 : 2)} {unidadVolumen}</span>
          <br />
          <span style={{ color: "var(--acento-suave)", fontWeight: "bold" }}>x*</span> = <span style={{ color: "var(--optimo)" }}>{corteOptimo.toFixed(decimales)}</span> | V_max = <span style={{ color: "var(--optimo)" }}>{volumenMaximo.toFixed(esMetros ? 4 : 2)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="panel-formula">
      <h2>Lectura en vivo</h2>
      <div className="bloque-formula">
        <span className="fx">V(x)</span> = x · (A - 2x) · (B - 2x)
        <br />
        A = <span className="val">{esMetros ? largo.toFixed(2) : largo}</span> {unidad} &nbsp; B = <span className="val">{esMetros ? ancho.toFixed(2) : ancho}</span> {unidad}
        <br />
        x = <span className="val">{corte.toFixed(decimales)}</span> {unidad}
        <br />
        V(x) = {corte.toFixed(decimales)} · ({baseLargo.toFixed(decimales)}) · ({baseAncho.toFixed(decimales)}) = <span className="val">{volumen.toFixed(esMetros ? 4 : 2)} {unidadVolumen}</span>
        <br />
        <br />
        <span className="fx">V'(x) = 0</span> → x* = <span className="val">{corteOptimo.toFixed(decimales)} {unidad}</span>
        <br />
        V_max = <span className="val">{volumenMaximo.toFixed(esMetros ? 4 : 2)} {unidadVolumen}</span>
      </div>
    </div>
  );
}
