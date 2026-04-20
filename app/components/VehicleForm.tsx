"use client";
import { useForm } from "react-hook-form";
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
});

type FormValues = z.infer<typeof vehicleFormSchema>;

interface VehicleFormProps {
  defaultValues?: Partial<FormValues>;
  onSubmit: (data: FormData) => Promise<void>;
  submitLabel: string;
}

export function VehicleForm({
  defaultValues,
  onSubmit,
  submitLabel,
}: VehicleFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: defaultValues || {
      padron: "",
      placa: "",
      marca: "",
      modelo: "",
      conductor: "",
      leasingUrl: "",
    },
  });

  const actionHandler = async (data: FormValues) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => fd.append(k, v ?? ""));
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
      {/* Sección: Identificación */}
      <div className="mb-4">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
          Identificación
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={fieldClass}>
            <label className={labelClass}>Padrón</label>
            <Input placeholder="Ej: 1234" {...register("padron")} />
            {errors.padron && (
              <p className={errorClass}>{errors.padron.message}</p>
            )}
          </div>
          <div className={fieldClass}>
            <label className={labelClass}>Placa</label>
            <Input placeholder="Ej: ABC-123" {...register("placa")} />
            {errors.placa && (
              <p className={errorClass}>{errors.placa.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 my-4" />

      {/* Sección: Especificaciones */}
      <div className="mb-4">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
          Especificaciones
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={fieldClass}>
            <label className={labelClass}>Marca</label>
            <Input placeholder="Ej: JAC" {...register("marca")} />
            {errors.marca && (
              <p className={errorClass}>{errors.marca.message}</p>
            )}
          </div>
          <div className={fieldClass}>
            <label className={labelClass}>Modelo</label>
            <Input placeholder="Ej: SD401" {...register("modelo")} />
            {errors.modelo && (
              <p className={errorClass}>{errors.modelo.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 my-4" />

      {/* Sección: Operación */}
      <div className="mb-4">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
          Operación
        </p>
        <div className="flex flex-col gap-4">
          <div className={fieldClass}>
            <label className={labelClass}>Conductor</label>
            <Input
              placeholder="Nombre completo del conductor"
              {...register("conductor")}
            />
            {errors.conductor && (
              <p className={errorClass}>{errors.conductor.message}</p>
            )}
          </div>
          <div className={fieldClass}>
            <label className={labelClass}>
              URL de leasing{" "}
              <span className="text-gray-400 normal-case tracking-normal font-normal ml-1">
                — opcional
              </span>
            </label>
            <Input placeholder="https://..." {...register("leasingUrl")} />
            <p className="text-xs text-gray-400 mt-0.5">
              Enlace al contrato o documento de leasing
            </p>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-auto"
        >
          {isSubmitting ? "Guardando..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
