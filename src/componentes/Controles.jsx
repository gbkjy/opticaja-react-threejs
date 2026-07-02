import React, { useContext, useEffect, useRef, useState } from "react";
import { ContextoCaja } from "../contexto/ContextoCaja";

export default function Controles() {
  const { largo, setLargo, ancho, setAncho, corte, setCorte, corteOptimo, esOptimo, unidad } = useContext(ContextoCaja);
  const animacionRef = useRef(null);

  const dimMin = 10;
  const dimMax = 300;
  const corteMax = Math.min(largo, ancho) / 2 - 0.5;
  const cortePaso = 0.1;

  const [txtLargo, setTxtLargo] = useState("");
  const [txtAncho, setTxtAncho] = useState("");
  const [txtCorte, setTxtCorte] = useState("");

  useEffect(() => {
    setTxtLargo(largo.toString());
  }, [largo]);

  useEffect(() => {
    setTxtAncho(ancho.toString());
  }, [ancho]);

  useEffect(() => {
    setTxtCorte(corte.toFixed(1));
  }, [corte]);

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

  useEffect(() => {
    return () => {
      if (animacionRef.current) {
        cancelAnimationFrame(animacionRef.current);
      }
    };
  }, []);

  const alCambiarLargoManual = (e) => {
    const val = e.target.value;
    setTxtLargo(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed >= 0) {
      setLargo(Math.min(parsed, dimMax));
    }
  };

  const alCambiarAnchoManual = (e) => {
    const val = e.target.value;
    setTxtAncho(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed >= 0) {
      setAncho(Math.min(parsed, dimMax));
    }
  };

  const alCambiarCorteManual = (e) => {
    const val = e.target.value;
    setTxtCorte(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed >= 0) {
      let verif = Math.min(parsed, corteMax);
      setCorte(verif);
    }
  };

  return (
    <div className="panel-controles">
      <h2>Parámetros</h2>
      
      <div className="campo-rango" style={{ marginBottom: "16px" }}>
        <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
          <span>Largo de la lámina (A)</span>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <input
              type="number"
              min={dimMin}
              max={dimMax}
              step="1"
              value={txtLargo}
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
              step="1"
              value={txtAncho}
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
              value={txtCorte}
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
