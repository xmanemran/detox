import _ from "lodash";

export function capitalizeFirstLetter(s: string): string {
  if (_.isEmpty(s)) {
    return "";
  }

  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function lowerCamelCaseJoin(array: string[]): string {
  if (_.isEmpty(array)) {
    return "";
  }

  let retVal = array[0];
  for (let i = 1; i < array.length; i++) {
      retVal += capitalizeFirstLetter(array[i]);
  }

  return retVal;
}
