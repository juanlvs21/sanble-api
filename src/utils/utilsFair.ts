import dayjs from "dayjs";

import { IFair, IFairGeo } from "../interfaces/IFair";
import { defaultImage } from "./defaultImage";

export const fairDataFormat = (fair: IFair): IFair => {
  let coverUrl = defaultImage;

  const photographs = fair.photographs.map((photo) => {
    const creationTime = dayjs(
      (photo.creationTimestamp?.seconds || 0) * 1000
    ).format();

    if (photo.isCover) coverUrl = photo.url;

    delete photo.creationTimestamp;

    return { ...photo, creationTime };
  });

  const fairReturn = {
    ...fair,
    coverUrl,
    creationTime: dayjs((fair.creationTimestamp?.seconds || 0) * 1000).format(),
    celebrationDate: fair.celebrationDate
      ? dayjs(fair.celebrationDate).format()
      : "",
  };

  delete fairReturn.creationTimestamp;

  return { ...fairReturn, photographs };
};

export const fairDataFormatGeo = (fair: IFairGeo): IFairGeo => ({
  id: fair.id,
  name: fair.name,
  geopoint: fair.geopoint,
  stars: fair.stars,
  type: fair.type,
});
