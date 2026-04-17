import { useState } from "react";
import { DashboardLayout } from "@/components/admin/DashboardLayout";
import { Search, Phone, Video, Send, Paperclip, Smile, Image, ChevronDown, Check, CheckCheck, Users, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  date: string;
  time: string;
  unread?: number;
  isRead?: boolean;
  isOnline?: boolean;
}

interface Message {
  id: string;
  content: string;
  sender: "me" | "other";
  timestamp: string;
  date: string;
  images?: string[];
  link?: { text: string; url: string };
  isRead?: boolean;
  senderName?: string;
  senderLogo?: string;
}

const conversations: Conversation[] = [
  { id: "1", name: "Maggie Sullivan", avatar: "MS", lastMessage: "Lorem ipsum ultricies elementum...", date: "12 Dec 2025", time: "10Am", unread: 1, isOnline: true },
  { id: "2", name: "Alan Cain", avatar: "AC", lastMessage: "sed et nulla in consequat sagittis amet arcu...", date: "12 NOV 2025", time: "9Pm", isRead: true },
  { id: "3", name: "Gilbert Johnston", avatar: "GJ", lastMessage: "Aliquam ullamcorper a at as ut libero amet arcu ipsum...", date: "12 NOV 2025", time: "9Pm", isRead: true },
  { id: "4", name: "Christine Brooks", avatar: "CB", lastMessage: "sed et nulla in consequat sagittis amet arcu...", date: "12 NOV 2025", time: "9Pm", unread: 6 },
  { id: "5", name: "Rosie Pearson", avatar: "RP", lastMessage: "Aliquam ullamcorper a at as ut libero arcu ipsum...", date: "7 Sep 2025", time: "Mon", isRead: true },
];

interface Group {
  id: string;
  name: string;
  memberCount: number;
}

const groups: Group[] = [
  { id: "g1", name: "App Development", memberCount: 4 },
  { id: "g2", name: "Backend", memberCount: 2 },
  { id: "g3", name: "UI&UX Design", memberCount: 2 },
];

const messages: Message[] = [
  {
    id: "1",
    content: "vulputate ultrices cras nisl pellentesque tempus aliquam et eget sollicitudin erat in mauris eros amet volutpat enim placerat",
    sender: "other",
    timestamp: "10:14 AM",
    date: "Yesterday",
    senderName: "Maggie Sullivan",
  },
  {
    id: "2",
    content: "turpis donec ut sed elementum pellentesque at viverra arcu vitae urna varius fringillatturpis donec ut sed elementum pellentesque at viverra",
    sender: "me",
    timestamp: "10:15 AM",
    date: "Yesterday",
    senderLogo: "MicroSoft",
  },
  {
    id: "3",
    content: "I Shared The first two page In If you first page\n\nYOU CAN SHOW THIS",
    sender: "other",
    timestamp: "10:14 AM",
    date: "Yesterday",
    senderName: "Maggie Sullivan",
    link: { text: "Sha6Iny Graduation Project🎓 - Figma", url: "#" },
  },
  {
    id: "4",
    content: "turpis donec ut sed elementum pellentesque at viverra arcu vitae urna varius fringillatturpis donec ut sed elementum pellentesque at viverra arcu vitae urna varius fringillatturpis donec ut sed elementum pellentesque at viverra arcu vitae urna varius fringillatturpis donec ut sed elementum pellentesque at viverra arcu vitae urna varius fringilla",
    sender: "me",
    timestamp: "10:16 AM",
    date: "Yesterday",
    senderLogo: "MicroSoft",
    isRead: true,
  },
];

