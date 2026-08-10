# CamboCine UI Clone Prompt For Stitch / AI Design Agent

Use this prompt to recreate the current CamboCine movie ticket booking system UI as closely as possible. The goal is not to redesign from scratch. The goal is to clone the existing frontend and admin dashboard visual style, layout, hierarchy, component behavior, and responsive patterns.

## Main Instruction

Design a full UI clone of **CamboCine**, a modern Cambodia movie ticket booking platform. Match the current project UI as closely as possible across public client pages, booking flow, authentication pages, PWA/mobile experience, and the admin dashboard.

Do not create a generic cinema website. Do not make a new visual direction. Do not use bright mixed gradients or unrelated colors. Keep the same dark cinematic product UI with clean cards, red primary actions, slate panels, gold accents, realistic movie posters, compact admin tables, and clear responsive behavior.

## Brand

- Product name: **CamboCine**
- Logo concept: neon cinema logo with popcorn, drink, film clapper, glasses, and "CINEMA MOVIE TIME"
- Domain context: `cambocine.online`
- Brand tone: modern, cinematic, premium, simple, Cambodia-focused, production-ready
- Use the logo in:
  - Public top navigation
  - Admin sidebar
  - Auth pages
  - PWA install prompt
  - Browser/favicon references

## Visual Style

Use a consistent dark cinema palette:

- Page background: near black `#0b0d10`
- Card background: dark slate `#14171c`
- Soft panel background: `#101318`
- Secondary surface: `#1b1f26`
- Border: `#252a32`
- Primary red: `#e50914`
- Primary hover red: `#f23b43`
- Gold accent: `#f5c451`
- Text white: `#f8fafc`
- Muted text: slate gray `#9ca3af`
- Success green: `#22c55e`
- Warning yellow: `#f59e0b`
- Error red: `#ef4444`

Style rules:

- Dark, spacious, cinematic UI.
- Use rounded cards, generally 14px-16px radius.
- Use soft borders, subtle shadows, and strong readable contrast.
- Avoid colorful gradients as primary design language.
- Avoid overcrowding and excessive paragraph text.
- Use icons from a modern line icon set similar to Lucide.
- Buttons should use clear icon + short label.
- Cards must be aligned, equal height where needed, and responsive.
- Text must wrap cleanly and never overflow cards.
- Tables must scroll horizontally on small screens.
- Mobile layout must be first-class for iOS and Android.

## Core Layout System

Use these layout patterns:

- Public pages use a fixed top navigation with logo, search, Movies, Tickets, location selector, auth/profile menu.
- Mobile public pages use a bottom tab bar with Home, Movies, Tickets, Profile.
- Admin pages use a fixed left sidebar on desktop and slide-out sidebar on mobile.
- Admin pages use a fixed top header with search, View Site, notifications, profile dropdown.
- Public main content starts below the navbar.
- Admin content starts below the admin header and beside the sidebar.
- Use max width containers around `1280px`.
- Use generous spacing: 16px mobile, 24px tablet, 32px desktop.

## Public Client Pages

### Home Page

Clone the CamboCine homepage:

- Full-width cinematic hero slideshow.
- Large movie backdrop image with dark overlay.
- Movie poster visible on desktop right side.
- Left hero content:
  - Status chip: Now Showing
  - Age rating chip
  - Rating chip with star
  - Large movie title
  - Duration, release date, genres
  - Short synopsis
  - Primary button: Book Now
  - Secondary button: Watch Trailer
  - Slide pagination pills under actions
- Desktop slide arrows on lower right side.
- Search/location CTA card overlapping bottom of hero:
  - Search input: "Search by movie, genre, or director"
  - City selector: Phnom Penh, Siem Reap, Battambang
  - Red Browse Movies button with ticket icon
- Sections:
  - Now Showing movie grid
  - Feature strip: Fast Booking, Digital Tickets, Local Cinemas
  - Recommended movies
  - Coming Soon movies
  - Weekend offer card
  - Cinema locations card

### Movie Cards

Each movie card should include:

- Poster image with 2:3 aspect ratio
- Rating chip on poster
- Age rating chip
- Trailer play circle if trailer exists
- Favorite button if user is logged in
- Movie title
- Genre line
- Duration and release date meta
- Red Book Now button
- Hover lift and slight poster zoom

Support both:

- Grid cards
- List cards with poster left and content right

### Movies Listing Page

Create a movie browsing page:

