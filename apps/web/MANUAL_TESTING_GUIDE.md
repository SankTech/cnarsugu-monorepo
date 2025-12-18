# Manual Testing Guide - Web App Checkpoint 35

## Quick Start

```bash
cd apps/web
npm run dev
```

Open browser to: http://localhost:3000

## 1. Product Flow Testing (30 minutes)

### Test 1: Auto Prestige Flow
**Steps:**
1. Click "Auto Prestige" card on home page
2. Select CV Range from dropdown (e.g., "2-4 CV")
3. Review the 4 formulas displayed
4. Click "Souscrire" on "Tiers" formula
5. **Expected:** IAC cross-sell modal appears
6. Click "Ajouter l'IAC" or "Continuer sans IAC"
7. **Expected:** Alert shows selection (enrollment page not yet implemented)

**Verify:**
- [ ] CV range selector works
- [ ] Pricing updates when CV range changes
- [ ] All 4 formulas display correctly
- [ ] IAC modal appears only for Tiers
- [ ] Redux state is updated (check Redux DevTools)

### Test 2: Moto Flow
**Steps:**
1. Navigate to /moto
2. Click on a category card (e.g., "Djakarta")
3. Review Tiers and Essentielle formulas
4. Click "Souscrire" on Tiers
5. **Expected:** Upgrade modal appears
6. Try both "Passer à Essentielle" and "Rester sur Tiers"
7. Click "Souscrire" on Essentielle directly
8. **Expected:** No modal, direct to enrollment

**Verify:**
- [ ] Category selection works
- [ ] Pricing displays for selected category
- [ ] IAC badge shows on Essentielle
- [ ] Upgrade modal appears for Tiers
- [ ] Redux state is updated

### Test 3: Multirisk Pro Flow
**Steps:**
1. Navigate to /multirisk-pro
2. Click "▼ Voir détails" on any package
3. Review coverage details
4. Click "Souscrire"
5. **Expected:** Alert shows selection

**Verify:**
- [ ] All 4 packages display
- [ ] Details expand/collapse correctly
- [ ] Coverage information is readable
- [ ] Redux state is updated

### Test 4: IAC Flow
**Steps:**
1. Navigate to /iac
2. Scroll through the page
3. Review coverage amounts
4. Click "Souscrire maintenant"
5. **Expected:** Alert shows selection

**Verify:**
- [ ] Coverage amounts display correctly
- [ ] Benefits section is clear
- [ ] FAQ section is readable
- [ ] Redux state is updated

### Test 5: Enrollment Flow
**Steps:**
1. Navigate to /enrollment (after selecting a product)
2. Select "Particulier" or "Entreprise"
3. Fill in the form
4. Submit
5. **Expected:** Navigate to /payment

**Verify:**
- [ ] Form fields change based on client type
- [ ] Product summary shows selected product
- [ ] Validation works (try submitting empty form)
- [ ] Product-specific fields appear

### Test 6: Payment Flow
**Steps:**
1. Navigate to /payment (after enrollment)
2. Review product summary
3. Select payment method
4. Enter phone number (for mobile money)
5. Click "Confirmer le paiement"
6. **Expected:** Navigate to /confirmation

**Verify:**
- [ ] Product summary is correct
- [ ] Total price is calculated correctly
- [ ] IAC line item shows if applicable
- [ ] Payment method selection works

### Test 7: Confirmation Flow
**Steps:**
1. Navigate to /confirmation (after payment)
2. Review confirmation details
3. Click "Télécharger le reçu"
4. **Expected:** Receipt downloads as .txt file

**Verify:**
- [ ] Confirmation details are correct
- [ ] Receipt download works
- [ ] Product-specific details show

## 2. Responsive Design Testing (20 minutes)

### Using Chrome DevTools

**Open DevTools:**
- Press F12 or Ctrl+Shift+I (Windows)
- Press Cmd+Option+I (Mac)

**Toggle Device Toolbar:**
- Click the device icon or press Ctrl+Shift+M

### Test Breakpoints

#### Mobile - 375px (iPhone SE)
**Pages to test:** Home, Auto Prestige, Moto, Multirisk Pro, IAC

**Verify:**
- [ ] Single column layout
- [ ] Text is readable (not too small)
- [ ] Buttons are tappable (not too small)
- [ ] No horizontal scroll
- [ ] Navigation works
- [ ] Forms are usable

#### Mobile - 414px (iPhone Pro Max)
**Verify:**
- [ ] Layout adjusts properly
- [ ] Content fits without overflow

#### Tablet - 768px (iPad)
**Verify:**
- [ ] 2-column grid on home page
- [ ] Product pages use 2 columns where appropriate
- [ ] Forms are wider and easier to use

#### Tablet - 1024px (iPad Pro)
**Verify:**
- [ ] 3-column grid on home page
- [ ] Product comparison tables fit well

#### Desktop - 1280px
**Verify:**
- [ ] 4-column grid on home page
- [ ] Full comparison tables visible
- [ ] Optimal reading width

#### Desktop - 1920px
**Verify:**
- [ ] Content is centered (not stretched)
- [ ] Maximum width is maintained

### Specific Responsive Checks

