// src/AdminPannel/Components/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Mail,
  Briefcase,
  DollarSign,
  IndianRupeeIcon,
  Activity,
  RefreshCcw,
  Clock,
  CheckCircle,
  AlertCircle,
  Image,
  Video,
  MapPin,
  Eye,
  Loader2,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  ArrowRight,
  Inbox,
  Receipt,
  FolderOpen,
  Layout,
} from "lucide-react";

// Import API functions
import {
  getDashboardStats,
  getQuickCounts,
  getRecentActivity,
  getInquiryAnalytics,
  getInvoiceAnalytics,
  formatCurrency,
  formatNumber,
  formatPercentage,
  getRelativeTime,
  getTrendInfo,
} from "../../api/admin/dashboardAdminApi";

/* ---------- Chart Colors ---------- */
const COLORS = {
  primary: "#22C55E",
  secondary: "#3B82F6",
  tertiary: "#F59E0B",
  quaternary: "#8B5CF6",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#06B6D4",
};

const PIE_COLORS = ["#22C55E", "#3B82F6", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4"];

/* ---------- Stat Card Component ---------- */
function StatCard({ title, value, subtitle, icon: Icon, trend, changePercent, color = "green", isLoading }) {
  const trendInfo = trend ? getTrendInfo(trend, changePercent) : null;

  const colorStyles = {
    green: "from-green-500 to-green-600",
    blue: "from-blue-500 to-blue-600",
    yellow: "from-yellow-500 to-yellow-600",
    purple: "from-purple-500 to-purple-600",
    red: "from-red-500 to-red-600",
    cyan: "from-cyan-500 to-cyan-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          {isLoading ? (
            <div className="h-8 w-20 bg-gray-200 animate-pulse rounded mt-2" />
          ) : (
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          )}
          {subtitle && (
            <div className="flex items-center gap-2 mt-2">
              {trendInfo && (
                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${trendInfo.bgColor} ${trendInfo.color}`}>
                  {trendInfo.icon} {trendInfo.text}
                </span>
              )}
              <p className="text-xs text-gray-500">{subtitle}</p>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorStyles[color]} text-white`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

/* ---------- Content Stat Card ---------- */
function ContentStatCard({ title, items, icon: Icon, color = "blue" }) {
  const colorStyles = {
    green: "bg-green-50 text-green-600",
    blue: "bg-blue-50 text-blue-600",
    yellow: "bg-yellow-50 text-yellow-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg ${colorStyles[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <h4 className="font-semibold text-gray-800">{title}</h4>
      </div>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{item.label}</span>
            <span className="font-semibold text-gray-900">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Activity Item ---------- */
function ActivityItem({ activity }) {
  const icons = {
    inquiry: <Mail className="w-4 h-4" />,
    invoice: <Receipt className="w-4 h-4" />,
    project: <FolderOpen className="w-4 h-4" />,
  };

  const colors = {
    inquiry: "bg-blue-100 text-blue-600",
    invoice: "bg-green-100 text-green-600",
    project: "bg-purple-100 text-purple-600",
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
      <div className={`p-2 rounded-lg ${colors[activity.type] || "bg-gray-100 text-gray-600"}`}>
        {icons[activity.type] || <Activity className="w-4 h-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
        <p className="text-xs text-gray-500">{activity.subtitle}</p>
      </div>
      <div className="text-xs text-gray-400 whitespace-nowrap">
        {getRelativeTime(activity.timestamp)}
      </div>
    </div>
  );
}

/* ---------- Quick Action Button ---------- */
function QuickActionButton({ label, icon: Icon, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`${color} w-full text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90 transition`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );
}

/* ---------- Main Dashboard Component ---------- */
export default function Dashboard() {
  const navigate = useNavigate();

  // State
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [inquiryAnalytics, setInquiryAnalytics] = useState(null);
  const [invoiceAnalytics, setInvoiceAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all dashboard data
  const fetchDashboardData = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const [statsResult, activityResult, inquiryResult, invoiceResult] = await Promise.all([
        getDashboardStats(),
        getRecentActivity(10),
        getInquiryAnalytics('30days'),
        getInvoiceAnalytics('12months'),
      ]);

      if (statsResult.success) {
        setStats(statsResult.data);
      }

      if (activityResult.success) {
        setActivities(activityResult.data.activities || []);
      }

      if (inquiryResult.success) {
        setInquiryAnalytics(inquiryResult.data);
      }

      if (invoiceResult.success) {
        setInvoiceAnalytics(invoiceResult.data);
      }

      setError(null);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Quick actions
  const quickActions = [
    { label: "Profile", icon: Users, color: "bg-green-600", path: "/admin/adminprofile" },
    { label: "About Us", icon: Layout, color: "bg-blue-600", path: "/admin/adminabout" },
    { label: "Our Work", icon: Briefcase, color: "bg-purple-600", path: "/admin/adminourwork" },
    { label: "Inquiries", icon: Mail, color: "bg-yellow-600", path: "/admin/admincontact" },
  ];

  // Prepare chart data
  const inquiryChartData = inquiryAnalytics?.chart?.inquiriesOverTime?.map(item => ({
    date: item.date.split('-').slice(1).join('/'), // Format: MM/DD
    total: item.count,
    new: item.newCount,
    read: item.readCount,
  })) || [];

  const revenueChartData = invoiceAnalytics?.chart?.revenueOverTime?.map(item => ({
    date: item.date,
    revenue: item.amountWithTax,
    invoices: item.invoiceCount,
  })) || [];

  const statusPieData = inquiryAnalytics?.distribution?.byStatus?.map(item => ({
    name: item.status,
    value: item.count,
  })) || [];

  const cityBarData = inquiryAnalytics?.distribution?.byCity?.slice(0, 5) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => fetchDashboardData()}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome back!</h2>
          <p className="text-gray-600">Here's what's happening with your organization today.</p>
        </div>
        <button
          onClick={() => fetchDashboardData(true)}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Inquiries"
          value={formatNumber(stats?.overview?.inquiries?.total)}
          subtitle="this month"
          icon={Mail}
          trend={stats?.overview?.inquiries?.trend}
          changePercent={stats?.overview?.inquiries?.changePercent}
          color="blue"
          isLoading={isLoading}
        />
        <StatCard
          title="New Inquiries"
          value={formatNumber(stats?.overview?.inquiries?.new)}
          subtitle="pending response"
          icon={Inbox}
          color="yellow"
          isLoading={isLoading}
        />
        <StatCard
          title="Total Invoices"
          value={formatNumber(stats?.overview?.invoices?.total)}
          subtitle="this month"
          icon={Receipt}
          trend={stats?.overview?.invoices?.trend}
          changePercent={stats?.overview?.invoices?.changePercent}
          color="green"
          isLoading={isLoading}
        />
        <StatCard
          title="Revenue"
          value={formatCurrency(stats?.overview?.revenue?.thisMonth)}
          subtitle="this month"
          icon={IndianRupeeIcon}
          trend={stats?.overview?.revenue?.trend}
          changePercent={stats?.overview?.revenue?.changePercent}
          color="purple"
          isLoading={isLoading}
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Inquiries Over Time */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Inquiries Trend</h3>
            <span className="text-xs text-gray-500">Last 30 days</span>
          </div>
          {inquiryChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={inquiryChartData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.secondary} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS.secondary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke={COLORS.secondary}
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-400">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                <p>No inquiry data available</p>
              </div>
            </div>
          )}
        </div>

        {/* Revenue Over Time */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Revenue Trend</h3>
            <span className="text-xs text-gray-500">Last 12 months</span>
          </div>
          {revenueChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(value) => [formatCurrency(value), 'Revenue']}
                  contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke={COLORS.primary}
                  strokeWidth={3}
                  dot={{ r: 4, fill: COLORS.primary }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-400">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                <p>No revenue data available</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Distribution Charts & Quick Actions Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Inquiry Status Pie Chart */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Inquiry Status</h3>
          {statusPieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-gray-400">
              <PieChartIcon className="w-12 h-12" />
            </div>
          )}
        </div>

        {/* Top Cities Bar Chart */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Inquiries by City</h3>
          {cityBarData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={cityBarData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="city" tick={{ fontSize: 12 }} width={80} />
                <Tooltip />
                <Bar dataKey="count" fill={COLORS.secondary} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-gray-400">
              <MapPin className="w-12 h-12" />
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {quickActions.map((action, i) => (
              <QuickActionButton
                key={i}
                label={action.label}
                icon={action.icon}
                color={action.color}
                onClick={() => navigate(action.path)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content Stats & Recent Activity Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Content Stats */}
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
          <ContentStatCard
            title="Home Page"
            icon={Layout}
            color="green"
            items={[
              { label: "Hero Slides", value: stats?.content?.home?.heroSlides || 0 },
              { label: "Stats", value: stats?.content?.home?.stats || 0 },
              { label: "About Items", value: stats?.content?.home?.aboutItems || 0 },
              { label: "Videos", value: stats?.content?.home?.videos || 0 },
            ]}
          />
          <ContentStatCard
            title="About Us Page"
            icon={Users}
            color="blue"
            items={[
              { label: "Hero Images", value: stats?.content?.aboutUs?.heroImages || 0 },
              { label: "Areas", value: stats?.content?.aboutUs?.areas || 0 },
            ]}
          />
          <ContentStatCard
            title="Vision & Mission"
            icon={Eye}
            color="purple"
            items={[
              { label: "Total Items", value: stats?.content?.visionMission?.items || 0 },
            ]}
          />
          <ContentStatCard
            title="Our Work"
            icon={Briefcase}
            color="yellow"
            items={[
              { label: "Projects", value: stats?.content?.ourWork?.projects || 0 },
            ]}
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Recent Activity</h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-1 max-h-[300px] overflow-y-auto">
            {activities.length > 0 ? (
              activities.map((activity, idx) => (
                <ActivityItem key={idx} activity={activity} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Clock className="w-10 h-10 mx-auto mb-2" />
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-5 rounded-xl shadow-sm">
          <p className="text-green-100 text-sm">Total Revenue</p>
          <p className="text-2xl font-bold mt-1">
            {formatCurrency(stats?.overview?.revenue?.total)}
          </p>
          <p className="text-green-200 text-xs mt-2">All time</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-5 rounded-xl shadow-sm">
          <p className="text-blue-100 text-sm">This Year</p>
          <p className="text-2xl font-bold mt-1">
            {formatCurrency(stats?.overview?.revenue?.thisYear)}
          </p>
          <p className="text-blue-200 text-xs mt-2">Year to date</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-5 rounded-xl shadow-sm">
          <p className="text-purple-100 text-sm">This Month</p>
          <p className="text-2xl font-bold mt-1">
            {formatCurrency(stats?.overview?.revenue?.thisMonth)}
          </p>
          <p className="text-purple-200 text-xs mt-2">
            {stats?.overview?.revenue?.trend === 'up' ? '↑' : '↓'} {formatPercentage(stats?.overview?.revenue?.changePercent)} vs last month
          </p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-5 rounded-xl shadow-sm">
          <p className="text-yellow-100 text-sm">Projects</p>
          <p className="text-2xl font-bold mt-1">
            {formatNumber(stats?.overview?.projects?.total)}
          </p>
          <p className="text-yellow-200 text-xs mt-2">Active projects</p>
        </div>
      </div>

      {/* System Info Footer */}
      {/* <div className="bg-gray-50 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {stats?.system?.totalUsers || 0} Users
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Last updated: {stats?.system?.lastUpdated ? new Date(stats.system.lastUpdated).toLocaleTimeString() : '-'}
          </span>
        </div>
        <button
          onClick={() => navigate('/admin/adminsettings')}
          className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
        >
          View Settings <ArrowRight className="w-4 h-4" />
        </button>
      </div> */}
    </div>
  );
}