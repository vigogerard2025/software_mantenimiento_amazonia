"use client";

import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type FormValues = {
  vehicleId: number;
  taskId: number;
  kmInterval: number;
  status?: boolean;
};

interface Props {
  defaultValues?: Partial<FormValues>;
  onSubmit: (data: FormData) => Promise<void>;
  submitLabel: string;
}

export function MaintenanceForm({
  defaultValues,
  onSubmit,
  submitLabel,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: defaultValues || {
      vehicleId: 1,
      taskId: 1,
      kmInterval: 10000,
      status: false,
    },
  });

  const actionHandler = async (data: FormValues) => {
    const formData = new FormData();

    formData.append("vehicleId", String(data.vehicleId));
    formData.append("taskId", String(data.taskId));
    formData.append("kmInterval", String(data.kmInterval));
    formData.append("status", String(data.status ?? false));

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(actionHandler)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">ID Vehículo</label>
        <Input
          type="number"
          {...register("vehicleId", { valueAsNumber: true })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">ID Tarea</label>
        <Input type="number" {...register("taskId", { valueAsNumber: true })} />
      </div>

      <div>
        <label className="block text-sm font-medium">Kilometraje</label>
        <Input
          type="number"
          {...register("kmInterval", { valueAsNumber: true })}
        />
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" {...register("status")} />
        <label className="text-sm">Completado</label>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Guardando..." : submitLabel}
      </Button>
    </form>
  );
}
