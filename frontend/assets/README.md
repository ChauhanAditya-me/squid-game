# Audio Assets

Place your audio files in this directory with the following names:

## Required Audio Files

1. **background.mp3**
   - Type: Background music (looping)
   - Duration: 2-5 minutes recommended
   - Mood: Tense, dramatic
   - Suggested: Dark ambient music or orchestral tension

2. **move.mp3**
   - Type: Sound effect
   - Duration: 0.5-1 second
   - Purpose: Played when player makes a successful move
   - Suggested: Soft "whoosh" or positive chime

3. **win.mp3**
   - Type: Sound effect
   - Duration: 1-3 seconds
   - Purpose: Played when player wins a round
   - Suggested: Victory fanfare or triumphant chord

4. **lose.mp3**
   - Type: Sound effect
   - Duration: 1-2 seconds
   - Purpose: Played when player is eliminated
   - Suggested: Dramatic impact or elimination sound

5. **shatter.mp3**
   - Type: Sound effect
   - Duration: 1-2 seconds
   - Purpose: Played when glass breaks in Glass Bridge
   - Suggested: Glass breaking/shattering sound

## Where to Find Audio

### Free Audio Sources:
- **Freesound.org** - Community uploaded sounds (CC licenses)
- **YouTube Audio Library** - Free music and sound effects
- **Incompetech.com** - Royalty-free music by Kevin MacLeod
- **ZapSplat.com** - Free sound effects
- **SoundBible.com** - Free sound clips

### Creating Your Own:
You can use tools like:
- Audacity (free audio editor)
- GarageBand (Mac)
- FL Studio (Windows)
- Online TTS or sound generators

## Format Requirements

- **Format**: MP3 recommended (supported by all browsers)
- **Alternative formats**: OGG, WAV (update HTML audio tags)
- **Bitrate**: 128kbps or higher for music, 64kbps for effects
- **Sample Rate**: 44.1kHz standard

## No Audio?

The game will work without audio files. The code includes error handling that will:
- Gracefully fail if audio files are missing
- Log console messages instead of crashing
- Continue game functionality normally

## License Considerations

⚠️ **Important**: Ensure you have the right to use any audio files in your project.
- Check licenses for commercial vs personal use
- Attribute creators as required
- Avoid copyrighted material without permission

## Testing Audio

After adding files, open the browser console to check for:
- Audio loading errors
- Autoplay policy blocks (click page to enable)
- Format compatibility issues

Enjoy your game with immersive audio! 🔊
