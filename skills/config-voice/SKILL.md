---
name: config-voice
description: Use when user asks to configure voice profiles, manage ASR (Automatic Speech Recognition) settings, add/update voice configurations, perform speech-to-text conversion, or set up voice models like Qwen ASR, OpenAI Whisper, Gemini ASR.
---

# Config Voice - Voice Profile & ASR Management

## Overview

Manage voice profiles for VibeSurf. Configure ASR (Automatic Speech Recognition) providers, models, and perform speech-to-text conversion.

Supported ASR providers:
- **qwen-asr** - Alibaba Qwen ASR models
- **openai-asr** - OpenAI Whisper API
- **gemini-asr** - Google Gemini ASR

## When to Use

- User wants to add a new voice profile for ASR
- User needs to configure speech-to-text settings
- User wants to update voice profile settings (API key, model params, etc.)
- User needs to list or manage existing voice profiles
- User wants to perform voice recognition (ASR) on an audio file
- User wants to see available voice models

## API Endpoints

Base path: `$VIBESURF_ENDPOINT/api/voices`

### Voice Profile Management

| Action | Method | Endpoint | Description |
|--------|--------|----------|-------------|
| List Profiles | GET | `/api/voices/voice-profiles?active_only=true` | List all voice profiles |
| Get Profile | GET | `/api/voices/{voice_profile_name}` | Get specific profile details |
| Create Profile | POST | `/api/voices/voice-profiles` | Create new voice profile |
| Update Profile | PUT | `/api/voices/voice-profiles/{voice_profile_name}` | Update existing profile |

### ASR (Speech Recognition)

| Action | Method | Endpoint | Description |
|--------|--------|----------|-------------|
| Perform ASR | POST | `/api/voices/asr` | Transcribe audio file to text |

### Model Management

| Action | Method | Endpoint | Description |
|--------|--------|----------|-------------|
| List Models | GET | `/api/voices/models` | Get available voice models |

## Request Examples

### Create ASR Profile

```json
POST /api/voices/voice-profiles
{
  "voice_profile_name": "my-qwen-asr",
  "voice_model_type": "asr",
  "voice_model_name": "qwen-asr",
  "api_key": "sk-...",
  "voice_meta_params": {
    "asr_model_name": "qwen-audio-asr-latest"
  },
  "description": "Qwen ASR for Chinese speech recognition"
}
```

### Create OpenAI Whisper Profile

```json
POST /api/voices/voice-profiles
{
  "voice_profile_name": "my-whisper",
  "voice_model_type": "asr",
  "voice_model_name": "openai-asr",
  "api_key": "sk-...",
  "voice_meta_params": {
    "asr_model_name": "whisper-1",
    "base_url": "https://api.openai.com/v1"  // Optional, for custom endpoints
  },
  "description": "OpenAI Whisper for English transcription"
}
```

### Update Profile

```json
PUT /api/voices/voice-profiles/my-qwen-asr
{
  "api_key": "new-api-key",
  "description": "Updated description",
  "is_active": true
}
```

### Perform ASR (Speech Recognition)

```bash
POST /api/voices/asr
Content-Type: multipart/form-data

Form fields:
- audio_file: <audio file> (required) - Audio file to transcribe (wav, mp3, etc.)
- voice_profile_name: "my-qwen-asr" (required) - Name of the voice profile to use
```

**Response:**
```json
{
  "success": true,
  "voice_profile_name": "my-qwen-asr",
  "voice_model_name": "qwen-asr",
  "recognized_text": "Transcribed text from audio",
  "filename": "recording.wav",
  "saved_audio_path": "/workspace/audios/asr-20250210_120000_000.wav"
}
```

## Profile Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| voice_profile_name | string | Yes | Unique profile identifier |
| voice_model_type | string | Yes | Type: `"asr"` or `"tts"` (currently ASR is supported) |
| voice_model_name | string | Yes | Model name: `qwen-asr`, `openai-asr`, `gemini-asr` |
| api_key | string | No | API key for the provider (required for most providers) |
| voice_meta_params | object | No | Model-specific parameters |
| description | string | No | Profile description |
| is_active | bool | No | Whether the profile is active (default: true) |

### voice_meta_params by Provider

**Qwen ASR:**
| Parameter | Type | Description |
|-----------|------|-------------|
| asr_model_name | string | Qwen model name, e.g., `qwen-audio-asr-latest` |

**OpenAI Whisper:**
| Parameter | Type | Description |
|-----------|------|-------------|
| asr_model_name | string | Model name, e.g., `whisper-1` |
| base_url | string | Optional custom base URL for OpenAI-compatible APIs |

**Gemini ASR:**
| Parameter | Type | Description |
|-----------|------|-------------|
| asr_model_name | string | Gemini model name |

## Workflow

### Setting up a Voice Profile

1. **Get available models** → `GET /api/voices/models`
2. **Create profile** → `POST /api/voices/voice-profiles`
3. **Verify profile** → `GET /api/voices/{voice_profile_name}`

### Performing Speech Recognition

1. **Ensure profile exists** → `GET /api/voices/voice-profiles` (list active profiles)
2. **Submit audio for transcription** → `POST /api/voices/asr` with `audio_file` and `voice_profile_name`
3. **Get recognized text** from response `recognized_text` field

## Error Handling

| Error | Solution |
|-------|----------|
| Profile not found | Verify `voice_profile_name` exists: `GET /api/voices/voice-profiles` |
| Profile is inactive | Activate profile: `PUT /api/voices/voice-profiles/{name}` with `"is_active": true` |
| Invalid voice_model_type | Must be `"asr"` or `"tts"` |
| Model not supported | Check available models: `GET /api/voices/models` |
| ASR failed | Check API key is valid and audio file format is supported |

## Notes

- Audio files are saved to `{workspace_dir}/audios/` with timestamp-based filenames
- Supported audio formats depend on the ASR provider (typically WAV, MP3, M4A)
- The `voice_profile_name` parameter is required for ASR requests
- Profiles store API keys encrypted in the database
