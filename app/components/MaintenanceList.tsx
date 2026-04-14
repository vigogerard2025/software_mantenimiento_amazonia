"use client";

import { Button } from "./ui/button";
import { Maintenance } from "../types/maintenance";

interface Props {
  data: Maintenance[];
  onEdit: (item: Maintenance) => void;
}

export function MaintenanceList({ data, onEdit }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Vehículo</th>
            <th className="p-2 text-left">Tarea</th>
            <th className="p-2 text-left">Km</th>
            <th className="p-2 text-left">Estado</th>
            <th className="p-2 text-left">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center p-4">
                No hay datos
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-2">{item.vehicle}</td>
                <td className="p-2">{item.task}</td>
                <td className="p-2">{item.kmInterval}</td>
                <td className="p-2">
                  {item.status ? "✅ Completado" : "⏳ Pendiente"}
                </td>
                <td className="p-2">
                  <Button onClick={() => onEdit(item)}> Editar</Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
