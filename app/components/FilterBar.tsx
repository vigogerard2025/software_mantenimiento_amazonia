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
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 bg-gray-50 p-3 rounded-lg mb-6 items-center"
    >
      <Input
        placeholder="Buscar"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="text-sm"
      />

      <Input
        placeholder="Placa"
        value={placa}
        onChange={(e) => setPlaca(e.target.value)}
        className="text-sm"
      />

      <Input
        placeholder="Marca"
        value={marca}
        onChange={(e) => setMarca(e.target.value)}
        className="text-sm"
      />

      <Input
        placeholder="Conductor"
        value={conductor}
        onChange={(e) => setConductor(e.target.value)}
        className="text-sm"
      />

      <Button type="submit" className="col-span-2 md:col-span-1 text-sm">
        Filtrar
      </Button>
    </form>
  );
}
