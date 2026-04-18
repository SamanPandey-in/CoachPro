import React, { useEffect, useState } from 'react';
import { TrendingUp, Award } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Layout from '../../components/Layout/Layout';
import Card from '../../components/UI/Card';
import Badge from '../../components/UI/Badge';
import { mockApi } from '../../api/mockData';

const CHART_BRAND = 'var(--chart-brand)';
const CHART_MUTED = 'var(--chart-muted)';

const StudentPerformance = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockApi.getStudentPerformance().then(result => {
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
            <p className="text-gray-400">Loading performance data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Performance</h1>
          <p className="text-gray-400">Detailed academic performance analysis</p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="text-center">
              <Award className="w-8 h-8 text-gold mx-auto mb-2" />
              <p className="text-gray-400 text-sm mb-1">Current Rank</p>
              <p className="text-4xl font-bold text-gold">#{data.overall.currentRank}</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-gray-400 text-sm mb-1">Overall Percentage</p>
              <p className="text-4xl font-bold text-green-400">{data.overall.overallPercentage}%</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <Award className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-gray-400 text-sm mb-1">Attendance</p>
              <p className="text-4xl font-bold text-primary">{data.overall.attendance}%</p>
            </div>
          </Card>
        </div>

        {/* Performance Trend */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Performance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="percentage" stroke={CHART_BRAND} strokeWidth={3} dot={{ r: 5, fill: CHART_MUTED }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Subject Performance */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Subject-wise Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.subjects}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="subject" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px' }} />
              <Bar dataKey="percentage" fill={CHART_BRAND} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Recent Tests */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Recent Test Results</h3>
          <div className="space-y-3">
            {data.tests.map((test) => (
              <div key={test.id} className="flex items-center justify-between p-4 bg-dark-200 rounded-lg hover:bg-dark-300 transition-colors">
                <div className="flex-1">
                  <h4 className="font-semibold text-white mb-1">{test.name}</h4>
                  <p className="text-sm text-gray-400">{test.subject} • {test.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gold">{test.marks}/{test.maxMarks}</p>
                  <Badge variant={test.grade === 'A' ? 'success' : 'primary'} size="sm">Grade {test.grade}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default StudentPerformance;
