import dayjs from "dayjs";

import { IFair, IFairGeo } from "../interfaces/IFair";

export const fairDataFormat = (fair: IFair): IFair => {
  let coverUrl = undefined;

  const ownerRefPath = fair.owner.path;

  const photographs = fair.photographs.map((photo) => {
    const creationTime = dayjs(
      (photo.creationTimestamp?.seconds || 0) * 1000
    ).format();

    if (photo.isCover) coverUrl = photo.url;

    delete photo.creationTimestamp;

    return { ...photo, creationTime };
  });

  const stands = fair.stands.map((ref) => ({
    id: ref.path.replace("stands/", ""),
    path: ref.path,
  }));

  const fairReturn = {
    ...fair,
    coverUrl,
    stands,
    photographs,
    owner: {
      path: ownerRefPath,
      id: ownerRefPath.replace("users/", ""),
    },
    creationTime: dayjs((fair.creationTimestamp?.seconds || 0) * 1000).format(),
    celebrationDate: fair.celebrationDate
      ? dayjs(fair.celebrationDate).format()
      : "",
  };

  delete fairReturn.creationTimestamp;

  return fairReturn;
};

export const fairDataFormatGeo = (fair: IFairGeo): IFairGeo => ({
  id: fair.id,
  name: fair.name,
  geopoint: fair.geopoint,
  stars: fair.stars,
  type: fair.type,
});
