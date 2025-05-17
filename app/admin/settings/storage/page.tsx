"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { getBrowserClient } from "@/lib/supabase"
import { STORAGE_BUCKETS } from "@/lib/storage-utils"
import { CheckCircle, XCircle } from "lucide-react"

export default function StorageSettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [bucketStatus, setBucketStatus] = useState<Record<string, boolean>>({})
  const { toast } = useToast()

  const checkBuckets = async () => {
    setIsLoading(true)
    const status: Record<string, boolean> = {}

    try {
      const supabase = getBrowserClient()
      const { data: buckets, error } = await supabase.storage.listBuckets()

      if (error) throw error

      const bucketNames = buckets.map((bucket) => bucket.name)

      // Check each bucket
      Object.values(STORAGE_BUCKETS).forEach((bucketName) => {
        status[bucketName] = bucketNames.includes(bucketName)
      })

      setBucketStatus(status)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to check storage buckets",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createAllBuckets = async () => {
    setIsLoading(true)
    const status: Record<string, boolean> = {}

    try {
      const supabase = getBrowserClient()

      // Create each bucket
      for (const bucketName of Object.values(STORAGE_BUCKETS)) {
        try {
          // Check if bucket exists
          const { data: buckets } = await supabase.storage.listBuckets()
          const bucketExists = buckets.some((bucket) => bucket.name === bucketName)

          if (!bucketExists) {
            const { error } = await supabase.storage.createBucket(bucketName, {
              public: true,
            })

            if (error) throw error
          }

          status[bucketName] = true
        } catch (error) {
          console.error(`Error creating bucket ${bucketName}:`, error)
          status[bucketName] = false
        }
      }

      setBucketStatus(status)

      const allCreated = Object.values(status).every((s) => s)

      if (allCreated) {
        toast({
          title: "Success",
          description: "All storage buckets have been created successfully.",
        })
      } else {
        toast({
          title: "Partial Success",
          description: "Some buckets could not be created. Please check the status below.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create storage buckets",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Storage Settings</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Storage Buckets</CardTitle>
          <CardDescription>Manage storage buckets required for the application to function properly.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button onClick={checkBuckets} disabled={isLoading}>
                Check Bucket Status
              </Button>
              <Button onClick={createAllBuckets} disabled={isLoading} variant="default">
                Create All Buckets
              </Button>
            </div>

            {Object.keys(bucketStatus).length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Bucket Status</h3>
                <div className="space-y-2">
                  {Object.entries(bucketStatus).map(([bucket, exists]) => (
                    <div key={bucket} className="flex items-center">
                      {exists ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mr-2" />
                      )}
                      <span>{bucket}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manual Setup Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            If the automatic bucket creation doesn't work, you can manually create the required buckets in the Supabase
            dashboard:
          </p>

          <ol className="list-decimal pl-5 space-y-2">
            <li>Go to your Supabase project dashboard</li>
            <li>Navigate to the "Storage" section</li>
            <li>Click "Create bucket" for each of the following buckets:</li>
            <ul className="list-disc pl-5 mt-2">
              {Object.values(STORAGE_BUCKETS).map((bucket) => (
                <li key={bucket}>{bucket}</li>
              ))}
            </ul>
            <li>For each bucket, go to "Policies" and add a policy to allow public access if needed</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
