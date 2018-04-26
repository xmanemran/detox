import { CustomError } from "./CustomError";

describe(CustomError.name, () => {
  it(`new CustomError should be defined`, () => {
    expect(new CustomError()).toBeDefined();
  });
});
