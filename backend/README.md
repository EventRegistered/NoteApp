## README.md

```md
# Notes Backend (SQL Server)

## Setup

1. Copy `.env.example` to `.env` and fill values.
2. Install dependencies: `npm install`.
3. Start the server in development: `npm run dev`.

## DB

Defaults target SQL Server. Ensure your DB is available and creds in `.env` are correct.

## Notes

This is an example app scaffold. For production, add migrations, logging, metrics, and a secrets manager.
```

---

# Done

All files have been generated above. You can copy them into `backend/` in your repo.

If you want I can:
- produce a downloadable ZIP of these files,
- output SQL migration scripts instead of `sequelize.sync()`,
- convert to Prisma, or
- add refresh token flow and tests.

Tell me which you want next.

Here is the **exact step-by-step guide** to use **cross-env** so your Node.js project works on **Windows, macOS, and Linux** with no changes.

---

# ✅ **Step 1 — Install cross-env**

Run this in your project folder:

```sh
npm install --save-dev cross-env
```

This adds it to your devDependencies.

---

# ✅ **Step 2 — Update your package.json scripts**

Find your current script:

```json
"scripts": {
  "dev": "NODE_ENV=development nodemon src/server.js"
}
```

Replace it with:

```json
"scripts": {
  "dev": "cross-env NODE_ENV=development nodemon src/server.js"
}
```

This makes the environment variable compatible with **all operating systems**.

---

# ✅ **Step 3 — Run your dev server**

```sh
npm run dev
```

Now it works on:

* Windows CMD
* Windows PowerShell
* Windows Git Bash
* Linux
* macOS

---

# ⭐ Optional: Add more env variables

Example with more variables:

```json
"scripts": {
  "dev": "cross-env NODE_ENV=development PORT=4000 DEBUG=true nodemon src/server.js"
}
```

All of these will be available in your Node app via:

```js
process.env.NODE_ENV
process.env.PORT
process.env.DEBUG
```

---

# 🎉 You’re done!

If you want, I can also help you:

* verify `nodemon.json`
* configure `.env` with **dotenv**
* set up SQL Server connection via environment variables

Just tell me!
