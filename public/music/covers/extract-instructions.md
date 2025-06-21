# Cover Art Extraction Instructions

This directory contains cover art images for the music player tracks.

## How to Extract Cover Art from MP3 Files

### Method 1: Using ffmpeg (Recommended)
If you have ffmpeg installed:

```bash
# Extract cover art from Undertale OST
ffmpeg -i "Undertale OST - Last Goodbye.mp3" -an -vcodec copy "covers/undertale-last-goodbye.jpg"

# Extract cover art from Deltarune OST  
ffmpeg -i "Deltarune OST： 13 - Field of Hopes and Dreams.mp3" -an -vcodec copy "covers/deltarune-field-of-hopes.jpg"
```

### Method 2: Using VLC Media Player
1. Open VLC Media Player
2. Open the MP3 file
3. Go to Tools → Media Information
4. Right-click on the cover art → Save Image As
5. Save to this directory with the appropriate filename

### Method 3: Using Windows Media Player
1. Right-click MP3 file → Properties
2. Go to Details tab
3. Right-click on album art → Copy
4. Paste into image editor and save as JPG

### Method 4: Online Tools
- Use online MP3 metadata extractors
- Upload your MP3 file
- Download the extracted cover art

## Naming Convention
Save cover art files as:
- `undertale-last-goodbye.jpg` - For Undertale OST
- `deltarune-field-of-hopes.jpg` - For Deltarune OST
- Use lowercase, replace spaces with hyphens

## File Format
- Preferred: JPG or PNG
- Recommended size: 300x300px to 500x500px
- Keep file size under 200KB for web performance

## Current Cover Art Files
- [x] undertale-last-goodbye.jpg
- [x] deltarune-field-of-hopes.jpg
- [x] piero-piccioni-greatest-hits.jpg
- [x] naruto-shippuden.jpg
- [x] crossing-field-orchestra.jpg
- [ ] pokemon-diamond-pearl.jpg (placeholder created)
- [ ] polaris-peace-sign.jpg (placeholder created)
- [ ] sonic-colors-final-boss.jpg (placeholder created)
- [ ] one-piece.jpg (placeholder created)

## Extracting Cover Art for New Songs

For the new songs added, you can extract cover art using:

```bash
# Pokemon Diamond & Pearl
ffmpeg -i "Pokemon Diamond & Pearl.mp3" -an -vcodec copy "covers/pokemon-diamond-pearl.jpg"

# Polaris X Peace Sign
ffmpeg -i "Polaris X Peace Sign.mp3" -an -vcodec copy "covers/polaris-peace-sign.jpg"

# Sonic Colors Final Boss
ffmpeg -i "Sonic Colors _Final Boss Phase.mp3" -an -vcodec copy "covers/sonic-colors-final-boss.jpg"

# One Piece
ffmpeg -i "one_piece.mp3" -an -vcodec copy "covers/one-piece.jpg"
```

After extracting the cover art, the music player will automatically display them! 