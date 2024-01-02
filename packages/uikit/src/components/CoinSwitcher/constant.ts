const PATH = `https://cdn.pancakeswap.com/sequnce-assets/`;

export const DTOKEN2WDNERO_PATH = `${PATH}dtoken2wdnero/dtoken2wdnero-`;
export const DTOKEN2WDNERO_COUNTS = 31;

export const WDNERO2DTOKEN_PATH = `${PATH}wdnerodtoken/wdnero2dtoken-`;
export const WDNERO2DTOKEN_COUNTS = 31;

export const FILE_TYPE = `.png`;

const pathGenerator = (path: string) => (d: string, index: number) => {
  if (index < 10) return `${path}0${index}${FILE_TYPE}`;
  return `${path}${index}${FILE_TYPE}`;
};

export const dtoken2WDneroImages = () => {
  let result: string[] = new Array(DTOKEN2WDNERO_COUNTS);
  result.fill("");
  result = result.map(pathGenerator(DTOKEN2WDNERO_PATH));
  return result;
};

export const wdnero2DTokenImages = () => {
  let result: string[] = new Array(WDNERO2DTOKEN_COUNTS);
  result.fill("");
  result = result.map(pathGenerator(WDNERO2DTOKEN_PATH));
  return result;
};
