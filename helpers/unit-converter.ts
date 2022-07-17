import BigNumber from "bignumber.js";

type Decimals =
  | "wei"
  | "kwei"
  | "mwei"
  | "gwei"
  | "szabo"
  | "finney"
  | "ether"
  | "kether"
  | "mether"
  | "gether"
  | "tether";
function parseUnit(unit: any) {
  const decimalsToUnit: any = {
    "-18": "wei",
    "-15": "kwei",
    "-12": "mwei",
    "-9": "gwei",
    "-6": "szabo",
    "-3": "finney",
    1: "ether",
    3: "kether",
    6: "mether",
    9: "gether",
    12: "tether",
  };
  if (typeof unit === "string") {
    unit = unit.trim().toLowerCase();
  }
  if (unit !== undefined && !isNaN(unit)) {
    unit = decimalsToUnit[unit];
  }
  return unit;
}

function convertToEther(value: any, unit: any) {
  if (value === undefined) {
    throw TypeError("value is required");
  }
  unit = parseUnit(unit);
  if (unit === undefined) {
    throw TypeError("unit is required");
  }

  const v = new BigNumber(value);
  if (unit === "eth") unit = "ether";

  if (unit === "wei") return v.times(new BigNumber(0.000000000000000001));
  if (unit === "kwei") return v.times(new BigNumber(0.000000000000001));
  if (unit === "mwei") return v.times(new BigNumber(0.000000000001));
  if (unit === "gwei") return v.times(new BigNumber(0.000000001));
  if (unit === "szabo") return v.times(new BigNumber(0.000001));
  if (unit === "finney") return v.times(new BigNumber(0.001));
  if (unit === "ether") return v.times(new BigNumber(1));
  if (unit === "kether") return v.times(new BigNumber(1000));
  if (unit === "mether") return v.times(new BigNumber(1000000));
  if (unit === "gether") return v.times(new BigNumber(1000000000));
  if (unit === "tether") return v.times(new BigNumber(1000000000000));

  throw TypeError("Invalid unit");
}

export function converter(value: number, unit: Decimals, toUnit?: Decimals) {
  unit = parseUnit(unit);
  toUnit = parseUnit(toUnit);
  const v = convertToEther(value, unit);

  const result: any = {
    wei: null,
    kwei: null,
    mwei: null,
    gwei: null,
    szabo: null,
    finney: null,
    ether: null,
    kether: null,
    mether: null,
    gether: null,
    tether: null,
  };

  result[unit] = new BigNumber(value).toString(10);

  if (unit !== "wei") {
    result.wei = v.times(new BigNumber(1000000000000000000)).toString(10);
  }
  if (unit !== "kwei") {
    result.kwei = v.times(new BigNumber(1000000000000000)).toString(10);
  }
  if (unit !== "mwei") {
    result.mwei = v.times(new BigNumber(1000000000000)).toString(10);
  }
  if (unit !== "gwei") {
    result.gwei = v.times(new BigNumber(1000000000)).toString(10);
  }
  if (unit !== "szabo") {
    result.szabo = v.times(new BigNumber(1000000)).toString(10);
  }
  if (unit !== "finney") {
    result.finney = v.times(new BigNumber(1000)).toString(10);
  }
  if (unit !== "ether") {
    result.ether = v.times(new BigNumber(1)).toString(10);
  }
  if (unit !== "kether") {
    result.kether = v.times(new BigNumber(0.001)).toString(10);
  }
  if (unit !== "mether") {
    result.mether = v.times(new BigNumber(0.000001)).toString(10);
  }
  if (unit !== "gether") {
    result.gether = v.times(new BigNumber(0.000000001)).toString(10);
  }
  if (unit !== "tether") {
    result.tether = v.times(new BigNumber(0.000000000001)).toString(10);
  }

  if (toUnit) {
    if (result[toUnit] === undefined) {
      throw TypeError("Invalid unit");
    }

    return result[toUnit];
  }

  return result;
}
