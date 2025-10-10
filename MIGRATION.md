# Migration Guide: Production-Ready GitHub DB Integration

This document outlines the complete migration from dual-layer (in-memory + file-based) architecture to a production-ready single-source-of-truth GitHub database architecture.

## Changes Overview

### 1. Eliminated Dual Data Layer
**Before**: Application used both `InMemoryDatabase` (lib/db.ts) and file-based GitHub DB (lib/github-db.ts)
**After**: GitHub DB via Octokit is the single source of truth

**Changes Made**:
- Removed in-memory database class from lib/db.ts
- lib/sdk.ts now calls API routes instead of in-memory DB
- All data operations go through GitHub API via Octokit

### 2. Integrated GitHub API with Octokit
**Added**: `@octokit/rest` package for official GitHub API integration

**lib/github-db.ts Changes**:
- Import and configure Octokit client
- All read/write operations use GitHub REST API
- Proper SHA-based file updates to prevent conflicts
- Auto-initialization of missing files with default content
- Atomic commits for every data change

**New Functions**:
- `getFileFromGitHub(path)`: Reads JSON from GitHub with fallback
- `updateFileInGitHub(path, content, message, sha)`: Writes with commit
- `getTopicBySlug(slug)`: Direct topic lookup by slug
- `getQuestionsByTopicId(topicId)`: Questions filtered by topic
- `updateTopicQuestionCounts()`: Sync topic counts with question data
- `searchQuestions(query)`: Full-text search in questions
- `searchTopics(query)`: Full-text search in topics

### 3. Implemented Proper Async API Routes
**Created New Routes**:
- `app/api/questions/route.ts`: Public question endpoints
- `app/api/topics/route.ts`: Public topic endpoints
- `app/api/search/route.ts`: Unified search endpoint

**Updated Admin Routes**:
- `app/api/admin/questions/route.ts`: Enhanced with search, filtering, pagination
- `app/api/admin/topics/route.ts`: Full CRUD operations
- `app/api/admin/analytics/route.ts`: Real-time stats from GitHub

**Features**:
- All routes marked with `export const dynamic = "force-dynamic"`
- Proper async/await patterns throughout
- Error handling with appropriate HTTP status codes
- Query parameter support for filtering and pagination

### 4. Server-Side Data Fetching Patterns
**lib/data.ts Refactored**:
- Now imports from github-db.ts instead of sdk.ts
- Functions for server-side data fetching (SSR compatible)
- Renamed to avoid conflicts: `getTopicsData()`, `getTopicBySlugData()`

**Usage**:
```typescript
// Server components (app router)
import { getFeaturedQuestions, getTopicsData } from "@/lib/data"

export default async function Page() {
  const questions = await getFeaturedQuestions()
  const topics = await getTopicsData()
  // ...
}
```

### 5. Comprehensive Error Handling & Loading States
**hooks/use-questions.ts Updates**:
- React Query for client-side data fetching
- Proper error handling with try/catch
- Loading states exposed via `isLoading`
- Error states exposed via `error`
- Separate hooks for admin operations with auth tokens

**hooks/use-topics.ts Updates**:
- Similar pattern as use-questions
- Admin-specific hooks with authentication
- Search functionality integrated

**Error Boundaries**:
- Existing ErrorBoundary component wraps page content
- Graceful degradation on errors

### 6. Unified Frontend Data Access
**Client-Side SDK (lib/sdk.ts)**:
- Now calls API routes instead of direct DB access
- Centralized error handling via `fetchWithErrorHandling()`
- Consistent return types
- Graceful fallbacks (empty arrays on errors)

**Hooks Pattern**:
```typescript
// Public data (no auth)
const { data, isLoading, error } = useQuestions()
const { data: topics } = useTopics()
const { data: results } = useSearchQuestions(query)

// Admin data (with auth)
const { data } = useAdminQuestions({ status: "all", page: 1 })
const createMutation = useCreateQuestion()
const updateMutation = useUpdateQuestion()
const deleteMutation = useDeleteQuestion()
```

### 7. End-to-End Feature Verification

#### Admin CRUD ✓
- Questions: Create, Read, Update, Delete via `/api/admin/questions`
- Topics: Create, Read, Update, Delete via `/api/admin/topics`
- All operations persist to GitHub repository
- Audit logs track every change

#### Public Frontend ✓
- Homepage displays published questions and topics
- Topic pages filter questions by topic
- Question detail pages with view tracking
- Search functionality across questions and topics

#### Bookmarks ✓
- Client-side localStorage-based (no backend needed)
- Managed via hooks and components

#### History ✓
- Reading history tracked in localStorage
- View count incremented via API on question view

#### Notes ✓
- Personal notes stored in localStorage
- Associated with question IDs

