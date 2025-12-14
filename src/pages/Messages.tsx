import { useState, useRef } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Phone, Video, Image, Paperclip, Mic, Send, Plus, CheckCheck, X, FileText, Play, Pause, Users, UserPlus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface Contact {
  id: string;
  name: string;
  avatar: string;
  avatarUrl?: string;
  lastMessage: string;
  time: string;
  unread?: number;
  isOnline?: boolean;
  role?: string;
  email?: string;
  phone?: string;
}

interface Message {
  id: string;
  content: string;
  sender: "me" | "other";
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;
  time: string;
  images?: string[];
  documents?: { name: string; size: string; type: string }[];
  voiceNote?: { duration: string; url: string };
  link?: { text: string; url: string };
}

interface Group {
  id: string;
  name: string;
  avatar: string;
  members: GroupMember[];
  description?: string;
}

interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  avatarUrl?: string;
  role?: string;
  isOnline?: boolean;
}

const contacts: Contact[] = [
  { id: "1", name: "Maggie Sullivan", avatar: "MS", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face", lastMessage: "Lorem ipsum ultrices elementum...", time: "10Am", unread: 1, isOnline: true, role: "UI/UX Designer", email: "maggie@example.com", phone: "+1 234 567 890" },
  { id: "2", name: "Alan Cain", avatar: "AC", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", lastMessage: "sed et nulla in consequat sagittis amet arcu...", time: "9Pm", role: "Developer", email: "alan@example.com", phone: "+1 234 567 891" },
  { id: "3", name: "Gilbert Johnston", avatar: "GJ", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face", lastMessage: "aliquam ullamcorper a at eu ut libero amet arcu ipsum...", time: "9Pm", isOnline: true, role: "Project Manager", email: "gilbert@example.com", phone: "+1 234 567 892" },
  { id: "4", name: "Christine Brooks", avatar: "CB", avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face", lastMessage: "sed et nulla in consequat sagittis amet arcu...", time: "9Pm", role: "Backend Developer", email: "christine@example.com", phone: "+1 234 567 893" },
  { id: "5", name: "Rosie Pearson", avatar: "RP", avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face", lastMessage: "aliquam ullamcorper a at eu ut libero amet arcu ipsum...", time: "9Am", isOnline: true, role: "Designer", email: "rosie@example.com", phone: "+1 234 567 894" },
  { id: "6", name: "Rosie Todd", avatar: "RT", lastMessage: "Lorem ipsum ultrices elementum...", time: "9pm", role: "QA Engineer", email: "rosiet@example.com", phone: "+1 234 567 895" },
  { id: "7", name: "Alfred Murray", avatar: "AM", lastMessage: "aliquam ullamcorper a at eu ut libero amet arcu ipsum...", time: "8Pm", role: "DevOps", email: "alfred@example.com", phone: "+1 234 567 896" },
];

const initialGroupMembers: GroupMember[] = [
  { id: "m1", name: "John Doe", avatar: "JD", avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face", role: "Team Lead", isOnline: true },
  { id: "m2", name: "Sarah Wilson", avatar: "SW", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face", role: "Designer", isOnline: true },
  { id: "m3", name: "Mike Chen", avatar: "MC", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", role: "Developer", isOnline: false },
  { id: "m4", name: "Emily Brown", avatar: "EB", avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face", role: "Developer", isOnline: true },
  { id: "m5", name: "David Lee", avatar: "DL", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face", role: "QA Engineer", isOnline: false },
  { id: "m6", name: "Lisa Park", avatar: "LP", avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face", role: "Designer", isOnline: true },
];

const initialGroups: Group[] = [
  { id: "g1", name: "App Development", avatar: "AD", members: initialGroupMembers.slice(0, 4), description: "Main development team for the mobile app project" },
  { id: "g2", name: "Backend", avatar: "BE", members: initialGroupMembers.slice(1, 3), description: "Backend API development team" },
  { id: "g3", name: "UI&UX Design", avatar: "UX", members: initialGroupMembers.slice(0, 2), description: "Design team for all UI/UX work" },
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
    content: "turpis donec ut sed elementum pellentesque at viverra arcu vitae urna varius fringilla",
    sender: "me",
    time: "Yesterday 10:18 AM",
  },
  {
    id: "m3",
    content: "Here's the document you requested",
    sender: "other",
    time: "Yesterday 10:19 AM",
    documents: [
      { name: "Project_Requirements.pdf", size: "2.4 MB", type: "pdf" },
      { name: "Design_Specs.docx", size: "1.1 MB", type: "doc" },
    ],
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
    content: "",
    sender: "other",
    time: "Yesterday 10:25 AM",
    voiceNote: { duration: "0:32", url: "#" },
  },
  {
    id: "m6",
    content: "Thanks! I'll review these and get back to you.",
    sender: "me",
    time: "Yesterday 10:30 AM",
  },
];

const groupMessages: Message[] = [
  {
    id: "gm1",
    content: "Hey team, let's discuss the new feature requirements",
    sender: "other",
    senderId: "m1",
    senderName: "John Doe",
    senderAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    time: "Today 9:00 AM",
  },
  {
    id: "gm2",
    content: "Sure! I've prepared some mockups for the dashboard",
    sender: "other",
    senderId: "m2",
    senderName: "Sarah Wilson",
    senderAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    time: "Today 9:05 AM",
    images: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop",
    ],
  },
  {
    id: "gm3",
    content: "I'll start working on the API endpoints today",
    sender: "other",
    senderId: "m3",
    senderName: "Mike Chen",
    senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    time: "Today 9:10 AM",
  },
  {
    id: "gm4",
    content: "Great progress everyone! Let me know if you need any help.",
    sender: "me",
    time: "Today 9:15 AM",
  },
  {
    id: "gm5",
    content: "Here's the technical spec document",
    sender: "other",
    senderId: "m4",
    senderName: "Emily Brown",
    senderAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    time: "Today 9:20 AM",
    documents: [
      { name: "Technical_Spec_v2.pdf", size: "3.2 MB", type: "pdf" },
    ],
  },
];

const sharedMedia = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1560015534-cee980ba7e13?w=200&h=200&fit=crop",
];

const sharedDocuments = [
  { name: "Project_Requirements.pdf", size: "2.4 MB", type: "pdf", date: "Dec 10" },
  { name: "Design_Specs.docx", size: "1.1 MB", type: "doc", date: "Dec 9" },
  { name: "Meeting_Notes.pdf", size: "0.8 MB", type: "pdf", date: "Dec 8" },
  { name: "Budget_2024.xlsx", size: "1.5 MB", type: "xls", date: "Dec 7" },
];

export default function Messages() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(contacts[0]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [messageInput, setMessageInput] = useState("");
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const availableMembers = initialGroupMembers.filter(
    member => !selectedGroup?.members.some(m => m.id === member.id)
  );

  const handleAddMember = (member: GroupMember) => {
    if (!selectedGroup) return;
    
    const updatedGroups = groups.map(g => 
      g.id === selectedGroup.id 
        ? { ...g, members: [...g.members, member] }
        : g
    );
    setGroups(updatedGroups);
    setSelectedGroup(updatedGroups.find(g => g.id === selectedGroup.id) || null);
    toast.success(`${member.name} added to ${selectedGroup.name}`);
    setIsAddMemberOpen(false);
  };

  const handleRemoveMember = (memberId: string) => {
    if (!selectedGroup) return;
    
    const memberToRemove = selectedGroup.members.find(m => m.id === memberId);
    const updatedGroups = groups.map(g => 
      g.id === selectedGroup.id 
        ? { ...g, members: g.members.filter(m => m.id !== memberId) }
        : g
    );
    setGroups(updatedGroups);
    setSelectedGroup(updatedGroups.find(g => g.id === selectedGroup.id) || null);
    if (memberToRemove) {
      toast.success(`${memberToRemove.name} removed from ${selectedGroup.name}`);
    }
  };

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
    setSelectedGroup(null);
    setIsInfoPanelOpen(true);
  };

  const handleGroupClick = (group: Group) => {
    setSelectedGroup(group);
    setSelectedContact(null);
    setIsInfoPanelOpen(true);
  };

  const handleImageUpload = () => {
    imageInputRef.current?.click();
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    recordingIntervalRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
    // Here you would handle the recorded audio
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const currentMessages = selectedGroup ? groupMessages : chatMessages;
  const currentName = selectedGroup ? selectedGroup.name : selectedContact?.name;
  const currentAvatar = selectedGroup ? selectedGroup.avatar : selectedContact?.avatar;

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-7rem)] gap-0 -m-6 mt-0">
        {/* Hidden file inputs */}
        <input
          type="file"
          ref={imageInputRef}
          className="hidden"
          accept="image/*"
          multiple
        />
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
          multiple
        />

        {/* Contacts Sidebar */}
        <div className="w-80 bg-card border-r border-border flex flex-col">
          {/* Contacts List */}
          <ScrollArea className="flex-1">
            <div className="p-2">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => handleContactClick(contact)}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                    selectedContact?.id === contact.id && !selectedGroup
                      ? "bg-secondary"
                      : "hover:bg-muted"
                  )}
                >
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={contact.avatarUrl} />
                      <AvatarFallback className="bg-primary/20 text-primary text-sm">
                        {contact.avatar}
                      </AvatarFallback>
                    </Avatar>
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
                  onClick={() => handleGroupClick(group)}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors",
                    selectedGroup?.id === group.id
                      ? "bg-secondary"
                      : "hover:bg-muted"
                  )}
                >
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <span className="flex-1 text-sm font-medium">{group.name}</span>
                  {group.members.length > 0 && (
                    <div className="w-6 h-6 rounded-full bg-chart-green flex items-center justify-center">
                      <span className="text-[10px] text-success-foreground font-medium">
                        +{group.members.length}
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
            <div 
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setIsInfoPanelOpen(true)}
            >
              {selectedGroup ? (
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
              ) : (
                <Avatar className="w-10 h-10">
                  <AvatarImage src={selectedContact?.avatarUrl} />
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {currentAvatar}
                  </AvatarFallback>
                </Avatar>
              )}
              <div>
                <h3 className="font-semibold text-sm">{currentName}</h3>
                <p className="text-xs text-muted-foreground">
                  {selectedGroup 
                    ? `${selectedGroup.members.length} members` 
                    : selectedContact?.role || "UI&UX Designer"}
                </p>
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
              {currentMessages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.sender === "me" ? "justify-end" : "justify-start"
                  )}
                >
                  <div className={cn("max-w-md", message.sender === "other" && "flex gap-2")}>
                    {message.sender === "other" && (
                      <Avatar className="w-8 h-8 shrink-0">
                        <AvatarImage src={message.senderAvatar || selectedContact?.avatarUrl} />
                        <AvatarFallback className="bg-primary/20 text-primary text-xs">
                          {message.senderName?.split(" ").map(n => n[0]).join("") || currentAvatar}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      {message.sender === "other" && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">
                            {message.senderName || selectedContact?.name}
                          </span>
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
                        {message.content && <p className="text-sm">{message.content}</p>}
                        
                        {/* Voice Note */}
                        {message.voiceNote && (
                          <div className="flex items-center gap-3 min-w-[200px]">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 shrink-0"
                              onClick={() => setPlayingVoice(playingVoice === message.id ? null : message.id)}
                            >
                              {playingVoice === message.id ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                            <div className="flex-1 h-1 bg-border rounded-full">
                              <div className="w-1/3 h-full bg-primary rounded-full" />
                            </div>
                            <span className="text-xs">{message.voiceNote.duration}</span>
                          </div>
                        )}

                        {/* Documents */}
                        {message.documents && (
                          <div className="space-y-2 mt-2">
                            {message.documents.map((doc, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 p-2 rounded bg-background/50 cursor-pointer hover:bg-background/80 transition-colors"
                              >
                                <FileText className="h-5 w-5 text-chart-blue" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium truncate">{doc.name}</p>
                                  <p className="text-[10px] text-muted-foreground">{doc.size}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Images */}
                        {message.images && (
                          <div className="flex gap-2 mt-2 flex-wrap">
                            {message.images.map((img, idx) => (
                              <img
                                key={idx}
                                src={img}
                                alt=""
                                className="w-16 h-16 rounded object-cover cursor-pointer hover:opacity-80 transition-opacity"
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
                          <CheckCheck className="h-3 w-3 text-chart-blue" />
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
            {isRecording ? (
              <div className="flex-1 flex items-center gap-3">
                <div className="flex items-center gap-2 text-destructive">
                  <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                  <span className="text-sm font-medium">{formatRecordingTime(recordingTime)}</span>
                </div>
                <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-destructive animate-pulse" style={{ width: "100%" }} />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground"
                  onClick={() => {
                    setIsRecording(false);
                    if (recordingIntervalRef.current) {
                      clearInterval(recordingIntervalRef.current);
                    }
                  }}
                >
                  <X className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  className="h-8 w-8 bg-primary hover:bg-primary/90"
                  onClick={handleStopRecording}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <Input
                  placeholder="Type a Message here...."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1 border-0 bg-transparent focus-visible:ring-0"
                />
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                    onClick={handleImageUpload}
                  >
                    <Image className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                    onClick={handleFileUpload}
                  >
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                    onClick={handleStartRecording}
                  >
                    <Mic className="h-5 w-5" />
                  </Button>
                  <Button size="icon" className="h-8 w-8 bg-primary hover:bg-primary/90">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Info Panel (Sheet) */}
        <Sheet open={isInfoPanelOpen} onOpenChange={setIsInfoPanelOpen}>
          <SheetContent className="w-[350px] sm:w-[400px] p-0">
            <SheetHeader className="p-6 pb-4 border-b border-border">
              <SheetTitle className="text-left">
                {selectedGroup ? "Group Info" : "Contact Info"}
              </SheetTitle>
            </SheetHeader>
            
            <ScrollArea className="h-[calc(100vh-5rem)]">
              <div className="p-6">
                {/* Profile/Group Header */}
                <div className="flex flex-col items-center text-center mb-6">
                  {selectedGroup ? (
                    <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                      <Users className="h-10 w-10 text-primary" />
                    </div>
                  ) : (
                    <Avatar className="w-20 h-20 mb-3">
                      <AvatarImage src={selectedContact?.avatarUrl} />
                      <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                        {selectedContact?.avatar}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <h3 className="font-semibold text-lg">
                    {selectedGroup?.name || selectedContact?.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedGroup 
                      ? selectedGroup.description 
                      : selectedContact?.role}
                  </p>
                </div>

                {/* Contact Details */}
                {selectedContact && !selectedGroup && (
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="text-sm">{selectedContact.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="text-sm">{selectedContact.email}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Group Members */}
                {selectedGroup && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-sm">
                        Members ({selectedGroup.members.length})
                      </h4>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 px-2 text-primary"
                        onClick={() => setIsAddMemberOpen(true)}
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {selectedGroup.members.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors group"
                        >
                          <div className="relative">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={member.avatarUrl} />
                              <AvatarFallback className="bg-primary/20 text-primary text-sm">
                                {member.avatar}
                              </AvatarFallback>
                            </Avatar>
                            {member.isOnline && (
                              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-card" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.role}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleRemoveMember(member.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Media & Documents Tabs */}
                <Tabs defaultValue="media" className="w-full">
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="media">Media</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                  </TabsList>
                  <TabsContent value="media" className="mt-4">
                    <div className="grid grid-cols-3 gap-2">
                      {sharedMedia.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt=""
                          className="aspect-square rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                        />
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="documents" className="mt-4">
                    <div className="space-y-2">
                      {sharedDocuments.map((doc, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-3 rounded-lg bg-muted cursor-pointer hover:bg-muted/80 transition-colors"
                        >
                          <FileText className="h-8 w-8 text-chart-blue" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {doc.size} • {doc.date}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>

        {/* Add Member Dialog */}
        <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Add Member to {selectedGroup?.name}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              {availableMembers.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No available members to add
                </p>
              ) : (
                <div className="space-y-2">
                  {availableMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                      onClick={() => handleAddMember(member)}
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={member.avatarUrl} />
                        <AvatarFallback className="bg-primary/20 text-primary text-sm">
                          {member.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                      <UserPlus className="h-4 w-4 text-primary" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
