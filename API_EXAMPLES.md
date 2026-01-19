# API Test Examples

## Using HTTPie (if installed)

### 1. Check Status

```bash
http GET http://localhost:5000/api/v1/ai/status
```

### 2. Load Default PDF

```bash
http POST http://localhost:5000/api/v1/ai/load-default
```

### 3. Ask Question

```bash
http POST http://localhost:5000/api/v1/ai/ask \
  question="What are the key skills mentioned in the CV?"
```

### 4. Generate Summary

```bash
http GET http://localhost:5000/api/v1/ai/summary
```

### 5. Extract Information

```bash
http POST http://localhost:5000/api/v1/ai/extract \
  infoType="experience"
```

### 6. Chat

```bash
http POST http://localhost:5000/api/v1/ai/chat \
  messages:='[{"role":"user","content":"What is this document about?"}]'
```

### 7. Upload PDF

```bash
http --form POST http://localhost:5000/api/v1/ai/upload \
  pdf@/path/to/document.pdf
```

### 8. Clear Context

```bash
http DELETE http://localhost:5000/api/v1/ai/context
```

---

## Using PowerShell (Invoke-WebRequest)

### 1. Check Status

```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/v1/ai/status" -Method Get
```

### 2. Load Default PDF

```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/v1/ai/load-default" -Method Post
```

### 3. Ask Question

```powershell
$body = @{
    question = "What are the technical skills?"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/v1/ai/ask" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

### 4. Generate Summary

```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/v1/ai/summary" -Method Get
```

### 5. Extract Information

```powershell
$body = @{
    infoType = "skills"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/v1/ai/extract" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

### 6. Upload PDF

```powershell
$filePath = "C:\path\to\document.pdf"
$fileName = Split-Path $filePath -Leaf

$boundary = [System.Guid]::NewGuid().ToString()
$contentType = "multipart/form-data; boundary=$boundary"

$bodyLines = @(
    "--$boundary",
    "Content-Disposition: form-data; name=`"pdf`"; filename=`"$fileName`"",
    "Content-Type: application/pdf",
    "",
    [System.Text.Encoding]::UTF8.GetString([System.IO.File]::ReadAllBytes($filePath)),
    "--$boundary--"
) -join "`r`n"

Invoke-RestMethod -Uri "http://localhost:5000/api/v1/ai/upload" `
  -Method Post `
  -ContentType $contentType `
  -Body $bodyLines
```

---

## Using JavaScript/Fetch

### Complete Example

```javascript
const API_URL = "http://localhost:5000/api";

// 1. Check status
async function checkStatus() {
  const res = await fetch(`${API_URL}/ai/status`);
  return await res.json();
}

// 2. Load default PDF
async function loadDefault() {
  const res = await fetch(`${API_URL}/ai/load-default`, {
    method: "POST",
  });
  return await res.json();
}

// 3. Ask question
async function askQuestion(question) {
  const res = await fetch(`${API_URL}/ai/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  return await res.json();
}

// 4. Get summary
async function getSummary() {
  const res = await fetch(`${API_URL}/ai/summary`);
  return await res.json();
}

// 5. Extract info
async function extractInfo(infoType) {
  const res = await fetch(`${API_URL}/ai/extract`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ infoType }),
  });
  return await res.json();
}

// 6. Upload PDF
async function uploadPDF(file) {
  const formData = new FormData();
  formData.append("pdf", file);

  const res = await fetch(`${API_URL}/ai/upload`, {
    method: "POST",
    body: formData,
  });
  return await res.json();
}

// 7. Chat
async function chat(messages) {
  const res = await fetch(`${API_URL}/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  return await res.json();
}

// Usage example
(async () => {
  await loadDefault();
  const answer = await askQuestion("What skills are mentioned?");
  console.log(answer);
})();
```

---

## Using Python (requests)

```python
import requests

API_URL = "http://localhost:5000/api"

# 1. Check status
response = requests.get(f"{API_URL}/ai/status")
print(response.json())

# 2. Load default PDF
response = requests.post(f"{API_URL}/ai/load-default")
print(response.json())

# 3. Ask question
response = requests.post(f"{API_URL}/ai/ask", json={
    "question": "What are the key skills?"
})
print(response.json())

# 4. Generate summary
response = requests.get(f"{API_URL}/ai/summary")
print(response.json())

# 5. Extract information
response = requests.post(f"{API_URL}/ai/extract", json={
    "infoType": "experience"
})
print(response.json())

# 6. Upload PDF
with open("document.pdf", "rb") as f:
    files = {"pdf": f}
    response = requests.post(f"{API_URL}/ai/upload", files=files)
    print(response.json())

# 7. Chat
response = requests.post(f"{API_URL}/ai/chat", json={
    "messages": [
        {"role": "user", "content": "What is this about?"}
    ]
})
print(response.json())
```