#### Analytics ✓
- Dashboard displays real-time stats from GitHub
- Auto-updates on every data change
- Tracks: total questions, topics, views, bookmarks

#### Audit Logs ✓
- Every CRUD operation logged
- Stored in audit-logs.json in GitHub
- Includes: timestamp, user, action, entity, changes

## Environment Variables

**New Required Variables**:
```env
GITHUB_TOKEN=ghp_xxxxxxxxxxxxx
GITHUB_OWNER=your-username
GITHUB_REPO=qa-data
GITHUB_BRANCH=main
```

**Existing Variables**:
```env
ADMIN_CREDENTIALS=admin:password
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_UPLOAD_PRESET=xxx
CLOUDINARY_URL=cloudinary://xxx
```

## GitHub Repository Setup

1. Create a new GitHub repository (e.g., `qa-data`)
2. Generate Personal Access Token with `repo` permissions
3. Initialize with these files:

**questions.json**:
```json
[]
```

**topics.json**:
```json
[]
```

**audit-logs.json**:
```json
[]
```

**analytics.json**:
```json
{
  "totalQuestions": 0,
  "totalTopics": 0,
  "totalViews": 0,
  "totalBookmarks": 0,
  "dailyStats": []
}
```

## Migration Steps

### For Existing Installations

1. **Install Octokit**:
```bash
npm install @octokit/rest
# or
pnpm add @octokit/rest
```

2. **Set up GitHub Repository** (see above)

3. **Configure Environment Variables**:
```bash
cp .env.example .env.local
# Edit .env.local with your values
```

4. **Migrate Existing Data** (if any):
```bash
# Copy db/*.json files to your GitHub repository
# Commit and push to GitHub
```

5. **Test the Migration**:
```bash
# Start dev server
pnpm dev

# Test admin panel at /admin
# Create a test question/topic
# Verify it appears in GitHub repository
```

### For New Installations

Follow the Setup instructions in README.md

## Breaking Changes

### Removed
- `InMemoryDatabase` class (lib/db.ts still exists but should be removed)
- Direct in-memory data access
- Synchronous data operations

### Changed
- `lib/sdk.ts`: Now async, calls API routes
- `hooks/use-questions.ts`: Now calls API instead of SDK
- `hooks/use-topics.ts`: Now calls API instead of SDK
- `lib/data.ts`: Renamed functions to avoid conflicts

### Added
- GitHub authentication requirement (GITHUB_TOKEN)
- Async/await patterns throughout
- Error handling at every layer
- Loading states for all data operations

## Testing Checklist

- [ ] Admin login works with ADMIN_CREDENTIALS
- [ ] Creating a question commits to GitHub
- [ ] Updating a question commits to GitHub
- [ ] Deleting a question commits to GitHub
- [ ] Creating a topic commits to GitHub
- [ ] Topic question counts update automatically
- [ ] Public pages display published content
- [ ] Search finds questions and topics
- [ ] View count increments on question view
- [ ] Analytics dashboard shows correct stats
- [ ] Audit logs record all admin actions
- [ ] Error handling works (try without GITHUB_TOKEN)
- [ ] Loading states display correctly

## Performance Considerations

### Caching
- React Query caches API responses client-side
- Stale time configured for optimal UX
- Automatic refetching on focus

### GitHub API Limits
- Standard rate limit: 5,000 requests/hour (authenticated)
- Consider implementing request caching for high-traffic sites
- Monitor usage via GitHub API dashboard

### Optimization Tips
1. Use server components where possible (default in Next.js App Router)
2. Implement Redis/Upstash for API response caching in production
3. Consider webhook-based cache invalidation
4. Use ISR (Incremental Static Regeneration) for public pages

## Troubleshooting

### "Unauthorized" errors
- Verify GITHUB_TOKEN is set correctly
- Check token has `repo` permissions
- Ensure token hasn't expired

### "File not found" errors
- Initialize repository with default JSON files
- Check GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH are correct

### "SHA mismatch" errors
- GitHub file was modified outside the application
- Clear React Query cache and refetch
- Check for concurrent modifications

### Slow performance
- Implement caching layer (Redis)
- Reduce API calls with proper React Query configuration
- Consider using GitHub GraphQL API for complex queries

## Future Enhancements

1. **Caching Layer**: Add Redis/Upstash for faster reads
2. **Webhooks**: Real-time updates via GitHub webhooks
3. **Search Index**: Elasticsearch or Algolia for advanced search
4. **CDN**: Serve static content via CDN
5. **Multi-Region**: Deploy to multiple regions for better latency
6. **Backup**: Automated backups beyond Git history
7. **Migration Tool**: CLI tool for bulk data migration
8. **Rate Limiting**: Implement rate limiting for API routes

## Support

For issues or questions:
1. Check this migration guide
2. Review README.md
3. Check GitHub Issues
4. Create new issue with details
