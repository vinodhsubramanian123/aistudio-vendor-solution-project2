/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DiscrepancyItem, UCIDConfig, PortalConnection, MissionAutomationStep, ForensicStep, HealingTask, QueryLog } from '../types';

export const INITIAL_DISCREPANCIES: DiscrepancyItem[] = [
  {
    id: '1',
    sku: 'P56156-B21',
    description: 'Intel Xeon Gold 6430 2.10GHz 32-core custom enterprise processor',
    category: 'Processor',
    boqQty: 4,
    bomQty: 4,
    status: 'Matched',
    insight: 'Exact match'
  },
  {
    id: '2',
    sku: 'P47810-B21',
    description: '32GB DDR5 4800 ECC Registered RAM RDIMM module',
    category: 'Memory',
    boqQty: 32,
    bomQty: 32,
    status: 'Matched',
    insight: 'Exact match'
  },
  {
    id: '3',
    sku: 'PS0775-B21',
    description: 'HPE 2U LFF Easy Install Rail Kit for DL380 Gen12 chassis',
    category: 'Rail Kit',
    boqQty: 2,
    bomQty: 0,
    status: 'Missing',
    insight: 'BOM short by 2'
  },
  {
    id: '4',
    sku: 'P57706-B21',
    description: '960GB SATA 6G Mixed Use SFF BC multi-vendor SSD',
    category: 'Storage',
    boqQty: 12,
    bomQty: 10,
    status: 'Qty Diff',
    insight: 'BOM short by 2'
  },
  {
    id: '5',
    sku: 'P48810-B21',
    description: 'Broadcom 5719 1Gb 4-port BASE-T network adapter',
    category: 'Network',
    boqQty: 2,
    bomQty: 3,
    status: 'Extra',
    insight: 'Extra in BOM'
  },
  {
    id: '6',
    sku: 'P42048-B21',
    description: 'HPE Smart Array P408i-a SR Gen10 Modular Controller',
    category: 'Controller',
    boqQty: 2,
    bomQty: 2,
    status: 'Matched',
    insight: 'Exact match'
  },
  {
    id: '7',
    sku: 'P38995-B21',
    description: 'HPE 800W Flex Slot Platinum Hot Plug Low Halogen Power Supply',
    category: 'Power Supply',
    boqQty: 4,
    bomQty: 4,
    status: 'Matched',
    insight: 'Exact match'
  },
  {
    id: '8',
    sku: 'P55123-B21',
    description: 'NVIDIA A16 64GB Quad-GPU Tensor Core Graphic Accelerator',
    category: 'GPU',
    boqQty: 1,
    bomQty: 2,
    status: 'Qty Diff',
    insight: 'BOM extra by 1'
  },
  {
    id: '9',
    sku: 'PS0521-B21',
    description: 'HPE security bezel kit with lock for DL380 Gen12 SFF',
    category: 'Others',
    boqQty: 0,
    bomQty: 1,
    status: 'Extra',
    insight: 'Extra in BOM'
  },
  {
    id: '10',
    sku: 'P51240-B21',
    description: 'HPE 1.92TB Read Intensive LFF digital signed disk drive',
    category: 'Storage',
    boqQty: 4,
    bomQty: 0,
    status: 'Missing',
    insight: 'BOM short by 4'
  }
];

export const INITIAL_UCID_CONFIGS: UCIDConfig[] = [
  {
    id: 'UCID-A',
    machineModel: 'HPE-DL380-GEN12-001',
    configsCount: 3,
    priority: 'HIGH',
    status: 'Running',
    steps: [
      { name: 'Base Server Config', status: 'Matched' },
      { name: 'Storage Config', status: 'In Progress' },
      { name: 'Networking Config', status: 'Pending' }
    ]
  },
  {
    id: 'UCID-B',
    machineModel: 'HPE-DL380-GEN12-002',
    configsCount: 2,
    priority: 'MEDIUM',
    status: 'Running',
    steps: [
      { name: 'Compute Config', status: 'Matched' },
      { name: 'GPU Config', status: 'Pending' }
    ]
  },
  {
    id: 'UCID-C',
    machineModel: 'HPE-APOLLO-6500-003',
    configsCount: 1,
    priority: 'LOW',
    status: 'Queued',
    steps: [
      { name: 'Solution Config', status: 'Pending' }
    ]
  }
];

export const PORTAL_CONNECTIONS: PortalConnection[] = [
  { name: 'HPE', status: 'Connected' },
  { name: 'Dell', status: 'Connected' },
  { name: 'Lenovo', status: 'Delayed' },
  { name: 'Ingram', status: 'Waiting' }
];

