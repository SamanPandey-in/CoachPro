import React, { useEffect, useState } from 'react';
import { Users, UserCheck, Award, TrendingUp, Brain, AlertTriangle, CheckCircle } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Layout from '../../components/Layout/Layout';
import StatCard from '../../components/UI/StatCard';
import Card from '../../components/UI/Card';
import Badge from '../../components/UI/Badge';
import { mockApi } from '../../api/mockData';

const CHART_BRAND = 'var(--chart-brand)';
const CHART_MUTED = 'var(--chart-muted)';
const CHART_ABSENT = '#E2E8F0';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockApi.getAdminDashboard().then(result => {
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
            <p className="text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout role="admin">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Complete overview of your coaching institute</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Users}
            label="Total Students"
            value={data.stats.totalStudents}
            change={data.stats.trends.students}
          />
          <StatCard
            icon={UserCheck}
            label="Total Teachers"
            value={data.stats.totalTeachers}
            change={data.stats.trends.teachers}
          />
          <StatCard
            icon={Award}
            label="Average Performance"
            value={`${data.stats.avgPerformance}%`}
            change={data.stats.trends.performance}
          />
          <StatCard
            icon={TrendingUp}
            label="Attendance Rate"
            value={`${data.stats.attendanceRate}%`}
            change={data.stats.trends.attendance}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Batch Performance */}
          <Card className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-white">Batch-wise Performance</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.batchPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="batch" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px' }}
                  labelStyle={{ color: '#ffffff' }}
                />
                <Bar dataKey="performance" fill={CHART_BRAND} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Attendance Distribution */}
          <Card>
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-semibold text-white">Attendance Today</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Present', value: data.attendanceToday.present },
                    { name: 'Absent', value: data.attendanceToday.absent }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill={CHART_BRAND} />
                  <Cell fill={CHART_ABSENT} />
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Growth Trend */}
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-semibold text-white">Growth Trend</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.growthTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px' }}
                labelStyle={{ color: '#ffffff' }}
              />
              <Legend />
              <Line type="monotone" dataKey="students" stroke={CHART_BRAND} strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="teachers" stroke={CHART_MUTED} strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Students */}
          <Card>
            <div className="flex items-center gap-2 mb-6">
              <Award className="w-5 h-5 text-gold" />
              <h3 className="text-lg font-semibold text-white">Top Performing Students</h3>
            </div>
            <div className="space-y-3">
              {data.topStudents.map((student) => (
                <div
                  key={student.rank}
                  className="flex items-center gap-4 p-4 bg-dark-200 rounded-xl hover:bg-dark-300 transition-colors"
                >
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                    ${student.rank === 1 ? 'bg-yellow-500 text-dark' : 
                      student.rank === 2 ? 'bg-gray-400 text-dark' : 
                      student.rank === 3 ? 'bg-orange-600 text-white' : 
                      'bg-dark-300 text-gray-400'}
                  `}>
                    #{student.rank}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white">{student.name}</p>
                    <p className="text-sm text-gray-400">{student.batch}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gold">{student.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Teacher Performance */}
          <Card>
            <div className="flex items-center gap-2 mb-6">
              <UserCheck className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-white">Teacher Performance</h3>
            </div>
            <div className="space-y-3">
              {data.teacherPerformance.map((teacher, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-dark-200 rounded-xl hover:bg-dark-300 transition-colors"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-gold to-primary rounded-full flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white">{teacher.name}</p>
                    <p className="text-sm text-gray-400">{teacher.subject}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-300">{teacher.lectures}</p>
                    <p className="text-xs text-gray-500">Lectures</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gold">★ {teacher.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* AI Insights */}
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
          <div className="flex items-center gap-2 mb-6">
            <Brain className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold text-white">AI-Powered Insights</h3>
            <Badge variant="primary" size="sm">Beta</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-6">
              <TrendingUp className="w-8 h-8 text-primary mb-3" />
              <h4 className="font-semibold text-primary mb-2">Predicted Toppers</h4>
              <p className="text-sm text-gray-300">{data.aiInsights.predictedToppers}</p>
            </div>
            
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
              <AlertTriangle className="w-8 h-8 text-yellow-500 mb-3" />
              <h4 className="font-semibold text-yellow-500 mb-2">At-Risk Students</h4>
              <p className="text-sm text-gray-300">{data.aiInsights.atRiskStudents}</p>
            </div>
            
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
              <CheckCircle className="w-8 h-8 text-green-500 mb-3" />
              <h4 className="font-semibold text-green-500 mb-2">Batch Health</h4>
              <p className="text-sm text-gray-300">{data.aiInsights.batchHealth}</p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
