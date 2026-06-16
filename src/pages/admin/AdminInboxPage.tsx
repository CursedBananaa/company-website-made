import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { AdminDashboardLayout } from "@/components/admin/DashboardLayout";
import { Search, Phone, Video, Send, Paperclip, Image, CheckCheck, Plus, Mic, FileText, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface Conversation {
  id: string; // The user ID of the other participant
  chatId?: number; // The actual chat record ID
  name: string;
  avatar: string;
  avatarUrl?: string;
  lastMessage: string;
  date: string;
  time: string;
  unread?: number;
  isRead?: boolean;
  isOnline?: boolean;
  email?: string;
  role?: string;
  phone?: string;
}

interface Message {
  id: number;
  content: string;
  sender: "me" | "other";
  timestamp: string;
  date: string;
  isRead?: boolean;
  senderName?: string;
  senderAvatar?: string;
}

const AdminInboxPage = () => {
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showProfile, setShowProfile] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!currentUserId) return;

    const presenceChannel = supabase.channel('online-users', {
      config: {
        presence: {
          key: currentUserId.toString(),
        },
      },
    });

    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        setOnlineUsers(new Set(Object.keys(state)));
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({ online_at: new Date().toISOString() });
        }
      });

    return () => {
      supabase.removeChannel(presenceChannel);
    };
  }, [currentUserId]);

  useEffect(() => {
    setConversations(prev => prev.map(c => ({
      ...c,
      isOnline: onlineUsers.has(c.id)
    })));
  }, [onlineUsers]);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) return;
      
      const { data: userData } = await supabase
        .from('user')
        .select('id, full_name')
        .eq('auth_id', authUser.id)
        .single();
        
      if (!userData) return;
      setCurrentUserId(userData.id);

      // Fetch all other users
      const { data: users } = await supabase
        .from('user')
        .select('*')
        .neq('id', userData.id);

      // Fetch existing chats
      const { data: chatsData } = await supabase
        .from("chats")
        .select("*")
        .contains("participants", [userData.id.toString()])
        .order("last_message_time", { ascending: false });

      if (users) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedChats = users.map((u: any) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const existingChat = chatsData?.find((c: any) => c.participants && c.participants.includes(u.id.toString()));
          const names = (u.full_name || "Unknown User").split(' ');
          const avatarStr = names.length > 1 ? `${names[0][0]}${names[1][0]}`.toUpperCase() : (u.full_name || "U").substring(0, 2).toUpperCase();

          return {
            id: u.id.toString(),
            chatId: existingChat?.id,
            name: u.full_name || "Unknown User",
            avatar: avatarStr,
            avatarUrl: u.profile_picture || undefined,
            lastMessage: existingChat?.last_message || "Start a conversation",
            date: existingChat ? new Date(existingChat.last_message_time || existingChat.created_at).toLocaleDateString() : "",
            time: existingChat ? new Date(existingChat.last_message_time || existingChat.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
            unread: existingChat?.unread_count || 0,
            isRead: existingChat ? existingChat.unread_count === 0 : true,
            isOnline: onlineUsers.has(u.id.toString()),
            email: u.email || "No email provided",
            role: u.role || "User",
            phone: u.phone_number || "Not set",
          };
        });

        // Sort by existing chat with latest message first
        formattedChats.sort((a, b) => {
          if (a.chatId && !b.chatId) return -1;
          if (!a.chatId && b.chatId) return 1;
          if (a.chatId && b.chatId) {
            const chatA = chatsData?.find((c: any) => c.id === a.chatId);
            const chatB = chatsData?.find((c: any) => c.id === b.chatId);
            const timeA = chatA?.last_message_time ? new Date(chatA.last_message_time).getTime() : 0;
            const timeB = chatB?.last_message_time ? new Date(chatB.last_message_time).getTime() : 0;
            return timeB - timeA;
          }
          return 0;
        });

        setConversations(formattedChats);
        
        // Auto-select contact from URL param (?userId=X)
        const targetUserId = searchParams.get("userId");
        if (targetUserId) {
          const target = formattedChats.find((c) => c.id === targetUserId);
          if (target) {
            setSelectedConversation(target);
            return;
          }
        }

        if (formattedChats.length > 0 && !selectedConversation) {
          setSelectedConversation(formattedChats[0]);
        }
      }
    };
    fetchConversations();

    const chatSub = supabase
      .channel('admin_public_chats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chats' }, () => {
        fetchConversations();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(chatSub);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When URL ?userId= changes (e.g. navigating from search), auto-select that contact
  useEffect(() => {
    const targetUserId = searchParams.get("userId");
    if (!targetUserId || conversations.length === 0) return;
    const target = conversations.find((c) => c.id === targetUserId);
    if (target) {
      setSelectedConversation(target);
    }
  }, [searchParams, conversations]);

  // Fetch messages and subscribe to realtime
  useEffect(() => {
    if (!selectedConversation?.chatId || !currentUserId) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      const { data: messagesData } = await supabase
        .from("messages")
        .select("*, user:sender_id(full_name, profile_picture)")
        .eq("chat_id", selectedConversation.chatId)
        .order("created_at", { ascending: true });

      if (messagesData) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedMsgs = messagesData.map((msg: any) => ({
          id: msg.id,
          content: msg.content,
          sender: msg.sender_id === currentUserId ? "me" : "other",
          timestamp: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: new Date(msg.created_at).toLocaleDateString(),
          senderName: msg.sender_id === currentUserId ? "Admin" : (msg.user?.full_name || selectedConversation.name),
          senderAvatar: msg.user?.profile_picture || undefined,
          isRead: msg.is_read || true,
        }));
        setMessages(formattedMsgs);
      }
    };

    fetchMessages();

    // Subscribe
    const channel = supabase
      .channel(`admin_chat_${selectedConversation.chatId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `chat_id=eq.${selectedConversation.chatId}` },
        (payload) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const msg = payload.new as any;
          const formattedMsg: Message = {
            id: msg.id,
            content: msg.content,
            sender: msg.sender_id === currentUserId ? "me" : "other",
            timestamp: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: new Date(msg.created_at).toLocaleDateString(),
            senderName: msg.sender_id === currentUserId ? "Admin" : selectedConversation.name,
            isRead: msg.is_read || true,
          };
          setMessages((prev) => [...prev, formattedMsg]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConversation, currentUserId]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation || !currentUserId) return;

    const newMsg = messageText;
    setMessageText("");

    let currentChatId = selectedConversation.chatId;

    if (!currentChatId) {
      const { data: newChat, error: chatError } = await supabase
        .from('chats')
        .insert({
          participants: [currentUserId.toString(), selectedConversation.id],
          last_message: newMsg,
          last_message_time: new Date().toISOString(),
          unread_count: 0
        })
        .select()
        .single();
        
      if (chatError) {
        console.error("Error creating chat:", chatError);
        toast.error("Failed to start chat");
        return;
      }
      currentChatId = newChat.id;
      setConversations(prev => prev.map(c => c.id === selectedConversation.id ? { ...c, chatId: currentChatId } : c));
      setSelectedConversation(prev => prev ? { ...prev, chatId: currentChatId } : null);
    } else {
      await supabase.from("chats").update({
        last_message: newMsg,
        last_message_time: new Date().toISOString()
      }).eq('id', currentChatId);
    }

    await supabase.from("messages").insert({
      chat_id: currentChatId,
      sender_id: currentUserId,
      content: newMsg,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="flex h-[calc(100vh-7rem)] gap-0 -m-6 mt-0 relative overflow-hidden">
        {/* Contacts Sidebar */}
        <div className={cn(
          "w-full md:w-80 bg-card border-r border-border flex flex-col shrink-0",
          selectedConversation ? "hidden md:flex" : "flex"
        )}>
          {/* Search Header */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-9 h-9 bg-muted border-0"
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2">
              {conversations.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => setSelectedConversation(contact)}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                    selectedConversation?.id === contact.id
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
          
          {/* Groups Section (Static or map over groups) */}
          <div className="border-t border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-sm">GROUPS (0)</span>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className={cn(
          "flex-1 flex flex-col bg-background min-w-0",
          !selectedConversation ? "hidden md:flex" : "flex"
        )}>
          {/* Chat Header */}
          <div className="h-16 border-b border-border flex items-center justify-between px-4 md:px-6 bg-card shrink-0">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden -ml-2 text-muted-foreground"
                onClick={() => setSelectedConversation(null)}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div 
                className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setShowProfile(true)}
              >
              <Avatar className="w-10 h-10">
                <AvatarImage src={selectedConversation?.avatarUrl} />
                <AvatarFallback className="bg-primary/20 text-primary">
                  {selectedConversation?.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-sm">{selectedConversation?.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {selectedConversation?.role || "User"}
                </p>
              </div>
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
              {messages.map((message) => (
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
                        <AvatarImage src={message.senderAvatar || selectedConversation?.avatarUrl} />
                        <AvatarFallback className="bg-primary/20 text-primary text-xs">
                          {message.senderName?.split(" ").map(n => n[0]).join("") || selectedConversation?.avatar}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      {message.sender === "other" && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">
                            {message.senderName || selectedConversation?.name}
                          </span>
                          <span className="text-xs text-muted-foreground">{message.timestamp}</span>
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
                      </div>
                      {message.sender === "me" && (
                        <div className="flex items-center justify-end gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                          <CheckCheck className="h-3 w-3 text-chart-blue" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="h-16 border-t border-border flex items-center gap-3 px-6 bg-card">
            <Input
              placeholder="Type a Message here...."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 border-0 bg-transparent focus-visible:ring-0"
            />
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                <Image className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                <Mic className="h-5 w-5" />
              </Button>
              <Button size="icon" className="h-8 w-8 bg-primary hover:bg-primary/90" onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Info Panel (Sheet) */}
        <Sheet open={showProfile} onOpenChange={setShowProfile}>
          <SheetContent className="w-[350px] sm:w-[400px] p-0">
            <SheetHeader className="p-6 pb-4 border-b border-border">
              <SheetTitle className="text-left">
                Contact Info
              </SheetTitle>
            </SheetHeader>
            
            <ScrollArea className="h-[calc(100vh-5rem)]">
              <div className="p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <Avatar className="w-20 h-20 mb-3">
                    <AvatarImage src={selectedConversation?.avatarUrl} />
                    <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                      {selectedConversation?.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg">
                    {selectedConversation?.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedConversation?.role}
                  </p>
                </div>

                {selectedConversation && (
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="text-sm">{selectedConversation.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="text-sm">{selectedConversation.email}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminInboxPage;
