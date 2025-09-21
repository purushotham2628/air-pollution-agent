# Bengaluru Air Quality Monitoring - Design Guidelines

## Design Approach
**Selected Approach**: Reference-Based (Environmental/Utility Dashboard)
Drawing inspiration from environmental monitoring platforms like PurpleAir, IQAir, and modern data dashboards like Linear and Notion. This utility-focused application prioritizes data clarity, real-time updates, and health-critical information accessibility.

## Core Design Elements

### A. Color Palette
**Primary Colors**:
- Primary: 220 91% 25% (Deep environmental blue)
- Secondary: 220 20% 50% (Neutral slate)

**AQI Status Colors**:
- Good: 120 60% 45% (Forest green)
- Moderate: 45 90% 55% (Amber yellow)
- Unhealthy: 15 85% 55% (Warning orange)
- Very Unhealthy: 0 75% 55% (Alert red)
- Hazardous: 280 60% 35% (Critical purple)

**Dark Mode**:
- Background: 220 15% 8%
- Surface: 220 12% 12%
- Text Primary: 220 15% 95%

**Light Mode**:
- Background: 0 0% 98%
- Surface: 0 0% 100%
- Text Primary: 220 15% 15%

### B. Typography
- **Primary Font**: Inter (Google Fonts)
- **Data Font**: JetBrains Mono (for numerical displays)
- **Hierarchy**: text-3xl for headings, text-lg for metrics, text-sm for labels

### C. Layout System
**Spacing Primitives**: Tailwind units of 2, 4, 6, and 8
- Consistent padding: p-4, p-6, p-8
- Grid gaps: gap-4, gap-6
- Margins: m-2, m-4, m-8

### D. Component Library

**Navigation**:
- Clean sidebar with environmental icons
- Collapsible mobile navigation
- Breadcrumb trail for data drill-downs

**Data Displays**:
- Large metric cards with color-coded AQI status
- Real-time indicators with subtle pulse animations
- Historical trend charts with gradient fills
- Comparison tables with zebra striping

**Forms & Controls**:
- Date range pickers for historical data
- Filter dropdowns for pollutant selection
- Export buttons with download icons
- Search inputs with autocomplete

**Overlays**:
- Health advisory modals with clear typography
- Alert notifications for dangerous AQI levels
- Loading states with environmental-themed spinners

### E. Visual Treatments

**Gradients**:
- Subtle blue-to-teal gradients for headers: 220 91% 25% to 180 65% 35%
- Chart area fills with low opacity AQI status colors
- Card backgrounds with very subtle 220 20% 98% to 220 15% 99% gradients

**Data Visualization**:
- Line charts with smooth curves for trends
- Area charts with gradient fills for pollutant levels
- Radial progress indicators for current AQI
- Heat maps for temporal pollution patterns

**Interactions**:
- Minimal hover states on cards (slight shadow increase)
- Smooth transitions for theme toggling
- Gentle fade-ins for real-time data updates
- No distracting animations that could interfere with critical health data

## Key Design Principles

1. **Data Clarity First**: Health-critical information must be immediately scannable
2. **Color-Coded Urgency**: Consistent AQI color system throughout interface
3. **Real-time Emphasis**: Visual indicators for live data vs. historical
4. **Mobile Accessibility**: Touch-friendly controls for outdoor usage
5. **Professional Restraint**: Serious, trustworthy aesthetic appropriate for health data

## Images
No large hero images needed. Focus on:
- Small environmental icons (leaf, wind, factory) in navigation
- Bengaluru landmark silhouettes in empty states
- Simple air quality iconography for status indicators
- Data visualization charts as primary visual elements

This design balances the urgency of environmental health data with a clean, professional interface that builds user trust in the AI predictions and real-time monitoring capabilities.