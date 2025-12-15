// src/pages/PrivacyPolicy.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Shield,
    FileText,
    User,
    Database,
    Share2,
    Lock,
    Cookie,
    ExternalLink,
    Users,
    UserCheck,
    RefreshCw,
    Mail,
    Phone,
    MapPin,
    ChevronRight,
    ChevronUp,
    Calendar,
    Building2,
    ScrollText,
    Eye,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import { getPublicProfile } from './api/admin/profileAdminApi';
// import { getPublicProfile } from '../api/admin/profileAdminApi';

const PrivacyPolicy = () => {
    const [profile, setProfile] = useState(null);
    const [activeSection, setActiveSection] = useState('');
    const [showScrollTop, setShowScrollTop] = useState(false);

    // Fetch profile data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getPublicProfile();
                if (response.success && response.data) {
                    setProfile(response.data);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
        fetchProfile();
    }, []);

    // Handle scroll for active section and scroll-to-top button
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);

            // Update active section based on scroll position
            const sections = document.querySelectorAll('[data-section]');
            let currentSection = '';

            sections.forEach((section) => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 150) {
                    currentSection = section.getAttribute('data-section');
                }
            });

            setActiveSection(currentSection);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const offset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    // Table of contents data
    const tableOfContents = [
        { id: 'information-collect', title: 'Information We Collect', icon: Database },
        { id: 'how-we-use', title: 'How We Use Your Information', icon: Eye },
        { id: 'sharing', title: 'Sharing of Information', icon: Share2 },
        { id: 'security', title: 'Data Security', icon: Lock },
        { id: 'cookies', title: 'Cookies & Analytics', icon: Cookie },
        { id: 'third-party', title: 'Third-Party Links', icon: ExternalLink },
        { id: 'children', title: "Children's Privacy", icon: Users },
        { id: 'your-rights', title: 'Your Rights', icon: UserCheck },
        { id: 'updates', title: 'Policy Updates', icon: RefreshCw },
        { id: 'contact', title: 'Contact Information', icon: Mail },
    ];

    const effectiveDate = 'January 1, 2025';
    const ngoName = profile?.ngoName || 'Vasundhara Sanrakshan Samajik Sansthan';
    const ngoEmail = profile?.email || 'vasundhara6757@gmail.com';
    const ngoPhone = profile?.mobileNo || '+91-9425006757';
    const ngoAddress = profile?.address || 'MIG-355, H-Sector, Phase-I, Ayodhya Nagar, Bhopal (M.P.), India';

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-green-800 via-green-700 to-green-900 text-white">
                <div className="container mx-auto px-4 py-16 md:py-24">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Icon */}
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
                            <Shield className="w-10 h-10 text-green-300" />
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Privacy Policy
                        </h1>

                        {/* Organization Name */}
                        <p className="text-xl md:text-2xl text-green-200 font-medium mb-6">
                            {ngoName}
                        </p>

                        {/* Effective Date */}
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                            <Calendar className="w-4 h-4" />
                            <span>Effective Date: {effectiveDate}</span>
                        </div>

                        {/* Breadcrumb */}
                        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-green-200">
                            <Link to="/" className="hover:text-white transition-colors">
                                Home
                            </Link>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-white">Privacy Policy</span>
                        </div>
                    </div>
                </div>

                {/* Wave Divider */}
                <div className="relative h-16">
                    <svg
                        className="absolute bottom-0 w-full h-16 text-gray-50"
                        preserveAspectRatio="none"
                        viewBox="0 0 1440 54"
                        fill="currentColor"
                    >
                        <path d="M0 22L60 16.7C120 11 240 1 360 0.7C480 1 600 11 720 19.3C840 28 960 34 1080 33.3C1200 33 1320 27 1380 23.7L1440 21V54H1380C1320 54 1200 54 1080 54C960 54 840 54 720 54C600 54 480 54 360 54C240 54 120 54 60 54H0V22Z" />
                    </svg>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
                    {/* Sidebar - Table of Contents */}
                    <aside className="lg:w-72 flex-shrink-0">
                        <div className="lg:sticky lg:top-24 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                                <ScrollText className="w-5 h-5 text-green-600" />
                                <h2 className="font-bold text-gray-900">Table of Contents</h2>
                            </div>
                            <nav className="space-y-1">
                                {tableOfContents.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = activeSection === item.id;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => scrollToSection(item.id)}
                                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-all ${isActive
                                                    ? 'bg-green-50 text-green-700 font-medium'
                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                }`}
                                        >
                                            <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-green-600' : 'text-gray-400'}`} />
                                            <span className="truncate">{item.title}</span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        {/* Introduction Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-green-100 rounded-xl">
                                    <Building2 className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-3">About This Policy</h2>
                                    <p className="text-gray-600 leading-relaxed">
                                        <strong className="text-gray-900">{ngoName}</strong> ("we", "our", "us") is a non-profit voluntary social organization working in the fields of environmental protection, sanitation, social welfare, and government-supported development projects. We are committed to protecting the privacy and personal information of visitors, partners, beneficiaries, donors, vendors, and stakeholders who interact with our website.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Policy Sections */}
                        <div className="space-y-8">
                            {/* Section 1: Information We Collect */}
                            <section
                                id="information-collect"
                                data-section="information-collect"
                                className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Database className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">1. Information We Collect</h2>
                                </div>

                                <p className="text-gray-600 mb-6">
                                    We may collect the following types of information:
                                </p>

                                <div className="space-y-4">
                                    {/* Personal Information */}
                                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <User className="w-5 h-5 text-green-600" />
                                            <h3 className="font-semibold text-gray-900">Personal Information</h3>
                                        </div>
                                        <p className="text-gray-600 text-sm">
                                            Name, phone number, email address, postal address, organization details, and other information voluntarily submitted through forms, emails, registrations, or contact requests.
                                        </p>
                                    </div>

                                    {/* Project & Contract Information */}
                                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FileText className="w-5 h-5 text-purple-600" />
                                            <h3 className="font-semibold text-gray-900">Project & Contract Information</h3>
                                        </div>
                                        <p className="text-gray-600 text-sm">
                                            Information shared for government tenders, project execution, partnerships, or official correspondence.
                                        </p>
                                    </div>

                                    {/* Technical Information */}
                                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Database className="w-5 h-5 text-orange-600" />
                                            <h3 className="font-semibold text-gray-900">Technical Information</h3>
                                        </div>
                                        <p className="text-gray-600 text-sm">
                                            IP address, browser type, device information, and website usage data for analytics and security purposes.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 2: How We Use Your Information */}
                            <section
                                id="how-we-use"
                                data-section="how-we-use"
                                className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Eye className="w-5 h-5 text-green-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">2. How We Use Your Information</h2>
                                </div>

                                <p className="text-gray-600 mb-6">
                                    The information collected is used only for legitimate purposes, including:
                                </p>

                                <ul className="space-y-3">
                                    {[
                                        'Responding to inquiries and communication',
                                        'Managing NGO activities, programs, and services',
                                        'Participation in government projects, tenders, and contracts',
                                        'Legal, accounting, and administrative requirements',
                                        'Improving website functionality and user experience',
                                        'Complying with applicable laws and regulations',
                                    ].map((item, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-600">{item}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-amber-800 text-sm font-medium">
                                        We do not sell, rent, or trade personal information to third parties.
                                    </p>
                                </div>
                            </section>

                            {/* Section 3: Sharing of Information */}
                            <section
                                id="sharing"
                                data-section="sharing"
                                className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <Share2 className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">3. Sharing of Information</h2>
                                </div>

                                <p className="text-gray-600 mb-6">
                                    We may share information only when required:
                                </p>

                                <ul className="space-y-3">
                                    {[
                                        'With government authorities for project execution, compliance, or tenders',
                                        'With authorized partners or vendors involved in NGO operations',
                                        'When required by law, court order, or regulatory authority',
                                    ].map((item, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <ChevronRight className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-600">{item}</span>
                                        </li>
                                    ))}
                                </ul>

                                <p className="mt-4 text-gray-600 italic">
                                    All such sharing is done strictly for official and lawful purposes.
                                </p>
                            </section>

                            {/* Section 4: Data Security */}
                            <section
                                id="security"
                                data-section="security"
                                className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-red-100 rounded-lg">
                                        <Lock className="w-5 h-5 text-red-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">4. Data Security</h2>
                                </div>

                                <p className="text-gray-600 leading-relaxed">
                                    We take reasonable technical and administrative measures to protect personal data from unauthorized access, misuse, loss, or disclosure. However, no method of online transmission or electronic storage is 100% secure.
                                </p>

                                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[
                                        { icon: Shield, title: 'Encryption', desc: 'Secure data transmission' },
                                        { icon: Lock, title: 'Access Control', desc: 'Restricted data access' },
                                        { icon: RefreshCw, title: 'Regular Updates', desc: 'Security patches applied' },
                                    ].map((item, index) => {
                                        const Icon = item.icon;
                                        return (
                                            <div key={index} className="bg-gray-50 rounded-xl p-4 text-center">
                                                <Icon className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                                <h4 className="font-semibold text-gray-900 text-sm">{item.title}</h4>
                                                <p className="text-gray-500 text-xs mt-1">{item.desc}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* Section 5: Cookies & Analytics */}
                            <section
                                id="cookies"
                                data-section="cookies"
                                className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-orange-100 rounded-lg">
                                        <Cookie className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">5. Cookies & Analytics</h2>
                                </div>

                                <p className="text-gray-600 leading-relaxed">
                                    Our website may use cookies or basic analytics tools to understand visitor behavior and improve services. You may disable cookies through your browser settings if you prefer.
                                </p>

                                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                    <p className="text-blue-800 text-sm">
                                        <strong>Tip:</strong> You can manage cookie preferences in your browser's privacy settings.
                                    </p>
                                </div>
                            </section>

                            {/* Section 6: Third-Party Links */}
                            <section
                                id="third-party"
                                data-section="third-party"
                                className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-cyan-100 rounded-lg">
                                        <ExternalLink className="w-5 h-5 text-cyan-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">6. Third-Party Links</h2>
                                </div>

                                <p className="text-gray-600 leading-relaxed">
                                    Our website may contain links to government portals or third-party websites. We are not responsible for the privacy practices or content of such external sites.
                                </p>
                            </section>

                            {/* Section 7: Children's Privacy */}
                            <section
                                id="children"
                                data-section="children"
                                className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-pink-100 rounded-lg">
                                        <Users className="w-5 h-5 text-pink-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">7. Children's Privacy</h2>
                                </div>

                                <p className="text-gray-600 leading-relaxed">
                                    Our services and website are not intended for children under 18 years of age. We do not knowingly collect personal data from minors.
                                </p>
                            </section>

                            {/* Section 8: Your Rights */}
                            <section
                                id="your-rights"
                                data-section="your-rights"
                                className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-indigo-100 rounded-lg">
                                        <UserCheck className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">8. Your Rights</h2>
                                </div>

                                <p className="text-gray-600 mb-6">
                                    You may request to:
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
                                        <h4 className="font-semibold text-gray-900 mb-2">Access & Update</h4>
                                        <p className="text-gray-600 text-sm">
                                            Access, update, or correct your personal information at any time.
                                        </p>
                                    </div>
                                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-200">
                                        <h4 className="font-semibold text-gray-900 mb-2">Withdraw Consent</h4>
                                        <p className="text-gray-600 text-sm">
                                            Withdraw consent for data usage where applicable.
                                        </p>
                                    </div>
                                </div>

                                <p className="mt-4 text-gray-600 text-sm">
                                    Requests can be made via the contact details provided below.
                                </p>
                            </section>

                            {/* Section 9: Policy Updates */}
                            <section
                                id="updates"
                                data-section="updates"
                                className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-yellow-100 rounded-lg">
                                        <RefreshCw className="w-5 h-5 text-yellow-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">9. Policy Updates</h2>
                                </div>

                                <p className="text-gray-600 leading-relaxed">
                                    We reserve the right to update this Privacy Policy from time to time. Changes will be posted on this page with the updated effective date.
                                </p>

                                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                                    <Calendar className="w-4 h-4" />
                                    <span>Last updated: {effectiveDate}</span>
                                </div>
                            </section>

                            {/* Section 10: Contact Information */}
                            <section
                                id="contact"
                                data-section="contact"
                                className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl shadow-lg p-8 text-white"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <Mail className="w-5 h-5 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold">10. Contact Information</h2>
                                </div>

                                <p className="text-green-100 mb-6">
                                    For any questions or concerns regarding this Privacy Policy, please contact:
                                </p>

                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                                    <h3 className="font-bold text-xl mb-4">{ngoName}</h3>

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-green-200 text-sm font-medium">Head Office</p>
                                                <p className="text-white">{ngoAddress}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Mail className="w-5 h-5 text-green-300 flex-shrink-0" />
                                            <div>
                                                <p className="text-green-200 text-sm font-medium">Email</p>
                                                <a
                                                    href={`mailto:${ngoEmail}`}
                                                    className="text-white hover:text-green-200 transition-colors"
                                                >
                                                    {ngoEmail}
                                                </a>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Phone className="w-5 h-5 text-green-300 flex-shrink-0" />
                                            <div>
                                                <p className="text-green-200 text-sm font-medium">Phone</p>
                                                <a
                                                    href={`tel:${ngoPhone.replace(/\s/g, '')}`}
                                                    className="text-white hover:text-green-200 transition-colors"
                                                >
                                                    {ngoPhone}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex flex-wrap gap-4">
                                    <Link
                                        to="/contact-us"
                                        className="inline-flex items-center gap-2 bg-white text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
                                    >
                                        Contact Us
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                    <Link
                                        to="/terms"
                                        className="inline-flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors"
                                    >
                                        Terms of Service
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </section>
                        </div>

                        {/* Print Notice */}
                        <div className="mt-8 text-center text-gray-500 text-sm">
                            <p>
                                You can print this page for your records using your browser's print function (Ctrl/Cmd + P).
                            </p>
                        </div>
                    </main>
                </div>
            </div>

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 p-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all hover:scale-110 z-50"
                    aria-label="Scroll to top"
                >
                    <ChevronUp className="w-6 h-6" />
                </button>
            )}
        </div>
    );
};

export default PrivacyPolicy;