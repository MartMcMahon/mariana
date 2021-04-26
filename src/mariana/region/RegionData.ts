// Maps the file name to the file contents because weird bundler stuff
const csvFileContents: { [filename: string]: string } = {
  "test.csv": require("fs").readFileSync("resources/regions/test.csv", "utf8"),
  "tes2.csv": require("fs").readFileSync("resources/regions/tes2.csv", "utf8"),
  "test3.csv": require("fs").readFileSync(
    "resources/regions/test3.csv",
    "utf8"
  ),
  "test4.csv": require("fs").readFileSync(
    "resources/regions/test4.csv",
    "utf8"
  ),
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
