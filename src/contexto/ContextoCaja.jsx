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
  const [unidad, setUnidad] = useState("cm");

  const valores = useMemo(() => {
    const corteValido = limitarCorte(corte, largo, ancho);
    const baseLargo = largo - 2 * corteValido;
    const baseAncho = ancho - 2 * corteValido;
    const volumen = obtenerVolumen(corteValido, largo, ancho);
    const corteOptimo = obtenerCorteOptimo(largo, ancho);
    const volumenMaximo = obtenerVolumenMaximo(largo, ancho);
    const tolerancia = unidad === "m" ? 0.015 : 0.15;
    const esOptimo = Math.abs(corteValido - corteOptimo) < tolerancia;

    const holguraTapa = unidad === "m" ? 0.004 : 0.4;
    const tapaLargo = baseLargo + holguraTapa;
    const tapaAncho = baseAncho + holguraTapa;
    const tapaAlto = corteOptimo / 2;
    const tapaLaminaLargo = tapaLargo + 2 * tapaAlto;
    const tapaLaminaAncho = tapaAncho + 2 * tapaAlto;
    const tapaArea = tapaLaminaLargo * tapaLaminaAncho;

    return {
      largo,
      setLargo,
      ancho,
      setAncho,
      corte: corteValido,
      setCorte,
      unidad,
      setUnidad,
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
    };
  }, [largo, ancho, corte, unidad]);

  return (
    <ContextoCaja.Provider value={valores}>
      {children}
    </ContextoCaja.Provider>
  );
}
