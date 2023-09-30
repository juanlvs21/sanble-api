import {
  ENotificationType,
  INotificationToken,
} from "../interfaces/INotification";
import { Message, MulticastMessage, db, messaging } from "./firebase";

type TSendNotification = {
  title: string;
  body: string;
  uid?: string;
  imageUrl?: string | null;
  data?: {
    type: ENotificationType;
    [key: string]: any;
  };
};

export const sendNotification = async ({
  title,
  body,
  uid,
  imageUrl,
}: TSendNotification) => {
  if (uid) {
    const doc = await db.collection("notification_tokens").doc(uid).get();

    if (doc.exists) {
      const { token } = doc.data() as INotificationToken;

      const message: Message = {
        notification: {
          title,
          body,
          imageUrl: imageUrl ?? undefined,
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

    if (tokens.length) {
      const message: MulticastMessage = {
        notification: {
          title,
          body,
          imageUrl: imageUrl ?? undefined,
        },
        tokens,
        android: {
          notification: {
            clickAction: "news_intent",
          },
        },
        apns: {
          payload: {
            aps: {
              category: "INVITE_CATEGORY",
            },
          },
        },
      };

      await messaging.sendMulticast(message);
    }
  }
};
