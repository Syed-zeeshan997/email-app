const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

// Ensure upload directories exist
const profileDir = path.join(__dirname, '../uploads/profiles');
const attachmentDir = path.join(__dirname, '../uploads/attachments');

[profileDir, attachmentDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

/**
 * Allowed file types
 */
const imageFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'), false);
  }
};

const attachmentFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp|pdf|doc|docx|txt|zip/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  if (ext) {
    cb(null, true);
  } else {
    cb(new Error('File type not allowed'), false);
  }
};

/**
 * Profile image upload configuration
 */
const profileStorage = multer.diskStorage({
  destination: profileDir,
  filename: (req, file, cb) => {
    cb(null, `profile-${uuidv4()}${path.extname(file.originalname)}`);
  },
});

const uploadProfile = multer({
  storage: profileStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: imageFilter,
});

/**
 * Email attachment upload configuration
 */
const attachmentStorage = multer.diskStorage({
  destination: attachmentDir,
  filename: (req, file, cb) => {
    cb(null, `attach-${uuidv4()}${path.extname(file.originalname)}`);
  },
});

const uploadAttachment = multer({
  storage: attachmentStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: attachmentFilter,
});

module.exports = { uploadProfile, uploadAttachment };
