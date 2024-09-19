import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth'
import { provideStorage, getStorage } from '@angular/fire/storage'
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD5vVm920PFSTHDesemy5_0syaoBhUzyCA",
  authDomain: "cuidasaude-2cffc.firebaseapp.com",
  databaseURL: "https://cuidasaude-2cffc-default-rtdb.firebaseio.com",
  projectId: "cuidasaude-2cffc",
  storageBucket: "cuidasaude-2cffc.appspot.com",
  messagingSenderId: "81754510079",
  appId: "1:81754510079:web:1c3112deb3b8c12b07f2ca"
};

export const appConfig: ApplicationConfig = {

  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(),
    provideAnimationsAsync(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())
  ]
};
