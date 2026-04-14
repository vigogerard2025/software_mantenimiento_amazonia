"use client";
import { Maintenance } from "./types/maintenance";
import { useEffect, useState } from "react";
import {
  getMaintenancePlan,
  createMaintenance,
  updateMaintenance,
} from "./actions/maintenancePlan";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import { MaintenanceForm } from "./components/MaintenanceForm";
import { MaintenanceList } from "./components/MaintenanceList";
import { toast } from "@/app/components/ui/toast";

export default function HomePage() {
  const [data, setData] = useState<Maintenance[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Maintenance | null>(null);

  const loadData = async () => {
    const result = await getMaintenancePlan();

    // 🔥 limpieza PRO (evita nulls)
    const cleanData: Maintenance[] = result.map((item) => ({
      id: item.id,
      vehicleId: item.vehicleId,
      taskId: item.taskId,
      vehicle: item.vehicle ?? "Sin vehículo",
      task: item.task ?? "Sin tarea",
      kmInterval: item.kmInterval,
      status: item.status ?? false,
    }));

    setData(cleanData);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (formData: FormData) => {
    await createMaintenance(formData);
    setShowForm(false);
    toast("Mantenimiento creado ✅");
    loadData();
  };

  const handleUpdate = async (formData: FormData) => {
    if (!editing) return;
    await updateMaintenance(editing.id, formData);
    setEditing(null);
    setShowForm(false);
    toast("Mantenimiento actualizado ✏️");
    loadData();
  };

  const handleEdit = (item: Maintenance) => {
    setEditing(item);
    setShowForm(true);
  };

  return (
    <main className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        Plan de Mantenimiento Preventivo
      </h1>

      <div className="mb-6 flex justify-between items-center">
        <Button
          onClick={() => {
            setEditing(null);
            setShowForm(!showForm);
          }}
        >
          {showForm ? "Cancelar" : "+ Nuevo Mantenimiento"}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            {editing ? "Editar Mantenimiento" : "Crear Mantenimiento"}
          </CardHeader>

          <CardContent>
            <MaintenanceForm
              defaultValues={
                editing
                  ? {
                      vehicleId: editing.vehicleId, // ✅ FIX
                      taskId: editing.taskId, // ✅ FIX
                      kmInterval: editing.kmInterval,
                      status: editing.status ?? false,
                    }
                  : undefined
              }
              onSubmit={editing ? handleUpdate : handleCreate}
              submitLabel={editing ? "Actualizar" : "Crear"}
            />
          </CardContent>
        </Card>
      )}

      <MaintenanceList data={data} onEdit={handleEdit} />
    </main>
  );
}
