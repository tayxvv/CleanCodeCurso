import crypto from "crypto";
import pgp from "pg-promise";
import AccountDAO from "./AccountDAODatabase";

export function validateCpf(cpf: string) {
  if (!cpf) return false;
  cpf = clean(cpf);
  if (isInvalidLength(cpf)) return false;
  if (allDigitsAreTheSame(cpf)) return false;
  const dg1 = calculateDigit(cpf, 10);
  const dg2 = calculateDigit(cpf, 11);
  return extractCheckDigit(cpf) == `${dg1}${dg2}`;
}

export function clean(cpf: string) {
  return cpf.replace(/\D/g, "");
}

export function isInvalidLength(cpf: string) {
  return cpf.length !== 11;
}

export function allDigitsAreTheSame(cpf: string) {
  return cpf.split("").every((c) => c === cpf[0]);
}

export function calculateDigit(cpf: string, factor: number) {
  let total = 0;
  for (const digit of cpf) {
    if (factor > 1) total += parseInt(digit) * factor--;
  }

  const rest = total % 11;
  return rest < 0 ? 0 : 11 - rest;
}

export function extractCheckDigit(cpf: string) {
  return cpf.slice(9);
}
