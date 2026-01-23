import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useStore } from '../../store/useStore';
import { useToast } from '../../components/ToastContainer';
import { ChevronDown, Plus, MessageCircle, Clock, AlertCircle, CheckCircle } from 'lucide-react';

const Tickets = () => {
    const { userEmail, userName } = useStore();
    const { showToast } = useToast();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState('All');
    const [message, setMessage] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'General',
        priority: 'Medium',
    });

    useEffect(() => {
        if (userEmail) {
            fetchTickets();
        }
    }, [userEmail]);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5000/api/tickets/user/${userEmail}`);
            setTickets(response.data);
            if (response.data.length > 0) {
                setSelectedTicket(response.data[0]);
            }
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTicket = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/tickets/create', {
                userEmail,
                userName: userName || 'Anonymous User',
                title: formData.title,
                description: formData.description,
                category: formData.category,
                priority: formData.priority,
            });

            setTickets([response.data.ticket, ...tickets]);
            setSelectedTicket(response.data.ticket);
            setFormData({ title: '', description: '', category: 'General', priority: 'Medium' });
            setShowCreateModal(false);
            showToast('success', 'Ticket created successfully!');
        } catch (error) {
            console.error('Error creating ticket:', error.response?.data || error.message);
            showToast('error', error.response?.data?.message || 'Failed to create ticket');
        }
    };

    const handleSendMessage = async () => {
        if (!message.trim() || !selectedTicket) return;

        try {
            const response = await axios.post(
                `http://localhost:5000/api/tickets/${selectedTicket._id}/message`,
                {
                    senderEmail: userEmail,
                    senderName: userName || 'Anonymous User',
                    message,
                    isAdmin: false,
                }
            );

            setSelectedTicket(response.data.ticket);
            setMessage('');

            // Update the ticket in the list
            setTickets(tickets.map(t => t._id === response.data.ticket._id ? response.data.ticket : t));
            showToast('success', 'Message sent successfully!');
        } catch (error) {
            console.error('Error sending message:', error.response?.data || error.message);
            showToast('error', error.response?.data?.message || 'Failed to send message');
        }
    };

    const handleCloseTicket = async () => {
        if (!selectedTicket) return;

        try {
            const response = await axios.put(
                `http://localhost:5000/api/tickets/${selectedTicket._id}/close`
            );

            setSelectedTicket(response.data.ticket);
            setTickets(tickets.map(t => t._id === response.data.ticket._id ? response.data.ticket : t));
            showToast('success', 'Ticket closed successfully');
        } catch (error) {
            console.error('Error closing ticket:', error.response?.data || error.message);
            showToast('error', error.response?.data?.message || 'Failed to close ticket');
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Open':
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            case 'In Progress':
                return <Clock className="w-5 h-5 text-yellow-500" />;
            case 'Resolved':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'Closed':
                return <CheckCircle className="w-5 h-5 text-gray-500" />;
            default:
                return <AlertCircle className="w-5 h-5 text-gray-400" />;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Urgent':
                return 'bg-red-100 text-red-800';
            case 'High':
                return 'bg-orange-100 text-orange-800';
            case 'Medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'Low':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredTickets = filterStatus === 'All'
        ? tickets
        : tickets.filter(t => t.status === filterStatus);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-gray-500">Loading tickets...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        New Ticket
                    </button>
                </div>

                {/* Create Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
                            <h2 className="text-2xl font-bold mb-6">Create New Ticket</h2>
                            <form onSubmit={handleCreateTicket} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description *
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        rows={4}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option>General</option>
                                        <option>Technical</option>
                                        <option>Registration</option>
                                        <option>Payment</option>
                                        <option>Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                                    <select
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option>Low</option>
                                        <option>Medium</option>
                                        <option>High</option>
                                        <option>Urgent</option>
                                    </select>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Create
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Tickets List */}
                    <div className="lg:col-span-1 bg-white rounded-lg shadow">
                        <div className="p-4 border-b">
                            <h2 className="font-semibold text-gray-900 mb-3">Tickets</h2>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option>All</option>
                                <option>Open</option>
                                <option>In Progress</option>
                                <option>Resolved</option>
                                <option>Closed</option>
                            </select>
                        </div>

                        <div className="divide-y max-h-96 overflow-y-auto">
                            {filteredTickets.length === 0 ? (
                                <div className="p-4 text-center text-gray-500">No tickets found</div>
                            ) : (
                                filteredTickets.map((ticket) => (
                                    <div
                                        key={ticket._id}
                                        onClick={() => setSelectedTicket(ticket)}
                                        className={`p-4 cursor-pointer hover:bg-gray-50 transition ${selectedTicket?._id === ticket._id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 truncate">{ticket.title}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {new Date(ticket.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            {getStatusIcon(ticket.status)}
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(ticket.priority)}`}>
                                                {ticket.priority}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Ticket Detail */}
                    <div className="lg:col-span-2">
                        {selectedTicket ? (
                            <div className="bg-white rounded-lg shadow">
                                {/* Header */}
                                <div className="p-6 border-b">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold text-gray-900">{selectedTicket.title}</h3>
                                            <div className="flex items-center gap-4 mt-2">
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(selectedTicket.status)}
                                                    <span className="text-sm text-gray-600">{selectedTicket.status}</span>
                                                </div>
                                                <span className={`text-xs px-3 py-1 rounded-full ${getPriorityColor(selectedTicket.priority)}`}>
                                                    {selectedTicket.priority}
                                                </span>
                                            </div>
                                        </div>
                                        {selectedTicket.status !== 'Closed' && (
                                            <button
                                                onClick={handleCloseTicket}
                                                className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                            >
                                                Close
                                            </button>
                                        )}
                                    </div>

                                    <div className="mt-4 grid grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-500">Category</p>
                                            <p className="font-medium text-gray-900">{selectedTicket.category}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Created</p>
                                            <p className="font-medium text-gray-900">
                                                {new Date(selectedTicket.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Messages</p>
                                            <p className="font-medium text-gray-900">{selectedTicket.messages.length}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="p-6 border-b max-h-64 overflow-y-auto">
                                    <div className="space-y-4">
                                        {selectedTicket.messages.map((msg, idx) => (
                                            <div key={idx} className={`flex gap-3 ${msg.isAdmin ? 'flex-row-reverse' : ''}`}>
                                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs text-white font-semibold ${msg.isAdmin ? 'bg-green-600' : 'bg-blue-600'
                                                    }`}>
                                                    {(msg.senderName || 'U').charAt(0).toUpperCase()}
                                                </div>
                                                <div className={`flex-1 ${msg.isAdmin ? 'text-right' : ''}`}>
                                                    <p className="text-xs font-medium text-gray-600">
                                                        {msg.senderName} {msg.isAdmin && '(Admin)'}
                                                    </p>
                                                    <div className={`mt-1 p-3 rounded-lg ${msg.isAdmin
                                                            ? 'bg-green-50 text-gray-900 rounded-br-none'
                                                            : 'bg-blue-50 text-gray-900 rounded-bl-none'
                                                        }`}>
                                                        <p className="text-sm">{msg.message}</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {new Date(msg.timestamp).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Message Input */}
                                {selectedTicket.status !== 'Closed' && (
                                    <div className="p-6 border-t">
                                        <div className="flex gap-3">
                                            <input
                                                type="text"
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                                placeholder="Type your message..."
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                            <button
                                                onClick={handleSendMessage}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                                            >
                                                <MessageCircle className="w-5 h-5" />
                                                Send
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {selectedTicket.status === 'Closed' && (
                                    <div className="p-6 border-t bg-gray-50 text-center text-gray-600">
                                        This ticket is closed and cannot receive new messages.
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow p-12 flex items-center justify-center h-96">
                                <div className="text-center">
                                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">Select a ticket to view details</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tickets;
