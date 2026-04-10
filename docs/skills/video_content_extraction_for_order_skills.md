# Video Content Extraction -> Order Skills SOP

## Use Case

When we need to turn long videos into reusable order-taking knowledge, use this SOP.

## Standard Steps

1. Input video files from local disk.
2. Convert to compressed mono audio with `ffmpeg`.
3. Run local Whisper transcription (prefer cached model first).
4. Produce multi-format outputs (`txt/srt/json/tsv/vtt`).
5. Clean transcript and extract:
   - Decision frameworks
   - Platform/channel choices
   - Quote and scope strategies
   - Risk control checklists
6. Write findings into skill references.

## Command Template

```bash
/opt/homebrew/bin/ffmpeg -y -i "<video>.mp4" -vn -ac 1 -ar 16000 -b:a 48k "/tmp/<name>.mp3"
PATH=/opt/homebrew/bin:$PATH /tmp/whisper_env/bin/whisper "/tmp/<name>.mp3" \
  --model tiny --language Chinese --task transcribe \
  --output_dir /tmp/skill_transcripts --fp16 False --verbose False
```

## This Round Inputs

- `接外包项目创业，如何选择最好的平台？`
- `AI时代下，老码农该何去何从？一点让你豁然开朗的建议`

## This Round Outputs

- `/tmp/skill_transcripts/skill_video_1.txt` (+ srt/json/tsv/vtt)
- `/tmp/skill_transcripts/skill_video_2.txt` (+ srt/json/tsv/vtt)

## Integration Targets

- `~/.codex/skills/freelance-quote-map-cn/references/`
- `~/.codex/skills/ai-order-studio/references/`
