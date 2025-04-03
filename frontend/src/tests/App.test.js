import { parseCSV } from '../components/Levels/Level1';

describe('parseCSV függvény tesztelése', () => {
  test('Helyesen bontja fel a CSV szöveget sorokra és mezőkre több sor esetén', () => {
    const csvData = `wave,la ola,hullám
breakfast,el desayuno,reggeli
morning,la mañana,reggel`;

    const expected = [
      { english: "wave", spanish: "la ola", hungarian: "hullám" },
      { english: "breakfast", spanish: "el desayuno", hungarian: "reggeli" },
      { english: "morning", spanish: "la mañana", hungarian: "reggel" }
    ];

    const result = parseCSV(csvData);
    expect(result).toEqual(expected);
  });

  test('Eltávolítja a felesleges szóközöket a CSV sorokban', () => {
    const csvData = "  apple ,  manzana ,  alma  \n  banana ,  plátano ,  banán ";

    const expected = [
      { english: "apple", spanish: "manzana", hungarian: "alma" },
      { english: "banana", spanish: "plátano", hungarian: "banán" }
    ];

    const result = parseCSV(csvData);
    expect(result).toEqual(expected);
  });

  test('Üres bemenetre üres tömböt ad vissza', () => {
    const csvData = "";
    const expected = [];
    const result = parseCSV(csvData);
    expect(result).toEqual(expected);
  });

  test('Helyesen kezeli a CSV-t, ha van extra új sor a végén', () => {
    const csvData = "cat,gato,macska\ndog,perro,kutya\n";
    const expected = [
      { english: "cat", spanish: "gato", hungarian: "macska" },
      { english: "dog", spanish: "perro", hungarian: "kutya" }
    ];
    const result = parseCSV(csvData);
    expect(result).toEqual(expected);
  });

  test('Hiányzó mezők esetén a hiányzó érték undefined lesz', () => {
    const csvData = "hello,hola\nworld,mundo,világ";
    const expected = [
      { english: "hello", spanish: "hola", hungarian: undefined },
      { english: "world", spanish: "mundo", hungarian: "világ" }
    ];
    const result = parseCSV(csvData);
    expect(result).toEqual(expected);
  });

});
