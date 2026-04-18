import React, { useEffect, useState } from 'react';
import { Brain, TrendingUp, AlertTriangle, Target, Lightbulb } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Layout from '../../components/Layout/Layout';
import Card from '../../components/UI/Card';
import Badge from '../../components/UI/Badge';
import { mockApi } from '../../api/mockData';

const CHART_BRAND = 'var(--chart-brand)';

const AdminAIInsights = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockApi.getAIInsights().then(result => {
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
            <p className="text-gray-400">Loading AI insights...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout role="admin">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">AI-Powered Insights</h1>
            <div className="flex items-center gap-2">
              <p className="text-gray-400">Intelligent predictions and recommendations</p>
              <Badge variant="primary" size="sm">Beta</Badge>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-primary/30">
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-3xl font-bold text-white mb-1">{data.predictedToppers.length}</p>
              <p className="text-sm text-gray-400">Predicted Toppers</p>
            </div>
          </Card>
          <Card className="border-yellow-500/30">
            <div className="text-center">
              <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-3xl font-bold text-white mb-1">{data.atRiskStudents.length}</p>
              <p className="text-sm text-gray-400">At-Risk Students</p>
            </div>
          </Card>
          <Card className="border-purple-500/30">
            <div className="text-center">
              <Target className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <p className="text-3xl font-bold text-white mb-1">{data.weakAreas.length}</p>
              <p className="text-sm text-gray-400">Weak Areas</p>
            </div>
          </Card>
          <Card className="border-green-500/30">
            <div className="text-center">
              <Lightbulb className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-3xl font-bold text-white mb-1">{data.recommendations.length}</p>
              <p className="text-sm text-gray-400">Recommendations</p>
            </div>
          </Card>
        </div>

        {/* Predicted Toppers */}
        <Card className="border-primary/30">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold text-white">Predicted Toppers</h3>
          </div>
          <div className="space-y-3">
            {data.predictedToppers.map((student) => (
              <div key={student.studentId} className="bg-dark-200 rounded-lg p-4 flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-white mb-1">{student.name}</h4>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-400">Current: <span className="text-white">#{student.currentRank}</span></span>
                    <span className="text-gray-400">Predicted: <span className="text-gold font-semibold">#{student.predictedRank}</span></span>
                    <span className="text-green-400">↑ {student.improvement} ranks</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{student.confidence}%</p>
                  <p className="text-xs text-gray-400">Confidence</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* At-Risk Students */}
        <Card className="border-yellow-500/30">
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <h3 className="text-xl font-semibold text-white">At-Risk Students</h3>
          </div>
          <div className="space-y-3">
            {data.atRiskStudents.map((student) => (
              <div key={student.studentId} className="bg-dark-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-white mb-1">{student.name}</h4>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-400">Rank: #{student.rank}</span>
                      <span className="text-gray-400">Score: {student.percentage}%</span>
                      <span className="text-gray-400">Attendance: {student.attendance}%</span>
                    </div>
                  </div>
                  <Badge variant="danger" size="sm">Alert</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {student.riskFactors.map((factor, idx) => (
                    <Badge key={idx} variant="warning" size="sm">{factor}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Performance Forecast */}
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <h3 className="text-xl font-semibold text-white">Performance Forecast</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.performanceForecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="predicted" stroke={CHART_BRAND} strokeWidth={3} dot={{ r: 5 }} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Weak Areas & Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="flex items-center gap-2 mb-6">
              <Target className="w-5 h-5 text-purple-500" />
              <h3 className="text-lg font-semibold text-white">Weak Areas Identified</h3>
            </div>
            <div className="space-y-3">
              {data.weakAreas.map((area, idx) => (
                <div key={idx} className="bg-dark-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">{area.subject} - {area.topic}</h4>
                    <Badge variant="danger" size="sm">{area.studentsStruggling} students</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-400">Avg Score: <span className="text-red-400 font-semibold">{area.avgScore}%</span></span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-6">
              <Lightbulb className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-semibold text-white">AI Recommendations</h3>
            </div>
            <div className="space-y-3">
              {data.recommendations.map((rec, idx) => (
                <div key={idx} className="bg-dark-200 rounded-lg p-4">
                  <Badge variant="primary" size="sm" className="mb-2">{rec.category}</Badge>
                  <p className="text-white">{rec.message}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AdminAIInsights;
