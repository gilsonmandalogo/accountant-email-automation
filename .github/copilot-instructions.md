# Accountant Email Automation

ALWAYS follow these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

This is a Next.js web application designed as a Home Assistant add-on that automates monthly accounting tasks. It processes Wise financial statements, exports invoices from Vendus platform, and generates email files (.eml) with attachments for monthly reporting.

## Working Effectively

### Prerequisites and Environment Setup
- Node.js v22 is required (specified in .nvmrc) but v20+ works fine
- Uses Yarn as package manager (yarn.lock present)
- Puppeteer requires special handling due to network restrictions

### Bootstrap and Install Dependencies
- `PUPPETEER_SKIP_DOWNLOAD=true yarn install` -- Takes 2-3 seconds. REQUIRED: Always set PUPPETEER_SKIP_DOWNLOAD=true due to network restrictions preventing Chrome download.

### Build and Development
- `yarn build` -- Takes 32 seconds. NEVER CANCEL. Set timeout to 60+ minutes for safety.
- `yarn lint` -- Takes 2.5 seconds. NEVER CANCEL. Set timeout to 30+ minutes for safety.
- `yarn dev` -- Starts development server on port 3000 with Turbopack. Ready in ~1 second.
- `yarn start` -- Starts production server on port 3000. Requires build to run first. Ready in ~0.4 seconds.

### Docker Operations
- The application is designed to run as a Docker container for Home Assistant
- Dockerfile uses multi-stage build with Node.js 22-alpine base
- Production image uses chromium-browser for Puppeteer operations
- Environment variables are loaded via run.sh script for Home Assistant integration

## Key Architecture

### Application Structure
- Next.js 15 application with App Router
- TypeScript with strict configuration
- Three main functional areas:
  1. **Statements Processing** (`/src/app/actions/processStatements.ts`)
  2. **Invoice Export** (`/src/app/actions/exportInvoices.ts`) 
  3. **Email Generation** (`/src/app/api/generate-email/route.ts`)

### Critical Files
- `src/app/page.tsx` - Main UI with three sections (Statements, Export Invoices, Generate Email)
- `src/app/layout.tsx` - Application layout (Google Fonts removed due to network restrictions)
- `private/` - Directory for processed files (extrato.csv, extrato.pdf, faturas.zip)
- `config.yaml` - Home Assistant add-on configuration
- `run.sh` - Production startup script for Home Assistant

### Known Build Issues and Workarounds
- **Google Fonts**: Removed from layout.tsx due to network access restrictions
- **Puppeteer**: Must use `PUPPETEER_SKIP_DOWNLOAD=true` during installation
- **TypeScript**: Uses `as BodyInit` cast in generate-email route for NextResponse compatibility

## Validation and Testing

### Manual Testing Scenarios
ALWAYS test these scenarios after making changes:

1. **Statement Processing Test**:
   - Start dev server: `yarn dev`
   - Navigate to http://localhost:3000
   - Upload a CSV file with columns: Date,Description,Amount
   - Upload any PDF file  
   - Click "Generate CSV"
   - Verify files created in `private/extrato.csv` and `private/extrato.pdf`
   - Check server logs for "CSV file written successfully" and "PDF file written successfully"

2. **UI Functionality Test**:
   - Verify all three main sections render: Statements, Export Invoices, Generate Email
   - Verify month dropdowns work (defaults to August)
   - Verify locale inputs work (defaults to en-US in dev, pt-PT in production)
   - Verify all buttons are clickable and responsive

3. **Build Validation**:
   - `yarn build` completes without TypeScript or lint errors
   - `yarn start` successfully starts production server
   - Production build creates standalone server in `.next/standalone/`

### Environment Variables Required for Full Functionality
The application expects these environment variables (configured via Home Assistant):
- `VENDUS_URL` - Vendus platform URL
- `VENDUS_USER` - Vendus login username  
- `VENDUS_PASS` - Vendus login password
- `EMAIL_TO` - Target email address
- `SUBJECT` - Email subject template with {{month}} placeholder
- `TEMPLATE` - Email body template with {{month}} placeholder

### Pre-commit Validation
ALWAYS run these commands before committing changes:
- `yarn lint` -- Must pass with no errors or CI will fail
- `yarn build` -- Must complete successfully or deployment will fail

## Common Development Tasks

### File Processing Flow
1. User uploads Wise CSV/PDF statements via "Statements" section
2. Server processes CSV data, reformats dates/numbers for locale
3. Files saved to `private/extrato.csv` and `private/extrato.pdf`
4. User exports invoices via "Export Invoices" (requires Vendus credentials)
5. Invoices saved to `private/faturas.zip` via Puppeteer automation
6. User generates email via "Generate Email" section
7. Server creates .eml file with all attachments using nodemailer

### Debugging Puppeteer Issues
- Puppeteer runs in no-sandbox mode for container compatibility
- Check environment variable `PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser` in production
- Export invoices function includes 10-minute timeout for document processing
- Network idle waiting ensures page loads completely before interaction

### TypeScript and Linting
- Strict TypeScript configuration with Next.js plugins
- ESLint rules: no-unused-vars: warn, no-console: off, semi: error, quotes: single
- Import path alias: `@/*` maps to `./src/*`

## Development Server Output Examples

### Successful Build
```
✓ Compiled successfully in 1595ms
✓ Linting and checking validity of types
✓ Generating static pages (6/6)
Done in 31.71s
```

### Successful Dev Server Start
```
▲ Next.js 15.5.3 (Turbopack)
- Local:        http://localhost:3000
✓ Ready in 985ms
```

### Successful Statement Processing
```
CSV file written successfully
PDF file written successfully
POST / 200 in 79ms
```

## File Structure Reference
```
/
├── src/app/
│   ├── actions/           # Server actions for processing
│   ├── api/              # API routes
│   ├── components/       # React components  
│   ├── page.tsx          # Main UI page
│   └── layout.tsx        # App layout
├── private/              # Generated files directory
├── package.json          # Dependencies and scripts
├── next.config.ts        # Next.js configuration
├── tsconfig.json         # TypeScript configuration
├── eslint.config.mjs     # ESLint configuration
├── Dockerfile            # Container build instructions
├── config.yaml           # Home Assistant add-on config
└── run.sh               # Production startup script
```

CRITICAL TIMEOUTS:
- Build: 32 seconds actual, use 60+ minute timeout
- Lint: 2.5 seconds actual, use 30+ minute timeout  
- Install: 2-3 seconds actual, use 10+ minute timeout
NEVER CANCEL these operations before completion.