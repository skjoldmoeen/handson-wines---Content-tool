
// skjuler div der indeholder billederne
const imagesDiv = document.querySelector("#images");

const fileInput = document.querySelector("#upload");

fileInput.addEventListener("change", async (e) => {
  const [file] = fileInput.files;

  // fremvisning af uploadede billede
  const originalImage = document.querySelector("#originalImage");
  originalImage.src = await fileToDataUri(file);

  // tilføjer logo til det uploade billede
  // og fremviser den nye version af billedet med logo
  const watermakedImage = document.querySelector("#watermakedImage");


  originalImage.addEventListener("load", async () => {
    watermakedImage.src = await watermakImage(
      originalImage,
      "./src/img.png"
    );

  });
  // synliggører div der indeholder billeder

  imagesDiv.style.visibility = "visible";
  return false;
});

function fileToDataUri(field) {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      resolve(reader.result);
    });

    reader.readAsDataURL(field);
  });
}

async function watermakImage(originalImage, watermarkImagePath) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  const canvasWidth = originalImage.width;
  const canvasHeight = originalImage.height;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // indlæser canvas med det originale billede
  context.drawImage(originalImage, 0, 0, canvasWidth, canvasHeight);
  // indlæser billede med logo og transformerer til pattern

  const result = await fetch(watermarkImagePath);
  const blob = await result.blob();
  const image = await createImageBitmap(blob);
  const pattern = context.createPattern(image, "no-repeat");
  // translater billede med logo til nederste hjørne til højre
  context.translate(canvasWidth - image.width, canvasHeight - image.height);
  context.rect(0, 0, canvasWidth, canvasHeight);
  context.fillStyle = pattern;

  context.fill();

  return canvas.toDataURL();
}
