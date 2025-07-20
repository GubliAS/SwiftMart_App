import { PhoneNumberUtil, PhoneNumberFormat } from "google-libphonenumber";
import cardValidator from "card-validator";
import { format as formatDateFns, isValid as isValidDateFns, parse as parseDateFns } from "date-fns";

const phoneUtil = PhoneNumberUtil.getInstance();

export function formatPhoneNumber(text: string, countryCode: string = "GH") {
  try {
    const phoneNumber = phoneUtil.parse(text, countryCode);
    return phoneUtil.format(phoneNumber, PhoneNumberFormat.INTERNATIONAL);
  } catch {
    return text;
  }
}

export function validatePhoneNumber(text: string, countryCode: string = "GH") {
  try {
    const phoneNumber = phoneUtil.parse(text, countryCode);
    return phoneUtil.isValidNumber(phoneNumber);
  } catch {
    return false;
  }
}

export function formatCardNumber(text: string) {
  const digits = text.replace(/\D/g, "");
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

export function validateCardNumber(text: string) {
  return cardValidator.number(text).isValid;
}

export function formatDate(date: Date, locale: string = "en-US", formatStr: string = "PP") {
  return formatDateFns(date, formatStr, { locale: undefined }); // Optionally pass locale object
}

export function validateDate(dateStr: string, formatStr: string = "yyyy-MM-dd") {
  const parsed = parseDateFns(dateStr, formatStr, new Date());
  return isValidDateFns(parsed);
} 