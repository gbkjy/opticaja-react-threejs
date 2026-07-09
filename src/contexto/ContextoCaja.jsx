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
    const largoSano = Math.max(Number(largo) || 0, 1);
    const anchoSano = Math.max(Number(ancho) || 0, 1);
    const corteSano = Math.max(Number(corte) || 0, 0);

    const corteValido = limitarCorte(corteSano, largoSano, anchoSano);
    const baseLargo = Math.max(largoSano - 2 * corteValido, 0.1);
    const baseAncho = Math.max(anchoSano - 2 * corteValido, 0.1);
    const volumen = obtenerVolumen(corteValido, largoSano, anchoSano);
    const corteOptimo = obtenerCorteOptimo(largoSano, anchoSano);
    const volumenMaximo = obtenerVolumenMaximo(largoSano, anchoSano);
    const tolerancia = 0.15;
    const esOptimo = Math.abs(corteValido - corteOptimo) < tolerancia;

    const holguraTapa = 0.4;
    const tapaLargo = baseLargo + holguraTapa;
    const tapaAncho = baseAncho + holguraTapa;
    const tapaAlto = Math.max(Math.min(corteOptimo / 2, 5.0), 0.1);
    const tapaLaminaLargo = tapaLargo + 2 * tapaAlto;
    const tapaLaminaAncho = tapaAncho + 2 * tapaAlto;
    const tapaArea = tapaLaminaLargo * tapaLaminaAncho;

    const areaM2 = (largoSano * anchoSano) / 10000;
    const costoActual = areaM2 * costoM2;

    const xEstandar = limitarCorte(Math.min(largoSano, anchoSano) * 0.1, largoSano, anchoSano);
    const volumenEstandar = obtenerVolumen(xEstandar, largoSano, anchoSano);
    
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
