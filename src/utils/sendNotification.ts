import {
  INotificationToken,
  ISendNotification,
} from "../interfaces/INotification";
import { MulticastMessage, db, messaging } from "./firebase";

export const sendNotification = async ({
  title,
  body,
  uid,
  imageUrl,
  data,
}: ISendNotification) => {
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

    await messaging.sendEachForMulticast(message);
  }
};
