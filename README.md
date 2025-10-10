# Islamic Q&A Platform

A production-ready Islamic question and answer platform with admin panel, GitHub repository-based persistent storage, and comprehensive features.

## Features

### User Features
- Browse questions by topics and categories
- Advanced search functionality
- Reading history tracking
- Bookmark management
- Personal notes on questions
- Islamic glossary
- Dark/Light theme support
- Fully responsive design

### Admin Features
- Secure authentication
- Full CRUD operations for questions and topics
- GitHub repository integration for persistent storage
- Bulk import/export capabilities
- Image upload (Cloudinary integration)
- Rich text editor support
- Advanced filtering and sorting
- Draft/Publish workflow
- Analytics dashboard with real-time stats
- Comprehensive audit logging
- Error handling and loading states

## Architecture

### Data Layer
- **Single Source of Truth**: GitHub repository serves as the production database
- **Octokit Integration**: Real GitHub API integration for all data operations
- **Persistent Storage**: All changes are committed to GitHub repository
- **Version Control**: Built-in versioning through Git commits
- **Audit Trail**: Every change is tracked through commit history

### API Layer
- **Async API Routes**: All routes use proper async/await patterns
- **Error Handling**: Comprehensive error handling with appropriate status codes
- **Authentication**: Bearer token-based auth for admin operations
- **Data Validation**: Server-side validation for all inputs

### Frontend Layer
- **React Query**: Client-side data fetching and caching
- **Loading States**: Proper loading indicators throughout
- **Error Boundaries**: Graceful error handling
- **Optimistic Updates**: Immediate UI feedback with rollback on errors

## Setup

1. **Install dependencies**:
```bash
pnpm install
```

2. **Create GitHub Repository**:
   - Create a new GitHub repository (e.g., `qa-data`)
   - Generate a Personal Access Token with `repo` permissions
   - Initialize the repository with the following files:
     - `questions.json` (empty array: `[]`)
     - `topics.json` (empty array: `[]`)
     - `audit-logs.json` (empty array: `[]`)
     - `analytics.json` (see structure below)

3. **Configure environment variables**:

Create `.env.local` file:
```env
# Admin Authentication
ADMIN_CREDENTIALS=admin:your-secure-password

# GitHub Configuration
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_OWNER=your-github-username-or-org
GITHUB_REPO=qa-data
GITHUB_BRANCH=main

# Optional: Cloudinary for image uploads
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_UPLOAD_PRESET=your-upload-preset
CLOUDINARY_URL=cloudinary://api-key:api-secret@cloud-name
```

4. **Initialize analytics.json** in your GitHub repo:
```json
{
  "totalQuestions": 0,
  "totalTopics": 0,
  "totalViews": 0,
  "totalBookmarks": 0,
  "dailyStats": []
}
```

5. **Run development server**:
```bash
pnpm run dev
```

6. **Access the application**:
   - Main site: http://localhost:3000
   - Admin panel: http://localhost:3000/admin

## Project Structure

```
├── app/                      # Next.js app directory
│   ├── admin/               # Admin panel pages
│   ├── api/                 # API routes
│   │   ├── admin/          # Admin endpoints (CRUD)
│   │   ├── questions/      # Public question endpoints
│   │   ├── topics/         # Public topic endpoints
│   │   └── search/         # Search endpoint
│   ├── question/           # Question detail pages
│   ├── topic/              # Topic pages
│   ├── bookmarks/          # Bookmarks page
│   ├── history/            # Reading history
│   └── glossary/           # Islamic glossary
├── components/              # React components
│   ├── admin/              # Admin-specific components
│   └── ui/                 # Reusable UI components
├── hooks/                   # Custom React hooks
│   ├── use-questions.ts    # Question data hooks
│   └── use-topics.ts       # Topic data hooks
├── lib/                     # Core utilities
│   ├── github-db.ts        # GitHub DB operations (Octokit)
│   ├── data.ts             # Server-side data fetching
│   ├── sdk.ts              # Client-side SDK
│   └── types.ts            # TypeScript types
└── scripts/                 # Utility scripts
```

## Database Schema

### Question
```typescript
{
  id: string
  title: string
  answer: string
  excerpt?: string
  topicIds: string[]
  tags: string[]
  status: "draft" | "published" | "pending"
  createdAt: string (ISO)
  updatedAt: string (ISO)
  createdBy: string
  viewCount: number
  bookmarkCount: number
  imageUrl?: string
}
```

