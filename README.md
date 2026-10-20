# Realestate

A Toronto property discovery proof of concept combining map markers, listing cards and property comments.

[Live demo](https://jp-realestate.vercel.app/)

## Local development

Run these commands from the repository root:

```sh
npm install
npm run dev
```

Available scripts:

- `npm run build`: `tsc && vite build`.
- `npm run lint`: `eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0`.
- `npm run preview`: `vite preview`.

## Main dependencies

`react`, `firebase`. See `package.json` for the full dependency list and versions.

Configure the external services used by the application before testing data-dependent features. Use your own development credentials and keep secrets out of Git.
