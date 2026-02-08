---
name: file
description: Use when user asks to upload files, download files, list uploaded files, or manage file storage in VibeSurf. Handles file operations including upload, download, and file listing. Does NOT include delete operations.
---

# File - File Upload and Management

## Overview

Manage file uploads and downloads in VibeSurf. Upload files to workspace directories, download files by ID or path, and list uploaded files.

## When to Use

- User wants to **upload files** to VibeSurf
- User wants to **download files** from VibeSurf
- User wants to **list uploaded files**
- User wants to **browse session files**
- User needs to **manage file storage**

## API Endpoints

Base path: `$VIBESURF_ENDPOINT/api/files`

| Action | Method | Endpoint | Description |
|--------|--------|----------|-------------|
| Upload Files | POST | `/api/files/upload` | Upload files to workspace |
| Download File | GET | `/api/files/download?file_id={id}` | Download file by ID or path |
| List Files | GET | `/api/files` | List all uploaded files |
| List Session Files | GET | `/api/files/session/{session_id}` | List files in a session directory |

## Request Examples

### Upload Files

```bash
curl -X POST "$VIBESURF_ENDPOINT/api/files/upload" \
  -F "files=@/path/to/file1.pdf" \
  -F "files=@/path/to/file2.jpg" \
  -F "session_id=optional-session-id"
```

**Response:**
```json
{
  "message": "Successfully uploaded 2 files",
  "files": [
    {
      "file_id": "uuid-string",
      "original_filename": "file1.pdf",
      "stored_filename": "file1.pdf",
      "session_id": null,
      "file_size": 12345,
      "mime_type": "application/pdf",
      "upload_time": "2026-02-08T12:00:00",
      "file_path": "/path/to/file"
    }
  ],
  "upload_directory": "/workspace/sessions/upload_files"
}
```

### Download File by ID

```bash
curl -X GET "$VIBESURF_ENDPOINT/api/files/download?file_id=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" \
  -o downloaded_file.pdf
```

### Download File by Path (Absolute or Relative)

**Using absolute path (preferred for direct file access):**
```bash
curl -X GET "$VIBESURF_ENDPOINT/api/files/download?file_path=/workspace/sessions/upload_files/myfile.pdf" \
  -o downloaded_file.pdf
```

**Using relative path from workspace:**
```bash
curl -X GET "$VIBESURF_ENDPOINT/api/files/download?file_path=sessions/upload_files/myfile.pdf" \
  -o downloaded_file.pdf
```

### List Uploaded Files

```bash
# List all files
curl -X GET "$VIBESURF_ENDPOINT/api/files"

# List with pagination
curl -X GET "$VIBESURF_ENDPOINT/api/files?limit=10&offset=0"

# List files for specific session
curl -X GET "$VIBESURF_ENDPOINT/api/files?session_id=optional-session-id"
```

**Response:**
```json
{
  "files": [
    {
      "file_id": "uuid-string",
      "original_filename": "document.pdf",
      "stored_filename": "document.pdf",
      "session_id": null,
      "file_size": 12345,
      "mime_type": "application/pdf",
      "upload_time": "2026-02-08T12:00:00",
      "file_path": "/workspace/sessions/upload_files/document.pdf"
    }
  ],
  "total_count": 1,
  "limit": 100,
  "offset": 0,
  "has_more": false,
  "session_id": null
}
```

### List Session Files

```bash
# List all files in a session directory
curl -X GET "$VIBESURF_ENDPOINT/api/files/session/{session_id}"

# Include directories
curl -X GET "$VIBESURF_ENDPOINT/api/files/session/{session_id}?include_directories=true"
```

**Response:**
```json
{
  "session_id": "session-uuid",
  "files": [
    {
      "name": "document.pdf",
      "path": "document.pdf",
      "size": 12345,
      "mime_type": "application/pdf",
      "modified_time": "2026-02-08T12:00:00",
      "type": "file"
    }
  ],
  "directories": [],
  "total_files": 1,
  "total_directories": 0
}
```

## File Upload Behavior

- Files are stored in workspace `upload_files` directory
- Duplicate filenames are automatically renamed (e.g., `file_1.pdf`, `file_2.pdf`)
- File metadata is stored in the database
- Session-specific files are stored in `sessions/{session_id}/upload_files`

## Query Parameters

### List Files Query

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| session_id | string | null | Filter by session ID |
| limit | integer | 100 | Number of results (-1 for all) |
| offset | integer | 0 | Pagination offset |

### Session Files Query

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| include_directories | boolean | false | Include directories in response |

## Download Options

Either `file_id` or `file_path` must be provided:

- **file_id**: UUID of the uploaded file (uses database lookup)
- **file_path**: **Absolute path** (e.g., `/workspace/sessions/upload_files/file.pdf`) or relative path (e.g., `sessions/upload_files/file.pdf`)

**Tip:** Use absolute path when you know the exact file location, as it's more reliable.

## Important Notes

- All file paths are validated for security (must be within workspace)
- Large file uploads may take time depending on network
- File download returns the file with original filename and correct MIME type
- Session files endpoint walks the entire session directory recursively

## Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| 400 Bad Request | Missing file_id or file_path in download | Provide either parameter |
| 403 Forbidden | File path outside workspace | Use valid file path |
| 404 Not Found | File not found | Check file_id or file_path |
| 500 Internal Error | File system or database error | Retry or check logs |

## Workflow

1. **Upload files** → POST `/api/files/upload`
2. **Get file_id** from upload response
3. **List files** to verify (optional) → GET `/api/files`
4. **Download file** → GET `/api/files/download?file_id={id}`
