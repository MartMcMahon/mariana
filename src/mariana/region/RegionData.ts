// Maps the file name to the file contents because weird bundler stuff
const regionCSVs = new Map([
  [
    "test.csv",
    require("fs").readFileSync("resources/regions/test.csv", "utf8"),
  ],
  [
    "tes2.csv",
    require("fs").readFileSync("resources/regions/tes2.csv", "utf8"),
  ],
  [
    "test3.csv",
    require("fs").readFileSync("resources/regions/test3.csv", "utf8"),
  ],
  [
    "test4.csv",
    require("fs").readFileSync("resources/regions/test4.csv", "utf8"),
  ],
]);

type CSVData = any;

export function getRegionCSV(csvName: string): CSVData {
  const data = regionCSVs.get(csvName);
  if (!data) {
    throw new Error(`Unknown csvName: ${csvName}`);
  }
  return data;
}
