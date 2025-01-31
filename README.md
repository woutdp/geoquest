## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open

# to automatically format the code
npm run format
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Contributing

The code at the moment is still a bit messy, especially the code for handling different 'game modes'. Feel free to refactor, fix or add features.

### Contributing Translations

Translations can be added, corrected in the `src/lib/translations` folder.  
When adding a new language, add the corresponding language identifier in `index.ts` in `availableLocales`. After that, all that is left
is to add the translation files in a folder with the same identifier. You can base model these according to the structure in the english files

If you want to add maps, feel free to do so, but be aware that we're almost hitting the storage limit of Cloudflare Pages so it might not be possible to do so.
