import React, { useContext, useEffect, useRef } from "react";
import { ContextoCaja } from "../contexto/ContextoCaja";

export default function Controles() {
  const { largo, setLargo, ancho, setAncho, corte, setCorte, corteOptimo, esOptimo, unidad, setUnidad } = useContext(ContextoCaja);
  const animacionRef = useRef(null);

  const irAlOptimo = () => {
    if (animacionRef.current) {
      cancelAnimationFrame(animacionRef.current);
    }

    const valorInicial = corte;
    const valorObjetivo = corteOptimo;
    const duracion = 300;
    const inicioTiempo = performance.now();

    const animar = (ahora) => {
      const transcurrido = ahora - inicioTiempo;
      const progreso = Math.min(transcurrido / duracion, 1);
      const valorActual = valorInicial + (valorObjetivo - valorInicial) * progreso;
      setCorte(valorActual);

      if (progreso < 1) {
        animacionRef.current = requestAnimationFrame(animar);
      }
    };

    animacionRef.current = requestAnimationFrame(animar);
  };

  const cambiarUnidad = (nuevaUnidad) => {
    if (nuevaUnidad === unidad) return;
    if (nuevaUnidad === "m") {
      const nuevoLargo = Math.min(largo / 100, 3.0);
      const nuevoAncho = Math.min(ancho / 100, 3.0);
      setLargo(nuevoLargo);
      setAncho(nuevoAncho);
      setCorte(Math.min(corte / 100, Math.min(nuevoLargo, nuevoAncho) / 2 - 0.005));
    } else {
      const nuevoLargo = Math.min(largo * 100, 300);
      const nuevoAncho = Math.min(ancho * 100, 300);
      setLargo(nuevoLargo);
      setAncho(nuevoAncho);
      setCorte(Math.min(corte * 100, Math.min(nuevoLargo, nuevoAncho) / 2 - 0.5));
    }
    setUnidad(nuevaUnidad);
  };

  useEffect(() => {
    return () => {
      if (animacionRef.current) {
        cancelAnimationFrame(animacionRef.current);
      }
    };
  }, []);

  const esMetros = unidad === "m";
  const dimMin = esMetros ? 0.1 : 10;
  const dimMax = esMetros ? 3.0 : 300;
  const corteMax = esMetros ? (Math.min(largo, ancho) / 2 - 0.005) : (Math.min(largo, ancho) / 2 - 0.5);
  const cortePaso = esMetros ? 0.001 : 0.1;

  const alCambiarLargoManual = (e) => {
    let val = parseFloat(e.target.value) || 0;
    if (val > dimMax) val = dimMax;
    setLargo(val);
  };

  const alCambiarAnchoManual = (e) => {
    let val = parseFloat(e.target.value) || 0;
    if (val > dimMax) val = dimMax;
    setAncho(val);
  };

  const alCambiarCorteManual = (e) => {
    let val = parseFloat(e.target.value) || 0;
    if (val > corteMax) val = corteMax;
    if (val < 0) val = 0;
    setCorte(val);
  };

  return (
    <div className="panel-controles">
      <h2>Parámetros</h2>

      <div className="selector-unidades" style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        <button
          className={`boton-unidad ${!esMetros ? "activo" : ""}`}
          style={{
            flex: 1,
            padding: "6px",
            fontFamily: "var(--fuente-mono)",
            fontSize: "11px",
            background: !esMetros ? "var(--tinta)" : "var(--panel)",
            color: !esMetros ? "var(--papel)" : "var(--tinta)",
            border: "1px solid var(--tinta)",
            cursor: "pointer"
          }}
          onClick={() => cambiarUnidad("cm")}
        >
          Centímetros (cm)
        </button>
        <button
          className={`boton-unidad ${esMetros ? "activo" : ""}`}
          style={{
            flex: 1,
            padding: "6px",
            fontFamily: "var(--fuente-mono)",
            fontSize: "11px",
            background: esMetros ? "var(--tinta)" : "var(--panel)",
            color: esMetros ? "var(--papel)" : "var(--tinta)",
            border: "1px solid var(--tinta)",
            cursor: "pointer"
          }}
          onClick={() => cambiarUnidad("m")}
        >
          Metros (m)
        </button>
      </div>
      
      <div className="campo-rango" style={{ marginBottom: "16px" }}>
        <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
          <span>Largo de la lámina (A)</span>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <input
              type="number"
              min={dimMin}
              max={dimMax}
              step={esMetros ? "0.01" : "1"}
              value={largo || ""}
              onChange={alCambiarLargoManual}
              style={{
                width: "80px",
                padding: "4px",
                border: "1px solid var(--tinta)",
                background: "var(--panel)",
                color: "var(--tinta)",
                fontFamily: "var(--fuente-mono)",
                fontSize: "13px",
                textAlign: "right"
              }}
            />
            <span style={{ fontSize: "12px", color: "var(--tinta-suave)" }}>{unidad}</span>
          </div>
        </label>
      </div>

      <div className="campo-rango" style={{ marginBottom: "20px" }}>
        <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
          <span>Ancho de la lámina (B)</span>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <input
              type="number"
              min={dimMin}
              max={dimMax}
              step={esMetros ? "0.01" : "1"}
              value={ancho || ""}
              onChange={alCambiarAnchoManual}
              style={{
                width: "80px",
                padding: "4px",
                border: "1px solid var(--tinta)",
                background: "var(--panel)",
                color: "var(--tinta)",
                fontFamily: "var(--fuente-mono)",
                fontSize: "13px",
                textAlign: "right"
              }}
            />
            <span style={{ fontSize: "12px", color: "var(--tinta-suave)" }}>{unidad}</span>
          </div>
        </label>
        <span style={{ fontSize: "10px", color: "var(--tinta-suave)" }}>Límite sugerido para logística: {dimMax} {unidad}</span>
      </div>

      <div className="campo-rango">
        <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <span>Corte en la esquina (x)</span>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <input
              type="number"
              min="0"
              max={corteMax}
              step={cortePaso}
              value={Number(corte.toFixed(esMetros ? 3 : 1)) || ""}
              onChange={alCambiarCorteManual}
              style={{
                width: "80px",
                padding: "4px",
                border: "1px solid var(--tinta)",
                background: "var(--panel)",
                color: "var(--tinta)",
                fontFamily: "var(--fuente-mono)",
                fontSize: "13px",
                textAlign: "right"
              }}
            />
            <span style={{ fontSize: "12px", color: "var(--tinta-suave)" }}>{unidad}</span>
          </div>
        </label>
        <input
          type="range"
          min="0"
          max={corteMax}
          step={cortePaso}
          value={corte}
          onChange={(e) => setCorte(parseFloat(e.target.value))}
        />
      </div>

      <button className="boton-optimo" onClick={irAlOptimo}>
        Ir al punto óptimo (x = x*)
      </button>

      <div className={`bandera-estado ${esOptimo ? "optimo-activo" : "optimo-inactivo"}`}>
        {esOptimo ? "✓ Volumen máximo alcanzado" : "Buscando el máximo…"}
      </div>
    </div>
  );
}
