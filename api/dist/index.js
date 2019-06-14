"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const Loki = require("lokijs");
const utils_1 = require("./utils");
// setup
const DB_NAME = 'db.json';
const COLLECTION_NAME = 'images';
const UPLOAD_PATH = 'uploads';
const upload = multer({ dest: `${UPLOAD_PATH}/`, fileFilter: utils_1.imageFilter }); // apply filter
const db = new Loki(`${UPLOAD_PATH}/${DB_NAME}`, { persistenceMethod: 'fs' });
// optional: clean all data before start
// cleanFolder(UPLOAD_PATH);
// app
const app = express();
app.use(cors());
app.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    // default route
    res.send(`
        <h1>Demo file upload</h1>
        <p>Please refer to <a href="https://scotch.io/tutorials/express-file-uploads-with-multer">my tutorial</a> for details.</p>
        <ul>
            <li>GET /images   - list all upload images</li>
            <li>GET /images/{id} - get one uploaded image</li>
            <li>POST /profile - handle single image upload</li>
            <li>POST /photos/upload - handle multiple images upload</li>
        </ul>
    `);
}));
app.post('/profile', upload.single('avatar'), (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const col = yield utils_1.loadCollection(COLLECTION_NAME, db);
        const data = col.insert(req.file);
        db.saveDatabase();
        res.send({ id: data.$loki, fileName: data.filename, originalName: data.originalname });
    }
    catch (err) {
        res.sendStatus(400);
    }
}));
app.post('/photos/upload', upload.array('photos', 12), (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const col = yield utils_1.loadCollection(COLLECTION_NAME, db);
        let data = [].concat(col.insert(req.files));
        db.saveDatabase();
        res.send(data.map(x => ({ id: x.$loki, fileName: x.filename, originalName: x.originalname })));
    }
    catch (err) {
        res.sendStatus(400);
    }
}));
app.get('/images', (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const col = yield utils_1.loadCollection(COLLECTION_NAME, db);
        res.send(col.data);
    }
    catch (err) {
        res.sendStatus(400);
    }
}));
app.get('/images/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const col = yield utils_1.loadCollection(COLLECTION_NAME, db);
        const result = col.get(req.params.id);
        if (!result) {
            res.sendStatus(404);
            return;
        }
        ;
        res.setHeader('Content-Type', result.mimetype);
        fs.createReadStream(path.join(UPLOAD_PATH, result.filename)).pipe(res);
    }
    catch (err) {
        res.sendStatus(400);
    }
}));
app.listen(3000, function () {
    console.log('listening on port 3000!');
});
//# sourceMappingURL=index.js.map