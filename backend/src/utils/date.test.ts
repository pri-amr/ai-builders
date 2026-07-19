import { parseDDMMYYYY, formatDDMMYYYY } from "./date";

describe("parseDDMMYYYY", () => {
  it("parsea una fecha válida en formato DD-MM-YYYY", () => {
    const date = parseDDMMYYYY("15-06-2026");

    expect(date).not.toBeNull();
    expect(date?.getUTCFullYear()).toBe(2026);
    expect(date?.getUTCMonth()).toBe(5);
    expect(date?.getUTCDate()).toBe(15);
  });

  it("devuelve null si el formato no coincide", () => {
    expect(parseDDMMYYYY("2026-06-15")).toBeNull();
    expect(parseDDMMYYYY("15/06/2026")).toBeNull();
    expect(parseDDMMYYYY("no-es-fecha")).toBeNull();
  });

  it("devuelve null si la fecha no existe en el calendario", () => {
    expect(parseDDMMYYYY("31-02-2026")).toBeNull();
    expect(parseDDMMYYYY("32-01-2026")).toBeNull();
    expect(parseDDMMYYYY("15-13-2026")).toBeNull();
  });
});

describe("formatDDMMYYYY", () => {
  it("formatea una fecha a DD-MM-YYYY con ceros a la izquierda", () => {
    const date = new Date(Date.UTC(2026, 0, 5));

    expect(formatDDMMYYYY(date)).toBe("05-01-2026");
  });
});
