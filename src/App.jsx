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
              <div className="ocultar-movil">
                <ExportarInforme />
              </div>
            </div>

            <div className="columna-centro">
              <div style={{ position: "relative" }}>
                <Visor3D />
              </div>
              <div className="ocultar-movil">
                <PanelProcedimiento />
              </div>
            </div>

            <div className="columna-derecha">
              <div className="seccion-patron-plano">
                <PatronPlano />
              </div>
              <PanelTapa />
              <div className="mostrar-movil">
                <PanelProcedimiento />
                <ExportarInforme />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProveedorCaja>
  );
}

export default App;
