import React, { useContext } from "react";
import { ContextoCaja } from "../contexto/ContextoCaja";

export default function PatronPlano() {
  const { largo, ancho, corte, unidad } = useContext(ContextoCaja);

  const margenMaximo = 180;
  const escala = Math.min(margenMaximo / largo, margenMaximo / ancho);
  const w = largo * escala;
  const h = ancho * escala;
  const cx = 20 + (margenMaximo - w) / 2;
  const cy = 20 + (margenMaximo - h) / 2;
  const c = corte * escala;

  const aletas = [
    `${cx},${cy + c} ${cx + c},${cy + c} ${cx + c},${cy} ${cx + c / 2},${cy}`,
    `${cx + w},${cy + c} ${cx + w - c},${cy + c} ${cx + w - c},${cy} ${cx + w - c / 2},${cy}`,
    `${cx},${cy + h - c} ${cx + c},${cy + h - c} ${cx + c},${cy + h} ${cx + c / 2},${cy + h}`,
    `${cx + w},${cy + h - c} ${cx + w - c},${cy + h - c} ${cx + w - c},${cy + h} ${cx + w - c / 2},${cy + h}`,
  ];

  const descartes = [
    `${cx},${cy} ${cx + c / 2},${cy} ${cx},${cy + c}`,
    `${cx + w},${cy} ${cx + w - c / 2},${cy} ${cx + w},${cy + c}`,
    `${cx},${cy + h} ${cx + c / 2},${cy + h} ${cx},${cy + h - c}`,
    `${cx + w},${cy + h} ${cx + w - c / 2},${cy + h} ${cx + w},${cy + h - c}`,
  ];

  return (
    <div className="panel-patron-plano">
      <h2>Patrón plano</h2>
      <svg viewBox="0 0 220 220" className="svg-patron">
        <defs>
          <pattern id="patronLineas" width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="6" stroke="#D9531E" strokeWidth="1" />
          </pattern>
        </defs>

        <rect x={cx + c} y={cy + c} width={w - 2 * c} height={h - 2 * c} fill="#C1834B" fillOpacity="0.15" />

        <rect x={cx} y={cy + c} width={c} height={h - 2 * c} fill="#3C567E" fillOpacity="0.15" />
        <rect x={cx + w - c} y={cy + c} width={c} height={h - 2 * c} fill="#3C567E" fillOpacity="0.15" />
        <rect x={cx + c} y={cy} width={w - 2 * c} height={c} fill="#3C567E" fillOpacity="0.15" />
        <rect x={cx + c} y={cy + h - c} width={w - 2 * c} height={c} fill="#3C567E" fillOpacity="0.15" />

        {aletas.map((puntos, indice) => (
          <polygon
            key={`aleta-${indice}`}
            points={puntos}
            fill="#8F5C2B"
            fillOpacity="0.3"
            stroke="#8F5C2B"
            strokeWidth="0.75"
          />
        ))}

        {descartes.map((puntos, indice) => (
          <polygon
            key={`descarte-${indice}`}
            points={puntos}
            fill="url(#patronLineas)"
            fillOpacity="0.3"
            stroke="#D9531E"
            strokeWidth="1"
            strokeDasharray="2,2"
          />
        ))}

        <rect x={cx} y={cy} width={w} height={h} fill="none" stroke="#12233F" strokeWidth="1.5" />

        <line x1={cx + c} y1={cy} x2={cx + c} y2={cy + h} stroke="#12233F" strokeWidth="1" strokeDasharray="4,3" />
        <line x1={cx + w - c} y1={cy} x2={cx + w - c} y2={cy + h} stroke="#12233F" strokeWidth="1" strokeDasharray="4,3" />
        <line x1={cx} y1={cy + c} x2={cx + w} y2={cy + c} stroke="#12233F" strokeWidth="1" strokeDasharray="4,3" />
        <line x1={cx} y1={cy + h - c} x2={cx + w} y2={cy + h - c} stroke="#12233F" strokeWidth="1" strokeDasharray="4,3" />

        <text x={cx + w / 2} y={cy + h + 14} fontSize="9" fill="#3C567E" textAnchor="middle" fontFamily="JetBrains Mono">
          A = {largo} {unidad} × B = {ancho} {unidad}
        </text>
      </svg>

      <div className="leyenda-patron">
        <div className="leyenda-item">
          <span className="leyenda-color descarte"></span>
          <span>Descarte (triángulos)</span>
        </div>
        <div className="leyenda-item">
          <span className="leyenda-color base"></span>
          <span>Base útil de la caja</span>
        </div>
        <div className="leyenda-item">
          <span className="leyenda-color pestañas"></span>
          <span>Paredes (pestañas)</span>
        </div>
        <div className="leyenda-item">
          <span style={{ display: "inline-block", width: "12px", height: "12px", background: "rgba(143, 92, 43, 0.3)", border: "1px solid #8F5C2B", marginRight: "6px" }}></span>
          <span>Aletas de pegado</span>
        </div>
      </div>
    </div>
  );
}
