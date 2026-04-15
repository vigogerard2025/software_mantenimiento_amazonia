"use client";
import { useEffect, useState } from "react";
import { Vehicle } from "@/app/db/schema";
import {
  getVehicles,
  createVehicle,
  updateVehicle,
  VehicleFilters,
} from "@/app/actions/vehicles";
import { VehicleCard } from "./VehicleCard";
import { VehicleForm } from "./VehicleForm";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Input } from "./ui/input";
import { toast } from "./ui/toast";

export function VehicleList() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [filters, setFilters] = useState<VehicleFilters>({ search: "" });

  const loadVehicles = async () => {
    const data = await getVehicles(filters);
    setVehicles(data);
  };

  useEffect(() => {
    loadVehicles();
  }, [filters]);

  const handleCreate = async (formData: FormData) => {
    await createVehicle(formData);
    setShowForm(false);
    toast("Vehículo creado");
    loadVehicles();
  };

  const handleUpdate = async (formData: FormData) => {
    if (!editingVehicle) return;
    await updateVehicle(editingVehicle.id, formData);
    setEditingVehicle(null);
    setShowForm(false);
    toast("Vehículo actualizado");
    loadVehicles();
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setShowForm(true);
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <Button
          onClick={() => {
            setEditingVehicle(null);
            setShowForm(!showForm);
          }}
        >
          {showForm ? "Cancelar" : "+ Nuevo Vehículo"}
        </Button>
        <div className="flex gap-2">
          <Input
            placeholder="Buscar (placa/marca/conductor)"
            value={filters.search || ""}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-64"
          />
        </div>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            {editingVehicle ? "Editar Vehículo" : "Crear Vehículo"}
          </CardHeader>
          <CardContent>
            <VehicleForm
              defaultValues={
                editingVehicle
                  ? {
                      padron: editingVehicle.padron,
                      placa: editingVehicle.placa,
                      marca: editingVehicle.marca,
                      modelo: editingVehicle.modelo,
                      conductor: editingVehicle.conductor,
                    }
                  : undefined
              }
              onSubmit={editingVehicle ? handleUpdate : handleCreate}
              submitLabel={editingVehicle ? "Actualizar" : "Crear"}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} onEdit={handleEdit} />
        ))}
      </div>
      {vehicles.length === 0 && (
        <p className="text-center text-gray-500">No hay vehículos.</p>
      )}
    </div>
  );
}
