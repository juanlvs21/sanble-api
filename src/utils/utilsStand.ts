import dayjs from "dayjs";

import { IStand } from "../interfaces/IStand";

export const standDataFormat = (stand: IStand): IStand => {
  let coverUrl = undefined;

  const photographs = stand.photographs.map((photo) => {
    const creationTime = dayjs(
      (photo.creationTimestamp?.seconds || 0) * 1000
    ).format();

    if (photo.isCover) coverUrl = photo.url;

    delete photo.creationTimestamp;

    return { ...photo, creationTime };
  });

  const fairs = stand.fairs.map((ref) => ({
    id: ref.path.replace("fairs/", ""),
    path: ref.path,
  }));

  const standReturn = {
    ...stand,
    fairs,
    coverUrl,
    photographs,
    creationTime: dayjs(
      (stand.creationTimestamp?.seconds || 0) * 1000
    ).format(),
  };

  delete standReturn.creationTimestamp;

  return standReturn;
};
