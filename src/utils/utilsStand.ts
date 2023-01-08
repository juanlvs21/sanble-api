import dayjs from "dayjs";

import { IStand } from "../interfaces/IStand";

export const standDataFormat = (stand: IStand): IStand => {
  const ownerRefPath = stand.owner.path;

  const fairs = stand.fairs.map((ref) => ({
    id: ref.path.replace("fairs/", ""),
    path: ref.path,
  }));

  const standReturn = {
    ...stand,
    fairs,
    creationTime: dayjs(
      (stand.creationTimestamp?.seconds || 0) * 1000
    ).format(),
    owner: {
      path: ownerRefPath,
      id: ownerRefPath.replace("users/", ""),
    },
  };

  delete standReturn.creationTimestamp;

  return { ...standReturn };
};
