import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Phone, Video, Image, Paperclip, Mic, Send, Plus, CheckCheck, X, FileText, Play, Pause, Users, UserPlus, Trash2, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useProfile } from "@/contexts/ProfileContext";
import { supabase } from "@/integrations/supabase/client";

interface Contact {
  id: string; // The other user's id
  chatId?: number; // The chat id
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
  id: string | number;
  content: string;
  sender: "me" | "other";
  senderId?: number;
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

const sharedMedia = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=200&h=200&fit=crop",
];

const sharedDocuments = [
  { name: "Project_Requirements.pdf", size: "2.4 MB", type: "pdf", date: "Dec 10" },
];

export default function Messages() {
  const { profile } = useProfile();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!profile.userId) return;

    const presenceChannel = supabase.channel('online-users', {
      config: {
        presence: {
          key: profile.userId.toString(),
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
  }, [profile.userId]);

  useEffect(() => {
    setContacts(prev => prev.map(c => ({
      ...c,
      isOnline: onlineUsers.has(c.id)
    })));
  }, [onlineUsers]);

  const fetchChats = async () => {
    if (!profile.userId) return;
    
    const { data: users, error: usersError } = await supabase
      .from('user')
      .select('*')
      .neq('id', profile.userId);
      
    if (usersError) {
      console.error("Error fetching users:", usersError);
      return;
    }

    const { data: userChats, error: chatsError } = await supabase
      .from('chats')
      .select('*')
      .contains('participants', [profile.userId.toString()]);
      
    if (chatsError) {
      console.error("Error fetching chats:", chatsError);
      return;
    }

    const formattedContacts = users.map(user => {
      const existingChat = userChats?.find(c => c.participants.includes(user.id.toString()));
      const names = user.full_name.split(' ');
      const avatarStr = names.length > 1 ? `${names[0][0]}${names[1][0]}`.toUpperCase() : user.full_name.substring(0, 2).toUpperCase();

      let timeStr = "";
      if (existingChat?.last_message_time) {
        timeStr = new Date(existingChat.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }

      return {
        id: user.id.toString(),
        chatId: existingChat?.id,
        name: user.full_name,
        avatar: avatarStr,
        avatarUrl: user.profile_picture || undefined,
        lastMessage: existingChat?.last_message || "Start a conversation",
        time: timeStr,
        unread: existingChat?.unread_count || 0,
        isOnline: onlineUsers.has(user.id.toString()),
        role: user.role,
        email: user.email,
        phone: user.phone_number || undefined,
      };
    });

    formattedContacts.sort((a, b) => {
      if (a.chatId && !b.chatId) return -1;
      if (!a.chatId && b.chatId) return 1;
      if (a.chatId && b.chatId) {
        const chatA = userChats?.find(c => c.id === a.chatId);
        const chatB = userChats?.find(c => c.id === b.chatId);
        const timeA = chatA?.last_message_time ? new Date(chatA.last_message_time).getTime() : 0;
        const timeB = chatB?.last_message_time ? new Date(chatB.last_message_time).getTime() : 0;
        return timeB - timeA;
      }
      return 0;
    });

    setContacts(formattedContacts);
    if (formattedContacts.length > 0) {
      setSelectedContact(prev => prev ? formattedContacts.find(c => c.id === prev.id) || formattedContacts[0] : formattedContacts[0]);
    }
  };

  useEffect(() => {
    if (!profile.userId) return;

    fetchChats();

    const chatSubscription = supabase
      .channel('public:chats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chats' }, () => {
        fetchChats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(chatSubscription);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.userId]);

  useEffect(() => {
    if (!selectedContact?.chatId) {
      setChatMessages([]);
      return;
    }

    const fetchMessages = async (chatId: number) => {
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*, user:sender_id(full_name, profile_picture)')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }

      const formatted = messages.map(msg => ({
        id: msg.id,
        content: msg.content,
        sender: msg.sender_id === profile.userId ? "me" as const : "other" as const,
        senderId: msg.sender_id,
        senderName: msg.user?.full_name,
        senderAvatar: msg.user?.profile_picture,
        time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }));
      
      setChatMessages(formatted);
      scrollToBottom();
    };

    fetchMessages(selectedContact.chatId);

    const messageSubscription = supabase
      .channel(`public:messages:chat_id=${selectedContact.chatId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${selectedContact.chatId}` }, (payload) => {
        const newMsg = payload.new as { id: number; content: string; sender_id: number; created_at: string };
        setChatMessages(prev => [...prev, {
          id: newMsg.id,
          content: newMsg.content,
          sender: newMsg.sender_id === profile.userId ? "me" as const : "other" as const,
          senderId: newMsg.sender_id,
          time: new Date(newMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }]);
        scrollToBottom();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messageSubscription);
    };
  }, [selectedContact?.chatId, profile.userId]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedContact || !profile.userId) return;

    let currentChatId = selectedContact.chatId;

    if (!currentChatId) {
      const { data: newChat, error: chatError } = await supabase
        .from('chats')
        .insert({
          participants: [profile.userId.toString(), selectedContact.id],
          last_message: messageInput,
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
      setContacts(prev => prev.map(c => c.id === selectedContact.id ? { ...c, chatId: currentChatId } : c));
      setSelectedContact(prev => prev ? { ...prev, chatId: currentChatId } : null);
    }

    const messageText = messageInput;
    setMessageInput(""); 

    const { error: msgError } = await supabase
      .from('messages')
      .insert({
        content: messageText,
        sender_id: profile.userId,
        chat_id: currentChatId,
        is_read: false
      });

    if (msgError) {
      console.error("Error sending message:", msgError);
      toast.error("Failed to send message");
      return;
    }

    await supabase
      .from('chats')
      .update({
        last_message: messageText,
        last_message_time: new Date().toISOString()
      })
      .eq('id', currentChatId);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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

  const handleAddMember = (member: GroupMember) => {};
  const handleRemoveMember = (memberId: string) => {};
  const handleImageUpload = () => imageInputRef.current?.click();
  const handleFileUpload = () => fileInputRef.current?.click();

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    recordingIntervalRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const availableMembers: GroupMember[] = [];
  const currentMessages = chatMessages;
  const currentName = selectedContact?.name || selectedGroup?.name || "";
  const currentAvatar = selectedContact?.avatar || selectedGroup?.avatar || "";

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-7rem)] gap-0 -m-6 mt-0 relative overflow-hidden">
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
        <div className={cn(
          "w-full md:w-80 bg-card border-r border-border flex flex-col shrink-0",
          (selectedContact || selectedGroup) ? "hidden md:flex" : "flex"
        )}>
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
        <div className={cn(
          "flex-1 flex flex-col bg-background min-w-0",
          !(selectedContact || selectedGroup) ? "hidden md:flex" : "flex"
        )}>
          {/* Chat Header */}
          <div className="h-16 border-b border-border flex items-center justify-between px-4 md:px-6 bg-card shrink-0">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden -ml-2 text-muted-foreground"
                onClick={() => {
                  setSelectedContact(null);
                  setSelectedGroup(null);
                }}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
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
                  onKeyDown={handleKeyPress}
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
                  <Button size="icon" className="h-8 w-8 bg-primary hover:bg-primary/90" onClick={handleSendMessage}>
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
