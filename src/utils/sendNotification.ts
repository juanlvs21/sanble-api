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
  data,
}: TSendNotification) => {
  const tokens: string[] = [];
  let snapshots: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>;

  if (uid) {
    snapshots = await db
      .collection("notification_tokens")
      .where("uid", "==", db.doc(`users/${uid}`))
      .get();
  } else {
    snapshots = await db.collection("notification_tokens").get();
  }

  if (!snapshots.empty) {
    snapshots.forEach(async (doc) => {
      let { token } = doc.data() as INotificationToken;
      tokens.push(token);
    });
  }

  if (tokens.length) {
    const message: MulticastMessage = {
      notification: {
        title,
        body,
        imageUrl: imageUrl ?? undefined,
      },
      tokens,
      data,
    };

    await messaging.sendMulticast(message);
  }
};
