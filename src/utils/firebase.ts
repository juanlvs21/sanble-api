import { initializeApp, ServiceAccount, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
export * from "firebase-admin/auth";
export * from "firebase-admin/firestore";

import {
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
  FIREBASE_PROJECT_ID,
} from "../config/env";

const serviceAccount: ServiceAccount = {
  projectId: FIREBASE_PROJECT_ID,
  privateKey: FIREBASE_PRIVATE_KEY,
  clientEmail: FIREBASE_CLIENT_EMAIL,
};

export const app = initializeApp({
  credential: cert(serviceAccount),
});

export const db = getFirestore(app);
export const auth = getAuth(app);