- Hero/title: "Movies in Phnom Penh"
- Search input with filter button
- Active filter chips
- Desktop sticky filter sidebar:
  - Sort By select
  - Genre selectable buttons with counts
  - Language chips
  - Minimum rating buttons
  - Reset area showing number of matching movies
- Main content:
  - Now Showing title
  - Grid/list toggle icons
  - Movie grid/list
  - Empty state with search icon and Clear Filters button
  - Trending Movies section
  - Coming Soon section
- Mobile filter should become a drawer/sheet-style panel.

### Movie Detail Page

Create a detailed movie page:

- Large backdrop hero with dark overlay.
- Poster card on left desktop.
- Main details:
  - Now Showing / Coming Soon chip
  - Age rating
  - Rating
  - Big movie title
  - Duration, release date, genres
  - Short synopsis
  - Director
  - Cast
  - Trailer, Save, Share buttons
- Showtime area:
  - Horizontal 7-day date selector
  - Horizontal cinema selector
  - Cinema cards with showtime buttons
  - Showtime buttons show time, price, available seats or sold out state
  - Empty state if no showtimes

### Booking Flow

Booking flow is:

Movie -> Cinema -> Seats -> Payment -> Ticket

Seat selection page:

- Top booking progress text.
- Movie summary card with poster, title, date, time, cinema, base ticket price.
- Realistic cinema seat map:
  - Screen indicator
  - Seat legend: Standard, VIP, Couple, Selected, Reserved
  - Row labels on both sides
  - Seats arranged in rows with aisle gaps
  - Selected seats turn primary red
  - VIP seats gold toned
  - Reserved seats muted/disabled
- Ticket summary sidebar:
  - Movie
  - Cinema
  - Date & Time
  - Selected seats chips
  - Ticket count
  - Subtotal
  - Total in gold
  - Continue to Payment button
  - Secure seat hold note

Checkout page:

- Step indicator: Seats / Payment / Ticket
- Checkout title and secure payment badge
- Payment method form:
  - Visa/card
  - Bakong QR
  - ABA PayWay
- Payment summary sidebar:
  - Movie poster thumbnail
  - Movie title
  - Cinema
  - Hall
  - Showtime
  - Seats
  - Total
- Error/success/loading states.

Confirmation page:

- Success icon and "Booking Confirmed"
- Digital ticket card:
  - Poster left
  - Paid chip
  - Movie title
  - Cinema
  - QR code
  - Hall
  - Date & time
  - Seats
  - Booking ID
  - Total payment
  - Download, Wallet, View Booking actions
- Helpful note cards below.

### Profile Page

Profile UI includes:

- Sidebar profile card with avatar, upload camera button, name, email.
- Vertical tabs:
  - Profile
  - My Bookings
  - Favorites
  - Notifications
  - Payment Methods
  - Logout
- Profile tab:
  - Edit profile button
  - First name, last name, email, phone
  - Notification preferences with checkboxes
- Bookings tab:
  - Booking cards
  - Empty state with ticket icon
- Favorites tab:
  - Movie cards or poster cards
  - Remove favorite button

### Auth Pages

Login/register/forgot password pages:

- Dark slate background.
- Centered card.
- Logo at top, not plain text title.
- Inputs with icons.
- Rounded fields.
- Primary orange/red submit button.
- Google sign-in button using real Google button style.
- Error state card.
- Login redirects admin/staff/owner to `/admin`, customer to `/`.

## PWA / Mobile Experience

Clone mobile behavior carefully:

- Public bottom nav fixed on mobile.
- Touch targets at least 44px tall.
- Safe-area padding for iOS.
- PWA install prompt:
  - Android install card with logo, "Install CamboCine", Later and Install buttons.
  - iOS add-to-home-screen helper card.
  - App update prompt.
- Offline banner:
  - Small fixed card near top.
  - Message: cached pages and saved tickets still work.

## Admin Dashboard Shell

Admin pages must use this structure:

- Desktop left sidebar width around 288px.
- Sidebar is fixed full height.
- Sidebar logo at top.
- Menu items:
  - Dashboard
  - Bookings
  - Payments
  - Movies
  - Cinemas
  - Showtimes
  - Ticket Validation
  - Customers
  - Notifications
  - Analytics
  - Settings
- Active item has orange/red left border, warm background tint, active dot.
- Mobile has menu button and overlay slide-out sidebar.
- Header:
  - Fixed top, dark slate translucent.
  - Search input: "Search movies, bookings, customers..."
  - View Site link
  - Notifications bell with dropdown
  - Profile dropdown with avatar, role label, profile/settings/security/logout.

