// src/Admin/AdminTeam.jsx
import React, { useState, useEffect } from "react";
import {
  Edit3,
  Trash2,
  Eye,
  Plus,
  Save,
  X,
  ImageIcon,
  Users,
  Upload,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";

/**
 * AdminTeam.jsx with Custom Modals and Toasts
 * - Replaces browser alerts with custom UI components for a modern feel.
 * - Includes Toast notifications, Confirmation modals, and a custom View modal.
 */

// --- Reusable UI Components ---

function IconButton({ title, onClick, children, className = "" }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`inline-flex items-center justify-center p-2 rounded-full hover:bg-gray-200 transition-colors ${className}`}
    >
      {children}
    </button>
  );
}

function Toast({ message, type, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(), 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const styles = {
    success: { bg: "bg-green-100", text: "text-green-800", icon: <CheckCircle /> },
    error: { bg: "bg-red-100", text: "text-red-800", icon: <AlertTriangle /> },
    info: { bg: "bg-blue-100", text: "text-blue-800", icon: <Info /> },
  };
  const style = styles[type] || styles.info;

  return (
    <div className={`fixed top-5 right-5 z-[60] flex items-center gap-3 p-4 rounded-lg shadow-lg ${style.bg} ${style.text}`}>
      {style.icon}
      <span className="font-medium">{message}</span>
      <button onClick={onDismiss} className="ml-2 -mr-1 p-1 rounded-full hover:bg-black/10"><X size={16} /></button>
    </div>
  );
}

function ConfirmationModal({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onCancel}>
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-4">
          <div className="p-2 bg-red-100 rounded-full"><AlertTriangle className="text-red-600" /></div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <p className="mt-2 text-sm text-gray-600">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
          <button onClick={() => { onConfirm(); onCancel(); }} className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700">Delete</button>
        </div>
      </div>
    </div>
  );
}

