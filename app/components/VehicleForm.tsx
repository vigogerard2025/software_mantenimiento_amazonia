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
    },
  });

  const actionHandler = async (data: FormValues) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => fd.append(k, v));
    await onSubmit(fd);
  };

  return (
    <form onSubmit={handleSubmit(actionHandler)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Padrón</label>
        <Input {...register("padron")} />
        {errors.padron && (
          <p className="text-red-500 text-xs">{errors.padron.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium">Placa</label>
        <Input {...register("placa")} />
        {errors.placa && (
          <p className="text-red-500 text-xs">{errors.placa.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium">Marca</label>
        <Input {...register("marca")} />
        {errors.marca && (
          <p className="text-red-500 text-xs">{errors.marca.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium">Modelo</label>
        <Input {...register("modelo")} />
        {errors.modelo && (
          <p className="text-red-500 text-xs">{errors.modelo.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium">Conductor</label>
        <Input {...register("conductor")} />
        {errors.conductor && (
          <p className="text-red-500 text-xs">{errors.conductor.message}</p>
        )}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {submitLabel}
      </Button>
    </form>
  );
}