**Home Page:**
- [ ] Product cards stack on mobile
- [ ] Grid expands to 2, 3, 4 columns on larger screens

**Auto Prestige:**
- [ ] Comparison table scrolls horizontally on mobile
- [ ] All 4 formulas visible on desktop

**Moto:**
- [ ] Category cards stack on mobile
- [ ] Formula comparison side-by-side on tablet+

**Multirisk Pro:**
- [ ] Package cards stack on mobile
- [ ] 2x2 grid on tablet
- [ ] 4 columns on desktop

**Forms (Enrollment/Payment):**
- [ ] Single column on mobile
- [ ] 2 columns on desktop where appropriate
- [ ] Input fields are full width on mobile

## 3. SEO Testing with Lighthouse (15 minutes)

### Build Production Version

```bash
cd apps/web
npm run build
npm start
```

Open browser to: http://localhost:3000

### Run Lighthouse Audit

**For each page:**
1. Open Chrome DevTools (F12)
2. Click "Lighthouse" tab
3. Select:
   - ✅ Performance
   - ✅ Accessibility
   - ✅ Best Practices
   - ✅ SEO
4. Select "Desktop" or "Mobile"
5. Click "Analyze page load"

### Pages to Audit

#### Home Page (/)
**Target Scores:**
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

**Common Issues:**
- Missing meta descriptions
- Images without alt text
- Contrast issues

#### Auto Prestige (/auto-prestige)
**Check for:**
- Proper heading hierarchy
- Semantic HTML
- Fast load time

#### Moto (/moto)
**Check for:**
- Interactive elements are accessible
- Color contrast is sufficient

#### Multirisk Pro (/multirisk-pro)
**Check for:**
- Long content is readable
- Collapsible sections work

#### IAC (/iac)
**Check for:**
- Content is well-structured
- CTAs are clear

### Lighthouse Score Interpretation

**90-100:** Excellent ✅
**50-89:** Needs improvement ⚠️
**0-49:** Poor ❌

### Common Fixes

**Performance Issues:**
- Add `loading="lazy"` to images
- Minimize JavaScript
- Use `next/image` for optimization

**Accessibility Issues:**
- Add `alt` text to images
- Ensure sufficient color contrast
- Add ARIA labels where needed

**SEO Issues:**
- Add meta descriptions
- Use proper heading hierarchy
- Add structured data

## 4. Cross-Browser Testing (Optional)

### Browsers to Test
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### What to Check
- [ ] Layout renders correctly
- [ ] Fonts load properly
- [ ] Colors display correctly
- [ ] Interactions work (clicks, hovers)
- [ ] Forms submit correctly

## 5. Redux State Testing

### Using Redux DevTools

**Install Extension:**
- Chrome: Redux DevTools
- Firefox: Redux DevTools

**What to Check:**
1. Open Redux DevTools
2. Navigate through product flows
3. Verify state updates:
   - `productSelection.selectedProductType`
   - `productSelection.autoSelection`
   - `productSelection.motoSelection`
   - `productSelection.multirisqueSelection`
   - `productSelection.iacAddOn`
   - `payment.method`
   - `payment.amount`

**Verify:**
- [ ] State updates when product is selected
- [ ] State persists during navigation
- [ ] State clears after confirmation

## 6. Error Handling Testing

### Test Error States

**Network Errors:**
1. Open DevTools → Network tab
2. Set throttling to "Offline"
3. Try loading a product page
4. **Expected:** Error message displays

**Invalid Form Data:**
1. Go to enrollment page
2. Submit empty form
3. **Expected:** Validation errors show
4. Enter invalid email
5. **Expected:** Email validation error

**Missing Product Selection:**
1. Navigate directly to /enrollment
2. **Expected:** Redirect to home page

## Testing Checklist Summary

### Product Flows (7 flows)
- [ ] Auto Prestige with IAC cross-sell
- [ ] Moto with upgrade modal
- [ ] Multirisk Pro
- [ ] IAC standalone
- [ ] Enrollment
- [ ] Payment
- [ ] Confirmation

### Responsive Design (6 breakpoints)
- [ ] 375px mobile
- [ ] 414px mobile
- [ ] 768px tablet
- [ ] 1024px tablet
- [ ] 1280px desktop
- [ ] 1920px desktop

### SEO (5 pages)
- [ ] Home page
- [ ] Auto Prestige
- [ ] Moto
- [ ] Multirisk Pro
- [ ] IAC

### Additional Tests
- [ ] Redux state management
- [ ] Error handling
- [ ] Cross-browser (optional)

## Estimated Time

- Product Flow Testing: 30 minutes
- Responsive Design Testing: 20 minutes
- SEO Testing: 15 minutes
- Additional Testing: 15 minutes

**Total: ~80 minutes**

## Reporting Issues

If you find any issues during testing, document:
1. **What:** Description of the issue
2. **Where:** Page/component where it occurs
3. **How:** Steps to reproduce
4. **Expected:** What should happen
5. **Actual:** What actually happens
6. **Screenshot:** If applicable

## Success Criteria

✅ All product flows work end-to-end
✅ Responsive design works on all breakpoints
✅ Lighthouse scores > 90 on all pages
✅ Redux state updates correctly
✅ Error handling works properly

---

**Happy Testing! 🚀**
