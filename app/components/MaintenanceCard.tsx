import { MaintenanceRecord } from "@/app/db/schema";
import { Button } from "./ui/button";
import { deleteMaintenance } from "@/app/actions/maintenances";

interface MaintenanceCardProps {
  maintenance: MaintenanceRecord;
  onEdit: (maintenance: MaintenanceRecord) => void;
}

export function MaintenanceCard({ maintenance, onEdit }: MaintenanceCardProps) {
  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">
            Placa: {maintenance.vehiclePlaca}
          </p>
          <p className="font-semibold">
            {maintenance.fecha} - {maintenance.tipo}
          </p>
          <p className="text-sm">Ubicación: {maintenance.ubicacion}</p>
          <p className="text-sm">KM: {maintenance.km.toLocaleString()}</p>
          {maintenance.descripcion && (
            <p className="text-sm text-gray-600 mt-1">
              {maintenance.descripcion}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => onEdit(maintenance)}>
            Editar
          </Button>
          <Button
            variant="danger"
            onClick={async () => {
              await deleteMaintenance(maintenance.id);
            }}
          >
            Eliminar
          </Button>
        </div>
      </div>
    </div>
  );
}
