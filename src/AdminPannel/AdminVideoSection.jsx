// src/AdminPannel/Components/AdminVideoSection.jsx
import React, { useEffect, useState } from "react";
import {
    Plus,
    Trash2,
    Edit3,
    Eye,
    X,
    Loader2,
    Video,
    Link as LinkIcon,
    AlertTriangle,
    Play,
    ExternalLink,
} from "lucide-react";
import {
    getVideoItems,
    createVideo,
    updateVideo,
    deleteVideo,
    deleteAllVideos,
} from "../api/admin/videoAdminApi";

/* ---------- Helper: Extract YouTube Video ID ---------- */
function extractYouTubeVideoId(url) {
    if (!url) return null;

    // Handle various YouTube URL formats
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /youtube\.com\/v\/([^&\n?#]+)/,
        /youtube\.com\/shorts\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }

    return null;
}

/* ---------- Helper: Get YouTube Embed URL ---------- */
function getYouTubeEmbedUrl(url) {
    const videoId = extractYouTubeVideoId(url);
    if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
    }
    return null;
}

/* ---------- Helper: Get YouTube Thumbnail ---------- */
function getYouTubeThumbnail(url) {
    const videoId = extractYouTubeVideoId(url);
    if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    }
    return null;
}

/* ---------- Video Form Modal ---------- */
function VideoFormModal({ isOpen, onClose, onSave, editData, isLoading }) {
    const [formData, setFormData] = useState({
        videoTitle: "",
        videoDescription: "",
        videoUrl: "",
        order: 0,
    });
    const [urlError, setUrlError] = useState("");

    useEffect(() => {
        if (isOpen) {
            if (editData) {
                setFormData({
                    videoTitle: editData.videoTitle || "",
                    videoDescription: editData.videoDescription || "",
                    videoUrl: editData.videoUrl || "",
                    order: editData.order || 0,
                });
            } else {
                setFormData({
                    videoTitle: "",
                    videoDescription: "",
                    videoUrl: "",
                    order: 0,
                });
            }
            setUrlError("");
        }
    }, [isOpen, editData]);

    const handleUrlChange = (url) => {
        setFormData({ ...formData, videoUrl: url });

        if (url && !extractYouTubeVideoId(url)) {
            setUrlError("Please enter a valid YouTube URL");
        } else {
            setUrlError("");
        }
    };

    const handleSubmit = () => {
        if (!formData.videoTitle.trim()) {
            return;
        }
        if (!formData.videoUrl.trim() || !extractYouTubeVideoId(formData.videoUrl)) {
            setUrlError("Please enter a valid YouTube URL");
            return;
        }
        onSave(formData);
    };

    const embedUrl = getYouTubeEmbedUrl(formData.videoUrl);
    const thumbnail = getYouTubeThumbnail(formData.videoUrl);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl my-8" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">
                        {editData ? "Edit Video" : "Add New Video"}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Left - Form Fields */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Video Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.videoTitle}
                                onChange={(e) => setFormData({ ...formData, videoTitle: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Enter video title"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                value={formData.videoDescription}
                                onChange={(e) => setFormData({ ...formData, videoDescription: e.target.value })}
                                rows={3}
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                                placeholder="Enter video description..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                YouTube URL <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="url"
                                    value={formData.videoUrl}
                                    onChange={(e) => handleUrlChange(e.target.value)}
                                    className={`w-full border rounded-lg p-2.5 pl-10 focus:ring-2 focus:ring-green-500 focus:border-transparent ${urlError ? "border-red-500" : "border-gray-300"
                                        }`}
                                    placeholder="https://www.youtube.com/watch?v=..."
                                />
                            </div>
                            {urlError && (
                                <p className="text-red-500 text-sm mt-1">{urlError}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                                Supports: youtube.com/watch, youtu.be, youtube.com/embed
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                            <input
                                type="number"
                                min="0"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Right - Preview */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                        <div className="border rounded-lg overflow-hidden bg-gray-100 aspect-video flex items-center justify-center">
                            {embedUrl ? (
                                <iframe
                                    src={embedUrl}
                                    title="Video Preview"
                                    className="w-full h-full"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <div className="text-center text-gray-400">
                                    <Video className="w-12 h-12 mx-auto mb-2" />
                                    <p className="text-sm">Enter a YouTube URL to preview</p>
                                </div>
                            )}
                        </div>
                        {formData.videoTitle && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                <h4 className="font-semibold text-gray-900">{formData.videoTitle}</h4>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                    {formData.videoDescription || "No description"}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || !formData.videoTitle.trim() || !formData.videoUrl.trim() || urlError}
                        className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                    >
                        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {editData ? "Update Video" : "Add Video"}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ---------- Confirmation Modal ---------- */
function ConfirmationModal({ isOpen, title, message, onConfirm, onCancel, isLoading }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onCancel}>
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-red-100 rounded-full">
                        <AlertTriangle className="text-red-600 w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                        <p className="mt-2 text-sm text-gray-600">{message}</p>
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                    >
                        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ---------- Preview Modal ---------- */
function PreviewModal({ isOpen, video, onClose }) {
    if (!isOpen || !video) return null;

    const embedUrl = video.embedUrl || getYouTubeEmbedUrl(video.videoUrl);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-xl p-4 max-w-4xl w-full relative" onClick={(e) => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    className="absolute -top-3 -right-3 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 z-10"
                >
                    <X className="w-5 h-5" />
                </button>
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    {embedUrl ? (
                        <iframe
                            src={embedUrl}
                            title={video.videoTitle}
                            className="w-full h-full"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Video className="w-16 h-16" />
                        </div>
                    )}
                </div>
                <div className="mt-4">
                    <h3 className="font-semibold text-xl text-gray-900">{video.videoTitle}</h3>
                    {video.videoDescription && (
                        <p className="text-gray-600 mt-2">{video.videoDescription}</p>
                    )}
                    <a
                        href={video.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700 mt-2"
                    >
                        Open on YouTube <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
            </div>
        </div>
    );
}

/* ---------- Video Card ---------- */
function VideoCard({ video, onEdit, onDelete, onPreview }) {
    const thumbnail = getYouTubeThumbnail(video.videoUrl);

    return (
        <div className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition bg-white group">
            <div className="relative aspect-video bg-gray-100">
                {thumbnail ? (
                    <img
                        src={thumbnail}
                        alt={video.videoTitle}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = "https://via.placeholder.com/400x225?text=Video+Thumbnail";
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Video className="w-12 h-12" />
                    </div>
                )}

                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg opacity-90">
                        <Play className="w-6 h-6 text-white ml-1" fill="white" />
                    </div>
                </div>

                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                        onClick={() => onPreview(video)}
                        className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
                        title="Preview"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onEdit(video)}
                        className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
                        title="Edit"
                    >
                        <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(video)}
                        className="p-2 bg-white rounded-full shadow hover:bg-red-50 text-red-600"
                        title="Delete"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                {/* Order badge */}
                <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    #{video.order || 0}
                </div>
            </div>

            <div className="p-4">
                <h4 className="font-semibold text-gray-900 truncate">{video.videoTitle || "Untitled"}</h4>
                <p className="text-sm text-gray-500 line-clamp-2 mt-1">{video.videoDescription || "No description"}</p>
            </div>
        </div>
    );
}

/* ---------- Video Preview Section ---------- */
function VideoPreview({ items }) {
    const [activeIndex, setActiveIndex] = useState(0);

    if (items.length === 0) {
        return (
            <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                <div className="text-center">
                    <Video className="w-12 h-12 mx-auto mb-2" />
                    <p>No videos to preview</p>
                </div>
            </div>
        );
    }

    const activeVideo = items[activeIndex];
    const embedUrl = activeVideo?.embedUrl || getYouTubeEmbedUrl(activeVideo?.videoUrl);

    return (
        <div className="space-y-4">
            {/* Main Video Player */}
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
                {embedUrl ? (
                    <iframe
                        src={embedUrl}
                        title={activeVideo.videoTitle}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Video className="w-16 h-16" />
                    </div>
                )}
            </div>

            {/* Video Info */}
            <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="font-semibold text-gray-900">{activeVideo.videoTitle}</h4>
                <p className="text-sm text-gray-500 mt-1">{activeVideo.videoDescription || "No description"}</p>
            </div>

            {/* Video List (if more than 1) */}
            {items.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {items.map((video, index) => {
                        const thumb = getYouTubeThumbnail(video.videoUrl);
                        return (
                            <button
                                key={video.id}
                                onClick={() => setActiveIndex(index)}
                                className={`flex-shrink-0 w-32 rounded-lg overflow-hidden border-2 transition ${index === activeIndex ? "border-green-500" : "border-transparent hover:border-gray-300"
                                    }`}
                            >
                                <div className="aspect-video bg-gray-100 relative">
                                    {thumb ? (
                                        <img src={thumb} alt={video.videoTitle} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Video className="w-6 h-6 text-gray-400" />
                                        </div>
                                    )}
                                    {index === activeIndex && (
                                        <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                                            <Play className="w-6 h-6 text-white" fill="white" />
                                        </div>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

/* ---------- Main AdminVideoSection Component ---------- */
export default function AdminVideoSection({ showToast }) {
    const [videoItems, setVideoItems] = useState([]);
    const [videoLoading, setVideoLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const [videoFormModal, setVideoFormModal] = useState({ isOpen: false, editData: null });
    const [confirmModal, setConfirmModal] = useState({ isOpen: false });
    const [previewModal, setPreviewModal] = useState({ isOpen: false, video: null });

    // Fetch Video Items
    const fetchVideoItems = async () => {
        setVideoLoading(true);
        const result = await getVideoItems();
        if (result.success) {
            setVideoItems(result.data);
        } else {
            showToast?.(result.error || "Failed to fetch videos", "error");
        }
        setVideoLoading(false);
    };

    useEffect(() => {
        fetchVideoItems();
    }, []);

    // ========== Video Handlers ==========
    const handleAddVideo = () => {
        setVideoFormModal({ isOpen: true, editData: null });
    };

    const handleEditVideo = (video) => {
        setVideoFormModal({ isOpen: true, editData: video });
    };

    const handleSaveVideo = async (videoData) => {
        setActionLoading(true);

        let result;
        if (videoFormModal.editData) {
            result = await updateVideo(videoFormModal.editData.id, videoData);
        } else {
            result = await createVideo(videoData);
        }

        if (result.success) {
            showToast?.(videoFormModal.editData ? "Video updated!" : "Video added!", "success");
            setVideoFormModal({ isOpen: false, editData: null });
            fetchVideoItems();
        } else {
            showToast?.(result.error || "Failed to save video", "error");
        }

        setActionLoading(false);
    };

    const handleDeleteVideo = (video) => {
        setConfirmModal({
            isOpen: true,
            title: "Delete Video",
            message: `Are you sure you want to delete "${video.videoTitle}"? This action cannot be undone.`,
            onConfirm: async () => {
                setActionLoading(true);
                const result = await deleteVideo(video.id);
                if (result.success) {
                    showToast?.("Video deleted!", "success");
                    fetchVideoItems();
                } else {
                    showToast?.(result.error || "Failed to delete video", "error");
                }
                setActionLoading(false);
                setConfirmModal({ isOpen: false });
            },
        });
    };

    const handleDeleteAllVideos = () => {
        setConfirmModal({
            isOpen: true,
            title: "Delete All Videos",
            message: "Are you sure you want to delete ALL videos? This action cannot be undone.",
            onConfirm: async () => {
                setActionLoading(true);
                const result = await deleteAllVideos();
                if (result.success) {
                    showToast?.("All videos deleted!", "success");
                    setVideoItems([]);
                } else {
                    showToast?.(result.error || "Failed to delete videos", "error");
                }
                setActionLoading(false);
                setConfirmModal({ isOpen: false });
            },
        });
    };

    const handlePreviewVideo = (video) => {
        setPreviewModal({
            isOpen: true,
            video: video,
        });
    };

    return (
        <>
            {/* Modals */}
            <ConfirmationModal
                {...confirmModal}
                isLoading={actionLoading}
                onCancel={() => setConfirmModal({ isOpen: false })}
            />
            <VideoFormModal
                isOpen={videoFormModal.isOpen}
                editData={videoFormModal.editData}
                isLoading={actionLoading}
                onClose={() => setVideoFormModal({ isOpen: false, editData: null })}
                onSave={handleSaveVideo}
            />
            <PreviewModal
                isOpen={previewModal.isOpen}
                video={previewModal.video}
                onClose={() => setPreviewModal({ isOpen: false, video: null })}
            />

            {/* Main Content */}
            <div className="bg-white p-6 rounded-2xl shadow space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-green-700">About Section (Video)</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={handleAddVideo}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold hover:bg-green-700"
                        >
                            <Plus className="w-4 h-4" /> Add Video
                        </button>
                        {videoItems.length > 0 && (
                            <button
                                onClick={handleDeleteAllVideos}
                                className="bg-red-100 text-red-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold hover:bg-red-200"
                            >
                                <Trash2 className="w-4 h-4" /> Delete All
                            </button>
                        )}
                    </div>
                </div>

                {/* Live Preview */}
                <div>
                    <h3 className="font-semibold text-gray-700 mb-3">Live Preview</h3>
                    {videoLoading ? (
                        <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
                        </div>
                    ) : (
                        <VideoPreview items={videoItems} />
                    )}
                </div>

                {/* Video Items Grid */}
                <div>
                    <h3 className="font-semibold text-gray-700 mb-3">
                        All Videos ({videoItems.length})
                    </h3>
                    {videoLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-gray-100 rounded-xl h-48 animate-pulse" />
                            ))}
                        </div>
                    ) : videoItems.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <Video className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 mb-4">No videos yet</p>
                            <button
                                onClick={handleAddVideo}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700"
                            >
                                Add Your First Video
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {videoItems.map((video) => (
                                <VideoCard
                                    key={video.id}
                                    video={video}
                                    onEdit={handleEditVideo}
                                    onDelete={handleDeleteVideo}
                                    onPreview={handlePreviewVideo}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}