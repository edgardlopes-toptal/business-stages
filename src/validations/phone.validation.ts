export function isPhoneValid(phone: string): boolean {
    const phoneRegex = /^\+\d{1,3}\s?\(?([2-9][0-9]{2})\)?[\s.-]?([2-9][0-9]{2})[\s.-]?([0-9]{4})$/;
    return phoneRegex.test(phone)
}