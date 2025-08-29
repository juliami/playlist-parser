
## cover-collage

Find album covers from a pasted playlist and build a downloadable 2x2 collage.

### Features
- Paste playlist text (tab-separated or bracket format)
- Automatically detect albums and fetch covers
- Show one cover per album with an inline refresh (⟳) to cycle/refetch
- Select any 4 covers and download a 2x2 collage (900×900) as `YYYY-MM-DD-matrix900.png`
- Toggle back to edit the playlist input at any time

### Input formats
- Tabs (preferred): `Artist\tTrack\t[Year]\t[Duration]\tAlbum`
- Tabs (short): `Artist\tTrack\tAlbum`
- Fallback: `Artist - [Album #03] Track`

Trailing parentheses like `(2012 Remastered)` are removed when searching.

### Quick start
1. Install dependencies: `npm install`
2. Start dev server: `npm start`
3. Open the app in your browser, paste your playlist, and click Go!

### Usage
- After Go!, the textarea collapses to give space to results.
- Each album shows a single current cover. Click ⟳ to try another candidate or refetch.
- Click a cover to select/deselect it. When exactly 4 are selected, click
  “Download 2x2 collage (900x900)” to save the image (named `YYYY-MM-DD-matrix900.png`).
- Click “Edit playlist” to return to the input view and modify your text.

### Testing
- Run tests once: `npm test -- --watchAll=false`

### Build
- Production build: `npm run build`

### Troubleshooting
- OpenSSL/webpack error on newer Node: the project’s `package.json` scripts
  include `NODE_OPTIONS=--openssl-legacy-provider` for `start`, `build`, and `test`.

### Tech
- React, react-jss, CRA tooling, iTunes Search API for cover lookup

### Credits
- Built and vibe-coded collaboratively with an AI pair programmer in Cursor.

