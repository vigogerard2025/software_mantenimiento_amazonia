import { Vehicle } from "@/app/db/schema";
import { Button } from "./ui/button";
import { Car, User, Hash } from "lucide-react";
import Image from "next/image";
interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: number) => void;
}
const getVehicleImage = (marca: string, modelo: string) => {
  const m = marca?.toLowerCase() || "";
  const mod = modelo?.toLowerCase() || "";

  // HYUNDAI
  if (m.includes("hyundai")) return "/cars/ex8.png";

  // JAC SD400
  if (mod.includes("sd400")) return "/cars/sd400.jpg";

  // JAC SD401 - SD407
  if (/sd40[1-7]/.test(mod)) return "/cars/sd401.jpg";

  // fallback JAC
  if (m.includes("jac")) return "/cars/sd401.jpg";

  return "/cars/ex8.png";
};
export function VehicleCard({ vehicle, onEdit, onDelete }: VehicleCardProps) {
  console.log("MARCA:", vehicle.marca);
  return (
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
  );
}
