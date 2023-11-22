import { validateCpf } from "../src/CpfValidator";

test.each(["06544656143", "71428793860", "87748248800"])(
  "Deve testar cpfs válidos",
  function (cpf: string) {
    expect(validateCpf(cpf)).toBe(true);
  }
);

test.each(["", undefined, null, "111", "11111111111111", "11111111111"])(
  "Deve testar cpfs inválidos",
  function (cpf: any) {
    expect(validateCpf(cpf)).toBe(false);
  }
);
