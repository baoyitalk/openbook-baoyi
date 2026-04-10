# Video Content Extraction Tech Stack

## Goal

Create a repeatable local workflow to extract long-form video knowledge and feed it into order-taking skills.

## Stack

- `ffmpeg` (`/opt/homebrew/bin/ffmpeg`)
  - Video to audio conversion
  - Compression to mono 16k mp3 for faster transcription
- `openai-whisper` (local Python venv)
  - Installed in `/tmp/whisper_env`
  - CLI command: `/tmp/whisper_env/bin/whisper`
- `PyTorch` (CPU on Apple Silicon in this run)
  - Inference backend required by Whisper
- Whisper model cache (reused)
  - `~/.cache/whisper/tiny.pt`
  - `~/.cache/whisper/small.pt`
- Output artifacts
  - `.txt` plain transcript
  - `.srt` subtitle file
  - `.vtt`, `.tsv`, `.json` structured outputs

## Current Workflow

1. Convert source mp4 to compact audio:
   - `/opt/homebrew/bin/ffmpeg -i <video>.mp4 -vn -ac 1 -ar 16000 -b:a 48k /tmp/<name>.mp3`
2. Run local Whisper transcription:
   - `PATH=/opt/homebrew/bin:$PATH /tmp/whisper_env/bin/whisper /tmp/<name>.mp3 --model tiny --language Chinese --task transcribe --output_dir /tmp/skill_transcripts --fp16 False --verbose False`
3. Collect outputs from `/tmp/skill_transcripts`.
4. Convert transcript into skill-ready references:
   - Topic summary
   - Actionable SOP
   - Quote/offer implications

## Runtime Notes

- `small` has better quality but is slower.
- `tiny` is faster and suitable for rough first-pass extraction.
- Ensure `ffmpeg` is on `PATH`; otherwise Whisper raises `FileNotFoundError: ffmpeg`.
- In restricted network environments, prefer local inference and cached models.

## Output-to-Skill Mapping

- Raw transcript -> `skills/*/references/video-transcripts/*.md`
- Clean summary -> `skills/*/references/video-playbooks/*.md`
- Practical checklist -> `skills/*/references/execution-checklists/*.md`
