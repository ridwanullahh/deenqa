"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface AuditLog {
  id: string
  action: string
  entity: "question" | "topic"
  entityId: string
  userId: string
  timestamp: string
  changes?: Record<string, unknown>
}

export function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/analytics", {
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setLogs(data.recentActivity)
      }
    } catch (error) {
      console.error("Failed to fetch logs:", error)
    } finally {
      setLoading(false)
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "create":
        return "default"
      case "update":
        return "secondary"
      case "delete":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Logs</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Loading logs...</div>
        ) : logs.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No audit logs available</p>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-4 p-4 border rounded-lg">
                <Badge variant={getActionColor(log.action)} className="capitalize">
                  {log.action}
                </Badge>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{log.userId}</span> {log.action}d a{" "}
                    <span className="font-medium">{log.entity}</span>{" "}
                    <span className="text-muted-foreground">(ID: {log.entityId})</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(log.timestamp).toLocaleString()}
                  </p>
                  {log.changes && (
                    <details className="mt-2">
                      <summary className="text-xs cursor-pointer text-muted-foreground hover:text-foreground">
                        View changes
                      </summary>
                      <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-x-auto">
                        {JSON.stringify(log.changes, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
