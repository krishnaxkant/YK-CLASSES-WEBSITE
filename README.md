# Y.K. Classes Website

A React + Vite website for Y.K. Classes. The frontend uses React Router, Framer Motion and Lucide icons. The local Express server and Vercel serverless function handle website enquiry emails.

## Requirements

- Node.js 20.19+ (Node.js 22 LTS is recommended)
- npm

## Run locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a local environment file by copying `.env.example` to `.env`, then add a Google App Password for the institute Gmail account. Never commit or share `.env`.

   **Windows PowerShell:**

   ```powershell
   Copy-Item .env.example .env
   ```

   **macOS / Linux:**

   ```bash
   cp .env.example .env
   ```

3. Start the local enquiry API in one terminal:

   ```bash
   npm run server
   ```

4. Start the Vite frontend in a second terminal:

   ```bash
   npm run dev
   ```

   Open the local URL printed by Vite.

The Vite development server proxies `/api` requests to `http://localhost:5000`, so the Express server must be running to test enquiry submissions.

## Useful commands

```bash
npm run dev      # Start the frontend
npm run server   # Start the local Express enquiry API
npm run build    # Create a production frontend build in dist/
npm run preview  # Preview the production build
npm run lint     # Run ESLint
```

## Email and deployment notes

- The website sends enquiries through Gmail SMTP using Nodemailer.
- Use a Google App Password, not the normal Gmail password.
- For Vercel deployment, add `GMAIL_USER`, `GMAIL_APP_PASSWORD`, and `ENQUIRY_TO` as environment variables for the environments you use, then redeploy. Vercel does not read your local `.env` file.
- Keep `.env` and `.env.local` private; never commit them to Git.
- Vercel uses `api/send-enquiry.js` for the `/api/send-enquiry` endpoint.
- The student review cards in `src/Home.jsx` currently contain placeholder names and quotes. Replace them with approved, genuine student details before publishing the website.

## Project structure

```text
.
├── api/                  # Vercel serverless enquiry function
├── public/               # Static assets (including logo.png)
├── shared/               # Shared enquiry email handler
├── src/
│   ├── components/       # Navbar, Footer and shared layout
│   ├── pages/            # Fees, Reviews and YKSAT pages
│   ├── App.jsx           # Routes
│   ├── Home.jsx          # Home page
│   └── App.css           # Main site styles
├── server.js             # Local Express enquiry API
├── vite.config.js
├── vercel.json
└── package.json
```
