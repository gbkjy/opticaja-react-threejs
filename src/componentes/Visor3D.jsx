import React, { useContext, useEffect, useRef } from "react";
import * as THREE from "three";
import { ContextoCaja } from "../contexto/ContextoCaja";

export default function Visor3D() {
  const { largo, ancho, corte, baseLargo, baseAncho, volumen, unidad } = useContext(ContextoCaja);
  const contenedorRef = useRef(null);
  const escenaRef = useRef(null);
  const renderizadorRef = useRef(null);
  const camaraRef = useRef(null);
  const grupoRef = useRef(null);

  const carasMallasRef = useRef([]);
  const carasBordesRef = useRef([]);
  const cuadriculaRef = useRef(null);

  const arrastrandoRef = useRef(false);
  const ultimoXRef = useRef(0);
  const ultimoYRef = useRef(0);
  const rotacionYRef = useRef(0.6);
  const rotacionXRef = useRef(-0.35);

  const esMetros = unidad === "m";
  const escalaVisual = esMetros ? 100 : 1;
  const decimales = esMetros ? 3 : 2;
  const unidadVolumen = esMetros ? "m³" : "cm³";

  useEffect(() => {
    const contenedor = contenedorRef.current;
    if (!contenedor) return;

    const escena = new THREE.Scene();
    escenaRef.current = escena;

    const camara = new THREE.PerspectiveCamera(40, contenedor.clientWidth / contenedor.clientHeight, 0.1, 2000);
    camara.position.set(0, 100, 180);
    camara.lookAt(0, 20, 0);
    camaraRef.current = camara;

    const renderizador = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderizador.setSize(contenedor.clientWidth, contenedor.clientHeight);
    renderizador.setPixelRatio(window.devicePixelRatio || 1);
    contenedor.appendChild(renderizador.domElement);
    renderizadorRef.current = renderizador;

    const luzAmbiental = new THREE.AmbientLight(0xffffff, 0.75);
    escena.add(luzAmbiental);

    const luzDireccional = new THREE.DirectionalLight(0xffffff, 0.6);
    luzDireccional.position.set(80, 120, 60);
    escena.add(luzDireccional);

    const cuadricula = new THREE.GridHelper(220, 22, 0x8F5C2B, 0xCBB68C);
    cuadricula.position.y = -0.05;
    cuadricula.material.depthWrite = false;
    escena.add(cuadricula);
    cuadriculaRef.current = cuadricula;

    const grupo = new THREE.Group();
    escena.add(grupo);
    grupoRef.current = grupo;

    const materialCaja = new THREE.MeshStandardMaterial({ 
      color: 0xD2B48C, 
      roughness: 0.85, 
      metalness: 0.05,
      side: THREE.DoubleSide
    });
    
    const geometriaMolde = new THREE.BoxGeometry(1, 1, 1);
    const geometriaBordesMolde = new THREE.EdgesGeometry(geometriaMolde);
    const materialBordes = new THREE.LineBasicMaterial({ color: 0x12233F });

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
    geometriaTrapecio.translate(0, 0, -0.5);
    const geometriaBordesTrapecio = new THREE.EdgesGeometry(geometriaTrapecio);

    const mallas = [];
    const bordes = [];

    for (let i = 0; i < 9; i++) {
      const geo = i < 5 ? geometriaMolde : geometriaTrapecio;
      const geoBordes = i < 5 ? geometriaBordesMolde : geometriaBordesTrapecio;
      const malla = new THREE.Mesh(geo, materialCaja);
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
      if (grupo) {
        grupo.rotation.y = rotacionYRef.current;
        grupo.rotation.x = rotacionXRef.current * 0.3;
      }
      camara.lookAt(0, 20, 0);
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
      rotacionXRef.current = Math.max(-1.4, Math.min(0.1, rotacionXRef.current + difY * 0.01));
      ultimoXRef.current = e.clientX;
      ultimoYRef.current = e.clientY;
    };

    const alIniciarTouch = (e) => {
      if (e.touches.length !== 1) return;
      arrastrandoRef.current = true;
      ultimoXRef.current = e.touches[0].clientX;
      ultimoYRef.current = e.touches[0].clientY;
    };

    const alMoverTouch = (e) => {
      if (!arrastrandoRef.current || e.touches.length !== 1) return;
      const difX = e.touches[0].clientX - ultimoXRef.current;
      const difY = e.touches[0].clientY - ultimoYRef.current;
      rotacionYRef.current += difX * 0.01;
      rotacionXRef.current = Math.max(-1.4, Math.min(0.1, rotacionXRef.current + difY * 0.01));
      ultimoXRef.current = e.touches[0].clientX;
      ultimoYRef.current = e.touches[0].clientY;
    };

    contenedor.addEventListener("mousedown", alBajarMouse);
    window.addEventListener("mouseup", alSubirMouse);
    window.addEventListener("mousemove", alMoverMouse);
    contenedor.addEventListener("touchstart", alIniciarTouch);
    window.addEventListener("touchend", alSubirMouse);
    window.addEventListener("touchmove", alMoverTouch);

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
      contenedor.removeEventListener("touchstart", alIniciarTouch);
      window.removeEventListener("touchend", alSubirMouse);
      window.removeEventListener("touchmove", alMoverTouch);
      observador.disconnect();
      if (renderizador.domElement && contenedor.contains(renderizador.domElement)) {
        contenedor.removeChild(renderizador.domElement);
      }
      geometriaMolde.dispose();
      materialCaja.dispose();
      geometriaBordesMolde.dispose();
      materialBordes.dispose();
      geometriaTrapecio.dispose();
      geometriaBordesTrapecio.dispose();
    };
  }, []);

  useEffect(() => {
    if (carasMallasRef.current.length < 9 || carasBordesRef.current.length < 9) return;

    const largoEscalado = Math.max(baseLargo * escalaVisual, 0.001);
    const anchoEscalado = Math.max(baseAncho * escalaVisual, 0.001);
    const altoEscalado = Math.max(corte * escalaVisual, 0.001);
    const t = 0.8;

    const mallas = carasMallasRef.current;
    const bordes = carasBordesRef.current;

    const actualizarMallas = (indice, escala, posicion) => {
      mallas[indice].scale.set(escala.x, escala.y, escala.z);
      mallas[indice].position.set(posicion.x, posicion.y, posicion.z);

      bordes[indice].scale.set(escala.x, escala.y, escala.z);
      bordes[indice].position.set(posicion.x, posicion.y, posicion.z);
    };

    actualizarMallas(0, { x: largoEscalado, y: t, z: anchoEscalado }, { x: 0, y: t / 2, z: 0 });
    actualizarMallas(1, { x: largoEscalado, y: altoEscalado, z: t }, { x: 0, y: altoEscalado / 2 + t / 2, z: anchoEscalado / 2 - t / 2 });
    actualizarMallas(2, { x: largoEscalado, y: altoEscalado, z: t }, { x: 0, y: altoEscalado / 2 + t / 2, z: -anchoEscalado / 2 + t / 2 });
    actualizarMallas(3, { x: t, y: altoEscalado, z: anchoEscalado - 2 * t }, { x: -largoEscalado / 2 + t / 2, y: altoEscalado / 2 + t / 2, z: 0 });
    actualizarMallas(4, { x: t, y: altoEscalado, z: anchoEscalado - 2 * t }, { x: largoEscalado / 2 - t / 2, y: altoEscalado / 2 + t / 2, z: 0 });

    // Aletas de pegado de la base principal (mallas 5 a 8) dobladas en las esquinas interiores
    const aletaLargo = Math.max(altoEscalado, 0.1);
    const offset = 0.05;
    const aletaY = t + offset;
    const aletaAltoEscalada = altoEscalado - offset * 2;

    actualizarMallas(5, { x: aletaLargo, y: aletaAltoEscalada, z: t }, { x: -largoEscalado / 2 + t, y: aletaY, z: anchoEscalado / 2 - t - offset });
    actualizarMallas(6, { x: -aletaLargo, y: aletaAltoEscalada, z: t }, { x: largoEscalado / 2 - t, y: aletaY, z: anchoEscalado / 2 - t - offset });
    actualizarMallas(7, { x: aletaLargo, y: aletaAltoEscalada, z: t }, { x: -largoEscalado / 2 + t, y: aletaY, z: -anchoEscalado / 2 + t + offset });
    actualizarMallas(8, { x: -aletaLargo, y: aletaAltoEscalada, z: t }, { x: largoEscalado / 2 - t, y: aletaY, z: -anchoEscalado / 2 + t + offset });

    if (camaraRef.current) {
      const dimensionMayor = Math.max(largo, ancho);
      const factor = Math.max(1, dimensionMayor / 120);
      camaraRef.current.position.set(0, 100 * factor, 180 * factor);

      if (cuadriculaRef.current) {
        cuadriculaRef.current.scale.set(factor, 1, factor);
      }
    }

  }, [baseLargo, baseAncho, corte, escalaVisual, largo, ancho]);

  return (
    <div className="contenedor-visor-3d">
      <div ref={contenedorRef} className="lienzo-3d" />
      <div className="informacion-dimensiones">
        base: <b>{baseLargo.toFixed(decimales)} × {baseAncho.toFixed(decimales)}</b> {unidad}
        <br />
        alto: <b>{corte.toFixed(decimales)}</b> {unidad}
        <br />
        volumen: <b>{volumen.toFixed(esMetros ? 4 : 2)}</b> {unidadVolumen}
      </div>
      <div className="leyenda-interaccion">arrastra para rotar</div>
    </div>
  );
}
