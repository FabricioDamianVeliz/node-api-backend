const {average} = require('../utils/for_testing');

describe.skip('average', () => {
    test('de un valor es el valor mismo', () => {
    
        expect(average([1])).toBe(1);
    })

    test('de muchos se calcula correctamente', () => {
    
        expect(average([1,2,3,4,5,6])).toBe(3.5);
    })

    test('de arreglo vacío es cero', () => {
    
        expect(average([])).toBe(0);
    })
})