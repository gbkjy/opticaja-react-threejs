import React, { useContext, useState } from "react";
import { ContextoCaja } from "../contexto/ContextoCaja";
import { obtenerPrimeraDerivada, obtenerSegundaDerivada } from "../matematica/modeloCaja";

export default function PanelProcedimiento() {
  const { largo, ancho, corte, baseLargo, baseAncho, volumen, corteOptimo, volumenMaximo, unidad } = useContext(ContextoCaja);
  const [desplegado, setDesplegado] = useState(false);

  const primeraDerivadaValor = obtenerPrimeraDerivada(corte, largo, ancho);
  const segundaDerivadaValor = obtenerSegundaDerivada(corteOptimo, largo, ancho);

  const esMetros = unidad === "m";
  const decimales = esMetros ? 3 : 2;
  const unidadArea = esMetros ? "m²" : "cm²";
  const unidadVolumen = esMetros ? "m³" : "cm³";
  const largoFormato = esMetros ? largo.toFixed(2) : largo.toString();
  const anchoFormato = esMetros ? ancho.toFixed(2) : ancho.toString();

  return (
    <div className="panel-procedimiento">
      <button className="procedimiento-cabecera" onClick={() => setDesplegado(!desplegado)}>
        <span>VER EL PROCEDIMIENTO MATEMÁTICO</span>
        <span className={`chevron ${desplegado ? "abierto" : ""}`}>▼</span>
      </button>

      {desplegado && (
        <div className="procedimiento-contenido">
          <div className="paso-matematico">
            <h3>1. FUNCIÓN OBJETIVO</h3>
            <p>Se desea maximizar el volumen de la caja. El volumen V está determinado por el producto del área de la base y su altura x:</p>
            <div className="bloque-codigo">
              V(x) = x · (A − 2x) · (B − 2x)
              <br />
              V(x) = x · ({largoFormato} − 2x) · ({anchoFormato} − 2x)
              <br />
              V({corte.toFixed(decimales)}) = {corte.toFixed(decimales)} · ({baseLargo.toFixed(decimales)}) · ({baseAncho.toFixed(decimales)}) = <b>{volumen.toFixed(esMetros ? 4 : 2)} {unidadVolumen}</b>
            </div>
          </div>

          <div className="paso-matematico">
            <h3>2. FUNCIÓN RESTRICTIVA</h3>
            <p>La restricción viene dada por el tamaño de la lámina rectangular original, que tiene dimensiones fijas:</p>
            <div className="bloque-codigo">
              A = {largoFormato} {unidad} &nbsp;|&nbsp; B = {anchoFormato} {unidad} &nbsp; (Área total: {(largo * ancho).toFixed(esMetros ? 4 : 0)} {unidadArea})
            </div>
          </div>

          <div className="paso-matematico">
            <h3>3. DERIVAR E IGUALAR A CERO</h3>
            <p>Para hallar los puntos críticos, calculamos la primera derivada de V(x) con respecto a x e igualamos a cero:</p>
            <div className="bloque-codigo">
              V'(x) = A·B − 4(A+B)x + 12x² = 0
              <br />
              V'({corte.toFixed(decimales)}) = ({largoFormato}·{anchoFormato}) − 4·({largoFormato}+{anchoFormato})·{corte.toFixed(decimales)} + 12·({corte.toFixed(decimales)})² = <b>{primeraDerivadaValor.toFixed(esMetros ? 4 : 2)}</b>
              <br />
              Al resolver la ecuación cuadrática, el punto crítico óptimo dentro del dominio es:
              <br />
              x* = <b>{corteOptimo.toFixed(decimales)} {unidad}</b>
            </div>
          </div>

          <div className="paso-matematico">
            <h3>4. VERIFICACIÓN DE MÁXIMO</h3>
            <p>Confirmamos si el punto crítico es un máximo evaluando en la segunda derivada. Si V''(x*) &lt; 0, es un máximo local:</p>
            <div className="bloque-codigo">
              V''(x) = 24x − 4(A+B)
              <br />
              V''({corteOptimo.toFixed(decimales)}) = 24 · ({corteOptimo.toFixed(decimales)}) − 4 · ({largoFormato} + {anchoFormato}) = <b>{segundaDerivadaValor.toFixed(esMetros ? 3 : 2)}</b> &lt; 0
              <br />
              Dado que es menor que cero, se confirma que en x* = {corteOptimo.toFixed(decimales)} {unidad} se alcanza el volumen máximo.
            </div>
          </div>

          <div className="paso-matematico">
            <h3>5. RESULTADOS FINALES</h3>
            <p>Con las dimensiones obtenidas del cálculo:</p>
            <div className="bloque-codigo">
              Largo base: {largoFormato} − 2 · ({corteOptimo.toFixed(decimales)}) = <b>{(largo - 2 * corteOptimo).toFixed(decimales)} {unidad}</b>
              <br />
              Ancho base: {anchoFormato} − 2 · ({corteOptimo.toFixed(decimales)}) = <b>{(ancho - 2 * corteOptimo).toFixed(decimales)} {unidad}</b>
              <br />
              Altura de la caja: <b>{corteOptimo.toFixed(decimales)} {unidad}</b>
              <br />
              Volumen óptimo máximo: <b>{volumenMaximo.toFixed(esMetros ? 4 : 2)} {unidadVolumen}</b>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
