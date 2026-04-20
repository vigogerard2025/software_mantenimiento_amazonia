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
  const [showFilters, setShowFilters] = useState(false);

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
      await deleteMaintenance(id);
      toast("Mantenimiento eliminado");
    } catch (error) {
      setMaintenances(old);
      toast("Error al eliminar");
    }
  };

  return (
    <div>
      {/* TOOLBAR: botón nuevo + toggle filtros */}
      <div className="mb-4 flex flex-wrap gap-2 items-center justify-between">
        <Button
          onClick={() => {
            setEditing(null);
            setShowForm(!showForm);
          }}
        >
          {showForm ? "Cancelar" : "+ Nuevo Mantenimiento"}
        </Button>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="text-sm text-gray-500 underline underline-offset-2 sm:hidden"
        >
          {showFilters ? "Ocultar filtros" : "🔍 Filtrar"}
        </button>
      </div>

      {/* FILTROS — siempre visibles en desktop, colapsables en móvil */}
      <div
        className={`${
          showFilters ? "flex" : "hidden"
        } sm:flex flex-col sm:flex-row flex-wrap gap-2 mb-5`}
      >
        <Input
          placeholder="Placa"
          value={filters.vehiclePlaca || ""}
          onChange={(e) =>
            setFilters({ ...filters, vehiclePlaca: e.target.value })
          }
          className="w-full sm:w-32"
        />
        <Input
          type="date"
          placeholder="Desde"
          value={filters.fromDate || ""}
          onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
          className="w-full sm:w-36"
        />
        <Input
          type="date"
          placeholder="Hasta"
          value={filters.toDate || ""}
          onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
          className="w-full sm:w-36"
        />
        <Select
          value={filters.tipo || ""}
          onChange={(e) => setFilters({ ...filters, tipo: e.target.value })}
          className="w-full sm:w-28"
        >
          <option value="">Todos</option>
          <option value="Preventivo">Preventivo</option>
          <option value="Correctivo">Correctivo</option>
        </Select>
        <Button variant="secondary" onClick={() => setFilters({})}>
          Limpiar
        </Button>
      </div>

      {/* FORMULARIO */}
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
                      mecanico: editing.mecanico ?? "",
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

      {/* GRID DE CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
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
        <p className="text-center text-gray-500 py-10">
          No hay mantenimientos.
        </p>
      )}
    </div>
  );
}
