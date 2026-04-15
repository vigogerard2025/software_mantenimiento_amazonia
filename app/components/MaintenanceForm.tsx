"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { getAllPlacas } from "@/app/actions/vehicles";

const maintenanceFormSchema = z.object({
  vehiclePlaca: z.string().min(1, "Placa requerida"),
  fecha: z.string().min(1, "Fecha requerida"),
  ubicacion: z.string().min(1, "Ubicación requerida"),

  // 🔥 CAMBIO AQUÍ
  km: z.number().int().min(0, "KM no negativo"),

  tipo: z.string().min(1, "Tipo requerido"),
  descripcion: z.string().optional(),
});

type FormValues = z.infer<typeof maintenanceFormSchema>;

interface MaintenanceFormProps {
  defaultValues?: Partial<FormValues>;
  onSubmit: (data: FormData) => Promise<void>;
  submitLabel: string;
}

export function MaintenanceForm({
  defaultValues,
  onSubmit,
  submitLabel,
}: MaintenanceFormProps) {
  const [placas, setPlacas] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset, // 🔥 importante
  } = useForm<FormValues>({
    resolver: zodResolver(maintenanceFormSchema),
    defaultValues: {
      vehiclePlaca: "",
      fecha: "",
      ubicacion: "",
      km: 0,
      tipo: "5K",
      descripcion: "",
      ...defaultValues,
    },
  });

  // 🔥 FIX: actualizar form al editar
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  useEffect(() => {
    getAllPlacas().then(setPlacas);
  }, []);

  const actionHandler = async (data: FormValues) => {
    const fd = new FormData();

    fd.append("vehiclePlaca", data.vehiclePlaca);
    fd.append("fecha", data.fecha);
    fd.append("ubicacion", data.ubicacion);
    fd.append("km", String(data.km)); // 🔥 FIX number
    fd.append("tipo", data.tipo);
    fd.append("descripcion", data.descripcion || "");

    await onSubmit(fd);
  };

  return (
    <form onSubmit={handleSubmit(actionHandler as any)}>
      {" "}
      {/* 🔥 SELECT CORREGIDO (usar select nativo) */}
      <div>
        <label className="block text-sm font-medium">Vehículo (Placa)</label>
        <select
          {...register("vehiclePlaca")}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Seleccione una placa</option>
          {placas.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        {errors.vehiclePlaca && (
          <p className="text-red-500 text-xs">{errors.vehiclePlaca.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium">Fecha</label>
        <Input type="date" {...register("fecha")} />
        {errors.fecha && (
          <p className="text-red-500 text-xs">{errors.fecha.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium">Ubicación</label>
        <Input {...register("ubicacion")} />
        {errors.ubicacion && (
          <p className="text-red-500 text-xs">{errors.ubicacion.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium">KM</label>
        <Input type="number" {...register("km")} />
        {errors.km && (
          <p className="text-red-500 text-xs">{errors.km.message}</p>
        )}
      </div>
      {/* 🔥 SELECT CORREGIDO */}
      <div>
        <label className="block text-sm font-medium">
          Tipo de Mantenimiento
        </label>
        <select
          {...register("tipo")}
          className="w-full border rounded px-3 py-2"
        >
          <option value="5K">5K</option>
          <option value="10K">10K</option>
          <option value="20K">20K</option>
          <option value="30K">30K</option>
        </select>
        {errors.tipo && (
          <p className="text-red-500 text-xs">{errors.tipo.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium">Descripción</label>
        <Input {...register("descripcion")} />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Guardando..." : submitLabel}
      </Button>
    </form>
  );
}
