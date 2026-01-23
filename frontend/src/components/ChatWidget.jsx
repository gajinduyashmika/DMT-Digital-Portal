import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, User, Bot, ArrowLeft, RefreshCw, Plus, Sparkles, Paperclip } from 'lucide-react';
import { useStore } from '../store/useStore';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const translations = {
    en: {
        title: 'Chat Support',
        placeholder: 'Type your message...',
        welcome: 'Hi, How can we help you today?',
        staff: 'Chat with DMT Staff',
        bot: 'Chat with AI Bot',
        newTicket: 'Create New Ticket',
        myTickets: 'My Tickets',
        noTickets: 'No support tickets yet',
        ticketTitle: 'Subject',
        ticketDesc: 'Describe your issue',
        submit: 'Submit',
        back: 'Back',
        sending: 'Sending...',
        category: 'Category',
        categories: {
            General: 'General',
            Technical: 'Technical',
            Registration: 'Registration',
            Payment: 'Payment',
            Other: 'Other'
        }
    },
    si: {
        title: 'කතා සහාය',
        placeholder: 'ඔබේ පණිවිඩය ටයිප් කරන්න...',
        welcome: 'ඔබට අද අපට උදව් කළ හැක්කේ කෙසේද?',
        staff: 'DMT කාර්ය මණ්ඩලය සමඟ කතා කරන්න',
        bot: 'AI බොට් සමඟ කතා කරන්න',
        newTicket: 'නව ටිකට් සාදන්න',
        myTickets: 'මගේ ටිකට්',
        noTickets: 'සහාය ටිකට් නැත',
        ticketTitle: 'මාතෘකාව',
        ticketDesc: 'ඔබේ ගැටලුව විස්තර කරන්න',
        submit: 'ඉදිරිපත් කරන්න',
        back: 'ආපසු',
        sending: 'යවමින්...',
        category: 'වර්ගය',
        categories: {
            General: 'සාමාන්‍ය',
            Technical: 'තාක්ෂණික',
            Registration: 'ලියාපදිංචිය',
            Payment: 'ගෙවීම',
            Other: 'වෙනත්'
        }
    },
    ta: {
        title: 'அரட்டை ஆதரவு',
        placeholder: 'உங்கள் செய்தியை தட்டச்சு செய்யவும்...',
        welcome: 'இன்று நாங்கள் எப்படி உதவ முடியும்?',
        staff: 'DMT ஊழியர்களுடன் அரட்டை',
        bot: 'AI போட்டுடன் அரட்டை',
        newTicket: 'புதிய டிக்கெட் உருவாக்கு',
        myTickets: 'எனது டிக்கெட்கள்',
        noTickets: 'ஆதரவு டிக்கெட்கள் இல்லை',
        ticketTitle: 'தலைப்பு',
        ticketDesc: 'உங்கள் பிரச்சனையை விவரிக்கவும்',
        submit: 'சமர்ப்பி',
        back: 'பின்',
        sending: 'அனுப்புகிறது...',
        category: 'வகை',
        categories: {
            General: 'பொது',
            Technical: 'தொழில்நுட்ப',
            Registration: 'பதிவு',
            Payment: 'கட்டணம்',
            Other: 'மற்றவை'
        }
    },
};

