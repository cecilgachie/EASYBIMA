const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Define the source directory and output directory
const sourceDir = path.join(__dirname, 'src', 'assets');
const outputDir = path.join(__dirname, 'src', 'assets', 'enhanced');

// Create the output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Define the target resolution for 4K (3840x2160)
const targetWidth = 3840;
const targetHeight = 2160;

// List of image files to enhance (the ones used in the login page)
const imagesToEnhance = [
  'picture1.jpg',
  'picture2.jpg',
  'picture3.jpg',
  'picture4.jpg',
  'picture5.jpg',
  'picture6.jpg',
  'cic_insurance.png'
];

// Function to enhance an image
async function enhanceImage(filename) {
  const inputPath = path.join(sourceDir, filename);
  const outputPath = path.join(outputDir, filename);
  
  try {
    // Get image metadata
    const metadata = await sharp(inputPath).metadata();
    console.log(`Processing ${filename} (${metadata.width}x${metadata.height})`);
    
    // Calculate new dimensions while maintaining aspect ratio
    let newWidth, newHeight;
    const aspectRatio = metadata.width / metadata.height;
    
    if (aspectRatio > targetWidth / targetHeight) {
      // Image is wider than 4K aspect ratio
      newWidth = targetWidth;
      newHeight = Math.round(targetWidth / aspectRatio);
    } else {
      // Image is taller than 4K aspect ratio
      newHeight = targetHeight;
      newWidth = Math.round(targetHeight * aspectRatio);
    }
    
    // Process the image
    await sharp(inputPath)
      // Resize to higher resolution
      .resize({
        width: newWidth,
        height: newHeight,
        fit: 'fill',
        withoutEnlargement: false
      })
      // Apply sharpening
      .sharpen({
        sigma: 1.2,
        m1: 0.5,
        m2: 0.5,
        x1: 1.5,
        y2: 20,
        y3: 50
      })
      // Enhance image quality
      .modulate({
        brightness: 1.05, // Slightly increase brightness
        saturation: 1.2   // Increase saturation for more vibrant colors
      })
      // Reduce noise
      .median(1)
      // Adjust contrast
      .linear(1.1, -0.1) // Increase contrast
      // Save with high quality
      .toFormat(path.extname(filename).substring(1), {
        quality: 100,
        chromaSubsampling: '4:4:4' // Best quality for JPEG
      })
      .toFile(outputPath);
    
    console.log(`Enhanced ${filename} to ${newWidth}x${newHeight}`);
    return { filename, success: true, dimensions: `${newWidth}x${newHeight}` };
  } catch (error) {
    console.error(`Error enhancing ${filename}:`, error);
    return { filename, success: false, error: error.message };
  }
}

// Process all images
async function enhanceAllImages() {
  console.log('Starting image enhancement process...');
  
  const results = [];
  
  for (const image of imagesToEnhance) {
    const result = await enhanceImage(image);
    results.push(result);
  }
  
  console.log('\nEnhancement Results:');
  console.table(results);
  
  // Count successful enhancements
  const successCount = results.filter(r => r.success).length;
  console.log(`\nSuccessfully enhanced ${successCount} of ${results.length} images.`);
  
  if (successCount > 0) {
    console.log(`\nEnhanced images are available in: ${outputDir}`);
  }
}

// Run the enhancement process
enhanceAllImages().catch(err => {
  console.error('An error occurred during the enhancement process:', err);
});
