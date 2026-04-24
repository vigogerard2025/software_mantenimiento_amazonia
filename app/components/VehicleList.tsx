"use client";
import { useEffect, useState, useRef } from "react";
import { Vehicle } from "@/app/db/schema";
import {
  getVehicles,
  createVehicle,
  updateVehicle,
  VehicleFilters,
  deleteVehicle,
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
  const formRef = useRef<HTMLDivElement>(null);

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
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteVehicle(id);
      toast("Vehículo eliminado");
      loadVehicles();
    } catch (error) {
      console.error(error);
      toast("Error al eliminar");
    }
  };

  return (
    <div>
      {/* TOOLBAR */}
      <div className="mb-4 flex flex-wrap gap-2 items-center justify-between">
        <Button
          onClick={() => {
            setEditingVehicle(null);
            setShowForm(!showForm);
          }}
        >
          {showForm ? "Cancelar" : "+ Nuevo Vehículo"}
        </Button>

        <Input
          placeholder="Buscar (placa/marca/conductor)"
          value={filters.search || ""}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="w-full sm:w-64"
        />
      </div>

      {/* FORMULARIO */}
      {showForm && (
        <div ref={formRef}>
          <Card className="mb-6">
            <CardHeader>
              {editingVehicle ? "Editar Vehículo" : "Crear Vehículo"}
            </CardHeader>
            <CardContent>
              {/* 🔥 FIX: se pasa vehicle={editingVehicle} para que el form lea los datos */}
              <VehicleForm
                vehicle={editingVehicle ?? undefined}
                onSubmit={editingVehicle ? handleUpdate : handleCreate}
                submitLabel={editingVehicle ? "Actualizar" : "Crear"}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {vehicles.length === 0 && (
        <p className="text-center text-gray-500 py-10">No hay vehículos.</p>
      )}
    </div>
  );
}
