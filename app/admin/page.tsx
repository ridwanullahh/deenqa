// Admin dashboard. Bismillah Ar-Rahman Ar-Raheem.
//
// Auth is gated by the admin layout (which redirects to /admin/login
// if the JWT cookie is missing/invalid) and the middleware. This page
// is the dashboard itself: questions manager, topics manager, analytics,
// and audit log viewer.

"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QuestionManager } from "@/components/admin/question-manager"
import { TopicManager } from "@/components/admin/topic-manager"
import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard"
import { AuditLogViewer } from "@/components/admin/audit-log-viewer"

export const runtime = "edge"
export const dynamic = "force-dynamic"

export default function AdminPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage questions, topics, view analytics, and review audit logs.
        </p>
      </div>

      <Tabs defaultValue="questions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="topics">Topics</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="logs">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="questions">
          <QuestionManager />
        </TabsContent>

        <TabsContent value="topics">
          <TopicManager />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsDashboard />
        </TabsContent>

        <TabsContent value="logs">
          <AuditLogViewer />
        </TabsContent>
      </Tabs>
    </div>
  )
}