Admin role UI:

- Staff can access bookings, payments, ticket validation, profile, dashboard.
- Admin can access all admin management except owner-only owner account control.
- Owner can access everything.

## Admin Dashboard Page

Dashboard must be dynamic-looking and data-focused:

- Header:
  - "Dashboard"
  - Subtitle: "Live cinema performance from backend data."
  - Range segmented control: 7d, 30d, 90d
  - Refresh button
- Stat cards:
  - Total Bookings
  - Total Revenue
  - Total Users
  - Active Movies
  - Active Cinemas
  - Average Rating
- Cards should be compact and equal height.
- Charts:
  - Revenue + bookings composed chart
  - Hourly bookings bar chart
  - Booking status donut chart
  - Revenue by genre chart
  - Monthly trend chart
  - Top movies/top genres panels
- Recent bookings list.
- Loading state with spinner.
- Error state as red alert.

## Admin Bookings Page

Must include:

- Title and subtitle.
- Refresh and Export buttons.
- Search by movie, cinema, ticket code.
- Status filter.
- Stats cards:
  - Total Bookings
  - Confirmed
  - Total Revenue
  - Pending
- Table:
  - Movie
  - Cinema
  - Showtime
  - Seats
  - Total
  - Booking status
  - Payment status
  - Ticket code
  - Actions
- Actions:
  - View details modal
  - Mark confirmed/completed/used/cancelled where appropriate
  - Cancel confirmation
  - Export CSV

## Admin Payments Page

Must include:

- Stats cards:
  - Total Revenue
  - Transactions
  - Completed
  - Pending
  - Failed
- Search by movie, booking ID, payment ID.
- Filter by status and method.
- Payment table/list.
- View payment modal.
- Update status: pending, completed, failed, refunded.
- Export CSV.

## Admin Movies Page

Movie management UI:

- Search by title/director.
- Filter by genre.
- Stats cards:
  - Total Movies
  - Now Showing
  - Coming Soon
  - Average Rating
- Table/cards show poster, title, genre, rating, duration, status, director.
- Add/Edit movie modal:
  - Title
  - Genre
  - Rating
  - Duration
  - Release date
  - Synopsis
  - Status
  - Director
  - Cast
  - Language
  - Age rating
  - Poster URL
  - Trailer URL
  - Featured checkbox
- Delete confirmation.
- View movie modal.
- Export CSV.

## Admin Cinemas Page

Cinema management UI:

- Search by name, city, address.
- Stats:
  - Total Cinemas
  - Total Screens
  - Total Capacity
  - Cities
- Cards/table show cinema name, city, address, phone, email, screens, facilities, active status.
- Add/Edit cinema modal:
  - Name
  - Address
  - City
  - Phone
  - Email
  - Facilities chips
  - Active toggle
  - Image URL
  - Screens formatted as name/capacity/type
- Delete confirmation.
- View modal.
- Export CSV.

## Admin Showtimes Page

Showtime management UI:

- Search by movie/cinema.
- Filters:
  - Movie
  - Cinema
  - Date
- Stats cards for showtimes, selling, sold out, capacity.
- Table/list:
  - Movie
  - Cinema
  - Screen
  - Date
  - Start/end time
  - Price
  - Available/total seats
  - Status
  - Actions
- Add/Edit modal:
  - Movie select
  - Cinema select
  - Screen select
  - Date
  - Start time
  - Price
  - Available seats
  - Total seats
  - Status
- End time is calculated from movie duration.
- Update status and delete confirmation.
- Export CSV.

## Admin Ticket Validation Page

Ticket validation UI:

- Header title and subtitle.
- Stats:
  - Valid Tickets
  - Used Tickets
  - Confirmed Bookings
  - Validation Rate
- Two-column validation area:
  - Left: scan/enter ticket code card with camera icon, input, Validate button.
  - Right: result card with success/error/warning state.
- Result details:
  - Movie
  - Showtime
  - Seats
  - Status badge
- Recent validations table:
  - Ticket Code
  - Movie
  - Showtime
  - Seats
  - Status
  - Validated At

## Admin Customers Page

User/customer management UI:

- Search users.
- Filter by role.
- Stats:
  - Total Accounts
  - Customers
  - Administrators
  - Staff
