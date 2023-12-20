import Cpf from "../src/domain/Cpf";

test.each(["06544656143"])("Deve testar cpfs válidos", function (cpf: string) {
  expect(new Cpf(cpf)).toBeDefined();
});

test.each(["", undefined, null, "111", "11111111111111", "11111111111"])(
  "Deve testar cpfs inválidos",
  function (cpf: any) {
    expect(() => new Cpf(cpf)).toThrow(new Error("Invalid CPF."));
  }
);
