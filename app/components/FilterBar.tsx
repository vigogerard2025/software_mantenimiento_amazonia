"use client";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export function VehicleFilterBar({
  onFilter,
}: {
  onFilter: (filters: any) => void;
}) {
  const [search, setSearch] = useState("");
  const [placa, setPlaca] = useState("");
  const [marca, setMarca] = useState("");
  const [conductor, setConductor] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter({ search, placa, marca, conductor });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-gray-50 p-4 rounded-lg mb-6"
    >
      <Input
        placeholder="Buscar (placa/marca/conductor)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Input
        placeholder="Placa exacta"
        value={placa}
        onChange={(e) => setPlaca(e.target.value)}
      />
      <Input
        placeholder="Marca"
        value={marca}
        onChange={(e) => setMarca(e.target.value)}
      />
      <Input
        placeholder="Conductor"
        value={conductor}
        onChange={(e) => setConductor(e.target.value)}
      />
      <Button type="submit">Filtrar</Button>
    </form>
  );
}
