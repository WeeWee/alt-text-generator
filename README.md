# Welcome to ALT Text!
Alt text is a AI tool created to enchance your alt text, making it easier for you
- 🧑‍💻[Demo](alttext.adamkindberg.com)

## Development

Run the dev server
using the package manager of your choice
I'll use pnpm.

```shellscript
pnpm dev
```

## Generate SQL and Migration

Generate SQL using the db:generate command to generate the SQL from the schema
```shellscript
pnpm db:generate
```
Migrate using the db:migrate command to migrate the SQL to your database
```shellscript
pnpm db:migrate
```

## Deployment

First, build your app for production:

```sh
pnpm build
```

Then run the app in production mode:

```sh
pnpm start
```

