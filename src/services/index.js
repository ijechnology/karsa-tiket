import { SERVICE_CONFIG } from './config';
import { mockEventService } from './eventService';
import { mockPembeliService } from './pembeliService';
import { mockTiketService } from './tiketService';

// Unified Service Adapter
export const eventService = mockEventService;
export const pembeliService = mockPembeliService;
export const tiketService = mockTiketService;

export { SERVICE_CONFIG };
