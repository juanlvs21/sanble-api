import dayjs from "dayjs";

import { IStand } from "../interfaces/IStand";

export const standDataFormat = (stand: IStand): IStand => {
  const ownerRefPath = stand.owner.path;

  const standReturn = {
    ...stand,
    creationTime: dayjs(
      (stand.creationTimestamp?.seconds || 0) * 1000
    ).format(),
    owner: {
      path: ownerRefPath,
      id: ownerRefPath.replace("users/", ""),
    },
    fairsParticipates: stand.fairsParticipates.map((fair) => {
      const fairRefPath = fair.ref.path;
      return {
        ...fair,
        ref: {
          path: fairRefPath,
          id: fairRefPath.replace("fairs/", ""),
        },
      };
    }),
  };

  delete standReturn.creationTimestamp;

  return { ...standReturn };
};
