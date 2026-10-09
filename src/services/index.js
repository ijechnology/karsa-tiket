import { SERVICE_CONFIG } from './config';
import { mockEventService } from './eventService';
import { mockPembeliService } from './pembeliService';
import { mockTiketService } from './tiketService';
import { mockRekapService } from './rekapService';

// Unified Service Adapter
export const eventService = mockEventService;
export const pembeliService = mockPembeliService;
export const tiketService = mockTiketService;
export const rekapService = mockRekapService;

export { SERVICE_CONFIG };