const InboxPage = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation>(conversations[0]);
  const [showProfile, setShowProfile] = useState(true);
  const [messageText, setMessageText] = useState("");

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-8rem)] gap-4">
        {/* Conversations List */}
        <div className="w-80 bg-card rounded-xl border border-border overflow-hidden flex flex-col shrink-0">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {/* Direct Messages */}
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={cn(
                  "flex items-start gap-3 p-4 cursor-pointer transition-colors border-b border-border/50",
                  selectedConversation.id === conv.id ? "bg-accent" : "hover:bg-muted/50"
                )}
              >
                <div className="relative shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">{conv.avatar}</span>
                  </div>
                  {conv.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-online border-2 border-card" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-foreground truncate">{conv.name}</span>
                    <span className="text-xs text-muted-foreground shrink-0 ml-2">{conv.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                  <p className="text-xs text-muted-foreground mt-1">{conv.date}</p>
                </div>
                <div className="flex flex-col items-center gap-1 shrink-0">
                  {conv.unread ? (
                    <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                      {conv.unread}
                    </span>
                  ) : conv.isRead ? (
                    <CheckCheck className="h-4 w-4 text-primary" />
                  ) : null}
                </div>
              </div>
            ))}

            {/* Groups Section */}
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Groups ({groups.length})
              </span>
              <button className="p-1 rounded hover:bg-muted transition-colors">
                <Plus className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {groups.map((group) => (
              <div
                key={group.id}
                className="flex items-center gap-3 p-4 cursor-pointer transition-colors border-b border-border/50 hover:bg-muted/50"
              >
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-foreground">{group.name}</span>
                </div>
                <span className="h-6 min-w-6 px-1.5 rounded-full bg-online text-white text-xs font-medium flex items-center justify-center shrink-0">
                  +{group.memberCount}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-card rounded-xl border border-border overflow-hidden flex flex-col min-w-0">
          {/* Chat Header */}
          <div className="h-16 px-4 border-b border-border flex items-center justify-between shrink-0">
            <button 
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-3 hover:bg-muted/50 rounded-lg p-1 -ml-1 transition-colors"
            >
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">{selectedConversation.avatar}</span>
                </div>
                {selectedConversation.isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-online border-2 border-card" />
                )}
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-foreground">{selectedConversation.name}</h3>
                <p className="text-xs text-muted-foreground">UI&UX Designer</p>
              </div>
            </button>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                <Search className="h-5 w-5 text-muted-foreground" />
              </button>
              <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                <Phone className="h-5 w-5 text-muted-foreground" />
              </button>
              <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                <Video className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex",
                  msg.sender === "me" ? "justify-end" : "justify-start"
                )}
              >
                <div className={cn(
                  "max-w-[70%]",
                  msg.sender === "me" ? "items-end" : "items-start"
                )}>
                  {msg.sender === "other" && (
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">
                          {selectedConversation.avatar}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-foreground">{msg.senderName}</span>
                      <span className="text-xs text-muted-foreground">{msg.date} {msg.timestamp}</span>
                    </div>
                  )}
                  
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-3",
                      msg.sender === "me" 
                        ? "bg-primary text-primary-foreground rounded-br-md" 
                        : "bg-muted text-foreground rounded-bl-md"
                    )}
                  >
                    <p className="text-sm whitespace-pre-line">{msg.content}</p>
                    {msg.link && (
                      <a href={msg.link.url} className="text-sm text-primary hover:underline mt-2 block">
                        {msg.link.text}
                      </a>
                    )}
                  </div>
                  
                  {msg.sender === "me" && (
                    <div className="flex items-center justify-end gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{msg.date} {msg.timestamp}</span>
                      {msg.senderLogo && (
                        <span className="text-xs font-medium text-muted-foreground">{msg.senderLogo}</span>
                      )}
                      {msg.isRead ? (
                        <CheckCheck className="h-4 w-4 text-primary" />
                      ) : (
                        <Check className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-border shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type a Message here...."
                  className="w-full h-12 px-4 pr-32 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                    <Image className="h-5 w-5 text-muted-foreground" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                    <Smile className="h-5 w-5 text-muted-foreground" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                    <Paperclip className="h-5 w-5 text-muted-foreground" />
                  </button>
                </div>
              </div>
              <button className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors">
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* User Profile Panel */}
        {showProfile && (
          <div className="w-72 bg-card rounded-xl border border-border overflow-hidden shrink-0 animate-fade-in">
            <div className="p-6 text-center border-b border-border">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-primary">{selectedConversation.avatar}</span>
              </div>
              <h3 className="font-semibold text-foreground text-lg">{selectedConversation.name}</h3>
              <p className="text-sm text-muted-foreground">UI&UX Designer</p>
              <p className="text-xs text-muted-foreground mt-1">San Francisco, California</p>
              
              <div className="flex items-center justify-center gap-2 mt-4">
                <button className="h-10 w-10 rounded-full bg-accent flex items-center justify-center hover:bg-accent/80 transition-colors">
                  <Phone className="h-5 w-5 text-accent-foreground" />
                </button>
                <button className="h-10 w-10 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors">
                  <Video className="h-5 w-5 text-primary-foreground" />
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">User Information</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Completed Training days</p>
                    <p className="text-sm font-medium text-foreground">2/60</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium text-foreground">Maggie_Sullivan@gmail.com</p>
                  </div>
                </div>
              </div>
              
              <div>
                <button className="flex items-center justify-between w-full py-2">
                  <h4 className="text-sm font-semibold text-foreground">Additional Info</h4>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default InboxPage;
