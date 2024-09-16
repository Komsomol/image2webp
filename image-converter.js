const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Directory containing images
const inputDir = path.join(__dirname, 'images');
const outputDir = path.join(__dirname, 'output');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Function to convert and optimize images to WebP
const convertToWebP = async (inputPath, outputPath) => {
  try {
    await sharp(inputPath)
      .resize({
        width: 1920,
        height: 1080,
        fit: 'inside', // Resizes to fit within the 1920x1080 box, preserving aspect ratio
        withoutEnlargement: true, // Prevents upscaling if the image is smaller than 1920x1080
      })
      .webp({
        quality: 75, // Adjust quality (1-100); 75 is a good balance
        effort: 6,   // Compression effort (0-6); higher values mean better compression but slower
      })
      .toFile(outputPath);
    console.log(`Converted and optimized: ${inputPath} -> ${outputPath}`);
  } catch (error) {
    console.error(`Error converting ${inputPath}:`, error);
  }
};

// Read files from input directory
fs.readdir(inputDir, (err, files) => {
  if (err) {
    console.error('Error reading input directory:', err);
    return;
  }

  files.forEach((file) => {
    const inputFilePath = path.join(inputDir, file);

    // Check if the file is a .jpg or .png
    if (/\.(jpg|jpeg|png)$/i.test(file)) {
      const outputFilePath = path.join(
        outputDir,
        `${path.parse(file).name}.webp`
      );

      // Convert and optimize image to WebP
      convertToWebP(inputFilePath, outputFilePath);
    }
  });
});
