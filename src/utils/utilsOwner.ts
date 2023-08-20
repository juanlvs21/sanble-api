import { getAuth } from "firebase-admin/auth";
import { DocumentReference } from "firebase-admin/firestore";

import { IUserOwnerData } from "../interfaces/IUser";

export const getOwnerUserData = async (
  ownerRef: DocumentReference
): Promise<IUserOwnerData> => {
  try {
    const userRecord = await getAuth().getUser(ownerRef.id);

    return {
      uid: userRecord.uid,
      email: userRecord.email ?? "",
      displayName: userRecord.displayName ?? "",
      photoURL: userRecord?.photoURL,
    };
  } catch (error) {
    console.error({ error });
    throw "Usuario no existe";
  }
};
