import { INotificationToken } from "../interfaces/INotification";
import { db } from "../utils/firebase";

export class NotificationService {
  static async saveToken(uid: string, body: INotificationToken) {
    const { deviceID, token } = body;

    await db
      .collection("notification_tokens")
      .doc(deviceID)
      .set({ uid: db.doc(`users/${uid}`), deviceID, token }, { merge: true });
  }
}
