# Universal Video Booster & Shortcuts

A Tampermonkey script that provides sound amplification (up to 10,000%), noise reduction, and fast forward using left/right arrow keys. Ideal for watching school lecture videos.

## Features

- 🔊 **Volume Booster:** Amplify video sound up to 10000%.
- ⏸️ **Play/Pause:** Toggle playback with the spacebar.
- ⏪ **Rewind:** Jump back 10 seconds with the left arrow.
- ⏩ **Fast Forward:** Jump ahead 10 seconds with the right arrow.
- ⬆️ **Increase Volume:** Use the up arrow to boost volume.
- ⬇️ **Decrease Volume:** Use the down arrow to lower volume.
- 🎛️ **Noise Filter:** Reduce background noise for clearer audio.
  - 🔄 Toggle on/off with **N** key.
  - 🎚️ Adjust noise filter frequency with **Ctrl + Up⬆️/Down⬇️** (500Hz - 6000Hz).
- 🔄 **Language Support:** Auto-detects browser language (English/Chinese).

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) for your browser.
2. Click [here](https://github.com/your-repo/universal-video-booster/raw/main/universal-video-booster.user.js) to install the script.

## Whitelist Setup

To make the script run only on specific websites, modify the `@match` lines in the script's metadata. For example:

```javascript
// @match        https://moodle.xxx.edu.tw/*
// @match        https://example.com/*
```

This ensures the script only activates on those websites.

## Usage

1. Visit any website with an HTML5 video.
2. Use the keyboard shortcuts to control playback and boost volume.
3. A visual overlay will appear to confirm actions.

## Compatibility

- Works on most websites with `<video>` elements.
- Tested with Moodle and other educational platforms.

## Changelog

- **v2025-03-20**: Initial release with multi-language support and universal video boosting.

## License

[MIT License](LICENSE)

---
✉ Created by [Microdust](https://github.com/micr0dust)

Feel free to contribute, suggest new features, or report bugs!

![thumbnail](./icon.png)
