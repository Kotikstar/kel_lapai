# Kelionės lapo generatorius

Šis projektas leidžia lengvai generuoti mėnesinius kelionių lapus PDF formatu. Sukurtas naudojant Node.js ir Bootstrap, su šiuolaikišku tamsiu dizainu, intuityvia sąsaja ir automatiniais skaičiavimais (sunaudotas kuras, likučiai ir kt.).

## Funkcionalumas

- Įvedamas automobilio spidometro pradžios ir pabaigos rodmuo.
- Įvedamas įsigytas kuro kiekis ir likutis nuo praėjusio mėnesio.
- Galima pridėti kelis maršrutus: data, atstumas, tikslas, išvykimo ir grįžimo laikas.
- Galima ištrinti nereikalingą maršrutą paspaudus „X“.
- PDF sugeneruojamas paspaudus „Generuoti PDF“.
- PDF apima automatinį kilometražo, sunaudoto kuro ir likučių skaičiavimą.
- Laikas rodomas 24 valandų formatu.
- Data PDF faile pateikiama kaip „2025 m. liepos mėn.“
- Bootstrap dark tema ir adaptuotas dizainas.

## Naudojamos technologijos

- Node.js + Express
- pdf-lib (PDF generavimui)
- SweetAlert2 (pranešimams)
- Fontkit (šriftų palaikymui PDF)
- HTML, JavaScript, CSS
