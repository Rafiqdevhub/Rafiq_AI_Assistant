# Portfolio AI Assistant

Express.js server with TypeScript for Portfolio AI Assistant application.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file:

```bash
cp .env.example .env
```

3. Configure your environment variables in `.env`

### Development

Run the development server with hot reload:

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### Build

Compile TypeScript to JavaScript:

```bash
npm run build
```

### Production

Run the production server:

```bash
npm start
```

## 📁 Project Structure

```
portfolio-ai-assistant/
├── src/
│   ├── config/          # Configuration files
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   └── index.ts         # Application entry point
├── dist/                # Compiled JavaScript (generated)
├── .env                 # Environment variables
├── .env.example         # Example environment variables
├── tsconfig.json        # TypeScript configuration
├── nodemon.json         # Nodemon configuration
└── package.json         # Project dependencies
```

## 🔌 API Endpoints

- `GET /health` - Health check endpoint
- `GET /api` - API welcome message
- `GET /api/example` - Example endpoint

## 🛠️ Tech Stack

- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **Node.js** - Runtime environment
- **Nodemon** - Development auto-reload
- **ts-node** - TypeScript execution

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests

## 🤝 Contributing

Feel free to contribute to this project!

## 📄 License

ISC
