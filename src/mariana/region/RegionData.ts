// Maps the file name to the file contents because weird bundler stuff
const csvFileContents: { [filename: string]: string } = {
  "region1.csv": require("fs").readFileSync("resources/regions/region1.csv", "utf8"),
  "region2.csv": require("fs").readFileSync("resources/regions/region2.csv", "utf8"),
  "region3.csv": require("fs").readFileSync("resources/regions/region3.csv", "utf8"),
  "region4.csv": require("fs").readFileSync("resources/regions/region4.csv", "utf8"),
  "region5.csv": require("fs").readFileSync("resources/regions/region5.csv", "utf8"),
  "region6.csv": require("fs").readFileSync("resources/regions/region6.csv", "utf8"),
  "region7.csv": require("fs").readFileSync("resources/regions/region7.csv", "utf8"),
  "region8.csv": require("fs").readFileSync("resources/regions/region8.csv", "utf8"),
  "region9.csv": require("fs").readFileSync("resources/regions/region9.csv", "utf8"),
  "region10.csv": require("fs").readFileSync("resources/regions/region10.csv", "utf8"),
  "region11.csv": require("fs").readFileSync("resources/regions/region11.csv", "utf8"),
  "region12.csv": require("fs").readFileSync("resources/regions/region12.csv", "utf8"),
};

type TileType = number;
export type RegionCSVData = TileType[][];

export function getRegionCSV(filename: string): RegionCSVData {
  const fileContent = csvFileContents[filename];
  if (!fileContent) {
    throw new Error(`Unknown csv file: ${filename}`);
  }

  return fileContent.split("\n").map((line, j) => {
    return line.split(",").map((cellString, i) => {
      const tileType = parseInt(cellString);
      if (isNaN(tileType)) {
        return -1;
      } else {
        return tileType;
      }
    });
  });
}