function ViewMemberModal({ member, onClose }) {
    if (!member) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Team Member Details</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><X /></button>
                </div>
                <div className="text-center">
                    <img src={member.image || 'https://via.placeholder.com/150'} alt={member.name} className="w-32 h-32 object-cover rounded-full mx-auto mb-4 border-4 border-green-200"/>
                    <h4 className="font-bold text-2xl text-gray-900">{member.name}</h4>
                    <p className="text-green-700 font-semibold text-md mb-4">{member.role}</p>
                    <p className="text-sm text-gray-600 text-left bg-gray-50 p-3 rounded-lg border">{member.description || "No description provided."}</p>
                </div>
                 <div className="mt-6 text-right">
                    <button onClick={onClose} className="bg-gray-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-gray-700">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

// --- Main Component ---

export default function AdminTeam() {
  const defaultBanner = {
    bgImage: "", title: "MEET OUR TEAM", subtitle: "The driving force behind our mission.", description: "",
  };

  const [banner, setBanner] = useState(defaultBanner);
  const [members, setMembers] = useState([]);
  const [editingMember, setEditingMember] = useState(null);
  const [form, setForm] = useState({ image: "", name: "", role: "", description: "" });
  
  // State for modals and toasts
  const [toast, setToast] = useState({ visible: false, message: "", type: "info" });
  const [modal, setModal] = useState({ isOpen: false, title: "", message: "", onConfirm: () => {} });
  const [viewingMember, setViewingMember] = useState(null);

  useEffect(() => {
    try {
      const savedBanner = JSON.parse(localStorage.getItem("teamBanner"));
      const savedMembers = JSON.parse(localStorage.getItem("teamMembers"));
      if (savedBanner) setBanner({ ...defaultBanner, ...savedBanner });
      if (savedMembers) setMembers(savedMembers);
    } catch (error) {
      console.error("Failed to parse data from localStorage", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("teamMembers", JSON.stringify(members));
  }, [members]);

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
  };
  
  const handleBannerChange = (e) => {
    const { name, value } = e.target;
    setBanner({ ...banner, [name]: value });
  };

  const handleSaveBanner = () => {
    localStorage.setItem("teamBanner", JSON.stringify(banner));
    showToast("Banner details have been saved successfully!");
  };

  const handleImageUpload = (file, type) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "banner") {
          setBanner({ ...banner, bgImage: reader.result });
        } else {
          setForm({ ...form, image: reader.result });
        }
        showToast("Image uploaded.", "info");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddOrUpdateMember = () => {
    if (!form.name || !form.role) {
      showToast("Name and Designation are required.", "error");
      return;
    }

    if (editingMember !== null) {
      const updatedMembers = members.map((member, index) =>
        index === editingMember ? form : member
      );
      setMembers(updatedMembers);
      showToast("Member updated successfully.");
    } else {
      setMembers([...members, form]);
      showToast("New member added successfully.");
    }
    
    setForm({ image: "", name: "", role: "", description: "" });
    setEditingMember(null);
  };

  const handleEdit = (index) => {
    setEditingMember(index);
    setForm(members[index]);
    document.getElementById('team-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleDelete = (index) => {
    setModal({
      isOpen: true,
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this member? This action cannot be undone.",
      onConfirm: () => {
        const updatedMembers = members.filter((_, i) => i !== index);
        setMembers(updatedMembers);
        showToast("Member deleted.", "info");
      },
    });
  };

  const handleView = (member) => {
    setViewingMember(member);
  };

  const cancelEdit = () => {
    setEditingMember(null);
    setForm({ image: "", name: "", role: "", description: "" });
  };

  return (
    <div className="p-4 md:p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* --- Modals and Toasts Rendering --- */}
      {toast.visible && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast({ ...toast, visible: false })} />}
      <ConfirmationModal isOpen={modal.isOpen} title={modal.title} message={modal.message} onConfirm={modal.onConfirm} onCancel={() => setModal({ ...modal, isOpen: false })}/>
      <ViewMemberModal member={viewingMember} onClose={() => setViewingMember(null)} />

      {/* Banner Section */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-green-700 flex items-center gap-3">
          <ImageIcon size={28} /> Team Page Banner
        </h2>
        <div className="grid md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-1">
            <label className="block font-semibold mb-2">Background Image</label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              {banner.bgImage ? (
                <img src={banner.bgImage} alt="Banner Preview" className="w-full h-40 object-cover rounded-md mb-3"/>
              ) : (
                <div className="w-full h-40 bg-gray-100 rounded-md flex flex-col items-center justify-center text-gray-400 mb-3">
                    <ImageIcon size={40} />
                    <p className="mt-2 text-sm">No Image Uploaded</p>
                </div>
              )}
              <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md inline-flex items-center gap-2">
                <Upload size={16} /> <span>Upload Image</span>
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0], "banner")} className="hidden"/>
              </label>
            </div>
          </div>
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="font-semibold block mb-1">Title</label>
              <input type="text" name="title" value={banner.title} onChange={handleBannerChange} placeholder="e.g., WELCOME TO OUR TEAM" className="w-full border rounded-md p-2"/>
            </div>
            <div>
              <label className="font-semibold block mb-1">Subtitle</label>
              <input type="text" name="subtitle" value={banner.subtitle} onChange={handleBannerChange} placeholder="e.g., WHY TEAM IS IMPORTANT?" className="w-full border rounded-md p-2"/>
            </div>
            <div>
              <label className="font-semibold block mb-1">Description</label>
              <textarea name="description" value={banner.description} onChange={handleBannerChange} placeholder="Write about why your team is important..." rows={4} className="w-full border rounded-md p-2"/>
            </div>
          </div>
        </div>
        <div className="mt-6 text-right">
          <button onClick={handleSaveBanner} className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 ml-auto hover:bg-green-700 transition-transform active:scale-95">
            <Save size={18} /> Save Banner Details
          </button>
        </div>
      </div>

      {/* Team Members Section */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-green-700 flex items-center gap-3">
          <Users size={28} /> Manage Team Members
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div id="team-form" className="lg:col-span-1">
            <div className="border p-5 rounded-xl bg-gray-50/70 sticky top-6">
              <h3 className="font-bold text-xl mb-4 text-gray-800">{editingMember !== null ? "Edit Member" : "Add New Member"}</h3>
              <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                     {form.image && (<img src={form.image} alt="Preview" className="w-full h-40 object-cover rounded-md mb-3 border"/>)}
                    <label className="cursor-pointer w-full bg-white border border-gray-300 text-gray-700 text-sm py-2 px-3 rounded-md inline-flex items-center justify-center gap-2 hover:bg-gray-50">
                        <Upload size={16} /><span>{form.image ? "Change Image" : "Upload Image"}</span>
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0], "member")} className="hidden"/>
                    </label>
                 </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" placeholder="e.g., John Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border rounded-md p-2"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Designation / Role</label>
                    <input type="text" placeholder="e.g., Founder & CEO" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full border rounded-md p-2"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                    <textarea placeholder="Brief introduction..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border rounded-md p-2" rows={3}/>
                </div>
              </div>
              <div className="mt-5">
                <button onClick={handleAddOrUpdateMember} className="bg-green-600 text-white font-semibold px-4 py-2.5 rounded-lg w-full flex items-center justify-center gap-2 hover:bg-green-700 active:scale-95 transition-all">
                  {editingMember !== null ? <><Save size={16}/>Update Member</> : <><Plus size={16}/>Add Member</>}
                </button>
                {editingMember !== null && (
                  <button onClick={cancelEdit} className="mt-2 bg-gray-200 text-black px-4 py-2 rounded-lg w-full flex items-center justify-center gap-2 hover:bg-gray-300">
                    <X size={16} /> Cancel Edit
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            {members.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {members.map((member, index) => (
                  <div key={index} className="border rounded-xl shadow-md overflow-hidden bg-white transition-shadow hover:shadow-xl">
                    <div className="p-5 flex flex-col items-center text-center">
                      <img src={member.image || 'https://via.placeholder.com/150'} alt={member.name} className="w-28 h-28 object-cover rounded-full mb-4 border-4 border-green-100 shadow-sm"/>
                      <h4 className="font-bold text-lg text-gray-900">{member.name}</h4>
                      <p className="text-green-700 font-semibold text-sm mb-2">{member.role}</p>
                      <p className="text-sm text-gray-600 line-clamp-3 min-h-[60px]">{member.description}</p>
                    </div>
                    <div className="flex justify-center gap-2 bg-gray-50 border-t p-2">
                        <IconButton title="View Details" onClick={() => handleView(member)}><Eye size={18} className="text-gray-600" /></IconButton>
                        <IconButton title="Edit Member" onClick={() => handleEdit(index)}><Edit3 size={18} className="text-blue-600" /></IconButton>
                        <IconButton title="Delete Member" onClick={() => handleDelete(index)}><Trash2 size={18} className="text-red-600" /></IconButton>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center text-gray-500 border-2 border-dashed rounded-xl h-full p-10">
                <Users size={48} className="mb-4" />
                <h3 className="text-xl font-semibold">No Team Members Found</h3>
                <p>Use the form on the left to add your first team member.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}