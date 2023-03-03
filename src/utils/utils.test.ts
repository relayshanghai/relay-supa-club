import { numFormatter } from "./utils";

describe("numformatter", () => {
    it("should return '-' if zero or NaN", () => {
        expect(numFormatter(0)).toBe("-")
        expect(numFormatter(NaN)).toBe("-")
    })
    it("should return string", () => {
        expect(typeof numFormatter(1)).toBe("string")
    })

    it("should return format to 'billions'", () => {
        expect(numFormatter(1000000000)).toBe("1.0B")
        expect(numFormatter(1010000000)).toBe("1.0B")
        expect(numFormatter(1100000000)).toBe("1.1B")
        expect(numFormatter(999900000000)).toBe("999.9B")
        // expect(numFormatter(999990000000)).toBe("999.9B")
    })

    it("should return format to 'millions' ", () => {
        expect(numFormatter(1000000)).toBe("1.0M")
        expect(numFormatter(1010000)).toBe("1.0M")
        expect(numFormatter(1100000)).toBe("1.1M")
        expect(numFormatter(999900000)).toBe("999.9M")
        // expect(numFormatter(999990000)).toBe("999.9M")
    })

    it("should return format to 'thousands' ", () => {
        expect(numFormatter(1000)).toBe("1.0K")
        expect(numFormatter(1010)).toBe("1.0K")
        expect(numFormatter(1100)).toBe("1.1K")
        expect(numFormatter(999900)).toBe("999.9K")
        // expect(numFormatter(999990)).toBe("999.9K")
    })

    it("should return to negative", () => {
        expect(numFormatter(-1)).toBe("-1")
        expect(numFormatter(-1000000000)).toBe("-1000000000")
        expect(numFormatter(-Infinity)).toBe("-Infinity")
    })

    it("can handle e-notations", () => {
        expect(numFormatter(1.23e+20)).toBe("123000000000.0B")
        expect(numFormatter(1.23e-10)).toBe("1.23e-10")
    })
})
