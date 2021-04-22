const multer = require("multer");
const mime = require("mime");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");

const s3 = new aws.S3();

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: "ap-southeast-2",
});

const s3Storage = multerS3({
  s3,
  bucket: "books-r-us-bucket",
  acl: "public-read",
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    let extension = mime.getExtension(file.mimetype);
    let filename = file.fieldname + "-" + Date.now() + "." + extension;
    cb(null, filename);
  },
});

const limits = {
  fileSize: 5000000,
  files: 1,
};

const fileFilter = (req, file, cb) => {
  const fileTypes = ["image/png", "image/jpg", "image/jpeg", "image/gif"];

  if (!fileTypes.includes(file.mimetype)) {
    cb(new Error("File type must be either png,jpg or gif"));
  } else {
    // To accept the file pass `true`, like so:
    cb(null, true);
  }
};

const singleUpload = multer({
  storage: s3Storage,
  limits,
  fileFilter,
}).single("image");

const uploadToS3 = (req, res, next) => {
  singleUpload(req, res, (err) => {
    try {
      if (err instanceof multer.MulterError) {
        res.status(400);
        throw new Error("File exceeds 5MB");
      } else if (err) {
        res.status(400);
        throw new Error(err.message);
      } else {
        if (!req.file.location) {
          res.status(400);
          throw new Error("File is missing");
        }
        res.send(req.file.location);
      }
    } catch (error) {
      next(error);
    }
  });
};

module.exports = {
  uploadToS3,
};
