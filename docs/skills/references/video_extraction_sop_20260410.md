# Video Extraction SOP (2026-04-10)

## Input Videos

- `/Users/johnpeng/Downloads/接外包项目创业，如何选择最好的平台？ - 001 - 接外包项目创业，如何选择最好的平台？.mp4`
- `/Users/johnpeng/Downloads/AI时代下，老码农该何去何从？一点让你豁然开朗的建议 - 001 - AI时代下，老码农该何去何从？一点让你豁然开朗的建议.mp4`

## Runtime Stack

- `ffmpeg` for audio extraction/compression
- `openai-whisper` local inference
- `torch` CPU backend
- cached local models:
  - `~/.cache/whisper/tiny.pt`
  - `~/.cache/whisper/small.pt`

## Executed Commands

```bash
/opt/homebrew/bin/ffmpeg -y -i "<video_1>.mp4" -vn -ac 1 -ar 16000 -b:a 48k /tmp/skill_video_1.mp3
/opt/homebrew/bin/ffmpeg -y -i "<video_2>.mp4" -vn -ac 1 -ar 16000 -b:a 48k /tmp/skill_video_2.mp3

PATH=/opt/homebrew/bin:$PATH /tmp/whisper_env/bin/whisper /tmp/skill_video_1.mp3 \
  --model tiny --language Chinese --task transcribe \
  --output_dir /tmp/skill_transcripts --fp16 False --verbose False

PATH=/opt/homebrew/bin:$PATH /tmp/whisper_env/bin/whisper /tmp/skill_video_2.mp3 \
  --model tiny --language Chinese --task transcribe \
  --output_dir /tmp/skill_transcripts --fp16 False --verbose False
```

## Output Artifacts

- `/tmp/skill_transcripts/skill_video_1.txt`
- `/tmp/skill_transcripts/skill_video_1.srt`
- `/tmp/skill_transcripts/skill_video_1.json`
- `/tmp/skill_transcripts/skill_video_2.txt`
- `/tmp/skill_transcripts/skill_video_2.srt`
- `/tmp/skill_transcripts/skill_video_2.json`

## Notes

- `tiny` was used for speed. For higher text quality, rerun with `--model small`.
- Ensure `PATH` contains `/opt/homebrew/bin`; otherwise Whisper cannot find `ffmpeg`.
