export interface Anomaly {
  id: number;
  satellite_id: string;
  anomaly_type: 'software' | 'hardware';
  description: string;
  timestamp: string;
  status: 'pending' | 'fixed';
}