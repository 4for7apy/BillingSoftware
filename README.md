# Vishal Special invoice maker

A dependency-free invoice app that runs entirely in the browser.

## Features

- Product catalog with saved rate, HSN/SAC, unit, and tax %
- Customer catalog with billing and shipping details
- Invoice builder with product selection for line items
- Saved invoices list with reopen/delete actions
- PDF export through the browser print dialog
- Local browser storage so everything stays free and offline

## How to use

1. Open `/Users/arpitsrivastav/Documents/New project/index.html` in a browser.
2. Add products and customers in the left panel.
3. Create or edit an invoice and choose products from the line-item dropdown.
4. Click `Save invoice` to keep it in the saved invoices list.
5. Click `Download PDF` and use `Save as PDF` in the print dialog.

## Notes

- No backend or paid service is required for this version.
- Data is stored in your browser on the current device.
- For production use, confirm tax/legal wording for your business.
- If you deploy on Vercel and use cloud save, set `GOOGLE_SCRIPT_URL` and `GOOGLE_SCRIPT_SECRET` as Vercel environment variables.
