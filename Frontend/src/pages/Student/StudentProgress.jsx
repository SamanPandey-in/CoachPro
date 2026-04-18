import React from 'react';
import { Target, TrendingUp, Award } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Layout from '../../components/Layout/Layout';
import Card from '../../components/UI/Card';
import Badge from '../../components/UI/Badge';

const CHART_BRAND = 'var(--chart-brand)';
const CHART_MUTED = 'var(--chart-muted)';

const StudentProgress = () => {
  const progressData = [
    { month: 'Aug', score: 78 },
    { month: 'Sep', score: 81 },
    { month: 'Oct', score: 83 },
    { month: 'Nov', score: 85 },
    { month: 'Dec', score: 87 }
  ];

  return (
    <Layout role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Progress</h1>
          <p className="text-gray-400">Track your academic journey and achievements</p>
        </div>

        {/* Progress Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-gray-400 text-sm mb-1">Overall Improvement</p>
              <p className="text-4xl font-bold text-green-400">+12%</p>
              <p className="text-sm text-gray-400 mt-1">Since admission</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <Award className="w-8 h-8 text-gold mx-auto mb-2" />
              <p className="text-gray-400 text-sm mb-1">Rank Improvement</p>
              <p className="text-4xl font-bold text-gold">↑ 7</p>
              <p className="text-sm text-gray-400 mt-1">Positions moved up</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <Target className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-gray-400 text-sm mb-1">Goals Achieved</p>
              <p className="text-4xl font-bold text-primary">5/7</p>
              <p className="text-sm text-gray-400 mt-1">This semester</p>
            </div>
          </Card>
        </div>

        {/* Progress Chart */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Progress Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="score" stroke={CHART_BRAND} strokeWidth={3} dot={{ r: 5, fill: CHART_MUTED }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Subject Strengths */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Strengths</h3>
            <div className="space-y-3">
              {[
                { subject: 'Mathematics', score: 92 },
                { subject: 'Physics', score: 88 },
                { subject: 'English', score: 85 }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <span className="text-white font-medium">{item.subject}</span>
                  <Badge variant="success">{item.score}%</Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Areas to Improve</h3>
            <div className="space-y-3">
              {[
                { subject: 'Chemistry', score: 72 },
                { subject: 'Biology', score: 75 }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <span className="text-white font-medium">{item.subject}</span>
                  <Badge variant="warning">{item.score}%</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default StudentProgress;
