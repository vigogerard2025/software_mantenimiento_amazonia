"use client";

import { useState } from "react";
import { MaintenanceRecord } from "@/app/db/schema";
import { Button } from "./ui/button";
import { Wrench, Calendar, MapPin, Gauge, User } from "lucide-react";

interface MaintenanceCardProps {
  maintenance: MaintenanceRecord;
  onEdit: (maintenance: MaintenanceRecord) => void;
  onDelete: (id: number) => void;
}

export function MaintenanceCard({
  maintenance,
  onEdit,
  onDelete,
}: MaintenanceCardProps) {
  const [showDesc, setShowDesc] = useState(false); // ✅ AQUÍ sí es correcto

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 border hover:scale-[1.02] flex flex-col justify-between h-full">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-green-100 p-3 rounded-full">
          <Wrench className="text-green-600" size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            {maintenance.tipo}
          </h3>
          <p className="text-sm text-gray-500">
            Placa: {maintenance.vehiclePlaca}
          </p>
        </div>
      </div>

      {/* INFO */}
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Calendar size={16} />
          <span>{maintenance.fecha}</span>
        </div>

        <div className="flex items-center gap-2">
          <MapPin size={16} />
          <span>{maintenance.ubicacion}</span>
        </div>

        <div className="flex items-center gap-2">
          <Gauge size={16} />
          <span>{maintenance.km.toLocaleString()} km</span>
        </div>

        <div className="flex items-center gap-2">
          <User size={16} />
          <span>{maintenance.mecanico}</span>
        </div>

        {/* 🔥 DESCRIPCIÓN TOGGLE */}
        {maintenance.descripcion && (
          <div className="mt-2">
            <button
              onClick={() => setShowDesc(!showDesc)}
              className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md hover:bg-blue-200"
            >
              {showDesc ? "Ocultar descripción" : "Ver descripción"}
            </button>

            {showDesc && (
              <div className="bg-gray-100 p-2 rounded-md text-xs text-gray-600 mt-2 whitespace-pre-line break-words">
                {maintenance.descripcion}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ACTIONS */}
      <div className="mt-5 flex gap-2 justify-end">
        <Button variant="secondary" onClick={() => onEdit(maintenance)}>
          Editar
        </Button>

        <Button variant="danger" onClick={() => onDelete(maintenance.id)}>
          Eliminar
        </Button>
      </div>
    </div>
  );
}
