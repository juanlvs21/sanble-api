import { initializeApp, ServiceAccount, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

import firebaseCredentials from "../../firebase-adminsdk.json";

const serviceAccount: ServiceAccount = {
  projectId: firebaseCredentials.project_id,
  clientEmail: firebaseCredentials.client_email,
  privateKey: firebaseCredentials.private_key,
};

export const app = initializeApp({
  credential: cert(serviceAccount),
});

export const db = getFirestore(app);
export const auth = getAuth(app);
