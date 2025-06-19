# Music Files Directory

This directory (`public/music/`) contains all the audio files for the music player.

## File Structure
```
public/
└── music/
    ├── README.md (this file)
    ├── Undertale OST - Last Goodbye.mp3
    └── [your-new-music-files.mp3]
```

## How to Add New Music Files

### Step 1: Add Audio Files
Place your music files in this directory (`public/music/`). Supported formats:
- `.mp3` (recommended)
- `.wav` 
- `.ogg`
- `.m4a`

### Step 2: Extract Cover Art (Optional)
If your MP3 files have embedded cover art, extract them to the `covers/` subdirectory:
- See `covers/extract-instructions.md` for detailed instructions
- Save cover art as JPG files (e.g., `covers/your-song-cover.jpg`)

### Step 3: Update the Playlist
Edit `components/MusicPlayer.jsx` and add your tracks to the `playlist` array:

```javascript
const playlist = [
  {
    title: "Last Goodbye",
    artist: "Undertale OST", 
    album: "Undertale Soundtrack",
    filename: "Undertale OST - Last Goodbye.mp3",
    coverArt: "/music/covers/undertale-last-goodbye.jpg"  // Optional cover art
  },
  // ADD YOUR NEW TRACKS HERE:
  {
    title: "Your Song Title",
    artist: "Artist Name",
    album: "Album Name", 
    filename: "your-audio-file.mp3",  // Must match the filename in this directory
    coverArt: "/music/covers/your-cover-art.jpg"  // Optional, remove if no cover art
  },
  {
    title: "Another Song",
    artist: "Another Artist",
    album: "Another Album",
    filename: "another-song.mp3",
    coverArt: "/music/covers/another-cover.jpg"
  }
  // Add as many tracks as you want...
];
```

### Example:
If you want to add a song called "Epic Music.mp3" by "John Doe":

1. Copy `Epic Music.mp3` to this directory
2. Add this object to the playlist array:
```javascript
{
  title: "Epic Music",
  artist: "John Doe", 
  album: "John's Album",
  filename: "Epic Music.mp3"
}
```

## Current Music Files:
- `Undertale OST - Last Goodbye.mp3` (5.2MB)
- `Deltarune OST： 13 - Field of Hopes and Dreams.mp3` (6.2MB) 
- `Amore Mio Aiutami (Dream Version) ● Piero Piccioni.mp3` (10MB)

## Notes:
- Make sure the `filename` in the playlist exactly matches the actual filename
- Audio files should be web-optimized for better loading performance
- Recommended audio quality: 128-320 kbps MP3
- Keep filenames simple (avoid special characters when possible)

## Music Player Features:
✅ Play/Pause with improved functionality  
✅ Next/Previous track navigation  
✅ Volume control with mute toggle  
✅ Progress bar with seeking  
✅ Auto-advance to next track  
✅ Track counter (current/total)  
✅ Minimize/expand player  
✅ Loop through playlist  
✅ **Cover art display** - Shows album art if available  
✅ Fallback to music icon when cover art unavailable  
✅ Smooth cover art loading with fade-in effect  
✅ Album name display in track info  