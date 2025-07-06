const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const { PDFDocument, rgb } = require("pdf-lib");
const fontkit = require("@pdf-lib/fontkit");

const app = express();
const PORT = 3000;

app.use(express.static(__dirname));
//app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

app.post("/generate-pdf", async (req, res) => {
  try {
    const {
      vairuotojas,
      automobilis,
      odometroPradzia,
      odometroPabaiga,
      likutisAnkstesnis,
      kuroIsigyta,
      sunaudojimoNorma,
      lentele
    } = req.body;

    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);
    const fontBytes = fs.readFileSync(path.join(__dirname, "fonts", "DejaVuSans.ttf"));
    const font = await pdfDoc.embedFont(fontBytes);
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const fontSize = 10;
    let y = height - 50;

    const visoKm = odometroPabaiga - odometroPradzia;
    const norma = sunaudojimoNorma || 12;
    const lapoNr = Date.now();

    function drawText(text, x, y, size = fontSize) {
      page.drawText(text, { x, y, size, font, color: rgb(0, 0, 0) });
    }

    const menesiai = [
      "sausio", "vasario", "kovo", "balandžio", "gegužės", "birželio",
      "liepos", "rugpjūčio", "rugsėjo", "spalio", "lapkričio", "gruodžio"
    ];
    const dabar = new Date();
    const menuo = menesiai[dabar.getMonth()];
    const metai = dabar.getFullYear();
    const suformatuotaData = `${metai} m. ${menuo} mėn.`;

    drawText(`KELIONĖS LAPAS NR.: ${lapoNr}`, 50, y); y -= 15;
    drawText(`Data: ${suformatuotaData}`, 50, y); y -= 15;
    drawText(`Automobilis: ${automobilis}`, 50, y); y -= 15;
    drawText(`Kuro rūšis: Dyzelinas`, 50, y); y -= 15;
    drawText(`Spidometro pradžia (km): ${odometroPradzia}`, 50, y); y -= 15;
    drawText(`Spidometro pabaiga (km): ${odometroPabaiga}`, 50, y); y -= 15;
    drawText(`Viso km: ${visoKm.toFixed(1)}`, 50, y); y -= 25;

    drawText("Nr.", 50, y);
    drawText("Data", 80, y);
    drawText("Maršrutas", 140, y);
    drawText("Išv.", 300, y);
    drawText("Grįž.", 340, y);
    drawText("km", 390, y);
    drawText("Tikslas", 420, y);
    y -= 15;

    let sunaudota = 0;
    lentele.forEach((kel, i) => {
      drawText(String(i + 1), 50, y);
      drawText(kel.data || "", 70, y);
      drawText(kel.marsrutas || "", 140, y);
      drawText(kel.isvaziavimoLaikas || "", 300, y);
      drawText(kel.grizimoLaikas || "", 340, y);
      drawText(String(kel.km || 0), 390, y);
      drawText(kel.tikslas || "", 420, y);
      y -= 15;

      sunaudota += ((kel.km || 0) * norma) / 100;
    });

    y -= 15;
    drawText(`Kuro sunaudojimo norma, l/100 km: ${norma}`, 50, y); y -= 15;
    drawText(`Įsigyta pagal kortelę: ${kuroIsigyta}`, 50, y); y -= 15;
    drawText(`Sunaudota pagal normą: ${sunaudota.toFixed(2)}`, 50, y); y -= 15;
    drawText(`Kuro likutis nuo praeito mėnesio: ${likutisAnkstesnis}`, 50, y); y -= 15;

    const galutinis = (kuroIsigyta || 0) + (likutisAnkstesnis || 0) - sunaudota;
    drawText(`Kuro likutis: ${galutinis.toFixed(2)}`, 50, y); y -= 30;
    drawText(`Vairuotojas: ${vairuotojas || 'Nenurodytas'}`, 50, y);

    const pdfBytes = await pdfDoc.save();
    const filename = `keliones_lapas_${Date.now()}.pdf`;
    const folderPath = path.join(__dirname, "keliones_lapai");
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);
    const filepath = path.join(folderPath, filename);
    fs.writeFileSync(filepath, pdfBytes);

    res.json({ success: true, filename });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Serveris veikia: http://localhost:${PORT}`);
});
