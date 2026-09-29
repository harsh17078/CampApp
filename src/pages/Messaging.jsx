import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  HStack,
  VStack,
  Avatar,
  Text,
  Input,
  IconButton,
  Button,
} from '@chakra-ui/react';
import Navbar2 from '../components/Navbar2';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { messageAPI, userAPI } from '../services/api';
import { FiSend, FiSearch, FiMessageSquare, FiUserCheck } from 'react-icons/fi';

const DEMO_CONTACTS = [
  {
    id: 991,
    name: "Elena Vance",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
    last_message: "Are we still meeting at the campfire tonight?",
    time: "10:42 AM",
    unread: true,
  },
  {
    id: 992,
    name: "Marcus Cole",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    last_message: "Check out those new photos from the trail!",
    time: "Yesterday",
    unread: false,
  },
  {
    id: 993,
    name: "Aria Chen",
    avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    last_message: "Awesome work on the new community post.",
    time: "2 days ago",
    unread: false,
  },
];

export default function Messaging() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState(DEMO_CONTACTS);
  const [selectedContact, setSelectedContact] = useState(DEMO_CONTACTS[0]);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender_id: 991,
      receiver_id: user?.id || 0,
      message: "Hey! Welcome to CampApp! How are you finding the platform?",
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 2,
      sender_id: user?.id || 0,
      receiver_id: 991,
      message: "Hey Elena! It looks super clean and the real-time feeds are great!",
      created_at: new Date(Date.now() - 1800000).toISOString(),
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load Contacts & Conversations
  useEffect(() => {
    const loadChatData = async () => {
      try {
        const [convRes, usersRes] = await Promise.allSettled([
          messageAPI.getConversations(),
          userAPI.searchUsers(''),
        ]);

        if (convRes.status === 'fulfilled' && convRes.value.success && convRes.value.conversations.length > 0) {
          const formatted = convRes.value.conversations.map((c) => ({
            id: c.user_id,
            name: c.name,
            avatar_url: c.avatar_url,
            last_message: c.last_message,
            time: 'Recent',
            unread: !c.is_read,
          }));
          setContacts(formatted);
          setSelectedContact(formatted[0]);
        } else if (usersRes.status === 'fulfilled' && usersRes.value.success && usersRes.value.users.length > 0) {
          const formatted = usersRes.value.users.map((u) => ({
            id: u.id,
            name: u.name,
            avatar_url: u.avatar_url,
            last_message: u.bio || 'Say hello!',
            time: 'Available',
            unread: false,
          }));
          setContacts(formatted);
          setSelectedContact(formatted[0]);
        }
      } catch (err) {
        console.warn('Chat load fallback:', err.message);
      }
    };

    loadChatData();
  }, []);

  // Fetch Message History for Selected Contact
  useEffect(() => {
    if (!selectedContact) return;

    const fetchHistory = async () => {
      try {
        const res = await messageAPI.getMessages(selectedContact.id);
        if (res.success && res.messages && res.messages.length > 0) {
          setMessages(res.messages);
        }
      } catch {
        // Keep initial fallback messages if offline
      }
    };

    fetchHistory();
  }, [selectedContact]);

  // Send Message Handler
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!newMessage.trim() || !selectedContact) return;

    const outgoingText = newMessage.trim();
    const tempMsg = {
      id: Date.now(),
      sender_id: user?.id || 0,
      receiver_id: selectedContact.id,
      message: outgoingText,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMsg]);
    setNewMessage('');
    setSending(true);

    try {
      await messageAPI.sendMessage(selectedContact.id, outgoingText);
    } catch {
      // Message rendered optimistically
    } finally {
      setSending(false);
    }
  };

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box minHeight="100vh" bg="var(--bg-primary)">
      <Navbar2 title="CampApp" />

      <Box className="main-app-container">
        <Sidebar />

        <Box className="feed-content-wrapper" maxW="960px" p={{ base: 2, md: 4 }}>
          <Box
            className="glass-card"
            borderRadius="3xl"
            overflow="hidden"
            bg="var(--bg-surface)"
            border="1px solid var(--border-color)"
            height="calc(100vh - 120px)"
            display="flex"
          >
            {/* Left Contacts Panel */}
            <Box
              width={{ base: '100%', sm: '300px', md: '340px' }}
              borderRight="1px solid var(--border-color)"
              display={{ base: selectedContact ? 'none' : 'flex', sm: 'flex' }}
              flexDirection="column"
              bg="var(--bg-surface)"
            >
              {/* Search Bar */}
              <Box p={3.5} borderBottom="1px solid var(--border-color)">
                <HStack
                  bg="var(--bg-primary)"
                  px={3}
                  py={1.5}
                  borderRadius="full"
                  border="1px solid var(--border-color)"
                >
                  <FiSearch size={15} color="var(--text-muted)" />
                  <Input
                    placeholder="Search campers..."
                    size="xs"
                    border="none"
                    _focus={{ outline: "none" }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </HStack>
              </Box>

              {/* Contacts List */}
              <VStack align="stretch" gap={0} overflowY="auto" flex="1">
                {filteredContacts.map((contact) => {
                  const isSelected = selectedContact?.id === contact.id;

                  return (
                    <Box
                      key={contact.id}
                      p={3.5}
                      cursor="pointer"
                      bg={isSelected ? "var(--brand-glow)" : "transparent"}
                      borderBottom="1px solid var(--border-color)"
                      _hover={{ bg: "var(--brand-glow)" }}
                      transition="all 0.15s ease"
                      onClick={() => setSelectedContact(contact)}
                    >
                      <HStack gap={3}>
                        <Avatar.Root size="sm" shape="full">
                          <Avatar.Image src={contact.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"} />
                          <Avatar.Fallback name={contact.name} />
                        </Avatar.Root>
                        <Box flex="1" overflow="hidden">
                          <HStack justify="space-between">
                            <Text fontSize="xs" fontWeight="700" color="var(--text-primary)" isTruncated>
                              {contact.name}
                            </Text>
                            <Text fontSize="3xs" color="var(--text-muted)">
                              {contact.time}
                            </Text>
                          </HStack>
                          <Text fontSize="2xs" color="var(--text-secondary)" isTruncated mt={0.5}>
                            {contact.last_message}
                          </Text>
                        </Box>
                      </HStack>
                    </Box>
                  );
                })}
              </VStack>
            </Box>

            {/* Right Chat Thread Window */}
            {selectedContact ? (
              <Box flex="1" display="flex" flexDirection="column" bg="var(--bg-primary)">
                {/* Chat Contact Header */}
                <HStack
                  p={3.5}
                  bg="var(--bg-surface)"
                  borderBottom="1px solid var(--border-color)"
                  justify="space-between"
                >
                  <HStack gap={3}>
                    <Button
                      display={{ base: 'inline-flex', sm: 'none' }}
                      size="2xs"
                      variant="ghost"
                      onClick={() => setSelectedContact(null)}
                    >
                      ←
                    </Button>
                    <Avatar.Root size="sm" shape="full">
                      <Avatar.Image src={selectedContact.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"} />
                      <Avatar.Fallback name={selectedContact.name} />
                    </Avatar.Root>
                    <Box>
                      <Text fontSize="xs" fontWeight="700" color="var(--text-primary)">
                        {selectedContact.name}
                      </Text>
                      <HStack gap={1} fontSize="3xs" color="green.500">
                        <Box w="6px" h="6px" borderRadius="full" bg="green.500" />
                        <Text>Active Camper</Text>
                      </HStack>
                    </Box>
                  </HStack>
                </HStack>

                {/* Messages Stream */}
                <VStack
                  flex="1"
                  p={4}
                  gap={3}
                  overflowY="auto"
                  align="stretch"
                  justify="flex-start"
                >
                  {messages.map((msg, idx) => {
                    const isMyMessage = msg.sender_id === (user?.id || 0) || !msg.sender_id;

                    return (
                      <HStack
                        key={msg.id || idx}
                        justify={isMyMessage ? 'flex-end' : 'flex-start'}
                        align="flex-end"
                        gap={2}
                      >
                        {!isMyMessage && (
                          <Avatar.Root size="2xs" shape="full">
                            <Avatar.Image src={selectedContact.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"} />
                            <Avatar.Fallback name={selectedContact.name} />
                          </Avatar.Root>
                        )}
                        <Box
                          maxW="72%"
                          px={4}
                          py={2.5}
                          borderRadius="2xl"
                          bg={
                            isMyMessage
                              ? 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)'
                              : 'var(--bg-surface)'
                          }
                          color={isMyMessage ? 'white' : 'var(--text-primary)'}
                          boxShadow="var(--shadow-sm)"
                          border={isMyMessage ? 'none' : '1px solid var(--border-color)'}
                        >
                          <Text fontSize="xs" lineHeight="1.5">
                            {msg.message}
                          </Text>
                          <Text
                            fontSize="3xs"
                            color={isMyMessage ? 'whiteAlpha.700' : 'var(--text-muted)'}
                            textAlign="right"
                            mt={1}
                          >
                            {new Date(msg.created_at || Date.now()).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </Text>
                        </Box>
                      </HStack>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </VStack>

                {/* Message Input Box */}
                <HStack
                  as="form"
                  onSubmit={handleSendMessage}
                  p={3}
                  bg="var(--bg-surface)"
                  borderTop="1px solid var(--border-color)"
                  gap={2}
                >
                  <Input
                    placeholder={`Message ${selectedContact.name}...`}
                    size="sm"
                    borderRadius="full"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    bg="var(--bg-primary)"
                    color="var(--text-primary)"
                  />
                  <IconButton
                    type="submit"
                    className="brand-button"
                    borderRadius="full"
                    size="sm"
                    disabled={!newMessage.trim() || sending}
                    loading={sending}
                    aria-label="Send Message"
                  >
                    <FiSend size={14} />
                  </IconButton>
                </HStack>
              </Box>
            ) : (
              <Box
                flex="1"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                color="var(--text-muted)"
              >
                <FiMessageSquare size={48} />
                <Text fontSize="sm" fontWeight="600" mt={3}>
                  Select a contact to start messaging
                </Text>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
