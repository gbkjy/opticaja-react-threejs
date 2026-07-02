import React, { useContext, useEffect, useRef } from "react";
import * as THREE from "three";
import { ContextoCaja } from "../contexto/ContextoCaja";

export default function PanelTapa() {
  const { 
    unidad, 
    tapaLargo, 
    tapaAncho, 
    tapaAlto, 
    tapaLaminaLargo, 
    tapaLaminaAncho, 
    tapaArea, 
    holguraTapa 
  } = useContext(ContextoCaja);

  const contenedorRef = useRef(null);
  const escenaRef = useRef(null);
  const renderizadorRef = useRef(null);
  const camaraRef = useRef(null);
  const grupoRef = useRef(null);

  const carasMallasRef = useRef([]);
  const carasBordesRef = useRef([]);

  const arrastrandoRef = useRef(false);
  const ultimoXRef = useRef(0);
  const ultimoYRef = useRef(0);
  const rotacionYRef = useRef(0.6);
  const rotacionXRef = useRef(-0.7);

  const esMetros = unidad === "m";
  const dec = esMetros ? 3 : 1;
  const decArea = esMetros ? 4 : 1;
  const unidadArea = esMetros ? "m²" : "cm²";
  const escalaVisual = esMetros ? 100 : 1;

  useEffect(() => {
    const contenedor = contenedorRef.current;
    if (!contenedor) return;

    const escena = new THREE.Scene();
    escenaRef.current = escena;

    const camara = new THREE.PerspectiveCamera(38, contenedor.clientWidth / contenedor.clientHeight, 0.1, 1000);
    camara.position.set(0, 30, 75);
    camara.lookAt(0, 10, 0);
    camaraRef.current = camara;

    const renderizador = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderizador.setSize(contenedor.clientWidth, contenedor.clientHeight);
    renderizador.setPixelRatio(window.devicePixelRatio || 1);
    contenedor.appendChild(renderizador.domElement);
    renderizadorRef.current = renderizador;

    const luzAmbiental = new THREE.AmbientLight(0xffffff, 0.85);
    escena.add(luzAmbiental);

    const luzDireccional = new THREE.DirectionalLight(0xffffff, 0.55);
    luzDireccional.position.set(40, 80, 40);
    escena.add(luzDireccional);

    const grupo = new THREE.Group();
    escena.add(grupo);
    grupoRef.current = grupo;

    const materialTapa = new THREE.MeshStandardMaterial({ 
      color: 0xD2B48C, 
      roughness: 0.85, 
      metalness: 0.05,
      side: THREE.DoubleSide
    });
    
    const geometriaMolde = new THREE.BoxGeometry(1, 1, 1);
    const geometriaBordesMolde = new THREE.EdgesGeometry(geometriaMolde);
    const materialBordes = new THREE.LineBasicMaterial({ color: 0x12233F });

    // Forma trapezoidal unitaria para las aletas (corte diagonal del 40% arriba)
    const formaTrapecio = new THREE.Shape();
    formaTrapecio.moveTo(0, 0);
    formaTrapecio.lineTo(1, 0);
    formaTrapecio.lineTo(0.6, 1);
    formaTrapecio.lineTo(0, 1);
    formaTrapecio.closePath();

    const opcionesExtrusion = {
      depth: 1,
      bevelEnabled: false
    };
    const geometriaTrapecio = new THREE.ExtrudeGeometry(formaTrapecio, opcionesExtrusion);
    geometriaTrapecio.translate(0, 0, -0.5); // Centrar en Z para alinear con BoxGeometry
    const geometriaBordesTrapecio = new THREE.EdgesGeometry(geometriaTrapecio);

    const mallas = [];
    const bordes = [];

    // 5 caras de la tapa + 4 aletas de pegado interiores = 9 mallas
    for (let i = 0; i < 9; i++) {
      const geo = i < 5 ? geometriaMolde : geometriaTrapecio;
      const geoBordes = i < 5 ? geometriaBordesMolde : geometriaBordesTrapecio;
      const malla = new THREE.Mesh(geo, materialTapa);
      grupo.add(malla);
      mallas.push(malla);

      const borde = new THREE.LineSegments(geoBordes, materialBordes);
      grupo.add(borde);
      bordes.push(borde);
    }

    carasMallasRef.current = mallas;
    carasBordesRef.current = bordes;

    let idAnimacion;
    const renderizar = () => {
      idAnimacion = requestAnimationFrame(renderizar);
      if (grupo && !arrastrandoRef.current) {
        rotacionYRef.current += 0.005;
      }
      if (grupo) {
        grupo.rotation.y = rotacionYRef.current;
        grupo.rotation.x = rotacionXRef.current;
      }
      camara.lookAt(0, 10, 0);
      renderizador.render(escena, camara);
    };
    renderizar();

    const alBajarMouse = (e) => {
      arrastrandoRef.current = true;
      ultimoXRef.current = e.clientX;
      ultimoYRef.current = e.clientY;
    };

    const alSubirMouse = () => {
      arrastrandoRef.current = false;
    };

    const alMoverMouse = (e) => {
      if (!arrastrandoRef.current) return;
      const difX = e.clientX - ultimoXRef.current;
      const difY = e.clientY - ultimoYRef.current;
      rotacionYRef.current += difX * 0.01;
      rotacionXRef.current = Math.max(-1.3, Math.min(0.2, rotacionXRef.current + difY * 0.01));
      ultimoXRef.current = e.clientX;
      ultimoYRef.current = e.clientY;
    };

    contenedor.addEventListener("mousedown", alBajarMouse);
    window.addEventListener("mouseup", alSubirMouse);
    window.addEventListener("mousemove", alMoverMouse);

    const observador = new ResizeObserver(() => {
      if (!contenedor || !camara || !renderizador) return;
      camara.aspect = contenedor.clientWidth / contenedor.clientHeight;
      camara.updateProjectionMatrix();
      renderizador.setSize(contenedor.clientWidth, contenedor.clientHeight);
    });
    observador.observe(contenedor);

    return () => {
      cancelAnimationFrame(idAnimacion);
      contenedor.removeEventListener("mousedown", alBajarMouse);
      window.removeEventListener("mouseup", alSubirMouse);
      window.removeEventListener("mousemove", alMoverMouse);
      observador.disconnect();
      if (renderizador.domElement && contenedor.contains(renderizador.domElement)) {
        contenedor.removeChild(renderizador.domElement);
      }
      geometriaMolde.dispose();
      materialTapa.dispose();
      geometriaBordesMolde.dispose();
      materialBordes.dispose();
      geometriaTrapecio.dispose();
      geometriaBordesTrapecio.dispose();
    };
  }, []);

  useEffect(() => {
    if (carasMallasRef.current.length < 9 || carasBordesRef.current.length < 9) return;

    const largoEscalado = Math.max(tapaLargo * escalaVisual, 0.001);
    const anchoEscalado = Math.max(tapaAncho * escalaVisual, 0.001);
    const altoEscalado = Math.max(tapaAlto * escalaVisual, 0.001);
    const t = 0.8;

    const mallas = carasMallasRef.current;
    const bordes = carasBordesRef.current;

    const actualizarMallas = (indice, escala, posicion) => {
      mallas[indice].scale.set(escala.x, escala.y, escala.z);
      mallas[indice].position.set(posicion.x, posicion.y, posicion.z);

      bordes[indice].scale.set(escala.x, escala.y, escala.z);
      bordes[indice].position.set(posicion.x, posicion.y, posicion.z);
    };

    // La tapa flotando boca abajo en y=0 para optimizar el zoom del canvas
    actualizarMallas(0, { x: largoEscalado, y: t, z: anchoEscalado }, { x: 0, y: altoEscalado + t / 2, z: 0 });
    actualizarMallas(1, { x: largoEscalado, y: altoEscalado, z: t }, { x: 0, y: altoEscalado / 2, z: anchoEscalado / 2 - t / 2 });
    actualizarMallas(2, { x: largoEscalado, y: altoEscalado, z: t }, { x: 0, y: altoEscalado / 2, z: -anchoEscalado / 2 + t / 2 });
    actualizarMallas(3, { x: t, y: altoEscalado, z: anchoEscalado - 2 * t }, { x: -largoEscalado / 2 + t / 2, y: altoEscalado / 2, z: 0 });
    actualizarMallas(4, { x: t, y: altoEscalado, z: anchoEscalado - 2 * t }, { x: largoEscalado / 2 - t / 2, y: altoEscalado / 2, z: 0 });

    // Aletas de pegado de la tapa (mallas 5 a 8) dobladas en las esquinas interiores usando trapecios.
    // La geometría del trapecio tiene su origen en (0,0), facilitando el nacimiento directo desde la arista de doblado sin doble arista en X.
    const aletaLargo = Math.max(altoEscalado, 0.1);
    const offset = 0.05;
    const aletaY = t + offset;
    const aletaAltoEscalada = altoEscalado - offset * 2;

    actualizarMallas(5, { x: aletaLargo, y: aletaAltoEscalada, z: t }, { x: -largoEscalado / 2 + t, y: aletaY, z: anchoEscalado / 2 - t - offset });
    actualizarMallas(6, { x: -aletaLargo, y: aletaAltoEscalada, z: t }, { x: largoEscalado / 2 - t, y: aletaY, z: anchoEscalado / 2 - t - offset });
    actualizarMallas(7, { x: aletaLargo, y: aletaAltoEscalada, z: t }, { x: -largoEscalado / 2 + t, y: aletaY, z: -anchoEscalado / 2 + t + offset });
    actualizarMallas(8, { x: -aletaLargo, y: aletaAltoEscalada, z: t }, { x: largoEscalado / 2 - t, y: aletaY, z: -anchoEscalado / 2 + t + offset });

    if (camaraRef.current) {
      const dimensionMayor = Math.max(tapaLargo, tapaAncho);
      const factor = Math.max(1, dimensionMayor / 95);
      camaraRef.current.position.set(0, 30 * factor, 75 * factor);
    }

  }, [tapaLargo, tapaAncho, tapaAlto, esMetros, holguraTapa, escalaVisual]);

  return (
    <div className="panel-tapa" style={{ marginTop: "20px" }}>
      <h2>Tapa telescópica complementaria</h2>
      <p style={{ fontSize: "12px", color: "var(--tinta-suave)", marginBottom: "10px" }}>
        Especificaciones técnicas para cortar y fabricar la tapa superior compatible con la base optimizada.
      </p>

      <div 
        ref={contenedorRef} 
        style={{ 
          width: "100%", 
          height: "110px", 
          marginBottom: "12px", 
          background: "rgba(18, 35, 63, 0.02)", 
          borderRadius: "4px",
          border: "1px solid rgba(18, 35, 63, 0.08)",
          cursor: "grab"
        }} 
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontFamily: "var(--fuente-mono)", fontSize: "12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(18, 35, 63, 0.1)", paddingBottom: "6px" }}>
          <span>Holgura aplicada:</span>
          <b>{holguraTapa.toFixed(dec)} {unidad} (4 mm)</b>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(18, 35, 63, 0.1)", paddingBottom: "6px" }}>
          <span>Base de la tapa:</span>
          <b>{tapaLargo.toFixed(dec)} × {tapaAncho.toFixed(dec)} {unidad}</b>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(18, 35, 63, 0.1)", paddingBottom: "6px" }}>
          <span>Altura de la tapa:</span>
          <b>{tapaAlto.toFixed(dec)} {unidad}</b>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(18, 35, 63, 0.1)", paddingBottom: "6px" }}>
          <span>Lámina requerida (A_t × B_t):</span>
          <b style={{ color: "var(--acento)" }}>{tapaLaminaLargo.toFixed(dec)} × {tapaLaminaAncho.toFixed(dec)} {unidad}</b>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "2px" }}>
          <span>Superficie de cartón:</span>
          <b>{tapaArea.toFixed(decArea)} {unidadArea}</b>
        </div>
      </div>

      <div style={{ 
        marginTop: "14px", 
        padding: "10px", 
        background: "rgba(18, 35, 63, 0.05)", 
        borderRadius: "4px", 
        borderLeft: "3px solid var(--tinta)",
        fontSize: "11px",
        color: "var(--tinta)"
      }}>
        💡 <b>Nota de manufactura:</b> Se ha configurado una holgura estándar para asegurar el deslizamiento telescópico de la tapa por sobre la base sin atascarse.
      </div>
    </div>
  );
}
