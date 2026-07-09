import React, { useContext } from "react";
import { ContextoCaja } from "../contexto/ContextoCaja";
import { obtenerVolumen } from "../matematica/modeloCaja";

export default function GraficoVolumen({ compacto = false }) {
  const { largo, ancho, corte, volumen, corteOptimo, volumenMaximo } = useContext(ContextoCaja);

  const largoSano = Math.max(Number(largo) || 0, 1);
  const anchoSano = Math.max(Number(ancho) || 0, 1);

  const svgAncho = 220;
  const svgAlto = compacto ? 110 : 120;
  const margen = 16;
  const limiteX = Math.min(largoSano, anchoSano) / 2;
  const limiteV = Math.max(volumenMaximo * 1.15, 0.1);

  let coordenadasCamino = "";
  const pasos = 60;
  for (let i = 0; i <= pasos; i++) {
    const xValor = (i / pasos) * limiteX;
    const yValor = obtenerVolumen(xValor, largo, ancho);
    const px = margen + (xValor / limiteX) * (svgAncho - 2 * margen);
    const py = svgAlto - margen - (yValor / limiteV) * (svgAlto - 2 * margen);
    coordenadasCamino += (i === 0 ? "M" : "L") + px.toFixed(1) + "," + py.toFixed(1) + " ";
  }

  const pxOptimo = margen + (corteOptimo / limiteX) * (svgAncho - 2 * margen);

  const pxActual = margen + (corte / limiteX) * (svgAncho - 2 * margen);
  const pyActual = svgAlto - margen - (volumen / limiteV) * (svgAlto - 2 * margen);

  const contenidoSvg = (
    <svg viewBox={`0 0 ${svgAncho} ${svgAlto}`} className="svg-grafico" style={{ width: "100%", height: "auto", display: "block" }}>
      <line x1={margen} y1={svgAlto - margen} x2={svgAncho - 8} y2={svgAlto - margen} stroke="#12233F" strokeWidth="1" />
      <line x1={margen} y1={8} x2={margen} y2={svgAlto - margen} stroke="#12233F" strokeWidth="1" />
      <path d={coordenadasCamino} fill="none" stroke="#8F5C2B" strokeWidth="1.75" />
      <line x1={pxOptimo} y1={8} x2={pxOptimo} y2={svgAlto - margen} stroke="#12233F" strokeWidth="0.75" strokeDasharray="3,3" />
      <circle cx={pxActual} cy={pyActual} r="3.5" fill="#D9531E" stroke="#12233F" strokeWidth="1" />
      <text x={margen} y="10" fontSize="8" fill="#3C567E" fontFamily="JetBrains Mono">V</text>
      <text x={svgAncho - 14} y={svgAlto - margen + 11} fontSize="8" fill="#3C567E" fontFamily="JetBrains Mono">x</text>
    </svg>
  );

  if (compacto) {
    return contenidoSvg;
  }

  return (
    <div className="panel-grafico">
      <h2>V(x) en el dominio</h2>
      {contenidoSvg}
      <div className="leyenda-pie">Punto rojo: x actual · Línea punteada: óptimo</div>
    </div>
  );
}
