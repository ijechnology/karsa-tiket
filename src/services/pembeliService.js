import { initialPembeli } from './mockData';

const STORAGE_KEY = 'karsa_mock_pembeli';

function getStoredPembeli() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialPembeli));
    return [...initialPembeli];
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return [...initialPembeli];
  }
}

function savePembeli(pembeliList) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pembeliList));
}

export const mockPembeliService = {
  async getPembeli(searchQuery = '', forceError = false) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (forceError) {
      throw new Error('Koneksi terputus saat mengambil data pembeli.');
    }
    const pembeliList = getStoredPembeli();
    if (!searchQuery.trim()) {
      return [...pembeliList].sort((a, b) => a.nama.localeCompare(b.nama));
    }
    const query = searchQuery.toLowerCase().trim();
    return pembeliList
      .filter((p) => p.nama.toLowerCase().includes(query) || p.no_whatsapp.includes(query))
      .sort((a, b) => a.nama.localeCompare(b.nama));
  },

  async checkPembeliExists(noWhatsapp) {
    const pembeliList = getStoredPembeli();
    return pembeliList.some((p) => p.no_whatsapp === noWhatsapp);
  },

  async createPembeli(pembeliData) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const pembeliList = getStoredPembeli();

    const nama = (pembeliData.nama || '').trim();
    const noWA = (pembeliData.no_whatsapp || '').trim();
    const email = (pembeliData.email || '').trim();

    if (!nama || nama.length > 60) {
      throw new Error('Nama pembeli wajib diisi (1 sampai 60 karakter).');
    }

    if (!/^08\d{8,11}$/.test(noWA)) {
      throw new Error('Nomor WhatsApp harus diawali 08 dan memiliki panjang 10 sampai 13 angka.');
    }

    if (!email.includes('@') || email.length > 80) {
      throw new Error('Email harus mengandung tanda @ dan maksimal 80 karakter.');
    }

    // Pengecekan unik nomor WhatsApp
    if (pembeliList.some((p) => p.no_whatsapp === noWA)) {
      throw new Error('Nomor WhatsApp sudah terdaftar.');
    }

    const newPembeli = {
      id: noWA, // Sesuai skema: ID dokumen = no_whatsapp
      nama: nama,
      no_whatsapp: noWA,
      email: email,
      dibuat_pada: new Date().toISOString()
    };

    pembeliList.push(newPembeli);
    savePembeli(pembeliList);
    return newPembeli;
  },

  async updatePembeli(noWhatsapp, pembeliData) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const pembeliList = getStoredPembeli();
    const index = pembeliList.findIndex((p) => p.no_whatsapp === noWhatsapp);
    if (index === -1) {
      throw new Error('Data pembeli tidak ditemukan.');
    }

    const nama = (pembeliData.nama || '').trim();
    const email = (pembeliData.email || '').trim();

    if (!nama || nama.length > 60) {
      throw new Error('Nama pembeli wajib diisi (1 sampai 60 karakter).');
    }

    if (!email.includes('@') || email.length > 80) {
      throw new Error('Email harus mengandung tanda @ dan maksimal 80 karakter.');
    }

    const updated = {
      ...pembeliList[index],
      nama: nama,
      email: email
    };

    pembeliList[index] = updated;
    savePembeli(pembeliList);
    return updated;
  },

  async deletePembeli(noWhatsapp) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const pembeliList = getStoredPembeli();
    const filtered = pembeliList.filter((p) => p.no_whatsapp !== noWhatsapp);
    savePembeli(filtered);
    return true;
  }
};