### Topic
```typescript
{
  id: string
  name: string
  slug: string
  questionCount: number
  description?: string
  createdAt: string (ISO)
  updatedAt: string (ISO)
}
```

### Audit Log
```typescript
{
  id: string
  action: string
  entity: "question" | "topic"
  entityId: string
  userId: string
  timestamp: string (ISO)
  changes?: Record<string, unknown>
}
```

## API Routes

### Public Routes
- `GET /api/questions` - List published questions
- `GET /api/questions?id={id}` - Get single question
- `GET /api/questions?topicId={id}` - Get questions by topic
- `GET /api/topics` - List all topics
- `GET /api/topics?slug={slug}` - Get topic by slug
- `GET /api/search?q={query}&type={type}` - Search questions/topics
- `POST /api/questions/{id}/view` - Increment view count

### Admin Routes (Authentication Required)
- `GET /api/admin/questions` - List all questions with pagination
- `POST /api/admin/questions` - Create new question
- `PUT /api/admin/questions` - Update question
- `DELETE /api/admin/questions?id={id}` - Delete question
- `GET /api/admin/topics` - List all topics
- `POST /api/admin/topics` - Create new topic
- `PUT /api/admin/topics` - Update topic
- `DELETE /api/admin/topics?id={id}` - Delete topic
- `GET /api/admin/analytics` - Get analytics and audit logs
- `POST /api/admin/upload` - Upload images to Cloudinary

## Features in Detail

### GitHub Database Integration
- **Octokit**: Official GitHub REST API client
- **Atomic Operations**: Each write operation is a single commit
- **Conflict Resolution**: SHA-based updates prevent conflicts
- **Auto-initialization**: Creates default files if missing
- **Automatic Analytics**: Updates stats on every data change

### Admin Panel
Access at `/admin` with credentials from `ADMIN_CREDENTIALS`.

Features:
- **Dashboard**: Overview of stats and recent activity
- **Question Manager**: Full CRUD with rich text editor
- **Topic Manager**: Manage categories and counts
- **Analytics**: Real-time usage statistics
- **Audit Logs**: Complete action history

### Client-Side Features
- **Bookmarks**: Local storage-based bookmarking
- **History**: Reading history tracking
- **Notes**: Personal notes on questions
- **Search**: Full-text search across questions and topics
- **Themes**: Dark/Light mode with persistence

## Deployment

### Prerequisites
1. GitHub repository set up with initial files
2. Environment variables configured
3. Cloudinary account (optional, for images)

### Build & Deploy

```bash
# Build for production
pnpm run build

# Start production server
pnpm start
```

### Hosting Platforms
Works with:
- Vercel (recommended)
- Netlify
- Railway
- AWS Amplify
- Any Node.js hosting

### Environment Variables
Set these in your hosting platform:
- `ADMIN_CREDENTIALS`
- `GITHUB_TOKEN`
- `GITHUB_OWNER`
- `GITHUB_REPO`
- `GITHUB_BRANCH`
- `CLOUDINARY_*` (optional)

## Security

- **Authentication**: Environment-based with Bearer tokens
- **Authorization**: All admin routes verify credentials
- **Input Validation**: Server-side validation on all inputs
- **No Secrets in Commits**: Credentials never stored in database
- **HTTPS Only**: Recommended for production
- **Rate Limiting**: Consider adding to prevent abuse

## Technologies

- **Framework**: Next.js 15.2.4 (App Router, Server Components)
- **Language**: TypeScript 5 (strict mode)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 3.4
- **Components**: Radix UI + shadcn/ui
- **State Management**: TanStack React Query 5
- **Animations**: Framer Motion
- **GitHub API**: Octokit/rest 21
- **Form Handling**: React Hook Form + Zod
- **Icons**: Lucide React
- **Image Upload**: Cloudinary (optional)

## Performance

- **Server Components**: Default for better performance
- **Client Components**: Only where interactivity needed
- **React Query**: Automatic caching and deduplication
- **Optimistic Updates**: Instant UI feedback
- **Dynamic Routes**: `force-dynamic` for API routes

## Error Handling

- **API Errors**: Proper HTTP status codes
- **Client Errors**: Error boundaries for graceful failures
- **Loading States**: Skeleton loaders and spinners
- **Retry Logic**: React Query automatic retries
- **Fallbacks**: Default content when data unavailable

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License

## Support

For issues and questions:
1. Check the documentation
2. Search existing issues
3. Create a new issue with details
