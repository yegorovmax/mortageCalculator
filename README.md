# Mortgage Calculator

A mobile-friendly mortgage calculator with a clean black and white design, similar to what you'd find on Zillow and Redfin.

## Features

- **Mobile-First Design**: Optimized for mobile devices with responsive layout
- **Real-Time Calculations**: Updates results as you type
- **Comprehensive Inputs**: 
  - Home price
  - Down payment (with quick percentage buttons)
  - Loan term (15, 20, 25, or 30 years)
  - Interest rate
  - Property tax (annual)
  - Home insurance (annual)
  - PMI (Private Mortgage Insurance)
- **Detailed Results**:
  - Monthly payment breakdown
  - Principal & Interest
  - Property tax
  - Insurance
  - PMI
  - Total interest paid
  - Total amount paid
  - Loan amount
- **Input Validation**: Error handling and user feedback
- **Clean UI**: Black and white color scheme with modern design

## How to Use

1. Open `index.html` in your web browser
2. Enter the home price
3. Set your down payment (use percentage buttons for quick entry)
4. Select loan term
5. Enter interest rate
6. Add property tax and insurance amounts
7. Set PMI if applicable
8. Results update automatically as you type

## Mobile Features

- Touch-friendly interface
- Responsive design for all screen sizes
- Optimized input handling for mobile keyboards
- Smooth animations and transitions

## Files

- `index.html` - Main HTML structure
- `styles.css` - CSS styling with mobile-first design
- `script.js` - JavaScript calculation logic and interactions

## Browser Support

Works on all modern browsers including:
- Chrome
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Calculation Formula

The calculator uses the standard mortgage payment formula:

```
M = P [ r(1 + r)^n ] / [ (1 + r)^n - 1 ]
```

Where:
- M = Monthly payment
- P = Principal loan amount
- r = Monthly interest rate
- n = Number of payments