- Table:
  - Avatar/name
  - Email
  - Phone
  - Role badge
  - Active status toggle
  - Joined date
  - Actions
- Add/Edit user modal:
  - First name
  - Last name
  - Email
  - Phone
  - Password for create only
  - Role select
- Role labels:
  - Customer
  - Staff
  - Admin
  - Owner
- Admin can manage non-owner accounts.
- Owner can manage all accounts.
- Owner accounts cannot be deleted by admin.

## Admin Notifications Page

Notification management UI:

- Stats:
  - Total
  - Unread
  - Read
  - Alerts
- Actions:
  - Add Notification
  - Mark all read
  - Clear all
- Search notifications.
- Filters:
  - All
  - Unread
  - Read
  - Booking
  - Alert
  - Success
  - System
- Notification list cards:
  - Type icon
  - Title
  - Message
  - Time
  - Read/unread state
  - Mark read
  - Delete
- Create notification modal with type, title, message.

## Admin Analytics Page

Analytics page UI:

- Header with time range select:
  - Last 7 days
  - Last 30 days
  - Last 6 months
  - Last year
- Export button.
- Stats cards:
  - Total Revenue
  - Total Bookings
  - Total Users
  - Occupancy Rate
- Charts:
  - Revenue vs expenses line chart
  - Bookings trend area/bar chart
  - Peak hours chart
  - Booking status pie chart
  - Revenue by genre chart
- Use Recharts-like visual style: dark chart background, slate grid lines, orange/green/blue chart colors.

## Admin Settings Page

Settings UI:

- Left tab card:
  - General
  - Notifications
  - Security
- Save Changes button.
- General:
  - Site name
  - Email
  - Phone
  - Address
  - Timezone
  - Currency
  - Language
- Notifications:
  - Email booking confirmations
  - Email promotions
  - SMS bookings
  - SMS promotions
  - Push notifications
- Security:
  - Two-factor toggle
  - Session timeout
  - Password expiry

## Interaction States

Include these states everywhere:

- Loading spinner
- Error alert
- Success alert
- Empty state
- Disabled buttons
- Hover states
- Selected states
- Confirmation states for destructive actions
- Modal open/close behavior
- Dropdown open/close behavior
- Mobile responsive stacked layouts
- Horizontal scrolling tables on mobile

## Responsive Rules

Desktop:

- Public hero uses two-column layout with content left and poster right.
- Admin uses fixed sidebar and header.
- Tables and charts appear in multi-column grids.

Tablet:

- Cards become 2-column grids.
- Admin sidebar remains hidden behind menu if width is too small.
- Forms should use 2 columns where comfortable.

Mobile:

- Public nav becomes logo + hamburger plus bottom nav.
- Hero content stacks and poster can hide.
- Search/location CTA stacks vertically.
- Movie cards use 2-column grid where possible; 1-column for list.
- Admin pages use slide-out sidebar.
- Tables scroll horizontally.
- Buttons wrap cleanly.
- Bottom nav must not cover content.
- Respect safe-area insets for iOS.

## Exact UI Feel To Match

The final design should feel like:

- A real cinema booking web app
- Dark, premium, cinematic
- Clean and usable, not decorative
- Compact enough for admin workflows
- Spacious enough for customers
- Clear red primary CTAs
- Subtle gold price/rating accents
- Strong card alignment
- Smooth hover and modal interactions
- Mobile-first and installable as PWA

## Do Not

- Do not use a light theme.
- Do not use random purple/blue gradient backgrounds.
- Do not make a marketing landing page instead of the actual app.
- Do not replace the admin dashboard with a generic SaaS dashboard.
- Do not remove movie posters, showtimes, seats, tickets, QR code, or role-based admin structure.
- Do not add too much explanatory text.
- Do not make cards different sizes without reason.
- Do not overflow long emails, IDs, or names.

## Deliverable Expected From Stitch / AI Design Agent

Generate a complete UI design clone for CamboCine including:

1. Public homepage
2. Movies listing page
3. Movie detail page
4. Booking seat selection page
5. Payment page
6. Booking confirmation ticket page
7. Profile page
8. Login/register pages
9. Admin dashboard
10. Admin bookings
11. Admin payments
12. Admin movies
13. Admin cinemas
14. Admin showtimes
15. Admin ticket validation
16. Admin customers
17. Admin notifications
18. Admin analytics
19. Admin settings
20. Mobile responsive versions for all important pages

Make it visually match the current CamboCine frontend as closely as possible.
