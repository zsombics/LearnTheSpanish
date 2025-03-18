import { parseCSV } from './components/Levels/Level1';

describe('parseCSV függvény tesztelése', () => {
  test('Helyesen bontja fel a CSV szöveget sorokra és mezőkre több sor esetén', () => {
    const csvData = `wave,la ola,hullám
breakfast,el desayuno,reggeli
morning,la mañana,reggel`;
    
    const expected = [
      { english: "wave",      spanish: "la ola",      hungarian: "hullám" },
      { english: "breakfast", spanish: "el desayuno", hungarian: "reggeli" },
      { english: "morning",   spanish: "la mañana",   hungarian: "reggel" }
    ];
    
    const result = parseCSV(csvData);
    expect(result).toEqual(expected);
  });

  test('Eltávolítja a felesleges szóközöket a CSV sorokban', () => {
    const csvData = "  apple ,  manzana ,  alma  \n  banana ,  plátano ,  banán ";
    
    const expected = [
      { english: "apple",  spanish: "manzana", hungarian: "alma" },
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

  test('A teljes, hosszú CSV tartalom helyes feldolgozása', () => {
    const csvData = `wave,la ola,hullám
breakfast,el desayuno,reggeli
morning,la mañana,reggel
abortion,el aborto,abortusz
narrow | tight,estrech@,szűk
greedy,deseos@,mohó
subject,el tema,téma
time,el tiempo,idő
early,tempran@,korai
magazine,la revista,folyóirat
timetable,el horario,órarend
intention,la intención,szándék
always,siempre,mindig
genuine,genuin@,eredeti
brain,el cerebro,agy
to drive,conducir,vezetni
to pass,adelantar,előzni
to shave,afeitarse,borotválkozni
driver,el chófer,sofőr
entertainment,el entretenemiento,szorakozás
to think,pensar,gondolni
thought,el pensamiento,gondolat
driving licence,el carnet de conducir,jogosítvány
acute,agud@,akut
down,abajo,alul
naked,desnud@,meztelen
discount,el descuento,árengedmény
to begin 1,comenzar,elkezdeni 1
to begin 2,empezar,elkezdeni 2`;
    
    const expected = [
      { english: "wave",              spanish: "la ola",               hungarian: "hullám" },
      { english: "breakfast",         spanish: "el desayuno",          hungarian: "reggeli" },
      { english: "morning",           spanish: "la mañana",            hungarian: "reggel" },
      { english: "abortion",          spanish: "el aborto",            hungarian: "abortusz" },
      { english: "narrow | tight",    spanish: "estrech@",             hungarian: "szűk" },
      { english: "greedy",            spanish: "deseos@",              hungarian: "mohó" },
      { english: "subject",           spanish: "el tema",              hungarian: "téma" },
      { english: "time",              spanish: "el tiempo",            hungarian: "idő" },
      { english: "early",             spanish: "tempran@",             hungarian: "korai" },
      { english: "magazine",          spanish: "la revista",           hungarian: "folyóirat" },
      { english: "timetable",         spanish: "el horario",           hungarian: "órarend" },
      { english: "intention",         spanish: "la intención",         hungarian: "szándék" },
      { english: "always",            spanish: "siempre",              hungarian: "mindig" },
      { english: "genuine",           spanish: "genuin@",              hungarian: "eredeti" },
      { english: "brain",             spanish: "el cerebro",           hungarian: "agy" },
      { english: "to drive",          spanish: "conducir",             hungarian: "vezetni" },
      { english: "to pass",           spanish: "adelantar",            hungarian: "előzni" },
      { english: "to shave",          spanish: "afeitarse",            hungarian: "borotválkozni" },
      { english: "driver",            spanish: "el chófer",            hungarian: "sofőr" },
      { english: "entertainment",     spanish: "el entretenemiento",   hungarian: "szorakozás" },
      { english: "to think",          spanish: "pensar",               hungarian: "gondolni" },
      { english: "thought",           spanish: "el pensamiento",       hungarian: "gondolat" },
      { english: "driving licence",   spanish: "el carnet de conducir", hungarian: "jogosítvány" },
      { english: "acute",             spanish: "agud@",               hungarian: "akut" },
      { english: "down",              spanish: "abajo",               hungarian: "alul" },
      { english: "naked",             spanish: "desnud@",             hungarian: "meztelen" },
      { english: "discount",          spanish: "el descuento",         hungarian: "árengedmény" },
      { english: "to begin 1",        spanish: "comenzar",            hungarian: "elkezdeni 1" },
      { english: "to begin 2",        spanish: "empezar",             hungarian: "elkezdeni 2" }
    ];
    
    const result = parseCSV(csvData);
    expect(result).toEqual(expected);
  });
});
