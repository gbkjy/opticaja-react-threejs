import React, { useContext } from "react";
import { ContextoCaja } from "../contexto/ContextoCaja";

export default function LecturaFormula() {
  const { largo, ancho, corte, baseLargo, baseAncho, volumen, corteOptimo, volumenMaximo, unidad } = useContext(ContextoCaja);

  const esMetros = unidad === "m";
  const decimales = esMetros ? 3 : 2;
  const unidadVolumen = esMetros ? "m³" : "cm³";

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
