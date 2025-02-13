# DevNotes

A minimalist note-taking application designed specifically for developers to capture and organize their technical learnings, code snippets, and development notes. Built with Next.js, Firebase Authentication, and MongoDB, DevNotes offers a clean interface with a Tron-inspired design.

## Quick Start
Test the application directly on your mobile or desktop device from this domain:
[https://devnotes-tau.vercel.app/](https://devnotes-tau.vercel.app/)

 **Note**: You may have to disable the adblocker for the gmail login prompt to work. 

## Tech Stack

- **Frontend**: 
  - Next.js 15.1.6
  - React 18.2.0
  - React Quill (Rich Text Editor)
  - TailwindCSS 3.4.1

- **Backend**: 
  - Next.js API Routes
  - MongoDB with Mongoose
  - Firebase Authentication

- **Authentication**:
  - Firebase Auth with Google Sign-in
  - JWT-based API authorization

- **Database**:
  - MongoDB Atlas
  - Mongoose ODM

## Installing / Getting started

### Prerequisites
1. Node.js (v18+ required)
2. MongoDB Atlas account
3. Firebase project credentials
4. Git installed locally
5. npm package manager

### Environment Setup

For the purpose of this homework submission, a `.env.local` file with working credentials has been provided in the repository. This means:

1. The included credentials are specifically created for this demo
2. Authentication and database access will work out of the box

> **Note**: In a real production application, `.env.local` would never be committed to version control for security reasons. These credentials are specifically created for demonstration purposes and don't pose any security risk.

### Local Development Setup

1. **Clone and Install**
```bash
# Clone the repository
git clone [your-repo-url]
cd devnotes

# Install dependencies
npm install
```

2. **Start Development Server**
```bash
npm run dev
```

3. **View the App**
- Open [http://localhost:3000](http://localhost:3000) in your browser
- Sign in with Google to test authentication
- Try creating and viewing notes

## Project Structure
```
devnotes/
├── components/          # React components
├── contexts/           # Auth context
├── lib/               
│   ├── dbConnect.js    # MongoDB connection
│   └── firebase.js     # Firebase configuration
├── models/             # Mongoose models
├── pages/
│   ├── api/           # API endpoints
│   └── index.js       # Main page
└── styles/            # Global styles
```

## Features
- Google Authentication
- Rich Text Editor with image support
- Real-time note creation
- Chronological note listing
- Responsive design
- User-specific notes
- Mobile-friendly image handling and compression

## New (Nice-to-Have) Features

### Theme Toggle (Light/Dark Mode)
- Implemented a theme toggle system accessible from the profile dropdown
- Light mode offers a softer color palette while maintaining the cyber aesthetic
- Dark mode features the original Tron-inspired design
- Theme preference is persisted across sessions using localStorage
- Smooth transitions between themes

### Enhanced Text Editor
- Added color formatting options with a curated palette:
  - Tron Blue (#27f7f7)
  - White (#FFFFFF)
  - Black (#000000)
  - Red (#FF0000)
  - Blue (#0000FF)
  - Green (#00FF00)
  - Orange (#FF4D00)
  - Purple (#62006D)
  - Gray (#808080)
  - Navy Blue (#000749)
  - Yellow (#FFFF00)
  - Pink (#FF0099)
- Color picker displays actual colors in dropdown menu
- Visual color indicator in toolbar

### Pagination
- Notes are now displayed in pages of 5 notes each
- Navigation controls include:
  - Previous/Next buttons
  - Current page indicator (Page X / Total)
  - Disabled state for navigation limits
- Maintains selected note state across page navigation
- Responsive design that works on all screen sizes

## API Endpoints
- `GET /api/notes` - Fetch user's notes (requires authentication)
- `POST /api/notes` - Create new note (requires authentication)

## Database Schema
```javascript
Note {
  title: String,      // Required
  content: String,    // Required
  userId: String,     // Required, from Firebase Auth
  createdAt: Date,    // Auto-generated
  updatedAt: Date     // Auto-updated
}
```

## Additional Development Notes

### Troubleshooting
- If MongoDB connection fails:
  ```shell
  # Verify your connection string
  # Check Network Access in MongoDB Atlas
  # Ensure .env.local is in the root directory
  ```

- For development issues:
  ```shell
  # Clear Next.js cache and node_modules
  rm -rf .next
  rm -rf node_modules
  npm install
  ```

## Testing CRUD Operations

### Create
1. Log in with Google
2. Fill in the note title and content
3. Click "SAVE_NOTE"

### Read
1. View all notes in the list below the form
2. Click any note to view full details
3. Use the search bar to filter notes by title or content

### Update
1. Open a note by clicking it
2. Click the "EDIT" button
3. Modify the note in the form
4. Click "SAVE_NOTE" to update
5. Note: Edited notes show an "EDITED" timestamp

### Delete
1. Open a note by clicking it
2. Click the "DELETE" button
3. Confirm the note is removed from the list

### Search
1. Type in the search bar above the notes list
2. Notes are filtered in real-time by title and content

### Mobile Testing
For the best experience testing on mobile:
1. Visit [https://devnotes-tau.vercel.app/](https://devnotes-tau.vercel.app/)
2. Sign in with Google
3. Create notes with text and images
4. Access your notes from any device

## Known Limitations
- Image uploads are limited to 10MB
- Rich text editor occasionally needs a refresh to load properly on slow connections
- Color picker button doesn't visually indicate the currently selected color
- Occasional adblocker issues with the gmail login prompt on mobile applications (adblocker must be disabled). 