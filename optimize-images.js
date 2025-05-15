const sharp = require('sharp');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'src');
const targetDir = path.join(__dirname, 'src/assets');

// Ensure target directory exists
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

async function optimizeImages() {
    try {
        // Process each image
        const images = ['picture1.jpg', 'picture2.jpg', 'picture3.jpg'];
        
        for (const image of images) {
            const sourcePath = path.join(sourceDir, image);
            const targetPath = path.join(targetDir, image);
            
            if (fs.existsSync(sourcePath)) {
                // Resize and optimize with sharp
                await sharp(sourcePath)
                    .resize(1200, 800, { // Adjust dimensions as needed
                        fit: 'inside',
                        withoutEnlargement: true
                    })
                    .jpeg({ quality: 80 }) // Adjust quality as needed
                    .toFile(targetPath);
                
                console.log(`Processed ${image}`);
            }
        }

        // Further optimize with imagemin
        await imagemin([`${targetDir}/*.{jpg,png}`], {
            destination: targetDir,
            plugins: [
                imageminJpegtran(),
                imageminPngquant({
                    quality: [0.6, 0.8]
                })
            ]
        });

        console.log('Image optimization complete!');
    } catch (error) {
        console.error('Error optimizing images:', error);
    }
}

optimizeImages(); 