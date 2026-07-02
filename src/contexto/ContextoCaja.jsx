import React, { createContext, useState, useMemo } from "react";
import {
  obtenerVolumen,
  obtenerCorteOptimo,
  obtenerVolumenMaximo,
  limitarCorte,
} from "../matematica/modeloCaja";

export const ContextoCaja = createContext();

export function ProveedorCaja({ children }) {
  const [largo, setLargo] = useState(120);
  const [ancho, setAncho] = useState(80);
  const [corte, setCorte] = useState(15);
  const [costoM2, setCostoM2] = useState(1000);
  const unidad = "cm";

  const valores = useMemo(() => {
    const corteValido = limitarCorte(corte, largo, ancho);
    const baseLargo = largo - 2 * corteValido;
    const baseAncho = ancho - 2 * corteValido;
    const volumen = obtenerVolumen(corteValido, largo, ancho);
    const corteOptimo = obtenerCorteOptimo(largo, ancho);
    const volumenMaximo = obtenerVolumenMaximo(largo, ancho);
    const tolerancia = 0.15;
    const esOptimo = Math.abs(corteValido - corteOptimo) < tolerancia;

    const holguraTapa = 0.4;
    const tapaLargo = baseLargo + holguraTapa;
    const tapaAncho = baseAncho + holguraTapa;
    const tapaAlto = Math.min(corteOptimo / 2, 5.0);
    const tapaLaminaLargo = tapaLargo + 2 * tapaAlto;
    const tapaLaminaAncho = tapaAncho + 2 * tapaAlto;
    const tapaArea = tapaLaminaLargo * tapaLaminaAncho;

    const areaM2 = (largo * ancho) / 10000;
    const costoActual = areaM2 * costoM2;

    const xEstandar = limitarCorte(Math.min(largo, ancho) * 0.1, largo, ancho);
    const volumenEstandar = obtenerVolumen(xEstandar, largo, ancho);
    
    const ratio = volumen / (volumenEstandar || 1);
    const ahorroPorcentaje = ratio > 1 ? (1 - 1 / ratio) * 100 : (ratio - 1) * 100;
    const ahorro1000 = 1000 * areaM2 * (ratio - 1) * costoM2;

    return {
      largo,
      setLargo,
      ancho,
      setAncho,
      corte: corteValido,
      setCorte,
      unidad,
      baseLargo,
      baseAncho,
      volumen,
      corteOptimo,
      volumenMaximo,
      esOptimo,
      holguraTapa,
      tapaLargo,
      tapaAncho,
      tapaAlto,
      tapaLaminaLargo,
      tapaLaminaAncho,
      tapaArea,
      costoM2,
      setCostoM2,
      costoActual,
      ahorroPorcentaje,
      ahorro1000,
    };
  }, [largo, ancho, corte, costoM2]);

  return (
    <ContextoCaja.Provider value={valores}>
      {children}
    </ContextoCaja.Provider>
  );
}
