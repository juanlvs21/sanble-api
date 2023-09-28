import { INotificationToken } from "../interfaces/INotification";
import { Message, MulticastMessage, db, messaging } from "./firebase";

type TSendNotification = {
  title: string;
  body: string;
  uid?: string;
  notificationIconUrl?: string;
};

const NOTIFICATION_ICON_URL = "https://ik.imagekit.io/juanldev/logo.png";

export const sendNotification = async ({
  title,
  body,
  uid,
  notificationIconUrl = NOTIFICATION_ICON_URL,
}: TSendNotification) => {
  if (uid) {
    const doc = await db.collection("notification_tokens").doc(uid).get();

    if (doc.exists) {
      const { token } = doc.data() as INotificationToken;

      const message: Message = {
        notification: {
          title,
          body,
          imageUrl: notificationIconUrl,
        },
        token,
      };

      await messaging.send(message);
    }
  } else {
    const tokens: string[] = [];
    const snapshots = await db.collection("notification_tokens").get();

    snapshots.forEach(async (doc) => {
      let { token } = doc.data() as INotificationToken;
      tokens.push(token);
    });

    const message: MulticastMessage = {
      notification: {
        title,
        body,
        imageUrl: notificationIconUrl,
      },
      tokens,
    };

    await messaging.sendMulticast(message);
  }
};
