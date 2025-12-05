import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Phone, Video, Image, Paperclip, Mic, Send, Plus, Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread?: number;
  isOnline?: boolean;
  role?: string;
}

interface Message {
  id: string;
  content: string;
  sender: "me" | "other";
  time: string;
  images?: string[];
  link?: { text: string; url: string };
}

interface Group {
  id: string;
  name: string;
  avatar: string;
  members: number;
}

const contacts: Contact[] = [
  { id: "1", name: "Maggie Sullivan", avatar: "MS", lastMessage: "Lorem ipsum ultrices elementum...", time: "10Am", unread: 1, isOnline: true },
  { id: "2", name: "Alan Cain", avatar: "AC", lastMessage: "sed et nulla in consequat sagittis amet arcu...", time: "9Pm" },
  { id: "3", name: "Gilbert Johnston", avatar: "GJ", lastMessage: "aliquam ullamcorper a at eu ut libero amet arcu ipsum...", time: "9Pm", isOnline: true },
  { id: "4", name: "Christine Brooks", avatar: "CB", lastMessage: "sed et nulla in consequat sagittis amet arcu...", time: "9Pm" },
  { id: "5", name: "Rosie Pearson", avatar: "RP", lastMessage: "aliquam ullamcorper a at eu ut libero amet arcu ipsum...", time: "9Am", isOnline: true },
  { id: "6", name: "Rosie Todd", avatar: "RT", lastMessage: "Lorem ipsum ultrices elementum...", time: "9pm" },
  { id: "7", name: "Alfred Murray", avatar: "AM", lastMessage: "aliquam ullamcorper a at eu ut libero amet arcu ipsum...", time: "8Pm" },
];

const groups: Group[] = [
  { id: "g1", name: "App Development", avatar: "AD", members: 2 },
  { id: "g2", name: "Backend", avatar: "BE", members: 0 },
  { id: "g3", name: "UI&UX Design", avatar: "UX", members: 2 },
];

const chatMessages: Message[] = [
  {
    id: "m1",
    content: "vulputate ultrices cras nisl pellentesque tempus aliquam et eget sollicitudin erat in mauris eros amet volutpat enim placerat",
    sender: "other",
    time: "Yesterday 10:18 AM",
  },
  {
    id: "m2",
    content: "turpis donec ut sed elementum pellentesque at viverra arcu vitae urna varius fringillaturpis donec ut sed elementum pellentesque at viverra arcu vitae urna varius fringilla",
    sender: "me",
    time: "Yesterday 10:18 AM",
  },
  {
    id: "m3",
    content: "turpis donec ut sed elementum pellentesque at viverra arcu vitae urna varius fringillaturpis donec ut sed elementum pellentesque at viverra arcu vitae urna varius fringillaturpis donec ut sed elementum pellentesque at viverra arcu vitae urna varius fringilla",
    sender: "other",
    time: "Yesterday 10:19 AM",
  },
  {
    id: "m4",
    content: "I Shared The first two page in if you first page",
    sender: "other",
    time: "Yesterday 10:19 AM",
    images: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=100&h=100&fit=crop",
    ],
    link: { text: "Sha8lny Graduation Project🎓 – Figma", url: "#" },
  },
  {
    id: "m5",
    content: "turpis donec ut sed elementum pellentesque at viverra arcu vitae urna varius fringillaturpis donec ut sed elementum pellentesque at viverra arcu vitae urna varius fringillaturpis donec ut sed elementum pellentesque at viverra arcu vitae urna varius fringilla",
    sender: "me",
    time: "Yesterday 10:18 AM",
  },
];

