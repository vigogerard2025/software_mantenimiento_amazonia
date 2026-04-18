"use client";
import { useEffect, useState } from "react";
import { MaintenanceRecord } from "@/app/db/schema";
import {
  getMaintenances,
  createMaintenance,
  updateMaintenance,
  MaintenanceFilters,
  deleteMaintenance,
} from "@/app/actions/maintenances";
import { MaintenanceCard } from "./MaintenanceCard";
import { MaintenanceForm } from "./MaintenanceForm";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { toast } from "./ui/toast";

export function MaintenanceList() {
  const [maintenances, setMaintenances] = useState<MaintenanceRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<MaintenanceRecord | null>(null);
  const [filters, setFilters] = useState<MaintenanceFilters>({});

  const load = async () => {
    const data = await getMaintenances(filters);
    setMaintenances(data);
  };

  useEffect(() => {
    load();
  }, [filters]);

  const handleCreate = async (fd: FormData) => {
    await createMaintenance(fd);
    setShowForm(false);
    toast("Mantenimiento registrado");
    load();
  };

  const handleUpdate = async (fd: FormData) => {
    if (!editing) return;
    await updateMaintenance(editing.id, fd);
    setEditing(null);
    setShowForm(false);
    toast("Mantenimiento actualizado");
    load();
  };

  const handleEdit = (m: MaintenanceRecord) => {
    setEditing(m);
    setShowForm(true);
  };
  const handleDelete = async (id: number) => {
    const old = [...maintenances];

    setMaintenances((prev) => prev.filter((m) => m.id !== id));

    try {
      await deleteMaintenance(id); // 👈 CAMBIO AQUÍ
      toast("Mantenimiento eliminado");
    } catch (error) {
      setMaintenances(old);
      toast("Error al eliminar");
    }
  };
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <Button
          onClick={() => {
            setEditing(null);
            setShowForm(!showForm);
          }}
        >
          {showForm ? "Cancelar" : "+ Nuevo Mantenimiento"}
        </Button>
        <div className="flex gap-2">
          <Input
            placeholder="Placa"
            value={filters.vehiclePlaca || ""}
            onChange={(e) =>
              setFilters({ ...filters, vehiclePlaca: e.target.value })
            }
            className="w-32"
          />
          <Input
            type="date"
            placeholder="Desde"
            value={filters.fromDate || ""}
            onChange={(e) =>
              setFilters({ ...filters, fromDate: e.target.value })
            }
            className="w-36"
          />
          <Input
            type="date"
            placeholder="Hasta"
            value={filters.toDate || ""}
            onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
            className="w-36"
          />
          <Select
            value={filters.tipo || ""}
            onChange={(e) => setFilters({ ...filters, tipo: e.target.value })}
            className="w-28"
          >
            <option value="">Todos</option>
            <option value="Preventivo">Preventivo</option>
            <option value="Correctivo">Correctivo</option>
          </Select>
          <Button variant="secondary" onClick={() => setFilters({})}>
            Limpiar
          </Button>
        </div>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            {editing ? "Editar Mantenimiento" : "Nuevo Mantenimiento"}
          </CardHeader>
          <CardContent>
            <MaintenanceForm
              defaultValues={
                editing
                  ? {
                      vehiclePlaca: editing.vehiclePlaca,
                      fecha: editing.fecha,
                      ubicacion: editing.ubicacion,
                      km: editing.km,
                      tipo: editing.tipo,
                      mecanico: editing.mecanico ?? "", // 👈 FIX
                      descripcion: editing.descripcion || "",
                    }
                  : undefined
              }
              onSubmit={editing ? handleUpdate : handleCreate}
              submitLabel={editing ? "Actualizar" : "Crear"}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {maintenances.map((m) => (
          <MaintenanceCard
            key={m.id}
            maintenance={m}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
      {maintenances.length === 0 && (
        <p className="text-center text-gray-500">No hay mantenimientos.</p>
      )}
    </div>
  );
}
