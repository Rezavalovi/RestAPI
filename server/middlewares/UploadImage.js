const multer = require("multer");
const path = require("path");

const upload = (fieldName = 'profile_image') => {
  const allowedExtensions = ['.jpeg', '.png']; // Allowed image extensions (lowercase for case-insensitive matching)

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = path.join(__dirname, '../uploads', fieldName); // Use relative path from server root

      // Create the upload directory if it doesn't exist (using async/await for clarity)
      (async () => {
        try {
          await fs.promises.mkdir(uploadPath, { recursive: true });
          cb(null, uploadPath);
        } catch (err) {
          cb(err);
        }
      })();
    },
    filename: function (req, file, cb) {
      const timestamp = new Date().getTime();
      const randomNum = Math.floor(Math.random() * 1000);
      const extension = path.extname(file.originalname).toLowerCase(); // Ensure lowercase extension
      const uniqueFileName = `${timestamp}-${randomNum}${extension}`;

      if (!allowedExtensions.includes(extension)) {
        return cb(new Error('Only JPEG or PNG images are allowed'));
      }

      cb(null, uniqueFileName);
    },
  });

  return multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 5 } }).single(fieldName); // Combine Multer options and single file upload functionality
};

module.exports = upload;
