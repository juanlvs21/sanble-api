import { initializeApp, ServiceAccount, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

import serviceAccountJSON from "../../firebase-adminsdk.json";

const serviceAccount: ServiceAccount = {
  projectId: serviceAccountJSON.project_id,
  clientEmail: serviceAccountJSON.client_email,
  privateKey: serviceAccountJSON.private_key,
};

export const app = initializeApp({
  credential: cert(serviceAccount),
});

export const db = getFirestore(app);
export const auth = getAuth(app);
