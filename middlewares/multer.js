const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'public/uploads';
    if (req.uploadType === 'products') {
      if(req.files.length>5){
        uploadPath = 'public/uploads/dump';
      }else
      uploadPath = 'public/uploads/products';
    } else {
      uploadPath = 'public/uploads/product';
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null,  file.originalname +'-'+Date.now()  );
  },
});

const setUploadType = (type) => {
  return (req, res, next) => {
    req.uploadType = type;
    next();
  };
};

const upload = multer({ storage: storage });

module.exports = { upload, setUploadType };
