export const chooseRegion = (address: string | null) => {
  const region = address?.split(" ");
  const regionDo = region?.[0];
  const regionSi = region?.[1];
  const studyRegion = `${regionDo} ${regionSi}`;

  if (!regionDo || !regionSi) {
    return null;
  } else {
    return studyRegion;
  }
};
