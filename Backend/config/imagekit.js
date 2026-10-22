import dotenv from "dotenv";
import ImageKit from "imagekit";
import sharp from "sharp";
import crypto from "crypto";
import path from "path";

dotenv.config();

export const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// Every upload is stored as WebP, at most MAX_DIMENSION px on its longest side. Phone
// photos are 3–10 MB, the site never shows an image wider than 1600 px, and anything that
// uses the stored URL without an ImageKit transform (emails, admin) gets the stored file.
const MAX_DIMENSION = 2400;
const WEBP_QUALITY = 82;

const kb = (bytes) => Math.round(bytes / 1024);

export async function optimizeImage(file) {
  const baseName = path.parse(file.originalname).name;

  try {
    const image = sharp(file.buffer, { failOn: "none" });
    const { width, height, format } = await image.metadata();

    const output = await image
      .rotate() // apply the camera's EXIF orientation, since the metadata is dropped
      .resize({
        width: MAX_DIMENSION,
        height: MAX_DIMENSION,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();

    // A small image that is already WebP can come out bigger; keep it as it was
    if (format === "webp" && Math.max(width, height) <= MAX_DIMENSION && output.length >= file.buffer.length) {
      return { buffer: file.buffer, fileName: `${baseName}.webp` };
    }

    console.log(`📷 ${file.originalname}: ${kb(file.buffer.length)} KB → ${kb(output.length)} KB WebP`);
    return { buffer: output, fileName: `${baseName}.webp` };
  } catch (err) {
    // A format sharp can't read (e.g. HEIC): upload the original and let ImageKit handle it
    console.warn(`📷 ${file.originalname}: could not convert to WebP (${err.message}); uploading the original`);
    return { buffer: file.buffer, fileName: file.originalname };
  }
}

export const uploadImagesToImageKit = async (
  files,
  folder = "/naarisa/variants"
) => {
  const CONCURRENCY = 2;

  const successful = [];
  const failed = [];

  for (let i = 0; i < files.length; i += CONCURRENCY) {
    const batch = files.slice(i, i + CONCURRENCY);

    const results = await Promise.allSettled(
      batch.map(async (file) => {
        const { buffer, fileName } = await optimizeImage(file);

        return imagekit.upload({
          file: buffer,
          fileName: `${crypto.randomUUID()}-${fileName}`,
          folder,
          useUniqueFileName: true,
        });
      })
    );

    results.forEach((result, idx) => {
      const file = batch[idx];

      if (result.status === "fulfilled") {
        successful.push({
          url: result.value.url,
          fileId: result.value.fileId,
          provider: "imagekit",
        });

        console.log(`✅ Uploaded: ${file.originalname}`);
      } else {
        const failure = {
          originalname: file.originalname,
          mimetype: file.mimetype,
          sizeBytes: file.size,
          sizeMB: (file.size / (1024 * 1024)).toFixed(2),
          error: result.reason?.message || String(result.reason),
          timestamp: new Date().toISOString(),
        };

        failed.push(failure);

        console.error("❌ Upload failed:", failure);
      }
    });
  }

  if (failed.length) {
    const err = new Error(
      `${failed.length} of ${files.length} image(s) failed`
    );
    err.failedUploads = failed;
    err.successfulUploads = successful;
    throw err;
  }

  return successful;
};

export const deleteImagesFromImageKit = async (images = []) => {
  const results = await Promise.allSettled(
    images.filter((img) => img.fileId).map((img) => imagekit.deleteFile(img.fileId))
  );

  results.forEach((r, i) => {
    if (r.status === "rejected") {
      console.error("ImageKit delete failed:", images[i], r.reason?.message);
    }
  });
};