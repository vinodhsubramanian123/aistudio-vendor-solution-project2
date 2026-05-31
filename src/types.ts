/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DiscrepancyItem {
  id: string;
  sku: string;
  description: string;
  category: string;
  boqQty: number;
  bomQty: number;
  status: 'Matched' | 'Qty Diff' | 'Missing' | 'Extra';
  insight: string;
}

export interface ConfigSubStep {
  name: string;
  status: 'Matched' | 'In Progress' | 'Pending' | 'Diff';
}

export interface UCIDConfig {
  id: string; // e.g., UCID-A, UCID-B, UCID-C
  machineModel: string; // e.g., HPE-DL380-GEN12-001
  configsCount: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'Running' | 'Queued' | 'Completed' | 'Pending';
  steps: ConfigSubStep[];
}

export interface PortalConnection {
  name: string;
  status: 'Connected' | 'Delayed' | 'Waiting';
}

export interface MissionAutomationStep {
  id: number;
  name: string;
  status: 'Completed' | 'In Progress' | 'Pending';
  time?: string;
  processed?: string;
}

export interface ForensicStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  status: 'Matched' | 'Diff' | 'Missing' | 'Pending';
  details?: string;
}

export interface HealingTask {
  id: string;
  title: string;
  subtitle: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'To Be Fixed' | 'Auto-Healed' | 'Fixed';
}

export interface QueryLog {
  id: string;
  query: string;
  answer: string;
  timestamp: string;
  isRecent: boolean;
}
