# Welcome to ALT Text!

- 🧑‍💻[Demo](alt-text.adamkindberg.com)

## Development

Run the dev server
using the package manager of your choice
I'll use pnpm.

```shellscript
pnpm dev
```

## Migration

Migrate using the db:migrate command to migrate the schema to your database
```shellscript
pnpm db:migrate
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.
