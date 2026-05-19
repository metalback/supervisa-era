---
name: Institutional Health Mobile
colors:
  surface: '#f8f9ff'
  surface-dim: '#d9dae0'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f9'
  surface-container: '#ededf4'
  surface-container-high: '#e7e8ee'
  surface-container-highest: '#e1e2e8'
  on-surface: '#191c20'
  on-surface-variant: '#424750'
  inverse-surface: '#2e3035'
  inverse-on-surface: '#f0f0f7'
  outline: '#727782'
  outline-variant: '#c2c6d2'
  surface-tint: '#2160a2'
  primary: '#00396b'
  on-primary: '#ffffff'
  primary-container: '#005092'
  on-primary-container: '#9ac3ff'
  inverse-primary: '#a4c9ff'
  secondary: '#48626e'
  on-secondary: '#ffffff'
  secondary-container: '#cbe7f5'
  on-secondary-container: '#4e6874'
  tertiary: '#5f2800'
  on-tertiary: '#ffffff'
  tertiary-container: '#823a02'
  on-tertiary-container: '#ffae80'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d4e3ff'
  primary-fixed-dim: '#a4c9ff'
  on-primary-fixed: '#001c39'
  on-primary-fixed-variant: '#004884'
  secondary-fixed: '#cbe7f5'
  secondary-fixed-dim: '#afcbd8'
  on-secondary-fixed: '#021f29'
  on-secondary-fixed-variant: '#304a55'
  tertiary-fixed: '#ffdbc9'
  tertiary-fixed-dim: '#ffb68d'
  on-tertiary-fixed: '#331200'
  on-tertiary-fixed-variant: '#763300'
  background: '#f8f9ff'
  on-background: '#191c20'
  surface-variant: '#e1e2e8'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  headline-md-mobile:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  container-padding: 16px
  stack-gap: 12px
  inline-gap: 8px
  section-margin: 24px
---

## Brand & Style
The design system is engineered for the high-stakes, high-efficiency environment of public health field work. It prioritizes clarity, speed of data entry, and institutional trust. The visual language follows a **Corporate/Modern** aesthetic, stripping away decorative elements to focus on utility and legibility. 

The system must evoke a sense of reliability and official authority while remaining approachable for diverse user groups. The interface uses high-contrast ratios and clear structural divisions to ensure usability under varying light conditions often found in field operations.

## Colors
The palette is rooted in the institutional blue of the Ministry, serving as the primary anchor for navigation and primary actions. 

- **Primary:** Used for headers, primary buttons, and active states.
- **Secondary (Blue-grey):** Applied to icon accents, metadata, and secondary structural elements to reduce visual fatigue.
- **Surface & Background:** A clean white is used for interactive cards and inputs, while a very light blue-grey background provides subtle contrast to define the layout boundaries.
- **Semantic Accents:** Green and Red are reserved strictly for status indicators (Success/Alert) to ensure that critical information is never missed.

## Typography
**Inter** is selected for its exceptional legibility on mobile screens and its neutral, professional tone.

- **Hierarchies:** Use `headline-md` for form section titles and `headline-sm` for card titles.
- **Form Labels:** `label-md` should be used in all-caps or medium weight for input headers to distinguish them from user-entered text.
- **Data Density:** In lists and history views, use `body-md` for secondary information to maintain a high information density without sacrificing readability.

## Layout & Spacing
The system utilizes a **8px grid** to ensure consistent alignment and touch-target sizing (minimum 44x44px for all interactive elements).

- **Grid Model:** A fluid single-column layout is preferred for mobile, with 16px lateral margins.
- **Form Spacing:** Vertical stacks of inputs should maintain a 12px gap to keep related fields grouped but distinct.
- **Touch Areas:** Buttons and toggles must have sufficient clearance to prevent accidental taps during active field use.

## Elevation & Depth
This design system uses **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows to maintain a clean, institutional feel.

- **Level 0 (Background):** #F8FAFC. Used for the main canvas.
- **Level 1 (Cards/Inputs):** White surface with a 1px border (#E2E8F0). This is the default state for content containers.
- **Level 2 (Active/Floating):** A subtle, highly diffused shadow (0px 4px 12px rgba(0, 0, 0, 0.05)) is used only for the Floating Action Button (FAB) or elevated status cards to indicate interactivity.

## Shapes
A **Soft** shape language is employed to balance professional rigor with modern accessibility.

- **Buttons & Inputs:** 0.25rem (4px) corner radius. This conveys a structured, reliable "form-like" feel.
- **Cards:** 0.5rem (8px) corner radius to gently separate distinct pieces of history or process data.
- **Status Pills:** Fully rounded (pill-shaped) to distinguish them from interactive buttons.

## Components

### Cards (History/Records)
Cards feature a white background with a thin neutral border. The top right corner is reserved for **Status Chips**:
- **En Proceso:** Secondary blue-grey background with dark grey text.
- **Enviada:** Success green background (low opacity) with deep green text.
- **Pendiente:** Warning orange background (low opacity) with deep orange text.

### Form Inputs
Labels are always persistent above the field. Input containers use a 1px border that thickens and changes to the Primary Institutional Blue on focus. Error states use the Alert Red for both the border and a helper text string below the field.

### Binary Selectors (Evaluation)
For binary evaluations (Yes/No, Pass/Fail), use **Segmented Controls** that span the full width of the container. The "Yes/Success" option should highlight in the Primary Blue or Success Green when active, ensuring no ambiguity in the selection.

### Navigation & Tabs
Tabs are placed at the top of the view (Estructura vs. Procesos) using a flat style with a 2px bottom indicator in Primary Blue for the active state. For primary screen actions, use a **Floating Action Button (FAB)** in the bottom right corner in Primary Blue with a white icon.

### Buttons
- **Primary:** Solid Primary Blue with white text.
- **Secondary:** Outlined with Primary Blue text and border.
- **Destructive:** Outlined or text-only in Alert Red for critical deletions or cancellations.