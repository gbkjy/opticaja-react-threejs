import React, { useContext, useEffect, useRef, useState } from "react";
import { ContextoCaja } from "../contexto/ContextoCaja";

export default function Controles() {
  const {
    largo,
    setLargo,
    ancho,
    setAncho,
    corte,
    setCorte,
    corteOptimo,
    esOptimo,
    unidad,
    costoM2,
    setCostoM2,
    costoActual,
    ahorroPorcentaje,
    ahorro1000,
  } = useContext(ContextoCaja);
  const animacionRef = useRef(null);

  const dimMin = 10;
  const dimMax = 300;
  const corteMax = Math.min(largo, ancho) / 2 - 0.5;
  const cortePaso = 0.1;

  const [txtLargo, setTxtLargo] = useState("");
  const [txtAncho, setTxtAncho] = useState("");
  const [txtCorte, setTxtCorte] = useState("");
  const [txtCostoM2, setTxtCostoM2] = useState("");

  useEffect(() => {
    setTxtLargo(largo.toString());
  }, [largo]);

  useEffect(() => {
    setTxtAncho(ancho.toString());
  }, [ancho]);

  useEffect(() => {
    setTxtCorte(corte.toFixed(1));
  }, [corte]);

  useEffect(() => {
    setTxtCostoM2(costoM2.toString());
  }, [costoM2]);

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

  const alCambiarCostoManual = (e) => {
    const val = e.target.value;
    setTxtCostoM2(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed >= 0) {
      setCostoM2(parsed);
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

      <div className="campo-rango" style={{ marginBottom: "20px" }}>
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

      <div className="campo-rango" style={{ marginBottom: "20px", borderTop: "1px solid var(--tinta-suave)", paddingTop: "16px" }}>
        <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
          <span>Costo del cartón por m²</span>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <input
              type="number"
              min="0"
              step="10"
              value={txtCostoM2}
              onChange={alCambiarCostoManual}
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
            <span style={{ fontSize: "12px", color: "var(--tinta-suave)" }}>CLP</span>
          </div>
        </label>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px", background: "var(--panel)", padding: "12px", borderRadius: "4px", border: "1px solid var(--tinta)", marginBottom: "16px", fontSize: "12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
          <span>Costo de cartón por caja</span>
          <span style={{ fontFamily: "var(--fuente-mono)" }}>${Math.round(costoActual).toLocaleString("es-CL")} CLP</span>
        </div>
        
        <div style={{ borderTop: "1px dashed var(--tinta-suave)", margin: "4px 0" }}></div>

        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", color: ahorroPorcentaje >= 0 ? "#2e7d32" : "#d32f2f" }}>
          <span>{ahorroPorcentaje >= 0 ? "Ahorro vs. caja estándar" : "Pérdida vs. caja estándar"}</span>
          <span>{ahorroPorcentaje.toFixed(1)}%</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", color: ahorroPorcentaje >= 0 ? "#2e7d32" : "#d32f2f", fontSize: "11px" }}>
          <span>{ahorroPorcentaje >= 0 ? "Ahorro en 1.000 unidades" : "Diferencia en 1.000 unidades"}</span>
          <span style={{ fontFamily: "var(--fuente-mono)", fontWeight: "bold" }}>
            {ahorroPorcentaje >= 0 ? "" : "-"}${Math.abs(Math.round(ahorro1000)).toLocaleString("es-CL")} CLP
          </span>
        </div>
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
