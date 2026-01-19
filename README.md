# Portfolio AI Assistant API Documentation

## AI Features

This API provides an intelligent assistant powered by Google Gemini AI that can analyze and answer questions about PDF documents.

## Prerequisites

Before using the AI features, you need to:

1. Get a Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add the API key to your `.env` file:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

## API Endpoints

### 1. Check Status

**GET** `/api/ai/status`

Check if a PDF context is loaded and ready.

**Response:**

```json
{
  "success": true,
  "contextLoaded": true,
  "message": "PDF context is loaded and ready"
}
```

### 2. Upload PDF

**POST** `/api/ai/upload`

Upload a new PDF file for analysis.

**Request:**

- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: Form data with field name `pdf`

**Example using curl:**

```bash
curl -X POST http://localhost:5000/api/ai/upload \
  -F "pdf=@/path/to/your/document.pdf"
```

**Response:**

```json
{
  "success": true,
  "message": "PDF uploaded and processed successfully",
  "file": {
    "originalName": "document.pdf",
    "size": 123456,
    "pages": 5
  }
}
```

### 3. Ask Questions

**POST** `/api/ai/ask`

Ask a question about the loaded PDF content.

**Request:**

```json
{
  "question": "What are the key skills mentioned in the document?"
}
```

**Response:**

```json
{
  "success": true,
  "question": "What are the key skills mentioned in the document?",
  "answer": "Based on the document, the key skills include..."
}
```

### 4. Generate Summary

**GET** `/api/ai/summary`

Get an AI-generated summary of the PDF content.

**Response:**

```json
{
  "success": true,
  "summary": "This document provides an overview of..."
}
```

### 5. Extract Information

**POST** `/api/ai/extract`

Extract specific information from the PDF.

**Request:**

```json
{
  "infoType": "skills"
}
```

**Response:**

```json
{
  "success": true,
  "infoType": "skills",
  "info": "The following skills are mentioned..."
}
```

### 6. Chat with AI

**POST** `/api/ai/chat`

Have a multi-turn conversation with the AI about the PDF.

**Request:**

```json
{
  "messages": [
    { "role": "user", "content": "What is this document about?" },
    { "role": "assistant", "content": "This is a CV..." },
    { "role": "user", "content": "Tell me more about the experience" }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "response": "The experience section shows..."
}
```

### 7. Load Default PDF

**POST** `/api/ai/load-default`

Load the default PDF (Rafiq CV.pdf) from the project root.

**Response:**

```json
{
  "success": true,
  "message": "Default PDF loaded successfully",
  "file": {
    "name": "Rafiq CV.pdf",
    "pages": 3
  }
}
```

### 8. Clear Context

**DELETE** `/api/ai/context`

Clear the currently loaded PDF context.

**Response:**

```json
{
  "success": true,
  "message": "PDF context cleared successfully"
}
```

## Usage Examples

### Example 1: Upload and Ask Questions

```javascript
// Upload PDF
const formData = new FormData();
formData.append("pdf", pdfFile);

const uploadResponse = await fetch("http://localhost:5000/api/ai/upload", {
  method: "POST",
  body: formData,
});

// Ask a question
const questionResponse = await fetch("http://localhost:5000/api/ai/ask", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    question: "What are the main qualifications?",
  }),
});
```

### Example 2: Get Summary

```javascript
const response = await fetch("http://localhost:5000/api/ai/summary");
const data = await response.json();
console.log(data.summary);
```

### Example 3: Extract Specific Information

```javascript
const response = await fetch("http://localhost:5000/api/ai/extract", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    infoType: "education",
  }),
});
```

## Features

- **PDF Upload**: Upload and process PDF files (max 10MB)
- **Intelligent Q&A**: Ask natural language questions about the PDF content
- **Summary Generation**: Get comprehensive summaries of the document
- **Information Extraction**: Extract specific types of information
- **Conversational AI**: Maintain context across multiple questions
- **Default PDF**: Automatically loads Rafiq CV.pdf on startup

## Error Handling

All endpoints return standardized error responses:

```json
{
  "success": false,
  "error": "Error message description"
}
```

Common HTTP status codes:

- `200`: Success
- `400`: Bad request (missing parameters, invalid input)
- `404`: Resource not found
- `500`: Server error

## Limitations

- Maximum PDF file size: 10MB
- Only PDF files are accepted
- Requires valid Gemini API key
- Rate limits apply based on your Gemini API plan

## Use Cases

- **CV/Resume Analysis**: Extract skills, experience, and qualifications
- **Document Q&A**: Answer questions about any PDF document
- **Content Summarization**: Get quick summaries of long documents
- **Information Extraction**: Pull out specific data points
- **Interactive Chat**: Have conversations about document content
