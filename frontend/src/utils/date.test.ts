import { isoDateToDDMMYYYY } from "./date";

describe("isoDateToDDMMYYYY", () => {
  it("convierte una fecha yyyy-mm-dd a DD-MM-YYYY", () => {
    expect(isoDateToDDMMYYYY("2026-06-15")).toBe("15-06-2026");
  });

  it("preserva ceros a la izquierda en día y mes", () => {
    expect(isoDateToDDMMYYYY("2026-01-05")).toBe("05-01-2026");
  });
});