export default function Messages() {
  const [selectedContact, setSelectedContact] = useState<Contact>(contacts[0]);
  const [messageInput, setMessageInput] = useState("");

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-7rem)] gap-0 -m-6 mt-0">
        {/* Contacts Sidebar */}
        <div className="w-80 bg-card border-r border-border flex flex-col">
          {/* Contacts List */}
          <ScrollArea className="flex-1">
            <div className="p-2">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                    selectedContact.id === contact.id
                      ? "bg-secondary"
                      : "hover:bg-muted"
                  )}
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium text-primary">
                      {contact.avatar}
                    </div>
                    {contact.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-card" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{contact.name}</span>
                      <span className="text-xs text-muted-foreground">{contact.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {contact.lastMessage}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {contact.unread ? (
                      <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center">
                        <span className="text-[10px] text-success-foreground font-medium">
                          {contact.unread}
                        </span>
                      </div>
                    ) : (
                      <CheckCheck className="w-4 h-4 text-chart-blue" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Groups Section */}
          <div className="border-t border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-sm">GROUPS ({groups.length})</span>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-xs font-medium text-muted-foreground">
                      {group.avatar}
                    </span>
                  </div>
                  <span className="flex-1 text-sm font-medium">{group.name}</span>
                  {group.members > 0 && (
                    <div className="w-6 h-6 rounded-full bg-chart-green flex items-center justify-center">
                      <span className="text-[10px] text-success-foreground font-medium">
                        +{group.members}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-background">
          {/* Chat Header */}
          <div className="h-16 border-b border-border flex items-center justify-between px-6 bg-card">
            <div className="flex items-center gap-3">
              <div className="grid grid-cols-2 gap-0.5">
                <div className="w-2 h-2 bg-destructive rounded-sm" />
                <div className="w-2 h-2 bg-success rounded-sm" />
                <div className="w-2 h-2 bg-chart-blue rounded-sm" />
                <div className="w-2 h-2 bg-pending rounded-sm" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{selectedContact.name}</h3>
                <p className="text-xs text-muted-foreground">{selectedContact.role || "UI&UX Designer"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search"
                  className="pl-9 w-40 h-8 bg-muted border-0 text-sm"
                />
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Video className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.sender === "me" ? "justify-end" : "justify-start"
                  )}
                >
                  <div className={cn("max-w-md", message.sender === "other" && "flex gap-2")}>
                    {message.sender === "other" && (
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary shrink-0">
                        {selectedContact.avatar}
                      </div>
                    )}
                    <div>
                      {message.sender === "other" && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">{selectedContact.name}</span>
                          <span className="text-xs text-muted-foreground">{message.time}</span>
                        </div>
                      )}
                      <div
                        className={cn(
                          "rounded-lg p-3",
                          message.sender === "me"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                      >
                        <p className="text-sm">{message.content}</p>
                        {message.images && (
                          <div className="flex gap-2 mt-2">
                            {message.images.map((img, idx) => (
                              <img
                                key={idx}
                                src={img}
                                alt=""
                                className="w-16 h-16 rounded object-cover"
                              />
                            ))}
                          </div>
                        )}
                        {message.link && (
                          <div className="mt-2">
                            <p className="text-xs font-medium mb-1">YOU CAN SHOW THIS</p>
                            <a
                              href={message.link.url}
                              className="text-chart-blue text-sm hover:underline"
                            >
                              {message.link.text}
                            </a>
                          </div>
                        )}
                      </div>
                      {message.sender === "me" && (
                        <div className="flex items-center justify-end gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{message.time}</span>
                          <span className="text-xs font-medium">MicroSoft</span>
                          <div className="grid grid-cols-2 gap-0.5">
                            <div className="w-1.5 h-1.5 bg-destructive rounded-sm" />
                            <div className="w-1.5 h-1.5 bg-success rounded-sm" />
                            <div className="w-1.5 h-1.5 bg-chart-blue rounded-sm" />
                            <div className="w-1.5 h-1.5 bg-pending rounded-sm" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="h-16 border-t border-border flex items-center gap-3 px-6 bg-card">
            <Input
              placeholder="Type a Message here...."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="flex-1 border-0 bg-transparent focus-visible:ring-0"
            />
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <Image className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <Mic className="h-5 w-5" />
              </Button>
              <Button size="icon" className="h-8 w-8 bg-primary hover:bg-primary/90">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
