const multer = require('multer')
const oneMegabyte = 1024 * 1024

const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, './uploads')
  },
  filename: function(req, file, callback) {
    callback(null, new Date().toISOString() + file.originalname)
  }
})

const fileFilter = (req, file, callback) => {
  // reject a fille
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    callback(null, true)
  } else {
    callback(null, false)
  }
}

module.exports = multer({
  storage,
  limits: {
    fileSize: oneMegabyte * 5
  },
  fileFilter
})
