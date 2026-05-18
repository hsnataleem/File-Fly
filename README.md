# File Fly 🚀

**Fast Local File Sharing Over Your Network**

File Fly is a lightweight, full-stack web application that enables quick and secure file sharing within your local network. Share files effortlessly by generating QR codes or direct links—no cloud storage, no complicated setup.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [How It Works](#how-it-works)
- [Configuration](#configuration)
- [License](#license)

---

## ✨ Features

- **📤 Easy File Upload** - Drag-and-drop interface for uploading files
- **🔗 Instant Sharing** - Generate unique URLs for each file
- **📱 QR Code Generation** - Share files via QR codes with instant scanning
- **⏱️ Auto-Expiry** - Files automatically expire after 10 minutes for security
- **📊 Real-time Status Tracking** - Monitor active file transfers
- **🌐 Local Network Support** - Share files across your entire network
- **🛡️ CORS Enabled** - Secure cross-origin resource sharing
- **💻 Cross-Platform** - Works on any device with a web browser

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library with hooks
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **QR Code Libraries** - QR code generation and display
- **Lucide React** - Beautiful icon library
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - JavaScript runtime
- **Express 5** - Fast, unopinionated web framework
- **Multer** - File upload middleware
- **UUID** - Unique file identifier generation
- **QRCode** - QR code generation
- **CORS** - Cross-origin resource sharing
- **Nodemon** - Development server with auto-reload

---

## 📁 Project Structure

```
File-Fly/
├── backend/                 # Node.js/Express backend
│   ├── server.js           # Main server file
│   ├── uploads/            # Temporary file storage
│   └── package.json        # Backend dependencies
│
├── frontend/               # React/Vite frontend
│   ├── src/
│   │   ├── main.jsx        # Entry point
│   │   ├── App.jsx         # Router setup
│   │   ├── index.css       # Global styles
│   │   ├── pages/          # Route pages
│   │   │   ├── Home.jsx    # Upload interface
│   │   │   ├── Download.jsx # File download page
│   │   │   ├── HowItWorks.jsx # Instructions
│   │   │   └── ActiveTransfers.jsx # Transfer monitoring
│   │   └── ErrorBoundary.jsx # Error handling
│   ├── index.html          # HTML template
│   └── package.json        # Frontend dependencies
│
├── package.json            # Root package.json
└── README.md              # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- Modern web browser
- Same local network connection for sharing

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/hsnataleem/File-Fly.git
   cd File-Fly
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   
   This will automatically install both backend and frontend dependencies (via postinstall script).

---

## 🏃 Running the Application

### Development Mode

Run both frontend and backend concurrently:

```bash
npm run dev
```

This starts:
- **Frontend**: http://localhost:5173 (Vite dev server)
- **Backend**: http://localhost:3000 (Express server)

### Production Mode

```bash
npm start
```

Runs only the backend server on port 3000.

### Individual Services

**Backend only:**
```bash
npm start --prefix backend
```

**Frontend only:**
```bash
npm run dev --prefix frontend
```

---

## 🔌 API Endpoints

### Health & Status

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | API status and version |
| `GET` | `/health` | Server health check |
| `GET` | `/api/ip` | Get server's local IP and port |

### File Operations

| Method | Endpoint | Description | Request |
|--------|----------|-------------|---------|
| `POST` | `/api/upload` | Upload a file | `multipart/form-data` with `file` |
| `GET` | `/api/file/:id` | Get file metadata | - |
| `GET` | `/api/download/:id` | Download file | - |
| `GET` | `/api/content/:id` | View file content | - |
| `POST` | `/api/files/status` | Batch check file statuses | `{ ids: [id1, id2, ...] }` |

### Response Examples

**Upload Response:**
```json
{
  "success": true,
  "file": {
    "id": "uuid",
    "originalName": "document.pdf",
    "filename": "random-uuid.pdf",
    "size": 1024000,
    "mimeType": "application/pdf",
    "expiresAt": 1234567890,
    "status": "pending"
  }
}
```

**Status Response:**
```json
{
  "statuses": {
    "file-id-1": { "status": "pending", "expiresAt": 1234567890 },
    "file-id-2": { "status": "downloaded", "expiresAt": 1234567890 }
  }
}
```

---

## 💡 How It Works

### Upload Flow
1. User selects a file via the web interface
2. File is uploaded to the backend (`/api/upload`)
3. Backend generates a unique UUID and stores file metadata
4. Backend returns file ID and generates a QR code
5. User can share the QR code or direct link with others

### Download Flow
1. User receives a QR code or direct link
2. Scanning QR or clicking link opens the download page
3. File metadata is fetched via `/api/file/:id`
4. User clicks download to fetch file from `/api/download/:id`
5. File status is updated to "downloaded"

### Auto-Expiry
- Files are stored in memory with a 10-minute expiry timer
- Background cleanup runs every minute
- Expired files are automatically deleted from disk and registry
- Users receive 404 for expired files

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Backend
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173,http://192.168.1.100:5173
```

### Frontend Configuration

The frontend automatically detects the backend server from the current origin or environment.

---

## 📝 Features Breakdown

### Home Page
- File upload with drag-and-drop support
- QR code generation for uploaded files
- Display of file metadata

### Download Page
- Fetch and display file information
- Download button with file streaming
- Real-time status tracking

### Active Transfers
- Live dashboard of all active uploads
- Status monitoring (pending/downloaded/expired)
- Time remaining before expiry

### How It Works
- Tutorial and instructions for users
- Step-by-step guide for file sharing

---

## 🔒 Security Features

- **CORS Protection** - Configurable allowed origins
- **UUID-based IDs** - Unguessable file identifiers
- **Auto-Expiry** - Automatic file cleanup after 10 minutes
- **Secure Filenames** - Random UUID filenames prevent path traversal
- **Error Handling** - Global error handler prevents information leakage

---

## 📊 File Storage

- **Upload Directory**: `backend/uploads/`
- **Storage Type**: Disk-based with in-memory registry
- **Cleanup**: Automatic via periodic cleanup task
- **Expiry Time**: 10 minutes (configurable via `EXPIRY_TIME_MS`)

---

## 🐛 Error Handling

- Comprehensive error boundary in React
- Express global error handler
- Graceful 404 responses for expired/missing files
- Request validation for all endpoints

---

## 📱 Responsive Design

- Mobile-friendly interface with Tailwind CSS
- Touch-optimized file upload
- QR code scaling for various screen sizes
- Optimized for desktop and mobile browsing

---

## 🚧 Future Enhancements

- [ ] File compression before transfer
- [ ] Batch file uploads
- [ ] Password protection for shared files
- [ ] Download count limits
- [ ] Persistent file storage option
- [ ] File preview functionality
- [ ] Direct peer-to-peer transfer option
- [ ] WebSocket for real-time updates

---

## 💬 Support & Contributing

Have a question or found a bug? Feel free to open an issue on GitHub!

---

## 📄 License

ISC License - Feel free to use this project for personal or commercial purposes.

---

## 🎉 Quick Start Summary

```bash
# Clone and install
git clone https://github.com/hsnataleem/File-Fly.git
cd File-Fly
npm install

# Run development server
npm run dev

# Open browser
# Frontend: http://localhost:5173
# Backend: http://localhost:3000

# Start sharing files!
```

---

**Made with ❤️ by [hsnataleem](https://github.com/hsnataleem)**
