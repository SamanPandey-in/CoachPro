import React, { useMemo, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import PageHeader from '../../components/UI/PageHeader';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const StudentProgress = () => {
  const [goals, setGoals] = useLocalStorage('student-study-goals', []);
  const [goalForm, setGoalForm] = useState({ title: '', subject: '', targetScore: '', currentScore: '' });

  const addGoal = () => {
    if (!goalForm.title || !goalForm.targetScore) return;
    const payload = {
      id: Date.now(),
      title: goalForm.title,
      subject: goalForm.subject || 'General',
      targetScore: Number(goalForm.targetScore),
      currentScore: Number(goalForm.currentScore || 0),
    };
    setGoals([payload, ...(goals || [])]);
    setGoalForm({ title: '', subject: '', targetScore: '', currentScore: '' });
  };

  const completion = (goal) => {
    if (!goal.targetScore || goal.targetScore <= 0) return 0;
    return Math.min(100, Math.round((goal.currentScore / goal.targetScore) * 100));
  };

  const avgCompletion = useMemo(() => {
    if (!(goals || []).length) return 0;
    const total = goals.reduce((sum, g) => sum + completion(g), 0);
    return Math.round(total / goals.length);
  }, [goals]);

  return (
    <Layout role="student">
      <div className="space-y-6">
        <PageHeader title="Study Goals" subtitle="Client-side personal goals and completion tracking" />

        <Card>
          <h3 className="font-semibold mb-3">Create Goal</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input value={goalForm.title} onChange={(e) => setGoalForm((p) => ({ ...p, title: e.target.value }))} placeholder="Goal title" className="h-10 px-3 rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark" />
            <input value={goalForm.subject} onChange={(e) => setGoalForm((p) => ({ ...p, subject: e.target.value }))} placeholder="Subject" className="h-10 px-3 rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark" />
            <input type="number" value={goalForm.targetScore} onChange={(e) => setGoalForm((p) => ({ ...p, targetScore: e.target.value }))} placeholder="Target score" className="h-10 px-3 rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark" />
            <input type="number" value={goalForm.currentScore} onChange={(e) => setGoalForm((p) => ({ ...p, currentScore: e.target.value }))} placeholder="Current score" className="h-10 px-3 rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark" />
          </div>
          <div className="mt-3 flex justify-end">
            <Button onClick={addGoal}>Add Goal</Button>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold mb-2">Overall Completion</h3>
          <p className="text-2xl font-bold mb-3">{avgCompletion}%</p>
          <div className="h-3 rounded-full bg-border dark:bg-border-dark overflow-hidden">
            <div className="h-full bg-brand" style={{ width: `${avgCompletion}%` }} />
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(goals || []).length === 0 && <Card><p className="text-sm text-text-muted dark:text-text-muted-dark">No goals yet.</p></Card>}
          {(goals || []).map((goal) => {
            const pct = completion(goal);
            return (
              <Card key={goal.id}>
                <h4 className="font-semibold">{goal.title}</h4>
                <p className="text-sm text-text-muted dark:text-text-muted-dark mb-2">{goal.subject}</p>
                <p className="text-sm mb-2">{goal.currentScore} / {goal.targetScore}</p>
                <div className="h-2 rounded-full bg-border dark:bg-border-dark overflow-hidden mb-2">
                  <div className="h-full bg-brand" style={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs text-text-muted dark:text-text-muted-dark">{pct}% completed</p>
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default StudentProgress;
