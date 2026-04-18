import React, { useEffect, useState } from 'react';
import { Award, TrendingUp, Calendar, ClipboardList, Brain } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Layout from '../../components/Layout/Layout';
import StatCard from '../../components/UI/StatCard';
import Card from '../../components/UI/Card';
import Badge from '../../components/UI/Badge';
import { mockApi } from '../../api/mockData';

const CHART_BRAND = 'var(--chart-brand)';
const CHART_MUTED = 'var(--chart-muted)';

const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockApi.getStudentDashboard().then(result => {
      setData(result);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <Layout role="student">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const getRankColor = (rank) => {
    if (rank <= 3) return 'text-gold';
    if (rank <= 10) return 'text-primary';
    return 'text-white';
  };

  return (
    <Layout role="student">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {JSON.parse(localStorage.getItem('user'))?.name}!
          </h1>
          <p className="text-gray-400">Here's what's happening with your academics today</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Award}
            label="Current Rank"
            value={`#${data.stats.currentRank}`}
            change="+2 from last month"
          />
          <StatCard
            icon={TrendingUp}
            label="Overall Percentage"
            value={`${data.stats.overallPercentage}%`}
            change="+5.2% from last month"
          />
          <StatCard
            icon={Calendar}
            label="Attendance"
            value={`${data.stats.attendance}%`}
            change="+3.1% from last month"
          />
          <StatCard
            icon={ClipboardList}
            label="Pending Assignments"
            value={data.stats.pendingAssignments}
            change="2 due this week"
          />
        </div>

        {/* Performance Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Trend */}
          <Card className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-white">Performance Trend</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.performanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px' }}
                  labelStyle={{ color: '#ffffff' }}
                />
                <Line type="monotone" dataKey="percentage" stroke={CHART_BRAND} strokeWidth={3} dot={{ r: 5, fill: CHART_MUTED }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Subject Performance */}
          <Card>
            <div className="flex items-center gap-2 mb-6">
              <Award className="w-5 h-5 text-gold" />
              <h3 className="text-lg font-semibold text-white">Subject Performance</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.subjectPerformance} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis type="number" stroke="#9ca3af" />
                <YAxis type="category" dataKey="subject" stroke="#9ca3af" width={80} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px' }}
                />
                <Bar dataKey="percentage" fill={CHART_BRAND} radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Recent Tests & Upcoming Assignments Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Tests */}
          <Card>
            <div className="flex items-center gap-2 mb-6">
              <Award className="w-5 h-5 text-gold" />
              <h3 className="text-lg font-semibold text-white">Recent Tests</h3>
            </div>
            
            <div className="space-y-3">
              {data.recentTests.map((test) => (
                <div
                  key={test.id}
                  className="bg-dark-200 rounded-lg p-4 hover:bg-dark-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{test.name}</h4>
                      <p className="text-sm text-gray-400">{test.subject}</p>
                    </div>
                    <Badge variant={test.grade === 'A' ? 'success' : 'warning'}>
                      Grade {test.grade}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{test.date}</span>
                    <span className="text-gold font-semibold">
                      {test.marks}/{test.maxMarks}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Upcoming Assignments */}
          <Card>
            <div className="flex items-center gap-2 mb-6">
              <ClipboardList className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-semibold text-white">Upcoming Assignments</h3>
            </div>
            
            <div className="space-y-3">
              {data.upcomingAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="bg-dark-200 rounded-lg p-4 hover:bg-dark-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{assignment.title}</h4>
                      <p className="text-sm text-gray-400">{assignment.subject}</p>
                    </div>
                    <Badge 
                      variant={assignment.daysRemaining <= 2 ? 'danger' : 'warning'}
                      size="sm"
                    >
                      {assignment.daysRemaining}d left
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Due: {assignment.dueDate}</span>
                    <Badge variant="default" size="sm">{assignment.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* AI Study Suggestions */}
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
          <div className="flex items-center gap-2 mb-6">
            <Brain className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold text-white">AI Study Suggestions</h3>
            <Badge variant="primary" size="sm">Beta</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-6">
              <h4 className="font-semibold text-primary mb-2">Focus Areas</h4>
              <p className="text-sm text-gray-300">
                Spend more time on Calculus and Thermodynamics to improve your overall score
              </p>
            </div>
            
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
              <h4 className="font-semibold text-green-500 mb-2">Strong Subjects</h4>
              <p className="text-sm text-gray-300">
                Excellent performance in Mathematics and Physics. Keep up the good work!
              </p>
            </div>
            
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
              <h4 className="font-semibold text-yellow-500 mb-2">Study Schedule</h4>
              <p className="text-sm text-gray-300">
                Maintain consistent study hours. Your performance improves with regular practice
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default StudentDashboard;
