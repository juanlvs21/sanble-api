import { INotificationToken } from "../interfaces/INotification";
import { db } from "../utils/firebase";

export class NotificationService {
  static async saveToken(uid: string, body: INotificationToken) {
    await db
      .collection("notification_tokens")
      .doc(uid)
      .set(body, { merge: true });
  }
}
