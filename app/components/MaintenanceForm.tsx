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
  mecanico: z.string().min(1, "Mecánico requerido"), // 👈 NUEVO

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
      mecanico: "",
      descripcion: "",
      ...defaultValues,
    },
  });

  // 🔥 FIX: actualizar form al editar
  useEffect(() => {
    if (defaultValues && placas.length > 0) {
      reset({
        ...defaultValues,
        vehiclePlaca: defaultValues.vehiclePlaca || "",
      });
    }
  }, [defaultValues, placas, reset]);

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
    fd.append("mecanico", data.mecanico); // 👈 NUEVO

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
          defaultValue={defaultValues?.vehiclePlaca || ""}
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
        <Input
          type="number"
          {...register("km", { valueAsNumber: true })}
        />{" "}
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
          <option value="Preventivo">Preventivo</option>
          <option value="Correctivo">Correctivo</option>
        </select>
        {errors.tipo && (
          <p className="text-red-500 text-xs">{errors.tipo.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium">
          Mecánico a cargo del Mantenimiento
        </label>
        <Input {...register("mecanico")} />
        {errors.mecanico && (
          <p className="text-red-500 text-xs">{errors.mecanico.message}</p>
        )}
      </div>
      <div className="pb-10">
        <label className="block text-sm font-medium ">Descripción</label>
        <textarea
          {...register("descripcion")}
          className="w-full border rounded px-3 py-2 h-40"
          onPaste={(e) => {
            e.preventDefault();
            const text = e.clipboardData.getData("text");

            const formatted = text
              .replace(/\t/g, "\n") // tabs → salto de línea
              .replace(/ {2,}/g, "\n"); // muchos espacios → salto

            document.execCommand("insertText", false, formatted);
          }}
        />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Guardando..." : submitLabel}
      </Button>
    </form>
  );
}
