import React, { useContext } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ContextoCaja } from "../contexto/ContextoCaja";

export default function ExportarInforme() {
  const {
    largo,
    ancho,
    corte,
    baseLargo,
    baseAncho,
    volumen,
    corteOptimo,
    volumenMaximo,
    unidad,
    holguraTapa,
    tapaLargo,
    tapaAncho,
    tapaAlto,
    tapaLaminaLargo,
    tapaLaminaAncho,
    tapaArea
  } = useContext(ContextoCaja);

  const generarPDF = () => {
    const jspdfConstructor = jsPDF.jsPDF || jsPDF;
    const doc = new jspdfConstructor({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const fecha = new Date().toLocaleDateString("es-ES");
    const referencia = `OPT-${Date.now().toString().slice(-6)}`;

    const esMetros = unidad === "m";
    const dec = esMetros ? 3 : 2;
    const decVol = esMetros ? 4 : 2;
    const unidadArea = esMetros ? "m²" : "cm²";
    const unidadVolumen = esMetros ? "m³" : "cm³";
    const largoStr = esMetros ? largo.toFixed(2) : largo.toString();
    const anchoStr = esMetros ? ancho.toFixed(2) : ancho.toString();

    doc.setFillColor(18, 35, 63);
    doc.rect(0, 0, 210, 34, "F");

    doc.setTextColor(239, 231, 211);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Informe técnico de optimización", 15, 14);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Diseño y fabricación de cajas de máximo volumen", 15, 21);

    doc.setFontSize(8.5);
    doc.text(`Fecha de emisión: ${fecha}  |  Código de referencia: ${referencia}`, 15, 27);

    doc.setTextColor(18, 35, 63);
    doc.setFontSize(13);
    doc.setFont("Helvetica", "bold");
    doc.text("1. Datos de entrada y parámetros", 15, 43);

    autoTable(doc, {
      startY: 46,
      head: [["Parámetro", "Símbolo", "Valor actual", "Descripción"]],
      body: [
        ["Largo de la lámina (A)", "A", `${largoStr} ${unidad}`, "Dimensión mayor de la plancha original de material"],
        ["Ancho de la lámina (B)", "B", `${anchoStr} ${unidad}`, "Dimensión menor de la plancha original de material"],
        ["Corte en esquina", "x", `${corte.toFixed(dec)} ${unidad}`, "Longitud de los cortes en cada esquina"],
        ["Área total de materia prima", "A_t", `${(largo * ancho).toFixed(esMetros ? 4 : 0)} ${unidadArea}`, "Superficie total disponible de material rectangular"],
      ],
      theme: "plain",
      headStyles: { fillColor: [18, 35, 63], textColor: [239, 231, 211], fontStyle: "bold" },
      styles: { cellPadding: 1.6, fontSize: 9.5, font: "Helvetica", lineColor: [18, 35, 63], lineWidth: 0.1 },
    });

    const ySeccion2 = doc.lastAutoTable.finalY + 8;
    doc.setFontSize(13);
    doc.setFont("Helvetica", "bold");
    doc.text("2. Resultados del cálculo de optimización", 15, ySeccion2);

    const eficienciaOriginal = (volumen / volumenMaximo) * 100;

    autoTable(doc, {
      startY: ySeccion2 + 3,
      head: [["Dimensión", "Fórmula", "Configuración actual", "Óptimo matemático (x*)"]],
      body: [
        ["Largo base", "A - 2x", `${baseLargo.toFixed(dec)} ${unidad}`, `${(largo - 2 * corteOptimo).toFixed(dec)} ${unidad}`],
        ["Ancho base", "B - 2x", `${baseAncho.toFixed(dec)} ${unidad}`, `${(ancho - 2 * corteOptimo).toFixed(dec)} ${unidad}`],
        ["Altura de la caja", "x", `${corte.toFixed(dec)} ${unidad}`, `${corteOptimo.toFixed(dec)} ${unidad}`],
        ["Volumen resultante", "V(x)", `${volumen.toFixed(decVol)} ${unidadVolumen}`, `${volumenMaximo.toFixed(decVol)} ${unidadVolumen}`],
        ["Eficiencia de diseño", "V/V_max", `${eficienciaOriginal.toFixed(1)} %`, "100.0 %"],
      ],
      theme: "plain",
      headStyles: { fillColor: [18, 35, 63], textColor: [239, 231, 211], fontStyle: "bold" },
      styles: { cellPadding: 1.6, fontSize: 9.5, font: "Helvetica", lineColor: [18, 35, 63], lineWidth: 0.1 },
    });

    const ySeccion3 = doc.lastAutoTable.finalY + 8;
    doc.setFontSize(13);
    doc.setFont("Helvetica", "bold");
    doc.text("3. Esquema de aprovechamiento de material", 15, ySeccion3);

    const areaBase = baseLargo * baseAncho;
    const areaParedes = 2 * (baseLargo * corte) + 2 * (baseAncho * corte);
    const areaEsquinasTotal = 4 * corte * corte;
    const areaAletas = areaEsquinasTotal / 2;
    const areaDescartada = areaEsquinasTotal / 2;
    const areaTotal = largo * ancho;

    const porcentajeBase = (areaBase / areaTotal) * 100;
    const porcentajeParedes = (areaParedes / areaTotal) * 100;
    const porcentajeAletas = (areaAletas / areaTotal) * 100;
    const porcentajeDescarte = (areaDescartada / areaTotal) * 100;

    autoTable(doc, {
      startY: ySeccion3 + 3,
      head: [["Sección del cartón", `Superficie (${unidadArea})`, "Porcentaje (%)", "Función en diseño"]],
      body: [
        ["Base útil", `${areaBase.toFixed(esMetros ? 4 : 1)} ${unidadArea}`, `${porcentajeBase.toFixed(1)} %`, "Piso contenedor de la caja"],
        ["Paredes laterales", `${areaParedes.toFixed(esMetros ? 4 : 1)} ${unidadArea}`, `${porcentajeParedes.toFixed(1)} %`, "Pestañas dobladas hacia arriba"],
        ["Aletas de pegado", `${areaAletas.toFixed(esMetros ? 4 : 1)} ${unidadArea}`, `${porcentajeAletas.toFixed(1)} %`, "Solapas de doblez para unión de esquinas"],
        ["Esquinas de descarte", `${areaDescartada.toFixed(esMetros ? 4 : 1)} ${unidadArea}`, `${porcentajeDescarte.toFixed(1)} %`, "Sobrantes triangulares recortados"],
      ],
      theme: "plain",
      headStyles: { fillColor: [18, 35, 63], textColor: [239, 231, 211], fontStyle: "bold" },
      styles: { cellPadding: 1.6, fontSize: 9.5, font: "Helvetica", lineColor: [18, 35, 63], lineWidth: 0.1 },
    });

    const ySeccion4 = doc.lastAutoTable.finalY + 8;
    doc.setFontSize(13);
    doc.setFont("Helvetica", "bold");
    doc.text("4. Especificaciones de la tapa telescópica", 15, ySeccion4);

    autoTable(doc, {
      startY: ySeccion4 + 3,
      head: [["Parámetro de tapa", "Valor sugerido", "Lámina requerida", "Holgura aplicada"]],
      body: [
        [
          "Largo × Ancho interior",
          `${tapaLargo.toFixed(dec)} × ${tapaAncho.toFixed(dec)} ${unidad}`,
          `${tapaLaminaLargo.toFixed(dec)} × ${tapaLaminaAncho.toFixed(dec)} ${unidad}`,
          `${holguraTapa.toFixed(dec)} ${unidad} (4 mm)`
        ],
        [
          "Altura de la tapa (H_t)",
          `${tapaAlto.toFixed(dec)} ${unidad}`,
          `Área total: ${tapaArea.toFixed(esMetros ? 4 : 1)} ${unidadArea}`,
          "Ajuste holgado"
        ]
      ],
      theme: "plain",
      headStyles: { fillColor: [18, 35, 63], textColor: [239, 231, 211], fontStyle: "bold" },
      styles: { cellPadding: 1.6, fontSize: 9.5, font: "Helvetica", lineColor: [18, 35, 63], lineWidth: 0.1 },
    });

    const ySeccion5 = doc.lastAutoTable.finalY + 8;
    doc.setFontSize(13);
    doc.setFont("Helvetica", "bold");
    doc.text("5. Resumen de validación matemática", 15, ySeccion5);

    try {
      doc.addImage("/iconos/opticaja_logo.png", "PNG", 15, ySeccion5 + 3, 13, 13, undefined, "FAST");
    } catch (e) { }

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8.2);
    doc.text(
      "Se valida que los cálculos anteriores han sido procesados mediante cálculo analítico\nde derivadas. El punto óptimo crítico V'(x) = 0 ha sido verificado como máximo\nabsoluto local por el criterio de la segunda derivada.",
      32,
      ySeccion5 + 7
    );

    try {
      doc.addImage("/iconos/firma.png", "PNG", 165, ySeccion5 + 2, 22, 18);
    } catch (e) { }

    doc.setDrawColor(18, 35, 63);
    doc.line(15, ySeccion5 + 22, 195, ySeccion5 + 22);

    doc.setFontSize(7.5);
    doc.text("Generado por OptiCaja • Prototipo de cálculo de ingeniería y optimización en tiempo real", 15, ySeccion5 + 26);

    doc.save(`informe-tecnico-${referencia}.pdf`);
  };

  return (
    <div className="panel-exportar">
      <h2>Exportación de Documento</h2>
      <p>Genera un informe técnico formal e industrial en formato PDF para los parámetros configurados actualmente.</p>
      <button className="boton-exportar" onClick={generarPDF}>
        Exportar informe técnico (PDF)
      </button>
    </div>
  );
}
