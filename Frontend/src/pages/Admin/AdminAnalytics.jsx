import React, { useEffect, useState } from 'react';
import { TrendingUp, Users, Award, Calendar, BarChart3 } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Layout from '../../components/Layout/Layout';
import StatCard from '../../components/UI/StatCard';
import Card from '../../components/UI/Card';
import { mockApi } from '../../api/mockData';

const CHART_BRAND = 'var(--chart-brand)';
const CHART_MUTED = 'var(--chart-muted)';
const CHART_ABSENT = '#E2E8F0';

const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockApi.getAnalytics().then(result => {
      setData(result);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <Layout role="admin">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading analytics...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-gray-400">Comprehensive performance and attendance analytics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-gold">{data.overview.totalRevenue}</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-1">New Admissions</p>
              <p className="text-2xl font-bold text-primary">{data.overview.newAdmissions}</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-1">Avg Attendance</p>
              <p className="text-2xl font-bold text-green-400">{data.overview.avgAttendance}%</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-1">Pass Percentage</p>
              <p className="text-2xl font-bold text-purple-400">{data.overview.passPercentage}%</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-1">Top Batch</p>
              <p className="text-2xl font-bold text-white">{data.overview.topBatch}</p>
            </div>
          </Card>
        </div>

        {/* Student Growth */}
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-white">Student Growth</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.studentGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="students" stroke={CHART_BRAND} fill={CHART_BRAND} fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Performance Distribution & Attendance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="flex items-center gap-2 mb-6">
              <Award className="w-5 h-5 text-gold" />
              <h3 className="text-lg font-semibold text-white">Performance Distribution</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.performanceDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="range" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px' }} />
                <Bar dataKey="count" fill={CHART_BRAND} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-semibold text-white">Attendance Distribution</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={data.attendanceDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {data.attendanceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? CHART_BRAND : CHART_ABSENT} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Subject Performance */}
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-white">Subject-wise Performance</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.subjectPerformance} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis type="number" stroke="#9ca3af" />
              <YAxis type="category" dataKey="subject" stroke="#9ca3af" width={100} />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px' }} />
              <Bar dataKey="avgScore" fill={CHART_MUTED} radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminAnalytics;
