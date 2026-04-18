import React, { useEffect, useState } from 'react';
import { Calendar, TrendingUp } from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import Card from '../../components/UI/Card';
import Badge from '../../components/UI/Badge';
import { mockApi } from '../../api/mockData';

const StudentAttendance = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockApi.getStudentAttendance().then(result => {
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
            <p className="text-gray-400">Loading attendance data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Attendance</h1>
          <p className="text-gray-400">Track your attendance record</p>
        </div>

        {/* Overall Attendance */}
        <Card>
          <div className="text-center">
            <Calendar className="w-12 h-12 text-primary mx-auto mb-4" />
            <p className="text-gray-400 mb-2">Overall Attendance</p>
            <p className="text-6xl font-bold text-primary mb-2">{data.overall}%</p>
            <p className="text-sm text-gray-400">Keep it above 85% for eligibility</p>
          </div>
        </Card>

        {/* Attendance History */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Attendance History</h3>
          <div className="space-y-2">
            {data.history.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-3 bg-dark-200 rounded-lg">
                <div>
                  <p className="text-white font-medium">{record.date}</p>
                  <p className="text-sm text-gray-400">{record.batch}</p>
                </div>
                <Badge
                  variant={
                    record.status === 'present' ? 'success' :
                    record.status === 'late' ? 'warning' : 'danger'
                  }
                  size="sm"
                >
                  {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default StudentAttendance;
