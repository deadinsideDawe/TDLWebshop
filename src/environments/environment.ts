// Fejlesztoi kornyezeti valtozok.
// Itt tartjuk az admin email listat, keszlet warning kuszobot es Firebase configot.
export const environment = {
  production: false,
  aiAssistantEndpoint: 'http://127.0.0.1:5001/tdlwebshop/europe-west1/aiAssistant',
  invoiceIssuer: {
    name: 'TDL Webshop',
    address: '1111 Budapest, Minta utca 10.',
    taxNumber: '12345678-2-42'
  },
  adminEmails: [
    'admin@tdlwebshop.hu',
    'teszt@tdlwebshop.hu'
  ],
  lowStockThreshold: 3,
  firebase: {
    apiKey: 'AIzaSyDTaX-8EoWilze8NGy3y7NjeVsJM2vzUJQ',
    authDomain: 'tdlwebshop.firebaseapp.com',
    projectId: 'tdlwebshop',
    storageBucket: 'tdlwebshop.firebasestorage.app',
    messagingSenderId: '439314513167',
    appId: '1:439314513167:web:7b43e61eb213a3b49e527a',
    measurementId: 'G-C9XHXX7N80'
  }
};
