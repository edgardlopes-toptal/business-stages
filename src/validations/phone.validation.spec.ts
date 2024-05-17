import { isPhoneValid } from "./phone.validation";

describe('phone.validation', () => {
    const testCases = [
        {phone: '+1 123-456-7890', isValid: false },   
        {phone: '+1 223-456-7890', isValid: true },   
        {phone: '+1 (223) 456-7890', isValid: true }, 
        {phone: '+1 223.456.7890', isValid: true },   
        {phone: '+1 2234567890', isValid: true },     
        {phone: '+44 123 456 7890', isValid: false },  
        {phone: '+91 123-456-7890', isValid: false },  
        {phone: '+91 (223) 456-7890', isValid: true },
        {phone: '+1 1234567890', isValid: false },     
        {phone: '+91 223 456 7890', isValid: true },  
        {phone: '+44 (223) 456-7890', isValid: true },
        {phone: '+123 223-456-7890', isValid: true}
    ];

    testCases.forEach(testCase => it(`${testCase.phone} should be ${testCase.isValid ? 'valid' : 'invalid'}`, () => {
        const isValid = isPhoneValid(testCase.phone);
        expect(isValid).toEqual(testCase.isValid);
    }))
})