# BOT (Baked On Time) - Landing Page

A lightweight, polished landing page for capturing waitlist signups with Supabase backend integration.

## 🚀 Quick Start

### 1. Deploy to GitHub Pages

1. Push this `landing` folder to your GitHub repository
2. Go to repository Settings → Pages
3. Set source to `main` branch and `/landing` folder
4. Your site will be live at `https://yourusername.github.io/repo-name/`

### 2. Set Up Supabase

#### Create Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for project initialization

#### Run Database Migration
1. Go to SQL Editor in Supabase dashboard
2. Copy contents of `supabase/migrations/001_create_waitlist_table.sql`
3. Paste and run the SQL
4. Verify table was created in Table Editor

#### Deploy Edge Functions

**Install Supabase CLI:**
```bash
npm install -g supabase
```

**Login to Supabase:**
```bash
supabase login
```

**Link your project:**
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

**Deploy the waitlist-signup function:**
```bash
supabase functions deploy waitlist-signup
```

**Deploy the stats function:**
```bash
supabase functions deploy stats
```

#### Get Your Function URL
After deployment, your function URL will be:
```
https://YOUR_PROJECT_REF.supabase.co/functions/v1/waitlist-signup
https://YOUR_PROJECT_REF.supabase.co/functions/v1/stats
```

### 3. Update Landing Page Configuration

Edit `script.js` and replace the placeholder URL:

```javascript
const SUPABASE_FUNCTION_URL = 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/waitlist-signup';
```

### 4. Test It Out

1. Open your landing page
2. Fill out the waitlist form
3. Submit and verify success message
4. Check Supabase Table Editor to see the new row

## 📊 View Analytics

Access your stats endpoint:
```
https://YOUR_PROJECT_REF.supabase.co/functions/v1/stats
```

Returns:
```json
{
  "success": true,
  "data": {
    "total_signups": 42,
    "baker_count": 28,
    "customer_count": 10,
    "curious_count": 4,
    "last_24h_signups": 5,
    "last_7d_signups": 15,
    "most_recent_signup": "2025-11-23T12:34:56Z",
    "breakdown_percentage": {
      "bakers": 67,
      "customers": 24,
      "curious": 9
    },
    "timestamp": "2025-11-23T14:22:10Z"
  }
}
```

## 🗂️ Project Structure

```
landing/
├── index.html          # Main landing page
├── style.css           # Styles with BOT branding
├── script.js           # Form handling & validation
└── README.md           # This file

supabase/
├── migrations/
│   └── 001_create_waitlist_table.sql    # Database schema
└── functions/
    ├── waitlist-signup/
    │   └── index.ts    # Signup handler
    └── stats/
        └── index.ts    # Analytics endpoint
```

## 🎨 Brand Colors

- Background: `#FFF5EC` (warm cream)
- Text: `#3C2F2F` (dark brown)
- Accent: `#F8C8D6` (soft pink)
- White: `#FFFFFF`

## ✨ Features

- ✅ Fully responsive design
- ✅ Email validation
- ✅ Role selection (Baker/Customer/Curious)
- ✅ Duplicate email prevention
- ✅ Loading states
- ✅ Success/error feedback
- ✅ No page refresh on submit
- ✅ Analytics tracking
- ✅ CORS-enabled APIs
- ✅ Zero dependencies (vanilla JS)

## 🔒 Security

- Row Level Security (RLS) enabled on database
- Service role authentication for Edge Functions
- Email validation on both client and server
- SQL injection protection via parameterized queries
- CORS configured for cross-origin requests

## 📝 Customization

### Change Form Fields
Edit `index.html` to add/remove fields, then update:
- `script.js` to capture new fields
- `waitlist-signup/index.ts` to validate & store them
- Database migration to add columns

### Add Email Notifications
Integrate with Resend, SendGrid, or similar:
1. Add email service in Edge Function
2. Send confirmation emails on signup
3. Store email preferences in database

### Add Analytics Tracking
Integrate Google Analytics, Plausible, or similar:
1. Add tracking script to `index.html`
2. Track conversion events in `script.js`

## 🚢 Deployment Checklist

- [ ] Database migration run successfully
- [ ] Edge Functions deployed
- [ ] Function URL updated in `script.js`
- [ ] Landing page pushed to GitHub
- [ ] GitHub Pages enabled
- [ ] Test form submission end-to-end
- [ ] Verify email shows in Supabase
- [ ] Check stats endpoint returns data
- [ ] Test on mobile devices
- [ ] Share URL with early testers

## 💡 Tips

- **Test Locally:** Use `python3 -m http.server 8000` in the `landing/` directory
- **Monitor Signups:** Check Supabase Table Editor regularly
- **Export Data:** Use Supabase SQL Editor to export CSV: `COPY waitlist_signups TO STDOUT WITH CSV HEADER`
- **Backup Data:** Enable daily backups in Supabase project settings

## 🆘 Troubleshooting

**Form not submitting?**
- Check browser console for errors
- Verify Function URL is correct in `script.js`
- Check Edge Function logs in Supabase dashboard

**Getting CORS errors?**
- Ensure Edge Functions include CORS headers
- Check browser console for specific error
- Verify OPTIONS requests are handled

**Database errors?**
- Confirm migration ran successfully
- Check RLS policies are enabled
- Verify service role key is set in Edge Functions

## 📚 Resources

- [Supabase Docs](https://supabase.com/docs)
- [Edge Functions Guide](https://supabase.com/docs/guides/functions)
- [GitHub Pages Docs](https://docs.github.com/pages)

---

Built with ❤️ for BOT (Baked On Time)
