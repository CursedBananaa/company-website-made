import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export default function Messages() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Messages</h1>
        
        <Card>
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-medium mb-2">No messages yet</h2>
            <p className="text-muted-foreground">Your messages will appear here</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
