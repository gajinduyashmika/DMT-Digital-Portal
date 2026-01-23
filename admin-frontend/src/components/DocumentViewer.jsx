import React, { useEffect } from 'react';
import { X, Download } from 'lucide-react';

export const DocumentViewer = ({ isOpen, onClose, documentUrl, title }) => {
    if (!isOpen) return null;

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Determine if PDF based on URL or data type (basic check)
    const isPdf = documentUrl?.toLowerCase().endsWith('.pdf') ||
        documentUrl?.startsWith('data:application/pdf');

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="relative w-full h-full max-w-6xl flex flex-col pointer-events-auto">
                {/* Header */}
                <div className="flex items-center justify-between text-white mb-4 px-2">
                    <h3 className="text-lg font-semibold truncate">{title || 'Document Viewer'}</h3>
                    <div className="flex items-center gap-4">
                        {documentUrl && (
                            <a
                                href={documentUrl}
                                download={title || 'document'}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                                title="Download"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Download className="w-5 h-5" />
                            </a>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50"
                            title="Close (Esc)"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 bg-gray-900 rounded-lg overflow-hidden border border-white/10 relative flex items-center justify-center">
                    {documentUrl ? (
                        isPdf ? (
                            <iframe
                                src={documentUrl}
                                className="w-full h-full bg-white"
                                title="PDF Viewer"
                            />
                        ) : (
                            <img
                                src={documentUrl}
                                alt={title}
                                className="max-w-full max-h-full object-contain"
                            />
                        )
                    ) : (
                        <div className="text-gray-400">No document to display</div>
                    )}
                </div>
            </div>

            {/* Backdrop click to close */}
            <div className="absolute inset-0 -z-10" onClick={onClose}></div>
        </div>
    );
};