export const MISSION_STEPS: MissionAutomationStep[] = [
  { id: 1, name: 'Login to HPE Partner Portal', status: 'Completed', time: '10:01:12', processed: 'Done' },
  { id: 2, name: 'Navigate to Configurator', status: 'Completed', time: '10:02:03', processed: 'Done' },
  { id: 3, name: 'Load UCID / Solution', status: 'Completed', time: '10:03:11', processed: 'Done' },
  { id: 4, name: 'Expand Configurations', status: 'Completed', time: '10:04:22', processed: 'Done' },
  { id: 5, name: 'Extract Config 1', status: 'Completed', time: '10:04:45', processed: 'Done' },
  { id: 6, name: 'Extract Config 2', status: 'In Progress', time: 'Active', processed: '312 / 442 parts' },
  { id: 7, name: 'Extract Config 3', status: 'Pending', processed: '0 / 256' },
  { id: 8, name: 'Validate & Normalize Data', status: 'Pending' },
  { id: 9, name: 'Generate BOM', status: 'Pending' },
  { id: 10, name: 'Save & Complete', status: 'Pending' }
];

export const FORENSIC_CHECKLISTS: Record<string, ForensicStep[]> = {
  'PS0775-B21': [
    { stepNumber: 1, title: 'Canonicalization', subtitle: 'SKU Normalized: PS0775-B21', status: 'Matched', details: 'Exact match in schema catalog' },
    { stepNumber: 2, title: 'Schema Match', subtitle: 'Matched to Rail Kit (100% Core Confidence)', status: 'Matched', details: 'Parsed classification matches structure specifications' },
    { stepNumber: 3, title: 'Config Grouping', subtitle: 'HPE DL380 Gen12 Base Chassis', status: 'Matched', details: 'Mapped to group with 2 core units' },
    { stepNumber: 4, title: 'Multiplier Applied', subtitle: 'BOM Multiplier: 1, BOQ Multiplier: 1', status: 'Matched', details: 'Rule resolved quantity multiplier successfully' },
    { stepNumber: 5, title: 'Comparison', subtitle: 'Not found in BOM stream', status: 'Missing', details: 'Search across 4,212 rows yields zero active records' },
    { stepNumber: 6, title: 'Result', subtitle: 'Missing in automated BOM file', status: 'Missing', details: 'Reconciler flagged this as omitted product item' }
  ],
  'P57706-B21': [
    { stepNumber: 1, title: 'Canonicalization', subtitle: 'SKU Normalized: P57706-B21', status: 'Matched' },
    { stepNumber: 2, title: 'Schema Match', subtitle: 'Storage SSD Class (98% confidence)', status: 'Matched' },
    { stepNumber: 3, title: 'Config Grouping', subtitle: 'Group matches Storage Config 2', status: 'Matched' },
    { stepNumber: 4, title: 'Multiplier Applied', subtitle: 'BOQ: 1x12 parts, BOM: 1x10 parts', status: 'Diff', details: 'Discrepancy found: Expected 12, Sourced 10' },
    { stepNumber: 5, title: 'Comparison', subtitle: 'Count mismatch detected', status: 'Diff' },
    { stepNumber: 6, title: 'Result', subtitle: 'Qty Mismatch (BOM is short by 2)', status: 'Diff' }
  ]
};

export const INITIAL_HEALING_TASKS: HealingTask[] = [
  { id: 'H-01', title: 'Missing Rail Kit — PS0775-B21', subtitle: 'UCID-A (Storage Config)', priority: 'High', status: 'To Be Fixed' },
  { id: 'H-02', title: 'Qty Mismatch — P57706-B21', subtitle: 'UCID-B (Compute Config)', priority: 'Medium', status: 'To Be Fixed' },
  { id: 'H-03', title: 'Unknown Part — XC3395-ACF', subtitle: 'UCID-B (GPU Config)', priority: 'Medium', status: 'To Be Fixed' },
  { id: 'H-04', title: 'Config Rule Violation', subtitle: 'UCID-A (Networking Config)', priority: 'Low', status: 'To Be Fixed' }
];

export const SUGGESTED_QUERIES = [
  'Why is PS0775-B21 missing?',
  'Show all quantity differences',
  'What is the risk score recommendation?',
  'Find alternatives for ram P47810-B21'
];

export const SYSTEM_QUERY_LOGS: QueryLog[] = [
  {
    id: 'q-1',
    query: 'Why is PS0775-B21 missing?',
    answer: 'The rail kit PS0775-B21 was present in the BOQ (Qty: 2) but omitted from the BOM during execution on the HPE portal. This is likely because the automatic portal sourcing script was queue-blocked. Recommended Action: Click Add to BOM, or execute Auto-Heal to trigger a background patch.',
    timestamp: '10:21:40',
    isRecent: true
  },
  {
    id: 'q-2',
    query: 'Show all quantity differences',
    answer: 'There are two main quantity differences active: Part P57706-B21 (SATA SSD) has BOQ Qty: 12 but BOM Qty: 10 (mismatch of 2). Part P55123-B21 (NVIDIA GPU) has BOQ Qty: 1 but BOM Qty: 2 (mismatch of 1).',
    timestamp: '10:18:12',
    isRecent: true
  },
  {
    id: 'q-3',
    query: 'Find alternatives for ram P47810-B21',
    answer: 'P47810-B21 is standard 32GB DDR5 RDIMM 4800. Compatible equivalents include Micron MTC20C2085S1RC48BA or Samsung M321R4GA3BB6-CQKOG. Both are certified for DL380 Gen12 with full safety compliance ratings.',
    timestamp: '10:11:05',
    isRecent: false
  }
];
