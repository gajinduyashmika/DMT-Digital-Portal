import React, { useState, useEffect, useRef } from 'react';
import {
    MessageCircle,
    Search,
    Filter,
    Send,
    MoreVertical,
    User,
    Clock,
    CheckCircle,
    AlertCircle,
    RefreshCw,
    XCircle
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const API_URL = 'http://localhost:5000/api';

export default function LiveChat() {
    const { token, user } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');
    const messagesEndRef = useRef(null);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const params = {};
            if (statusFilter !== 'all') {
                params.status = statusFilter;
            }

            const response = await axios.get(`${API_URL}/admin/tickets`, {
                headers: { Authorization: `Bearer ${token}` },
                params
            });

            setTickets(response.data.tickets || []);
            setError('');
        } catch (err) {
            console.error('Error fetching tickets:', err);
            setError('Failed to load tickets');
        } finally {
            setLoading(false);
        }
    };

    const refreshSelectedTicket = async () => {
        if (!selectedTicket) return;
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/admin/tickets/${selectedTicket._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSelectedTicket(response.data);
            // Also update in tickets list
            setTickets(prev => prev.map(t => t._id === selectedTicket._id ? response.data : t));
        } catch (err) {
            console.error('Error refreshing ticket:', err);
            setError('Failed to refresh ticket');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchTickets();
        }
    }, [token, statusFilter]);

    useEffect(() => {
        scrollToBottom();
    }, [selectedTicket?.messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const getStatusColor = (status) => {
        const s = status?.toLowerCase().replace(' ', '_');
        switch (s) {
            case 'open': return 'bg-green-100 text-green-800';
            case 'in_progress': return 'bg-blue-100 text-blue-800';
            case 'resolved': return 'bg-gray-100 text-gray-800';
            case 'closed': return 'bg-gray-200 text-gray-600';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        const s = status?.toLowerCase().replace(' ', '_');
        switch (s) {
            case 'open': return <MessageCircle className="h-4 w-4" />;
            case 'in_progress': return <Clock className="h-4 w-4" />;
            case 'resolved': return <CheckCircle className="h-4 w-4" />;
            case 'closed': return <XCircle className="h-4 w-4" />;
            default: return <AlertCircle className="h-4 w-4" />;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'registration': return 'bg-blue-100 text-blue-800';
            case 'transfer': return 'bg-purple-100 text-purple-800';
            case 'technical': return 'bg-orange-100 text-orange-800';
            case 'payment': return 'bg-green-100 text-green-800';
            case 'complaint': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedTicket) return;

        try {
            setSending(true);
            const response = await axios.post(
                `${API_URL}/admin/tickets/${selectedTicket._id}/reply`,
                { message: newMessage },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Update the selected ticket with new message
            setSelectedTicket(response.data.ticket);

            // Update in tickets list
            setTickets(prev => prev.map(t =>
                t._id === selectedTicket._id ? response.data.ticket : t
            ));

            setNewMessage('');
        } catch (err) {
            console.error('Error sending message:', err);
            setError('Failed to send message');
        } finally {
            setSending(false);
        }
    };

    const handleStatusChange = async (ticketId, newStatus) => {
        try {
            const response = await axios.put(
                `${API_URL}/admin/tickets/${ticketId}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Update in tickets list
            setTickets(prev => prev.map(t =>
                t._id === ticketId ? response.data.ticket : t
            ));

            if (selectedTicket?._id === ticketId) {
                setSelectedTicket(response.data.ticket);
            }
        } catch (err) {
            console.error('Error updating status:', err);
            setError('Failed to update ticket status');
        }
    };

    const handleCloseTicket = async (ticketId) => {
        try {
            const response = await axios.put(
                `${API_URL}/admin/tickets/${ticketId}/close`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setTickets(prev => prev.map(t =>
                t._id === ticketId ? response.data.ticket : t
            ));

            if (selectedTicket?._id === ticketId) {
                setSelectedTicket(response.data.ticket);
            }
        } catch (err) {
            console.error('Error closing ticket:', err);
            setError('Failed to close ticket');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes} min ago`;
        if (hours < 24) return `${hours} hours ago`;
        if (days < 7) return `${days} days ago`;
        return date.toLocaleDateString();
    };

    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch =
            ticket.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.title?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    return (
        <div className="h-[calc(100vh-200px)]">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
                <div className="flex space-x-3">
                    <button
                        onClick={fetchTickets}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-lg shadow h-full flex">
                {/* Ticket List */}
                <div className="w-1/3 border-r border-gray-200 flex flex-col">
                    <div className="p-4 border-b border-gray-200">
                        <div className="space-y-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search tickets..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div className="flex space-x-2">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                >
                                    <option value="all">All Status</option>
                                    <option value="Open">Open</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Resolved">Resolved</option>
                                    <option value="Closed">Closed</option>
                                </select>
                                <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                                    <Filter className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="flex items-center justify-center h-32">
                                <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
                            </div>
                        ) : filteredTickets.length === 0 ? (
                            <div className="flex items-center justify-center h-32 text-gray-500">
                                No tickets found
                            </div>
                        ) : (
                            filteredTickets.map((ticket) => (
                                <div
                                    key={ticket._id}
                                    onClick={() => setSelectedTicket(ticket)}
                                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${selectedTicket?._id === ticket._id ? 'bg-blue-50 border-blue-200' : ''
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <h3 className="text-sm font-medium text-gray-900 truncate">
                                                    {ticket.userName || 'Unknown User'}
                                                </h3>
                                                <span className="text-xs text-gray-400">#{ticket._id.slice(-6)}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mb-2">{ticket.userEmail}</p>
                                            <p className="text-sm text-gray-600 truncate font-medium">{ticket.title}</p>
                                            <p className="text-sm text-gray-500 truncate">
                                                {ticket.messages[ticket.messages.length - 1]?.message || 'No messages'}
                                            </p>
                                            <div className="flex items-center flex-wrap gap-2 mt-2">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                                    {getStatusIcon(ticket.status)}
                                                    <span className="ml-1 capitalize">{ticket.status.replace('_', ' ')}</span>
                                                </span>
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                                                    {ticket.priority}
                                                </span>
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(ticket.category)}`}>
                                                    {ticket.category}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">{formatDate(ticket.updatedAt)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Window */}
                <div className="flex-1 flex flex-col">
                    {selectedTicket ? (
                        <>
                            {/* Ticket Header */}
                            <div className="p-4 border-b border-gray-200 bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <User className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900">{selectedTicket.userName}</h3>
                                            <p className="text-xs text-gray-500">{selectedTicket.userEmail}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTicket.status)}`}>
                                            {getStatusIcon(selectedTicket.status)}
                                            <span className="ml-1 capitalize">{selectedTicket.status.replace('_', ' ')}</span>
                                        </span>
                                        <button
                                            onClick={() => refreshSelectedTicket()}
                                            className="p-2 hover:bg-gray-100 rounded"
                                            title="Refresh messages"
                                        >
                                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                                        </button>
                                        <button className="p-2 hover:bg-gray-100 rounded">
                                            <MoreVertical className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <p className="text-sm font-medium text-gray-700">{selectedTicket.title}</p>
                                    <p className="text-xs text-gray-500">Ticket #{selectedTicket._id.slice(-6)}</p>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {selectedTicket.messages.map((message, index) => (
                                    <div
                                        key={message._id || index}
                                        className={`flex ${message.isAdmin ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.isAdmin
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-900'
                                            }`}>
                                            {message.isAdmin && message.adminName && (
                                                <p className="text-xs text-blue-200 mb-1">{message.adminName}</p>
                                            )}
                                            <p className="text-sm">{message.message}</p>
                                            <p className={`text-xs mt-1 ${message.isAdmin ? 'text-blue-100' : 'text-gray-500'
                                                }`}>
                                                {new Date(message.timestamp).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message Input */}
                            {selectedTicket.status !== 'Closed' && (
                                <div className="p-4 border-t border-gray-200">
                                    <div className="flex items-end space-x-3">
                                        <div className="flex-1">
                                            <textarea
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                placeholder="Type your response..."
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                rows={2}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault();
                                                        handleSendMessage();
                                                    }
                                                }}
                                            />
                                        </div>
                                        <button
                                            onClick={handleSendMessage}
                                            disabled={!newMessage.trim() || sending}
                                            className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {sending ? (
                                                <RefreshCw className="h-5 w-5 animate-spin" />
                                            ) : (
                                                <Send className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                            <div className="text-center">
                                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                <p>Select a ticket to view messages</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Ticket Info Sidebar */}
                {selectedTicket && (
                    <div className="w-80 border-l border-gray-200 bg-gray-50 p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Ticket Information</h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Details</h4>
                                <div className="bg-white p-3 rounded-lg space-y-2">
                                    <p className="text-sm"><span className="font-medium">Ticket #:</span> {selectedTicket._id.slice(-6)}</p>
                                    <p className="text-sm"><span className="font-medium">Category:</span>
                                        <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(selectedTicket.category)}`}>
                                            {selectedTicket.category}
                                        </span>
                                    </p>
                                    <p className="text-sm"><span className="font-medium">Priority:</span>
                                        <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                                            {selectedTicket.priority}
                                        </span>
                                    </p>
                                    <p className="text-sm"><span className="font-medium">Created:</span> {new Date(selectedTicket.createdAt).toLocaleDateString()}</p>
                                    <p className="text-sm"><span className="font-medium">Status:</span>
                                        <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedTicket.status)}`}>
                                            {selectedTicket.status.replace('_', ' ')}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Update Status</h4>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => handleStatusChange(selectedTicket._id, 'In Progress')}
                                        disabled={selectedTicket.status === 'In Progress' || selectedTicket.status === 'Closed'}
                                        className="w-full text-left px-3 py-2 bg-white rounded-lg hover:bg-blue-50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Mark as In Progress
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange(selectedTicket._id, 'Resolved')}
                                        disabled={selectedTicket.status === 'Resolved' || selectedTicket.status === 'Closed'}
                                        className="w-full text-left px-3 py-2 bg-white rounded-lg hover:bg-green-50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Mark as Resolved
                                    </button>
                                    <button
                                        onClick={() => handleCloseTicket(selectedTicket._id)}
                                        disabled={selectedTicket.status === 'Closed'}
                                        className="w-full text-left px-3 py-2 bg-white rounded-lg hover:bg-red-50 text-sm text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Close Ticket
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Templates</h4>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setNewMessage('Thank you for contacting DMT Support. How can I assist you today?')}
                                        className="w-full text-left px-3 py-2 bg-white rounded-lg hover:bg-gray-50 text-sm"
                                    >
                                        Greeting
                                    </button>
                                    <button
                                        onClick={() => setNewMessage('Your application is currently being processed. You will receive an update within 3-5 business days.')}
                                        className="w-full text-left px-3 py-2 bg-white rounded-lg hover:bg-gray-50 text-sm"
                                    >
                                        Processing Update
                                    </button>
                                    <button
                                        onClick={() => setNewMessage('Please provide your application reference number so I can assist you better.')}
                                        className="w-full text-left px-3 py-2 bg-white rounded-lg hover:bg-gray-50 text-sm"
                                    >
                                        Request Reference
                                    </button>
                                    <button
                                        onClick={() => setNewMessage('Your issue has been resolved. Please let us know if you need any further assistance.')}
                                        className="w-full text-left px-3 py-2 bg-white rounded-lg hover:bg-gray-50 text-sm"
                                    >
                                        Issue Resolved
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
