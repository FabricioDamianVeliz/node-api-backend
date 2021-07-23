const {palindrome} = require('../utils/for_testing');

test.skip('Palindrome of fabricio', () => {

    const result = palindrome('fabricio');

    expect(result).toBe('oicirbaf');
})

test.skip('Palindrome of empty string', () => {

    const result = palindrome('');

    expect(result).toBe('');
});

test.skip('Palindrome of undefined', () => {

    const result = palindrome();

    expect(result).toBeUndefined();
})