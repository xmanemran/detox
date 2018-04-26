import path from "path";
import {AAPT, AAPTOptions} from "../AAPT";
import jc from "../utils/test/JestErrorCaster";

const AAPT_HOME = path.join(path.relative('.', __dirname), "executables", "aapt");

describe(AAPT, () => {
    describe("constructor", () => {
        it("should throw when no args given", () => {
            const options: any = void 0;
            expect(jc.wrap(() => new AAPT(options))).toThrowErrorMatchingSnapshot();
        });

        it("should throw when aapt binary path is not specified", () => {
            expect(jc.wrap(() => new AAPT({ aaptBin: "" }))).toThrowErrorMatchingSnapshot();
        });

        it("should throw when aapt binary path does not exist", () => {
            const options: AAPTOptions = {
                aaptBin: "/tmp/unexisting_aapt_path",
            };

            expect(jc.wrap(() => new AAPT(options))).toThrowErrorMatchingSnapshot();
        });
    });

    describe("methods", () => {
        const _AAPT = AAPT.prototype;
        let aapt: AAPT;

        describe(_AAPT.readPackageNameFromAPK, () => {
            const apkPath = "path/to/file.apk";

            describe("when aapt executable works but prints non-intelligible output", () => {
                beforeEach(() => aapt = new AAPT({aaptBin: path.join(AAPT_HOME, "aapt-dumb-badging-weird")}));

                it("should throw exception with logs and debug information", async () => {
                    try {
                        await aapt.readPackageNameFromAPK(apkPath);
                    } catch (e) {
                        expect(jc.toSimpleError(e)).toMatchSnapshot();
                    }
                });
            });

            describe("when aapt executable works as expected", () => {
                beforeEach(() => aapt = new AAPT({aaptBin: path.join(AAPT_HOME, "aapt-dumb-badging-ok")}));

                it("should return package name it parses in stdout", async () => {
                    const packageName = await aapt.readPackageNameFromAPK(apkPath);
                    expect(packageName).toMatchSnapshot();
                });

                it("should throw if empty package name is given", async () => {
                    try {
                        await aapt.readPackageNameFromAPK("");
                    } catch (e) {
                        expect(jc.toSimpleError(e)).toMatchSnapshot();
                    }
                });
            });

            describe("when aapt executable exits with an error code", () => {
                beforeEach(() => aapt = new AAPT({aaptBin: path.join(AAPT_HOME, "aapt-failure")}));

                it("should throw an error with a verbose debug information", async () => {
                    try {
                        await aapt.readPackageNameFromAPK(apkPath);
                    } catch (e) {
                        expect(jc.toSimpleError(e)).toMatchSnapshot();
                    }
                });
            });
        });
    });

});