export const ChatWidget = () => {
    const { isChatOpen, setChatOpen, language, isDarkMode, chatContext, openSupport } = useStore();
    const [view, setView] = useState('menu');
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleFileSelect = (e) => {
        if (e.target.files) {
            setAttachments(prev => [...prev, ...Array.from(e.target.files)]);
        }
    };

    const handlePaste = (e) => {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const blob = items[i].getAsFile();
                setAttachments(prev => [...prev, blob]);
            }
        }
    };

    // New ticket form
    const [ticketForm, setTicketForm] = useState({
        title: '',
        description: '',
        category: 'General'
    });

    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('username') || 'User';

    useEffect(() => {
        console.log('ChatWidget: chatContext or isChatOpen changed', { chatContext, isChatOpen });
        if (chatContext && isChatOpen) {
            console.log('ChatWidget: Setting new Ticket view');
            setView('newTicket');
            setTicketForm({
                title: `[Support] ${chatContext.title}`,
                description: `Reference: ${chatContext.reference}\n\nI need assistance with...`,
                category: 'General'
            });
        }
    }, [chatContext, isChatOpen]);

    useEffect(() => {
        if (view === 'tickets' && userEmail) {
            fetchTickets();
        }
    }, [view, userEmail]);

    useEffect(() => {
        scrollToBottom();
    }, [selectedTicket?.messages]);

    // AI Bot State
    const [botMessages, setBotMessages] = useState([]);
    const [botInput, setBotInput] = useState('');
    const [isBotTyping, setIsBotTyping] = useState(false);
    const botMessagesEndRef = useRef(null);

    // Auto-scroll for bot chat
    useEffect(() => {
        botMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [botMessages, isBotTyping]);

    const handleBotSend = async () => {
        if (!botInput.trim()) return;

        const userMsg = botInput.trim();
        setBotMessages(prev => [...prev, { text: userMsg, isBot: false }]);
        setBotInput('');
        setIsBotTyping(true);

        try {
            // Build history for context (last 5 messages)
            const history = botMessages.slice(-5).map(m => ({
                role: m.isBot ? "model" : "user",
                parts: [{ text: m.text }]
            }));

            const response = await axios.post(`${API_URL}/ai/chat`, {
                message: userMsg,
                history: history,
                context: chatContext // Pass current context (e.g. vehicle details)
            });

            const botResponse = response.data.response;
            setBotMessages(prev => [...prev, { text: botResponse, isBot: true }]);
        } catch (error) {
            console.error('Bot Error:', error);
            const errorMsg = error.response?.data?.response || "I'm having trouble connecting to the server. Please check your internet connection.";
            setBotMessages(prev => [...prev, {
                text: errorMsg,
                isBot: true
            }]);
        } finally {
            setIsBotTyping(false);
        }
    };

    // Auto-refresh messages every 10 seconds when in chat view
    useEffect(() => {
        let interval;
        if (view === 'chat' && selectedTicket) {
            interval = setInterval(() => {
                refreshTicket(selectedTicket._id, false);
            }, 10000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [view, selectedTicket?._id]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchTickets = async () => {
        if (!userEmail) return;
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/tickets/user/${userEmail}`);
            setTickets(response.data);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    const refreshTicket = async (ticketId, isManual = false) => {
        if (isManual) setRefreshing(true);
        try {
            const response = await axios.get(`${API_URL}/tickets/${ticketId}`);
            setSelectedTicket(response.data);
            // Also update in tickets list
            setTickets(prev => prev.map(t => t._id === ticketId ? response.data : t));
        } catch (error) {
            console.error('Error refreshing ticket:', error);
        } finally {
            if (isManual) setRefreshing(false);
        }
    };

    const createTicket = async () => {
        if (!userEmail || !ticketForm.title || !ticketForm.description) return;

        try {
            setSending(true);
            const response = await axios.post(`${API_URL}/tickets/create`, {
                userEmail,
                userName,
                title: ticketForm.title,
                description: ticketForm.description,
                category: ticketForm.category,
                priority: 'Medium'
            });

            setTicketForm({ title: '', description: '', category: 'General' });
            setSelectedTicket(response.data.ticket);
            setView('chat');
            fetchTickets();
        } catch (error) {
            console.error('Error creating ticket:', error);
        } finally {
            setSending(false);
        }
    };

    const sendMessage = async () => {
        if ((!newMessage.trim() && attachments.length === 0) || !selectedTicket || !userEmail) return;

        try {
            setSending(true);
            const formData = new FormData();
            formData.append('senderEmail', userEmail);
            formData.append('senderName', userName);
            formData.append('message', newMessage);
            formData.append('isAdmin', false);

            attachments.forEach(file => {
                formData.append('attachments', file);
            });

            const response = await axios.post(`${API_URL}/tickets/${selectedTicket._id}/message`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setSelectedTicket(response.data.ticket);
            setNewMessage('');
            setAttachments([]);
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Open': return 'bg-green-100 text-green-700';
            case 'In Progress': return 'bg-blue-100 text-blue-700';
            case 'Resolved': return 'bg-gray-100 text-gray-700';
            case 'Closed': return 'bg-gray-200 text-gray-500';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (!isChatOpen) {
        return (
            <button
                onClick={() => setChatOpen(true)}
                className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-transform hover:scale-110 hover:bg-red-700 z-50"
            >
                <MessageSquare size={24} />
            </button>
        );
    }

    const t = translations[language];

    return (
        <div className={`fixed bottom-6 right-6 w-96 rounded-2xl shadow-2xl z-50 overflow-hidden ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
            }`}>
            {/* Header */}
            <div className={`flex items-center justify-between p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-red-600'
                }`}>
                <div className="flex items-center gap-2">
                    {view !== 'menu' && (
                        <button
                            onClick={() => {
                                if (view === 'chat') {
                                    setView('tickets');
                                    setSelectedTicket(null);
                                } else {
                                    setView('menu');
                                }
                            }}
                            className="p-1 rounded hover:bg-white/20 text-white"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    <h3 className="font-semibold text-white">{t.title}</h3>
                </div>
                <button
                    onClick={() => {
                        setChatOpen(false);
                        setView('menu');
                        setSelectedTicket(null);
                    }}
                    className="p-1 rounded text-white hover:bg-white/20"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Content */}
            <div className="h-[450px] overflow-y-auto">
                {/* Main Menu */}
                {view === 'menu' && (
                    <div className="p-4 space-y-4">
                        <p className={`text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {t.welcome}
                        </p>
                        <button
                            onClick={() => setView('tickets')}
                            className={`flex w-full items-center gap-3 rounded-lg border p-4 transition-colors ${isDarkMode
                                ? 'border-gray-700 hover:bg-gray-800'
                                : 'border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            <User className="text-red-600" size={24} />
                            <div className="text-left">
                                <span className="font-medium">{t.staff}</span>
                                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                    {t.myTickets}
                                </p>
                            </div>
                        </button>
                        <button
                            onClick={() => setView('bot')}
                            className={`flex w-full items-center gap-3 rounded-lg border p-4 transition-colors ${isDarkMode
                                ? 'border-gray-700 hover:bg-gray-800'
                                : 'border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            <Bot className="text-red-600" size={24} />
                            <div className="text-left">
                                <span className="font-medium">{t.bot}</span>
                                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                    AI Assistant
                                </p>
                            </div>
                        </button>
                    </div>
                )}

                {/* Tickets List */}
                {view === 'tickets' && (
                    <div className="p-4">
                        <div className="flex gap-2 mb-4">
                            <button
                                onClick={() => setView('newTicket')}
                                className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                <Plus size={18} />
                                {t.newTicket}
                            </button>
                            <button
                                onClick={fetchTickets}
                                className={`px-4 py-3 rounded-lg transition-colors ${isDarkMode
                                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                    }`}
                                title="Refresh tickets"
                            >
                                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                            </button>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <RefreshCw className="animate-spin text-gray-400" size={24} />
                            </div>
                        ) : tickets.length === 0 ? (
                            <p className={`text-center py-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                {t.noTickets}
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {tickets.map((ticket) => (
                                    <button
                                        key={ticket._id}
                                        onClick={() => {
                                            setSelectedTicket(ticket);
                                            setView('chat');
                                        }}
                                        className={`w-full text-left p-3 rounded-lg border transition-colors ${isDarkMode
                                            ? 'border-gray-700 hover:bg-gray-800'
                                            : 'border-gray-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium truncate">{ticket.title}</h4>
                                                <p className={`text-xs truncate ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                                    {ticket.messages[ticket.messages.length - 1]?.message || ticket.description}
                                                </p>
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(ticket.status)}`}>
                                                {ticket.status}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* New Ticket Form */}
                {view === 'newTicket' && (
                    <div className="p-4 space-y-4">
                        <div>
                            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {t.ticketTitle}
                            </label>
                            <input
                                type="text"
                                value={ticketForm.title}
                                onChange={(e) => setTicketForm({ ...ticketForm, title: e.target.value })}
                                className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-red-500 outline-none ${isDarkMode
                                    ? 'bg-gray-800 border-gray-700 text-white'
                                    : 'bg-white border-gray-200'
                                    }`}
                                placeholder="Enter subject..."
                            />
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {t.category}
                            </label>
                            <select
                                value={ticketForm.category}
                                onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                                className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-red-500 outline-none ${isDarkMode
                                    ? 'bg-gray-800 border-gray-700 text-white'
                                    : 'bg-white border-gray-200'
                                    }`}
                            >
                                {Object.entries(t.categories).map(([key, value]) => (
                                    <option key={key} value={key}>{value}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {t.ticketDesc}
                            </label>
                            <textarea
                                value={ticketForm.description}
                                onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                                rows={4}
                                className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-red-500 outline-none resize-none ${isDarkMode
                                    ? 'bg-gray-800 border-gray-700 text-white'
                                    : 'bg-white border-gray-200'
                                    }`}
                                placeholder="Describe your issue..."
                            />
                        </div>
                        <button
                            onClick={createTicket}
                            disabled={!ticketForm.title || !ticketForm.description || sending}
                            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {sending ? t.sending : t.submit}
                        </button>
                    </div>
                )}

                {/* Chat View */}
                {view === 'chat' && selectedTicket && (
                    <div className="flex flex-col h-full">
                        {/* Ticket Info */}
                        <div className={`px-4 py-2 border-b ${isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-100 bg-gray-50'}`}>
                            <div className="flex items-center justify-between">
                                <h4 className="font-medium text-sm truncate flex-1">{selectedTicket.title}</h4>
                                <button
                                    onClick={() => refreshTicket(selectedTicket._id, true)}
                                    className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                                        }`}
                                    title="Refresh messages"
                                >
                                    <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
                                </button>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(selectedTicket.status)}`}>
                                    {selectedTicket.status}
                                </span>
                                <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                    {selectedTicket.category}
                                </span>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {selectedTicket.messages.map((msg, index) => (
                                <div
                                    key={msg._id || index}
                                    className={`flex ${msg.isAdmin ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div className={`max-w-[80%] px-3 py-2 rounded-lg ${msg.isAdmin
                                        ? isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                                        : 'bg-red-600 text-white'
                                        }`}>
                                        {msg.isAdmin && (
                                            <p className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {msg.senderName || 'Admin'}
                                            </p>
                                        )}
                                        <p className="text-sm">{msg.message}</p>
                                        {/* Attachments Display */}
                                        {msg.attachments && msg.attachments.length > 0 && (
                                            <div className="mt-2 space-y-2">
                                                {msg.attachments.map((att, i) => (
                                                    <div key={i}>
                                                        {att.type === 'image' ? (
                                                            <img
                                                                src={`http://localhost:5000${att.url}`}
                                                                alt="attachment"
                                                                className="max-w-full rounded-lg border border-white/20 max-h-48 object-cover cursor-pointer hover:opacity-90"
                                                                onClick={() => window.open(`http://localhost:5000${att.url}`, '_blank')}
                                                            />
                                                        ) : (
                                                            <a
                                                                href={`http://localhost:5000${att.url}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-2 bg-black/10 p-2 rounded text-xs hover:bg-black/20 text-inherit no-underline"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                                                                {att.name || 'Document'}
                                                            </a>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <p className={`text-xs mt-1 ${msg.isAdmin
                                            ? isDarkMode ? 'text-gray-500' : 'text-gray-500'
                                            : 'text-red-200'
                                            }`}>
                                            {formatTime(msg.timestamp)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        {selectedTicket.status !== 'Closed' && (
                            <div className={`p-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                {/* Attachment Preview */}
                                {attachments.length > 0 && (
                                    <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
                                        {attachments.map((file, idx) => (
                                            <div key={idx} className="relative group min-w-[60px]">
                                                {file.type.startsWith('image/') ? (
                                                    <img src={URL.createObjectURL(file)} alt="preview" className="h-16 w-16 object-cover rounded-lg border border-gray-300" />
                                                ) : (
                                                    <div className="h-16 w-16 flex items-center justify-center bg-gray-100 rounded-lg border border-gray-300">
                                                        <span className="text-xs text-gray-500 font-bold">DOC</span>
                                                    </div>
                                                )}
                                                <button
                                                    onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
                                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 shadow-md opacity-90 hover:opacity-100"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex gap-2 items-center">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                                        title="Attach file"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        multiple
                                        onChange={handleFileSelect}
                                        accept="image/*,.pdf,.doc,.docx"
                                    />

                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onPaste={handlePaste}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                sendMessage();
                                            }
                                        }}
                                        placeholder={t.placeholder}
                                        className={`flex-1 px-3 py-2 rounded-lg border focus:ring-2 focus:ring-red-500 outline-none text-sm ${isDarkMode
                                            ? 'bg-gray-800 border-gray-700 text-white'
                                            : 'bg-white border-gray-200'
                                            }`}
                                    />
                                    <button
                                        onClick={sendMessage}
                                        disabled={(!newMessage.trim() && attachments.length === 0) || sending}
                                        className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {sending ? (
                                            <RefreshCw size={18} className="animate-spin" />
                                        ) : (
                                            <Send size={18} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* AI Bot View */}
                {view === 'bot' && (
                    <div className="flex flex-col h-full">
                        <div className={`px-4 py-3 border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-red-600'}`}>
                            <div className="flex items-center gap-2">
                                <Bot className={`${isDarkMode ? 'text-red-500' : 'text-white'}`} size={20} />
                                <div>
                                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-white'}`}>AI Assistant</h3>
                                    <span className={`text-xs flex items-center gap-1 ${isDarkMode ? 'text-green-400' : 'text-green-200'}`}>
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                        Online
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {botMessages.length === 0 && (
                                <div className={`text-center p-4 rounded-lg bg-opacity-10 ${isDarkMode ? 'bg-white text-gray-400' : 'bg-black text-gray-500'}`}>
                                    <Sparkles className="mx-auto mb-2 opacity-50" size={24} />
                                    <p className="text-sm">Hi! I'm the DMT AI Assistant. Ask me anything about vehicle registration, transfers, or the portal!</p>
                                </div>
                            )}

                            {botMessages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                                    <div className={`max-w-[85%] px-3 py-2 rounded-2xl ${msg.isBot
                                        ? isDarkMode ? 'bg-gray-800 text-gray-200 rounded-tl-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'
                                        : 'bg-red-600 text-white rounded-tr-none'
                                        }`}>
                                        <div className="text-sm">
                                            {msg.text.split('\n').map((line, i) => {
                                                // Check for bullet points
                                                if (line.trim().startsWith('*') || line.trim().startsWith('-')) {
                                                    const content = line.trim().substring(1).trim();
                                                    // Parse bold in bullet points
                                                    const parts = content.split(/(\*\*.*?\*\*)/g);
                                                    return (
                                                        <div key={i} className="flex gap-2 ml-2 mb-1">
                                                            <span className="text-red-500">•</span>
                                                            <p>
                                                                {parts.map((part, j) => {
                                                                    if (part.startsWith('**') && part.endsWith('**')) {
                                                                        return <strong key={j}>{part.slice(2, -2)}</strong>;
                                                                    }
                                                                    return part;
                                                                })}
                                                            </p>
                                                        </div>
                                                    );
                                                }

                                                // Regular text with bold support
                                                const parts = line.split(/(\*\*.*?\*\*)/g);
                                                return (
                                                    <p key={i} className={`min-h-[1.2em] ${line.trim() === '' ? 'mb-2' : 'mb-1'}`}>
                                                        {parts.map((part, j) => {
                                                            if (part.startsWith('**') && part.endsWith('**')) {
                                                                return <strong key={j}>{part.slice(2, -2)}</strong>;
                                                            }
                                                            return part;
                                                        })}
                                                    </p>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isBotTyping && (
                                <div className="flex justify-start">
                                    <div className={`px-4 py-2 rounded-2xl rounded-tl-none ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                        <div className="flex gap-1">
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={botMessagesEndRef} />
                        </div>

                        <div className={`p-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={botInput}
                                    onChange={(e) => setBotInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleBotSend()}
                                    placeholder="Ask something..."
                                    className={`flex-1 px-3 py-2 rounded-lg border focus:ring-2 focus:ring-red-500 outline-none text-sm ${isDarkMode
                                        ? 'bg-gray-800 border-gray-700 text-white'
                                        : 'bg-white border-gray-200'
                                        }`}
                                />
                                <button
                                    onClick={handleBotSend}
                                    disabled={!botInput.trim() || isBotTyping}
                                    className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
};
