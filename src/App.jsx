import React from "react";
import Cabecera from "./componentes/Cabecera";
import Controles from "./componentes/Controles";
import LecturaFormula from "./componentes/LecturaFormula";
import Visor3D from "./componentes/Visor3D";
import PatronPlano from "./componentes/PatronPlano";
import GraficoVolumen from "./componentes/GraficoVolumen";
import PanelProcedimiento from "./componentes/PanelProcedimiento";
import ExportarInforme from "./componentes/ExportarInforme";
import PanelTapa from "./componentes/PanelTapa";
import { ProveedorCaja } from "./contexto/ContextoCaja";
import "./App.css";

function App() {
  return (
    <ProveedorCaja>
      <div className="aplicacion">
        <div className="bloque-principal">
          <Cabecera />
          
          <div className="cuadricula-principal">
            <div className="columna-izquierda">
              <Controles />
              <ExportarInforme />
            </div>

            <div className="columna-centro">
              <div style={{ position: "relative" }}>
                <Visor3D />
                <div style={{
                  position: "absolute",
                  top: "12px",
                  left: "12px",
                  zIndex: 10,
                  width: "190px",
                  background: "rgba(247, 245, 240, 0.94)",
                  border: "1px solid var(--tinta)",
                  borderRadius: "4px",
                  padding: "4px",
                  boxShadow: "0 2px 8px rgba(18, 35, 63, 0.06)",
                  pointerEvents: "none"
                }}>
                  <div style={{ fontSize: "9px", fontFamily: "var(--fuente-mono)", textAlign: "center", marginBottom: "2px", borderBottom: "1px solid rgba(18, 35, 63, 0.08)", paddingBottom: "2px" }}>
                    V(x) en el dominio
                  </div>
                  <GraficoVolumen compacto={true} />
                </div>

                <div style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  zIndex: 10,
                  width: "210px",
                  background: "rgba(247, 245, 240, 0.94)",
                  border: "1px solid var(--tinta)",
                  borderRadius: "4px",
                  padding: "4px",
                  boxShadow: "0 2px 8px rgba(18, 35, 63, 0.06)",
                  pointerEvents: "none"
                }}>
                  <LecturaFormula compacto={true} />
                </div>
              </div>
              <PanelProcedimiento />
            </div>

            <div className="columna-derecha">
              <div className="seccion-patron-plano">
                <PatronPlano />
              </div>
              <PanelTapa />
            </div>
          </div>
        </div>
      </div>
    </ProveedorCaja>
  );
}

export default App;
