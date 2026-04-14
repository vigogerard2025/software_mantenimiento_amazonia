export type Maintenance = {
  id: number;
  vehicleId: number;
  taskId: number;
  vehicle: string;
  task: string;
  kmInterval: number;
  status: boolean;
};
