import { SERVICE_CONFIG } from './config';
import { mockEventService } from './eventService';
import { mockPembeliService } from './pembeliService';

// Unified Service Adapter
export const eventService = mockEventService;
export const pembeliService = mockPembeliService;

export { SERVICE_CONFIG };
