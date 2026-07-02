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
              <LecturaFormula />
              <ExportarInforme />
              <PanelTapa />
            </div>

            <div className="columna-centro">
              <Visor3D />
              <PanelProcedimiento />
            </div>

            <div className="columna-derecha">
              <PatronPlano />
              <GraficoVolumen />
            </div>
          </div>
        </div>
      </div>
    </ProveedorCaja>
  );
}

export default App;
