import multer from "multer"

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!file) {
      return cb(null, null)
    }
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    if (!file) {
      return cb(null, null)
    }
    cb(null, file.originalname)
  }
})

export const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (!file) {
      return cb(null, false)
    }
    cb(null, true)
  }
})


// Middleware to handle empty file uploads
export const handleEmptyFile = (req, res, next) => {
  if (!req.file) {
    req.file = { path: null }  // Set a default path when no file is uploaded
  }
  next()
}