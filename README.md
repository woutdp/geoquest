## Instances

List of instances where you can use this software:
* [https://geoquest.gg](https://geoquest.gg)
* [https://geoquest.spirio.fr](https://geoquest.spirio.fr)

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

## Docker

### To build and run from source
```bash
git clone https://github.com/woutdp/geoquest.git
cd geoquest
docker build -t geoquest:latest .
docker run -p 3000:3000 localhost/geoquest:latest
# then browse to http://localhost:3000
```

### To run from an already built version

```bash
docker run -p 3000:3000 docker.io/spiriospirio/geoquest
# then browse to http://localhost:3000
```

## Contributing

The code at the moment is still a bit messy, especially the code for handling different 'game modes'. Feel free to refactor, fix or add features.
