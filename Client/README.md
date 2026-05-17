# NewsFlow Frontend

React frontend for the NewsFlow news feed system.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create your `.env` file**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and set your backend URL:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```
   > Change the port/URL to match wherever your Node/Express backend is running.

3. **Start the dev server**
   ```bash
   npm start
   ```
   Opens at `http://localhost:3000`

---

## Project Structure

```
src/
├── components/
│   ├── Navbar.js          # Top nav with search & category filter
│   ├── NewsCard.js        # Card for each news article
│   ├── NewsForm.js        # Shared form for create & edit
│   ├── Pagination.js      # Page controls
│   └── SkeletonCard.js    # Loading placeholders
├── context/
│   └── AuthContext.js     # Admin login state + JWT storage
├── pages/
│   ├── LoginPage.js       # Admin login
│   ├── NewsFeedPage.js    # Public news feed (pagination + infinite scroll)
│   ├── NewsDetailPage.js  # Single article view
│   ├── AdminDashboard.js  # Admin article management
│   ├── CreateNewsPage.js  # Create new article
│   └── EditNewsPage.js    # Edit existing article
└── utils/
    └── api.js             # All API calls (axios)
```

## Pages & Routes

| Route              | Access | Description                     |
|--------------------|--------|---------------------------------|
| `/`                | Public | News feed (pagination/infinite) |
| `/news/:id`        | Public | Article detail                  |
| `/login`           | Public | Admin login                     |
| `/admin`           | Admin  | Manage all articles             |
| `/admin/create`    | Admin  | Create new article              |
| `/admin/edit/:id`  | Admin  | Edit an article                 |

## Features

- **Public feed** — paginated grid with toggle to infinite scroll
- **Search** — live search by title (uses `GET /api/news/search?q=`)
- **Category filter** — filter by category (uses `GET /api/news/category/:category`)
- **Cloudinary images/videos** — shown in cards and detail pages
- **Admin login** — JWT stored in localStorage, auto-attached to all requests
- **Full CRUD** — create, read, update, delete from the admin dashboard
- **Skeleton loaders** — while content is fetching
- **Toast notifications** — success/error feedback

## Connecting to Your Backend

The `src/utils/api.js` file maps to your existing backend routes:

| Frontend call        | Backend route                  |
|----------------------|--------------------------------|
| `loginAdmin`         | `POST /api/admin/login`        |
| `getAllNews`          | `GET /api/news?page=&limit=`   |
| `getSingleNews`      | `GET /api/news/:id`            |
| `searchNews`         | `GET /api/news/search?q=`      |
| `getNewsByCategory`  | `GET /api/news/category/:cat`  |
| `createNews`         | `POST /api/news` (multipart)   |
| `updateNews`         | `PUT /api/news/:id`            |
| `deleteNews`         | `DELETE /api/news/:id`         |

> Adjust the paths in `api.js` if your backend uses different route prefixes.
