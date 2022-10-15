import dayjs from "dayjs";

import { IFair } from "../interfaces/IFair";
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
    creationTime: dayjs((fair.creationTimestamp?.seconds || 0) * 1000).format(),
    celebrationDate: fair.celebrationDate
      ? dayjs(fair.celebrationDate).format()
      : "",
  };

  delete fairReturn.creationTimestamp;

  return { ...fairReturn, photographs };
};

// export const getFairCover = (photographs: any[]): string => {
//     const cover = photographs.find((photo) => photo.isCover);

//     return cover
//       ? cover.photoUrl
//       : "https://ik.imagekit.io/sanble/no-image_LHuW5V1nj.png";
//   };

// {
//     "name": "Adoramos la Pasta",
//     "owner": "users/DyuKEAwA1ldTUlXFUvJc5LSMmrn1",
//     "contactEmail": "pasta@prueba.com",
//     "stars": 4,
//     "creationTime": {
//         "_seconds": 1664995583,
//         "_nanoseconds": 543000000
//     },
//     "id": "18bbca23-1429-464b-afa5-214ac5adaafe",
//     "description": "Para nosotros la pasta es lo mejor que existe, y por eso hemos decidido hacer una feria en su honor para apreciarla y admirarla. Tenemos disponibles productos fabricados a base de pasta de todo tipo",
//     "type": "entrepreneurship",
//     "address": "El Poblado, Porlamar 6301, Nueva Esparta",
//     "geopoint": [
//         10.9655553,
//         -63.8608029
//     ],
//     "photographs": [
//         {
//             "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua.",
//             "isCover": true,
//             "url": "https://ik.imagekit.io/sanble/41e6fc11-f202-4bc4-915b-37fc33ee6455_D5kGBvJhVp.jpg?ik-sdk-version=javascript-1.4.3&updatedAt=1647797855140",
//             "id": "727f4d79-35e3-44ec-89f4-2c36e7245452",
//             "creationTime": {
//                 "_seconds": 1665764531,
//                 "_nanoseconds": 300000000
//             }
//         }
//     ],
//     "contactPhone": "02951234567"
