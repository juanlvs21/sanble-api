import { initializeApp, ServiceAccount, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

import {
  FIREBASE_PROJECT_ID,
  FIREBASE_PRIVATE_KEY,
  FIREBASE_CLIENT_EMAIL,
} from "@/config/env";

const serviceAccount: ServiceAccount = {
  projectId: FIREBASE_PROJECT_ID,
  clientEmail: FIREBASE_CLIENT_EMAIL,
  privateKey: FIREBASE_PRIVATE_KEY,
};

export const app = initializeApp({
  credential: cert(serviceAccount),
});

export const db = getFirestore(app);
export const auth = getAuth(app);
