"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const vehicleFormSchema = z.object({
  padron: z.string().min(1, "Padrón requerido"),
  placa: z.string().min(1, "Placa requerida"),
  marca: z.string().min(1, "Marca requerida"),
  modelo: z.string().min(1, "Modelo requerido"),
  conductor: z.string().min(1, "Conductor requerido"),
  leasingUrl: z.string().optional(),
  kmActual: z.number().min(0),
});

type FormValues = z.infer<typeof vehicleFormSchema>;

interface VehicleFormProps {
  defaultValues?: Partial<FormValues>;
  onSubmit: (data: FormData) => Promise<void>;
  submitLabel: string;
  vehicle?: any;
}

export function VehicleForm({
  defaultValues,
  vehicle,
  onSubmit,
  submitLabel,
}: VehicleFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      padron: vehicle?.padron ?? "",
      placa: vehicle?.placa ?? "",
      marca: vehicle?.marca ?? "",
      modelo: vehicle?.modelo ?? "",
      conductor: vehicle?.conductor ?? "",
      leasingUrl: vehicle?.leasingUrl ?? "",
      kmActual: vehicle?.kmActual ?? 0, // 🔥 IMPORTANTE
    },
  });

  // ✅ TIPADO CORRECTO
  const actionHandler: SubmitHandler<FormValues> = async (data) => {
    const fd = new FormData();

    Object.entries(data).forEach(([k, v]) => {
      fd.append(k, String(v ?? "")); // 🔥 FIX CLAVE
    });

    await onSubmit(fd);
  };

  const fieldClass = "flex flex-col gap-1";
  const labelClass =
    "text-xs font-medium text-gray-500 uppercase tracking-wide";
  const errorClass = "text-red-500 text-xs mt-0.5";

  return (
    <form
      id="vehicle-form"
      onSubmit={handleSubmit(actionHandler)}
      className="space-y-0"
    >
      {/* Identificación */}
      <div className="mb-4">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
          Identificación
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={fieldClass}>
            <label className={labelClass}>Padrón</label>
            <Input {...register("padron")} />
            {errors.padron && (
              <p className={errorClass}>{errors.padron.message}</p>
            )}
          </div>

          <div className={fieldClass}>
            <label className={labelClass}>Placa</label>
            <Input {...register("placa")} />
            {errors.placa && (
              <p className={errorClass}>{errors.placa.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="border-t my-4" />

      {/* Especificaciones */}
      <div className="mb-4">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
          Especificaciones
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={fieldClass}>
            <label className={labelClass}>Marca</label>
            <Input {...register("marca")} />
            {errors.marca && (
              <p className={errorClass}>{errors.marca.message}</p>
            )}
          </div>

          <div className={fieldClass}>
            <label className={labelClass}>Modelo</label>
            <Input {...register("modelo")} />
            {errors.modelo && (
              <p className={errorClass}>{errors.modelo.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="border-t my-4" />

      {/* Operación */}
      <div className="mb-4">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
          Operación
        </p>

        <div className="flex flex-col gap-4">
          <div className={fieldClass}>
            <label className={labelClass}>Conductor</label>
            <Input {...register("conductor")} />
            {errors.conductor && (
              <p className={errorClass}>{errors.conductor.message}</p>
            )}
          </div>

          <div className={fieldClass}>
            <label className={labelClass}>URL de leasing</label>
            <Input {...register("leasingUrl")} />
          </div>

          <div className={fieldClass}>
            <label className={labelClass}>Kilometraje actual</label>
            <Input
              type="number"
              {...register("kmActual", { valueAsNumber: true })}
            />
            {errors.kmActual && (
              <p className={errorClass}>{errors.kmActual.message}</p>
            )}
          </div>
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Guardando..." : submitLabel}
      </Button>
    </form>
  );
}
