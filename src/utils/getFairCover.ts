export const getFairCover = (photographs: any[]): string => {
  const cover = photographs.find((photo) => photo.isCover);

  return cover
    ? cover.photoUrl
    : "https://ik.imagekit.io/sanble/no-image_LHuW5V1nj.png";
};
