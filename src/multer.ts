import multer from "multer";

export const upload = multer({
    storage: multer.memoryStorage(),

    limits: {
        fileSize: 5 * 1024 * 1024,
    },

    fileFilter(req, file, cb) {
        const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

        if (!allowed.includes(file.mimetype)) {
            return cb(new Error("Formato inválido"));
        }

        cb(null, true);
    },
});
