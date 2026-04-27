import { useState, useEffect, useRef } from "react";
import { AdminDashboardLayout } from "@/components/admin/DashboardLayout";
import { Search, Phone, Video, Send, Paperclip, Smile, Image, ChevronDown, Check, CheckCheck, Users, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface Conversation {
  id: string; // The user ID of the other participant
  chatId?: number; // The actual chat record ID
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
  id: number;
  content: string;
  sender: "me" | "other";
  timestamp: string;
  date: string;
  isRead?: boolean;
  senderName?: string;
  senderLogo?: string;
}

const AdminInboxPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showProfile, setShowProfile] = useState(true);
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
            lastMessage: existingChat?.last_message || "Start a conversation",
            date: existingChat ? new Date(existingChat.last_message_time || existingChat.created_at).toLocaleDateString() : "",
            time: existingChat ? new Date(existingChat.last_message_time || existingChat.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
            unread: existingChat?.unread_count || 0,
            isRead: existingChat ? existingChat.unread_count === 0 : true,
            isOnline: onlineUsers.has(u.id.toString()),
          };
        });

        // Sort by existing chat with latest message first
        formattedChats.sort((a, b) => {
          if (a.chatId && !b.chatId) return -1;
          if (!a.chatId && b.chatId) return 1;
          return 0;
        });

        setConversations(formattedChats);
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

  // Fetch messages and subscribe to realtime
  useEffect(() => {
    if (!selectedConversation?.chatId || !currentUserId) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      const { data: messagesData } = await supabase
        .from("messages")
        .select("*")
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
          senderName: msg.sender_id === currentUserId ? "Admin" : selectedConversation.name,
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
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={cn(
                  "flex items-start gap-3 p-4 cursor-pointer transition-colors border-b border-border/50",
                  selectedConversation?.id === conv.id ? "bg-accent" : "hover:bg-muted/50"
                )}
              >
                <div className="relative shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">{conv.avatar}</span>
                  </div>
                  {conv.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-card" />
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

            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Groups (0)
              </span>
              <button className="p-1 rounded hover:bg-muted transition-colors">
                <Plus className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>


          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-card rounded-xl border border-border overflow-hidden flex flex-col min-w-0">
          <div className="h-16 px-4 border-b border-border flex items-center justify-between shrink-0">
            {selectedConversation && (
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-3 hover:bg-muted/50 rounded-lg p-1 -ml-1 transition-colors"
              >
                <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">{selectedConversation.avatar}</span>
                  </div>
                  {selectedConversation.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-card" />
                  )}
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-foreground">{selectedConversation.name}</h3>
                  <p className="text-xs text-muted-foreground">Admin Chat</p>
                </div>
              </button>
            )}
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

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex", msg.sender === "me" ? "justify-end" : "justify-start")}>
                <div className={cn("max-w-[70%]", msg.sender === "me" ? "items-end" : "items-start")}>
                  {msg.sender === "other" && (
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">{selectedConversation?.avatar}</span>
                      </div>
                      <span className="text-xs font-medium text-foreground">{msg.senderName}</span>
                      <span className="text-xs text-muted-foreground">{msg.date} {msg.timestamp}</span>
                    </div>
                  )}
                  <div className={cn("rounded-2xl px-4 py-3", msg.sender === "me" ? "bg-primary text-primary-foreground rounded-br-md" : "bg-muted text-foreground rounded-bl-md")}>
                    <p className="text-sm whitespace-pre-line">{msg.content}</p>
                  </div>
                  {msg.sender === "me" && (
                    <div className="flex items-center justify-end gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{msg.date} {msg.timestamp}</span>
                      {msg.isRead ? <CheckCheck className="h-4 w-4 text-primary" /> : <Check className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-border shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type a Message here...."
                  className="w-full h-12 px-4 pr-32 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button className="p-2 rounded-lg hover:bg-muted transition-colors"><Image className="h-5 w-5 text-muted-foreground" /></button>
                  <button className="p-2 rounded-lg hover:bg-muted transition-colors"><Smile className="h-5 w-5 text-muted-foreground" /></button>
                  <button className="p-2 rounded-lg hover:bg-muted transition-colors"><Paperclip className="h-5 w-5 text-muted-foreground" /></button>
                </div>
              </div>
              <button 
                onClick={handleSendMessage}
                disabled={!selectedConversation}
                className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* User Profile Panel */}
        {showProfile && selectedConversation && (
          <div className="w-72 bg-card rounded-xl border border-border overflow-hidden shrink-0">
            <div className="p-6 text-center border-b border-border">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-primary">{selectedConversation.avatar}</span>
              </div>
              <h3 className="font-semibold text-foreground text-lg">{selectedConversation.name}</h3>
              <p className="text-sm text-muted-foreground">System Chat</p>
              <p className="text-xs text-muted-foreground mt-1">Global</p>
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
    </AdminDashboardLayout>
  );
};

export default AdminInboxPage;
