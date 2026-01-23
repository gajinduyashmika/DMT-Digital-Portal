import React, { useState } from 'react';
import { MessageCircle, X, Plus } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useToast } from './ToastContainer';
import axios from 'axios';

const TicketButton = ({ onNavigateToTickets }) => {
    const { userEmail, userName } = useStore();
    const { showToast } = useToast();
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'General',
        priority: 'Medium',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreateTicket = async (e) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.description.trim()) {
            showToast('error', 'Please fill in all fields');
            return;
        }

        if (!userEmail) {
            showToast('error', 'Please log in first to create a ticket');
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await axios.post('http://localhost:5000/api/tickets/create', {
                userEmail,
                userName: userName || 'Anonymous User',
                title: formData.title,
                description: formData.description,
                category: formData.category,
                priority: formData.priority,
            });

            setFormData({ title: '', description: '', category: 'General', priority: 'Medium' });
            setShowModal(false);
            showToast('success', 'Ticket created successfully!');
        } catch (error) {
            console.error('Error creating ticket:', error.response?.data || error.message);
            showToast('error', error.response?.data?.message || 'Failed to create ticket');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* Floating Button */}
            <div className="fixed bottom-6 right-6 z-40">
                <div className="flex flex-col gap-3 items-end">
                    {/* View Tickets Button */}
                    {onNavigateToTickets && (
                        <button
                            onClick={onNavigateToTickets}
                            className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg flex items-center justify-center transition-all"
                            title="View all tickets"
                        >
                            <MessageCircle className="w-6 h-6" />
                        </button>
                    )}

                    {/* Create Ticket Button */}
                    <button
                        onClick={() => setShowModal(!showModal)}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg flex items-center justify-center transition-all"
                        title="Create new ticket"
                    >
                        {showModal ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Plus className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        {/* Header */}
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">Create Support Ticket</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleCreateTicket} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subject *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Brief subject of your issue"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
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
                                    placeholder="Describe your issue in detail"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    rows={4}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    >
                                        <option>General</option>
                                        <option>Technical</option>
                                        <option>Registration</option>
                                        <option>Payment</option>
                                        <option>Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Priority
                                    </label>
                                    <select
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    >
                                        <option>Low</option>
                                        <option>Medium</option>
                                        <option>High</option>
                                        <option>Urgent</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
                                >
                                    {isSubmitting ? 'Creating...' : 'Create Ticket'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default TicketButton;
