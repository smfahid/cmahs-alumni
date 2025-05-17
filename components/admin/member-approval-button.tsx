"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { getBrowserClient } from "@/lib/supabase"

interface MemberApprovalButtonProps {
  memberId: string
}

export function MemberApprovalButton({ memberId }: MemberApprovalButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleApprove = async () => {
    setIsLoading(true)

    try {
      const supabase = getBrowserClient()

      const { error } = await supabase.from("users").update({ is_approved: true }).eq("id", memberId)

      if (error) throw error

      toast({
        title: "Member Approved",
        description: "The member has been approved successfully.",
      })

      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while approving the member.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleApprove} disabled={isLoading} size="sm">
      {isLoading ? "Approving..." : "Approve"}
    </Button>
  )
}
