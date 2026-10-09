import { SERVICE_CONFIG } from './config';
import { isFirebaseConfigured } from './firebase';
import { mockEventService } from './eventService';
import { mockPembeliService } from './pembeliService';
import { mockTiketService } from './tiketService';
import { mockRekapService } from './rekapService';
import {
  firestoreEventService,
  firestorePembeliService,
  firestoreTiketService,
  firestoreRekapService
} from './firestoreService';

// Gunakan Firestore bila MODE disetel ke 'firestore' dan konfigurasi .env aktif,
// jika tidak, gunakan Mock Service yang stabil dan aman untuk pengujian.
const useFirestore = SERVICE_CONFIG.MODE === 'firestore' && isFirebaseConfigured;

export const eventService = useFirestore ? firestoreEventService : mockEventService;
export const pembeliService = useFirestore ? firestorePembeliService : mockPembeliService;
export const tiketService = useFirestore ? firestoreTiketService : mockTiketService;
export const rekapService = useFirestore ? firestoreRekapService : mockRekapService;

export const currentServiceMode = useFirestore ? 'firestore' : 'mock';

export { SERVICE_CONFIG, isFirebaseConfigured };
