"use client";

import { useState } from "react";
import { Vehicle } from "@/app/db/schema";
import { Button } from "./ui/button";
import { Car, User, Hash, FileText, ExternalLink } from "lucide-react";
import Image from "next/image";
import { PdfModal } from "./PdfModal";

interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: number) => void;
}

const getVehicleImage = (marca: string, modelo: string) => {
  const m = marca?.toLowerCase() || "";
  const mod = modelo?.toLowerCase() || "";
  if (m.includes("hyundai")) return "/cars/ex8.png";
  if (mod.includes("sd400")) return "/cars/sd400.jpg";
  if (/sd40[1-7]/.test(mod)) return "/cars/sd401.jpg";
  if (m.includes("jac")) return "/cars/sd401.jpg";
  return "/cars/ex8.png";
};

export function VehicleCard({ vehicle, onEdit, onDelete }: VehicleCardProps) {
  const [showPdf, setShowPdf] = useState(false);

  // Extrae nombre de archivo desde la URL
  const pdfFilename = vehicle.leasingUrl
    ? vehicle.leasingUrl.split("/").pop() || "contrato-leasing.pdf"
    : "contrato-leasing.pdf";

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 flex flex-col justify-between border hover:scale-[1.02]">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-4">
          <Image
            src={getVehicleImage(vehicle.marca, vehicle.modelo)}
            alt="Vehículo"
            width={50}
            height={30}
          />
          <div>
            <h3 className="text-lg font-bold text-gray-800">{vehicle.placa}</h3>
            <p className="text-sm text-gray-500">
              {vehicle.marca} {vehicle.modelo}
            </p>
          </div>
        </div>

        {/* INFO */}
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Hash size={16} />
            <span>Padrón: {vehicle.padron}</span>
          </div>
          <div className="flex items-center gap-2">
            <User size={16} />
            <span>Conductor: {vehicle.conductor}</span>
          </div>

          {/* Leasing URL — botones Ver / Descargar */}
          {vehicle.leasingUrl && (
            <div className="pt-2 border-t border-gray-100 mt-2">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
                Documentación Vehicular
              </p>
              <div className="flex items-center gap-2">
                {/* Ver PDF en modal */}
                <button
                  onClick={() => setShowPdf(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200"
                >
                  <FileText size={13} />
                  Ver PDF
                </button>

                {/* Descargar directo */}
                <a
                  href={vehicle.leasingUrl}
                  download={pdfFilename}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                >
                  <ExternalLink size={13} />
                  Descargar
                </a>
              </div>
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="mt-5 flex gap-2 justify-end">
          <Button variant="secondary" onClick={() => onEdit(vehicle)}>
            Editar
          </Button>
          <Button variant="danger" onClick={() => onDelete(vehicle.id)}>
            Eliminar
          </Button>
        </div>
      </div>

      {/* MODAL PDF */}
      {showPdf && vehicle.leasingUrl && (
        <PdfModal
          url={vehicle.leasingUrl}
          filename={pdfFilename}
          onClose={() => setShowPdf(false)}
        />
      )}
    </>
  );
}
