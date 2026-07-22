# MetroCool - Feature Development Proposal

**Prepared for:** Client  
**Prepared by:** MetroCool Development Team  
**Date:** July 5, 2026  
**Version:** 1.0

---

## 📋 Executive Summary

This document outlines 7 new features and improvements planned for the MetroCool platform. Each section includes a description, user flow, and UI design reference for your review and approval.

---

## Table of Contents

1. [Delete Confirmation Popup](#1-delete-confirmation-popup)
2. [Email Notifications for Orders & Bookings](#2-email-notifications)
3. [Technician Proof of Work Improvements](#3-proof-of-work)
4. [Settlement Report & Commission Logic](#4-settlement--commission)
5. [Product Page Improvements](#5-product-page)
6. [AC Capacity Recommendation](#6-ac-recommendation)
7. [Service Delete Issue Fix](#7-service-delete-fix)

---

## 1. Delete Confirmation Popup

**Applies to:** Technician Panel & Admin Panel

### Description
A confirmation modal will appear whenever a user attempts to delete any record, preventing accidental deletions.

### UI Design

```
┌─────────────────────────────────────────────┐
│                                             │
│         ⚠️  Delete Confirmation             │
│                                             │
│   ┌─────────────────────────────────────┐   │
│   │                                     │   │
│   │   Are you sure you want to          │   │
│   │   delete this?                      │   │
│   │                                     │   │
│   │   This action cannot be undone.     │   │
│   │                                     │   │
│   └─────────────────────────────────────┘   │
│                                             │
│        ┌──────────┐   ┌──────────┐          │
│        │  Cancel  │   │  Delete  │          │
│        │  (Grey)  │   │  (Red)   │          │
│        └──────────┘   └──────────┘          │
│                                             │
└─────────────────────────────────────────────┘
```

### User Flow
```
User clicks Delete → Modal appears → User clicks "Cancel" → Modal closes (no action)
                                    → User clicks "Delete" → Record deleted → Success toast
```

### Applied Across
- Admin Panel: Services, Products, Orders, Bookings, Users, Technicians
- Technician Panel: Jobs, Reports

---

## 2. Email Notifications for Orders & Bookings

**Recipient:** metrocool.official@gmail.com

### Description
Automatic email notifications will be sent to the admin whenever a customer books a service or purchases a product.

### Email Template Design - Service Booking

```
┌─────────────────────────────────────────────────────────┐
│  ┌──────────┐                                           │
│  │MetroCool │   NEW SERVICE BOOKING RECEIVED            │
│  │  LOGO    │                                           │
│  └──────────┘                                           │
│─────────────────────────────────────────────────────────│
│                                                         │
│  📋 Booking Details                                     │
│  ─────────────────────────────────────────              │
│                                                         │
│  Booking ID        :  #MC-SVC-2026-001                  │
│  Date              :  July 5, 2026                      │
│                                                         │
│  👤 Customer Information                                │
│  ─────────────────────────────────────────              │
│                                                         │
│  Name              :  John Doe                          │
│  Phone             :  +91 98765 43210                   │
│  Email             :  john@example.com                  │
│  Address           :  123, Main Street, City            │
│                                                         │
│  🔧 Service Details                                     │
│  ─────────────────────────────────────────              │
│                                                         │
│  Service           :  AC Installation (1.5 Ton)         │
│  Preferred Date    :  July 8, 2026                      │
│  Preferred Time    :  10:00 AM - 12:00 PM              │
│  Payment Status    :  ✅ Paid                           │
│                                                         │
│─────────────────────────────────────────────────────────│
│  © 2026 MetroCool | All Rights Reserved                 │
└─────────────────────────────────────────────────────────┘
```

### Email Template Design - Product Order

```
┌─────────────────────────────────────────────────────────┐
│  ┌──────────┐                                           │
│  │MetroCool │   NEW PRODUCT ORDER RECEIVED              │
│  │  LOGO    │                                           │
│  └──────────┘                                           │
│─────────────────────────────────────────────────────────│
│                                                         │
│  📦 Order Details                                       │
│  ─────────────────────────────────────────              │
│                                                         │
│  Order ID          :  #MC-ORD-2026-045                  │
│  Date              :  July 5, 2026                      │
│                                                         │
│  👤 Customer Information                                │
│  ─────────────────────────────────────────              │
│                                                         │
│  Name              :  Jane Smith                        │
│  Phone             :  +91 87654 32109                   │
│  Email             :  jane@example.com                  │
│                                                         │
│  🛒 Product Details                                     │
│  ─────────────────────────────────────────              │
│                                                         │
│  Product           :  Samsung 1.5 Ton Split AC          │
│  Quantity          :  1                                 │
│  Price             :  ₹59,999                           │
│  Payment Status    :  ✅ Paid                           │
│                                                         │
│  📍 Delivery Address                                    │
│  ─────────────────────────────────────────              │
│                                                         │
│  456, Park Avenue, Apartment 12B                        │
│  Mumbai, Maharashtra - 400001                           │
│                                                         │
│─────────────────────────────────────────────────────────│
│  © 2026 MetroCool | All Rights Reserved                 │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Technician Proof of Work Improvements

### Description
After completing a job, technicians must submit proof of work with mandatory image upload. The form will highlight the image upload section until an image is provided.

### UI Design - Technician Form

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  ✅ Job Completion - Proof of Work                      │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Job ID: #MC-JOB-2026-012                       │    │
│  │  Service: AC Installation                       │    │
│  │  Customer: John Doe                             │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  Work Description:                                      │
│  ┌─────────────────────────────────────────────────┐    │
│  │  [Text area for technician notes]               │    │
│  │                                                 │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │ ╔═══════════════════════════════════════════╗    │    │
│  │ ║  🔴 RED BORDER / HIGHLIGHT               ║    │    │
│  │ ║                                          ║    │    │
│  │ ║   📷 Upload Proof of Work Image          ║    │    │
│  │ ║                                          ║    │    │
│  │ ║   ┌────────────────────────────┐         ║    │    │
│  │ ║   │   + Click to Upload        │         ║    │    │
│  │ ║   │     or Drag & Drop         │         ║    │    │
│  │ ║   └────────────────────────────┘         ║    │    │
│  │ ║                                          ║    │    │
│  │ ║   ⚠️ Image upload is required            ║    │    │
│  │ ╚═══════════════════════════════════════════╝    │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│            ┌───────────────────────┐                    │
│            │   Submit Proof of Work │                    │
│            └───────────────────────┘                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### After Image Upload (Red border removed)

```
│  ║   📷 Upload Proof of Work Image          ║
│  ║                                          ║
│  ║   ┌──────┐ ┌──────┐ ┌──────┐            ║
│  ║   │ IMG1 │ │ IMG2 │ │  +   │            ║
│  ║   │  ✓   │ │  ✓   │ │ Add  │            ║
│  ║   └──────┘ └──────┘ └──────┘            ║
│  ║                                          ║
│  ║   ✅ Images uploaded successfully         ║
```

### Admin Panel - View Proof of Work

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  📋 Proof of Work - Job #MC-JOB-2026-012               │
│                                                         │
│  Technician   :  Ravi Kumar                             │
│  Service      :  AC Installation                        │
│  Completed    :  July 5, 2026 at 2:30 PM               │
│                                                         │
│  Work Notes:                                            │
│  "Installed 1.5 Ton Split AC. Wall mounting done.       │
│   Copper piping 10ft. Gas charging completed."          │
│                                                         │
│  📷 Uploaded Images:                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │          │  │          │  │          │              │
│  │  Image 1 │  │  Image 2 │  │  Image 3 │              │
│  │          │  │          │  │          │              │
│  └──────────┘  └──────────┘  └──────────┘              │
│                                                         │
│  ┌─────────────┐  ┌──────────────────┐                  │
│  │ 👁️ View Full │  │ ⬇️ Download All  │                  │
│  └─────────────┘  └──────────────────┘                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Flow
```
Technician completes job
    → Opens Proof of Work form
    → Fills description + uploads images (red highlight until uploaded)
    → Submits form
    → Email sent to admin with proof details
    → Saved in Admin Panel (viewable + downloadable)
```

---

## 4. Settlement Report & Commission Logic

### Description
Replace the fixed 20% commission with a per-service configurable commission percentage. Settlement reports will auto-calculate totals.

### Admin Panel - Service Commission Configuration

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  ⚙️ Service Commission Settings                         │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Service Name          │  Commission %  │ Action │   │
│  │─────────────────────────────────────────────────-│   │
│  │  AC Installation       │  [  10%  ]     │  ✏️    │   │
│  │  AC Repair             │  [  20%  ]     │  ✏️    │   │
│  │  AC Gas Charging       │  [  15%  ]     │  ✏️    │   │
│  │  AC Deep Cleaning      │  [  12%  ]     │  ✏️    │   │
│  │  AC Uninstallation     │  [  10%  ]     │  ✏️    │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
│  💡 Commission is deducted from technician payment      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Settlement Report Example

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  📊 Settlement Report - Ravi Kumar                              │
│  Period: July 1 - July 15, 2026                                 │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Service        │ Price   │ Commission │ Admin  │ Tech     │  │
│  │────────────────────────────────────────────────────────── │  │
│  │ AC Install     │ ₹2,000  │ 10%        │ ₹200   │ ₹1,800  │  │
│  │ AC Repair      │ ₹3,000  │ 20%        │ ₹600   │ ₹2,400  │  │
│  │ Gas Charging   │ ₹1,500  │ 15%        │ ₹225   │ ₹1,275  │  │
│  │ Deep Cleaning  │ ₹2,500  │ 12%        │ ₹300   │ ₹2,200  │  │
│  │────────────────────────────────────────────────────────── │  │
│  │ TOTAL          │ ₹9,000  │   —        │₹1,325  │ ₹7,675  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Summary:                                                       │
│  ┌────────────────────────────────┐                             │
│  │  Total Revenue    :  ₹9,000   │                             │
│  │  Admin Earnings   :  ₹1,325   │                             │
│  │  Technician Pay   :  ₹7,675   │                             │
│  └────────────────────────────────┘                             │
│                                                                 │
│  ┌────────────────┐  ┌──────────────────┐                       │
│  │ 📄 Export PDF  │  │ 📧 Email Report  │                       │
│  └────────────────┘  └──────────────────┘                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Product Page Improvements

### Description
Redesign product cards with discount badges (Amazon-style), improved pricing display, and better responsive layout.

### Product Card Design

```
┌───────────────────────────┐
│  ┌─────────────────────┐  │
│  │                     │  │
│  │    [Product Image]  │  │
│  │                     │  │
│  │  ┌──────────┐      │  │
│  │  │ 14% OFF  │      │  │
│  │  │ (Green)  │      │  │
│  │  └──────────┘      │  │
│  └─────────────────────┘  │
│                           │
│  Samsung 1.5 Ton 5 Star   │
│  Inverter Split AC        │
│                           │
│  ⭐⭐⭐⭐☆ (124 reviews)    │
│                           │
│  ₹59,999  ₹69,999        │
│  (Bold)   (Strikethrough) │
│                           │
│  ┌─────────────────────┐  │
│  │  🛒 Add to Cart     │  │
│  └─────────────────────┘  │
│                           │
└───────────────────────────┘
```

### Discount Badge Styles

```
┌──────────────────────────────────────────────┐
│                                              │
│  Pricing Display:                            │
│                                              │
│  ₹59,999  MRP: ₹69,999  ┌──────────┐       │
│  (Large,   (Small,       │ 14% OFF  │       │
│   Bold)    Strikethrough) │ (Green)  │       │
│                           └──────────┘       │
│                                              │
│  You Save: ₹10,000 (14%)                    │
│                                              │
└──────────────────────────────────────────────┘
```

### Product Grid Layout (Desktop)

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  🏠 Products > Air Conditioners                                │
│                                                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │Product 1 │  │Product 2 │  │Product 3 │  │Product 4 │      │
│  │          │  │          │  │          │  │          │      │
│  │ 14% OFF  │  │ 22% OFF  │  │ 8% OFF   │  │ 30% OFF  │      │
│  │          │  │          │  │          │  │          │      │
│  │₹59,999   │  │₹45,999   │  │₹32,999   │  │₹27,999   │      │
│  │₹69,999   │  │₹58,999   │  │₹35,999   │  │₹39,999   │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Mobile Layout (Responsive - 2 columns)

```
┌──────────────────────────┐
│  ┌──────────┐┌──────────┐│
│  │Product 1 ││Product 2 ││
│  │ 14% OFF  ││ 22% OFF  ││
│  │₹59,999   ││₹45,999   ││
│  └──────────┘└──────────┘│
│  ┌──────────┐┌──────────┐│
│  │Product 3 ││Product 4 ││
│  │ 8% OFF   ││ 30% OFF  ││
│  │₹32,999   ││₹27,999   ││
│  └──────────┘└──────────┘│
└──────────────────────────┘
```

---

## 6. AC Capacity Recommendation Based on Room Size

### Description
A room size selector that recommends the appropriate AC tonnage and optionally filters products.

### UI Design - Room Size Selector

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  🏠 Find the Right AC for Your Room                     │
│                                                         │
│  Select your room size:                                 │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │  ○  90 - 120 sq ft   (Small Bedroom)           │    │
│  │  ● 121 - 154 sq ft   (Standard Bedroom)        │    │
│  │  ○ 155 - 180 sq ft   (Large Bedroom)           │    │
│  │  ○ 181 - 250 sq ft   (Living Room)             │    │
│  │  ○ 251 - 350 sq ft   (Large Hall)              │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │  ✅ RECOMMENDED FOR YOUR ROOM:                  │    │
│  │                                                 │    │
│  │  🌡️  1 Ton AC                                   │    │
│  │                                                 │    │
│  │  Best for rooms between 121 - 154 sq ft         │    │
│  │  Ideal for standard bedrooms with moderate      │    │
│  │  sunlight exposure.                             │    │
│  │                                                 │    │
│  │  ┌──────────────────────────────────┐           │    │
│  │  │ 🔍 Show 1 Ton AC Products Only  │           │    │
│  │  └──────────────────────────────────┘           │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Recommendation Table

```
┌────────────────────────────────────────────────┐
│  Room Size (sq ft)  │  Recommended AC Capacity │
│────────────────────────────────────────────────│
│   90 - 120          │  0.8 Ton                 │
│  121 - 154          │  1.0 Ton                 │
│  155 - 180          │  1.5 Ton                 │
│  181 - 250          │  2.0 Ton                 │
│  251 - 350          │  2.5 Ton                 │
└────────────────────────────────────────────────┘
```

---

## 7. Service Delete Issue Fix

### Description
Fix the existing bug where services cannot be deleted from the admin panel.

### Expected Behavior After Fix

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  🔧 Manage Services                                     │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Service Name          │  Price   │   Actions    │   │
│  │─────────────────────────────────────────────────-│   │
│  │  AC Installation       │  ₹2,000  │  ✏️  🗑️     │   │
│  │  AC Repair             │  ₹1,500  │  ✏️  🗑️     │   │
│  │  AC Gas Charging       │  ₹1,200  │  ✏️  🗑️     │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
│  User clicks 🗑️ on "AC Gas Charging"                    │
│           ↓                                             │
│  ┌─────────────────────────────────────┐                │
│  │  ⚠️ Are you sure you want to        │                │
│  │     delete "AC Gas Charging"?       │                │
│  │                                     │                │
│  │     ┌────────┐  ┌────────┐          │                │
│  │     │ Cancel │  │ Delete │          │                │
│  │     └────────┘  └────────┘          │                │
│  └─────────────────────────────────────┘                │
│           ↓ (After confirm)                             │
│  ┌──────────────────────────────────────────────────┐   │
│  │  ✅ Service "AC Gas Charging" deleted             │   │
│  │     successfully!                                │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
│  List auto-refreshes without the deleted service        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Fix Scope
- Identify and fix the root cause (API/Database issue)
- Ensure proper deletion from database
- Auto-refresh the service list after deletion
- Add success/error toast notifications

---

## 📅 Development Timeline (Estimated)

| # | Feature | Estimated Time |
|---|---------|---------------|
| 1 | Delete Confirmation Popup | 1-2 days |
| 2 | Email Notifications | 2-3 days |
| 3 | Proof of Work Improvements | 2-3 days |
| 4 | Settlement & Commission Logic | 3-4 days |
| 5 | Product Page Improvements | 2-3 days |
| 6 | AC Capacity Recommendation | 1-2 days |
| 7 | Service Delete Fix | 1 day |
| | **Total Estimated** | **12-18 days** |

---

## 🎨 Design Notes

- **Color Scheme:** Consistent with existing MetroCool branding
- **Delete buttons:** Red color to indicate destructive action
- **Success states:** Green color for confirmations
- **Responsive:** All features will be mobile-friendly
- **Accessibility:** Proper contrast ratios and keyboard navigation

---

## ✅ Approval

Please review this proposal and confirm:

- [ ] Feature scope is acceptable
- [ ] UI designs meet expectations
- [ ] Timeline is agreeable
- [ ] Any modifications needed

**Client Signature:** ___________________________  
**Date:** ___________________________

---

*This document is confidential and intended for MetroCool project stakeholders only.*
