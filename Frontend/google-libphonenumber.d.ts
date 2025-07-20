declare module "google-libphonenumber" {
  export class PhoneNumberUtil {
    static getInstance(): PhoneNumberUtil;
    parse(phoneNumber: string, regionCode: string): PhoneNumber;
    format(phoneNumber: PhoneNumber, format: PhoneNumberFormat): string;
  }

  export class PhoneNumber {}

  export enum PhoneNumberFormat {
    E164,
    INTERNATIONAL,
    NATIONAL,
    RFC3966,
  }
}
