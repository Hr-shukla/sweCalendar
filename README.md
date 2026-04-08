# My SWE Calendar Project 

Hey there! wlcm to my wall calendar project. I built this using React 18 and Vite because I wanted a simple, interactive calendar without pulling in huge frameworks like Next.js or heavy UI libraries. Just clean, straightforward code.

## What it does

I tried to give it that classic wall calendar feel, complete with a hero image at the top and ring holes for binding. Here are some of the cool things you can do with it:

- Click and drag across days to select date ranges (yep, it works on touch screens too!)
- Write notes for specific dates or ranges. Everything saves securely to your browser's local storage so you won't lose them when you refresh.
- See little dots on the days that have notes saved.
- Spot Indian public holidays right on the grid.
- Change the look and feel with 5 different color themes.
- Swap out the top picture by clicking the upload button on the image. (If you don't upload one, it'll just use the default images from the folder).
- Use it on any device. I made sure it naturally stacks into a nice vertical layout on phones and smaller tablets.

## How to run it locally

Getting it running is super easy. Just clone it down and run:

```bash
npm install
npm run dev
```

Then hop over to **http://localhost:5173** in your browser.

If you want to build it for production:

```bash
npm run build
npm run preview
```

## How to use it

It's pretty intuitive, but here’s a quick guide just in case:
- **Move around:** Use the ‹ / › buttons next to the month name.
- **Go back to today:** Hit the "Today" button.
- **Select dates:** Click and drag across the calendar grid.
- **Save a note:** Select your date range, type your thought, and hit "Save note".
- **Delete a note:** Just click the ✕ next to the note you want to ditch.
- **Change themes:** Tap one of the colored dots in the month panel.
- **Change the picture:** Look for the upload button floating at the bottom right of the top image.

Feel free to break things, experiment, and make it your own! Have fun with it. 🎉
