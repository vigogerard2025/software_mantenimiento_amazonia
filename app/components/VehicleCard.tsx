import { Vehicle } from "@/app/db/schema";
import { Button } from "./ui/button";
import { deleteVehicle } from "@/app/actions/vehicles";

interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit: (vehicle: Vehicle) => void;
}

export function VehicleCard({ vehicle, onEdit }: VehicleCardProps) {
  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold">
        {vehicle.placa} - {vehicle.marca} {vehicle.modelo}
      </h3>
      <p className="text-gray-600">Padrón: {vehicle.padron}</p>
      <p className="text-gray-600">Conductor: {vehicle.conductor}</p>
      <div className="mt-3 flex gap-2 justify-end">
        <Button variant="secondary" onClick={() => onEdit(vehicle)}>
          Editar
        </Button>
        <Button
          variant="danger"
          onClick={async () => {
            await deleteVehicle(vehicle.id);
          }}
        >
          Eliminar
        </Button>
      </div>
    </div>
  );
}
