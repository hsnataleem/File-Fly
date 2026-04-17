const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : true,
  credentials: true
}));
app.use(express.json());

// Set up storage
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// In-memory file registry
// id -> { id, originalName, filename, size, mimeType, expiresAt }
const fileRegistry = new Map();

const EXPIRY_TIME_MS = 10 * 60 * 1000; // 10 minutes

// Helper to get local IP
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) {
    const ifaceInfo = interfaces[interfaceName];
    for (const info of ifaceInfo) {
      if (!info.internal && info.family === 'IPv4') {
        return info.address;
      }
    }
  }
  return '127.0.0.1';
}

// Endpoints
app.get('/', (req, res) => {
  res.json({ message: 'File Fly API is running!', version: '1.0.0' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/api/ip', (req, res) => {
  res.json({ ip: getLocalIP(), port: PORT });
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileId = uuidv4();
  const fileData = {
    id: fileId,
    originalName: req.file.originalname,
    filename: req.file.filename,
    size: req.file.size,
    mimeType: req.file.mimetype,
    expiresAt: Date.now() + EXPIRY_TIME_MS,
    status: 'pending'
  };

  fileRegistry.set(fileId, fileData);
  res.json({ success: true, file: fileData });
});

app.get('/api/file/:id', (req, res) => {
  const fileId = req.params.id;
  const fileData = fileRegistry.get(fileId);

  if (!fileData) {
    return res.status(404).json({ error: 'File not found or expired' });
  }

  res.json({ file: fileData });
});

app.get('/api/download/:id', (req, res) => {
  const fileId = req.params.id;
  const fileData = fileRegistry.get(fileId);

  if (!fileData) {
    return res.status(404).send('File not found or expired');
  }

  const filePath = path.join(uploadDir, fileData.filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File on disk not found');
  }

  // Update status explicitly when download is initiated
  fileData.status = 'downloaded';

  res.download(filePath, fileData.originalName);
});

app.get('/api/content/:id', (req, res) => {
  const fileId = req.params.id;
  const fileData = fileRegistry.get(fileId);

  if (!fileData) {
    return res.status(404).send('File not found or expired');
  }

  const filePath = path.join(uploadDir, fileData.filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File on disk not found');
  }

  fileData.status = 'downloaded';
  res.sendFile(filePath);
});

// Endpoint for batched live polling of file statuses
app.post('/api/files/status', (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids)) {
    return res.status(400).json({ error: 'Expected array of ids' });
  }
  
  const results = {};
  for (const id of ids) {
    const file = fileRegistry.get(id);
    if (!file) {
      // Missing entirely = destroyed/expired
      results[id] = { status: 'expired' };
    } else {
      results[id] = { status: file.status, expiresAt: file.expiresAt };
    }
  }
  
  res.json({ statuses: results });
});

// Periodic cleanup task
setInterval(() => {
  const now = Date.now();
  for (const [id, fileData] of fileRegistry.entries()) {
    if (now > fileData.expiresAt) {
      const filePath = path.join(uploadDir, fileData.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      fileRegistry.delete(id);
      console.log(`Cleaned up expired file: ${id}`);
    }
  }
}, 60 * 1000); // Check every minute

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on port ${PORT}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Local network URL: http://${getLocalIP()}:${PORT}`);
  }
});
