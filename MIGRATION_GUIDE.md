# Architecture Migration Guide: NestJS → Next.js API Routes

## ✅ Migration Complete!

Your application has been successfully redesigned to use **Next.js API routes** instead of a separate NestJS backend. This eliminates the need to run two servers and simplifies your deployment.

## New Architecture

```
src/
├── app/
│   ├── api/alerts/          ← API Route Handlers
│   │   ├── vehicles/route.ts
│   │   ├── alarm-types/route.ts
│   │   ├── count/route.ts
│   │   ├── details/route.ts
│   │   ├── bulk-counts/route.ts
│   │   └── send-email/route.ts
│   ├── page.tsx             ← Dashboard (updated to use /api endpoints)
│   ├── alerts/page.tsx      ← Alerts page (updated to use /api endpoints)
│   └── ...
├── lib/
│   ├── config/              ← Configuration files
│   │   ├── alarms.ts
│   │   ├── vehicles.ts
│   │   └── mail.ts
│   ├── services/            ← Business logic
│   │   ├── masstrans.service.ts
│   │   ├── pdf.service.ts
│   │   └── mail.service.ts
│   └── utils/               ← Utilities
│       └── validation.ts
└── components/
    └── ...

.env.local                   ← Environment variables
```

## What Changed

### Before (NestJS Backend)
- Separate NestJS server running on `http://127.0.0.1:3001`
- Frontend called external backend APIs
- Required two separate `npm start` commands

### After (Next.js API Routes)
- Unified Next.js application with built-in API routes
- Frontend calls co-located `/api` endpoints
- Single `npm run dev` command

## API Endpoints

All API endpoints are now available at `/api/alerts/`:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/alerts/vehicles` | Get list of vehicles |
| GET | `/api/alerts/alarm-types` | Get list of alarm types |
| POST | `/api/alerts/count` | Get alarm count for specific alarm |
| POST | `/api/alerts/details` | Get detailed alert records |
| POST | `/api/alerts/bulk-counts` | Get counts for all alarm types |
| POST | `/api/alerts/send-email` | Generate PDF and send via email |

## Environment Variables

The `.env.local` file contains:

```env
# Masstrans API Configuration
NEXT_PUBLIC_MASSTRANS_API_BASE=http://52.66.177.17:12056/api/v1/basic/alarm
MASSTRANS_API_KEY=your_api_key

# Email Configuration (AWS SES SMTP)
MAIL_HOST=email-smtp.ap-south-1.amazonaws.com
MAIL_PORT=587
MAIL_USER=your_ses_user
MAIL_PASS=your_ses_password
MAIL_FROM=sender_email@domain.com
```

**⚠️ Important:** Never commit `.env.local` to version control. Add it to `.gitignore`.

## Running the Application

```bash
# Install dependencies (already done)
npm install

# Development mode (with hot reload)
npm run dev

# Production build
npm run build

# Production mode
npm start
```

The application will run on `http://localhost:3000` by default.

## Key Files

### API Route Handlers
- **[src/app/api/alerts/vehicles/route.ts](src/app/api/alerts/vehicles/route.ts)** - Vehicle listing
- **[src/app/api/alerts/count/route.ts](src/app/api/alerts/count/route.ts)** - Alarm count fetching
- **[src/app/api/alerts/details/route.ts](src/app/api/alerts/details/route.ts)** - Alert details
- **[src/app/api/alerts/send-email/route.ts](src/app/api/alerts/send-email/route.ts)** - Email sending

### Services
- **[src/lib/services/masstrans.service.ts](src/lib/services/masstrans.service.ts)** - External Masstrans API calls
- **[src/lib/services/pdf.service.ts](src/lib/services/pdf.service.ts)** - PDF generation
- **[src/lib/services/mail.service.ts](src/lib/services/mail.service.ts)** - Email sending via nodemailer

### Configuration
- **[src/lib/config/alarms.ts](src/lib/config/alarms.ts)** - Alarm type mappings
- **[src/lib/config/vehicles.ts](src/lib/config/vehicles.ts)** - Vehicle mappings
- **[src/lib/config/mail.ts](src/lib/config/mail.ts)** - Email configuration

## Cleanup Steps

To remove the old NestJS backend files:

```bash
# Remove backend directory if no longer needed
rm -rf backend/

# Update .gitignore to exclude old backend
echo "backend/" >> .gitignore
```

## Troubleshooting

### Issue: "Cannot reach API" error
- Make sure Next.js is running: `npm run dev`
- Check that port 3000 is not blocked

### Issue: Email not sending
- Verify AWS SES credentials in `.env.local`
- Check AWS SES sandbox settings if emails are not verified
- Review email addresses for typos

### Issue: PDF generation fails
- Ensure `pdfkit` is installed: `npm list pdfkit`
- Check server logs for detailed error messages

## Dependencies Added

- **nodemailer**: For sending emails via SMTP
- **pdfkit**: For PDF generation

These are already installed in `package.json`.

## Frontend Updates

Both frontend pages have been updated to use the new API routes:

- [src/app/page.tsx](src/app/page.tsx) - Dashboard
- [src/app/alerts/page.tsx](src/app/alerts/page.tsx) - Alerts page

All API calls now use relative paths (`/api/...`) instead of hardcoded backend URLs.

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Configure environment variables in `.env.local`
3. Run development server: `npm run dev`
4. Test API endpoints in the browser/client
5. Deploy to your hosting platform

## Support

For issues or questions:
1. Check the API route handler implementations
2. Review service layer logic
3. Verify environment variables are set correctly
4. Check browser console for client-side errors
5. Review server logs for backend errors
