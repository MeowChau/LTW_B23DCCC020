import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Book, Clock, Target, Plus, Trash2, Edit, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const defaultSubjects = [
  { id: '1', name: 'Toán' },
  { id: '2', name: 'Văn' },
  { id: '3', name: 'Anh' },
  { id: '4', name: 'Khoa học' },
  { id: '5', name: 'Công nghệ' },
];

const Bai2 = () => {
  const [activeTab, setActiveTab] = useState('progress');
  const [subjects, setSubjects] = useState(() => JSON.parse(localStorage.getItem('subjects')) || defaultSubjects);
  const [sessions, setSessions] = useState(() => JSON.parse(localStorage.getItem('sessions')) || []);
  const [goals, setGoals] = useState(() => JSON.parse(localStorage.getItem('goals')) || {});

  useEffect(() => { localStorage.setItem('subjects', JSON.stringify(subjects)); }, [subjects]);
  useEffect(() => { localStorage.setItem('sessions', JSON.stringify(sessions)); }, [sessions]);
  useEffect(() => { localStorage.setItem('goals', JSON.stringify(goals)); }, [goals]);

  // Subject Management
  const [subjectName, setSubjectName] = useState('');
  const addSubject = (e) => {
    e.preventDefault();
    if (!subjectName.trim()) return;
    setSubjects([...subjects, { id: Date.now().toString(), name: subjectName }]);
    setSubjectName('');
  };
  const deleteSubject = (id) => {
    if(window.confirm('Xóa môn học này sẽ không xóa các lịch sử học. Bạn có chắc không?')) {
      setSubjects(subjects.filter(s => s.id !== id));
    }
  };

  // Progress Management
  const [sessionForm, setSessionForm] = useState({ subjectId: '', date: '', duration: '', content: '', notes: '' });
  const addSession = (e) => {
    e.preventDefault();
    if (!sessionForm.subjectId || !sessionForm.date || !sessionForm.duration) return alert("Vui lòng điền đủ thông tin bắt buộc!");
    setSessions([{ ...sessionForm, id: Date.now().toString() }, ...sessions]);
    setSessionForm({ subjectId: '', date: '', duration: '', content: '', notes: '' });
  };
  const deleteSession = (id) => {
    if(window.confirm('Xóa lịch sử học này?')) setSessions(sessions.filter(s => s.id !== id));
  };

  // Goals & Stats Management
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const [goalForm, setGoalForm] = useState({ month: currentMonth, subjectId: 'total', targetValue: '', unit: 'minutes' });
  const [statsMonth, setStatsMonth] = useState(currentMonth);

  const getStatsData = () => {
    const monthSessions = sessions.filter(s => s.date.startsWith(statsMonth));
    const dataMap = {};
    monthSessions.forEach(s => {
      if (!dataMap[s.subjectId]) dataMap[s.subjectId] = 0;
      dataMap[s.subjectId] += parseInt(s.duration || 0, 10);
    });
    
    return Object.keys(dataMap).map(subId => {
      const subName = subjects.find(s => s.id === subId)?.name || 'Môn đã xóa';
      return { name: subName, value: dataMap[subId] };
    });
  };
  const statsData = getStatsData();
  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4'];
  
  const setGoal = (e) => {
    e.preventDefault();
    if (!goalForm.targetValue) return;
    const currentGoals = { ...goals };
    if (!currentGoals[goalForm.month]) currentGoals[goalForm.month] = {};
    const val = parseFloat(goalForm.targetValue);
    currentGoals[goalForm.month][goalForm.subjectId] = goalForm.unit === 'hours' ? Math.round(val * 60) : Math.round(val);
    setGoals(currentGoals);
    setGoalForm({...goalForm, targetValue: ''});
  };

  // Calculate Progress
  const calculateProgress = (month, subjectId) => {
    const monthSessions = sessions.filter(s => s.date.startsWith(month));
    const totalMinutes = monthSessions
      .filter(s => subjectId === 'total' || s.subjectId === subjectId)
      .reduce((acc, curr) => acc + parseInt(curr.duration || 0), 0);
    
    const targetMinutes = goals[month]?.[subjectId] || 0;
    const percentage = targetMinutes === 0 ? 0 : Math.min(100, (totalMinutes / targetMinutes) * 100);
    
    return { totalMinutes, targetMinutes, percentage };
  };

  return (
    <div>
      <Link to="/" className="btn btn-outline back-btn">
        <ArrowLeft size={16} /> Quay lại menu chọn bài
      </Link>

      <div className="glass-card bai2-layout">
        
        {/* Sidebar */}
        <div className="sidebar">
          <h2 className="mb-4">Quản lý Học tập</h2>
          <button className={`tab-btn flex items-center gap-4 ${activeTab === 'progress' ? 'active' : ''}`} onClick={() => setActiveTab('progress')}>
            <Clock size={20} /> Tiến độ học tập
          </button>
          <button className={`tab-btn flex items-center gap-4 ${activeTab === 'subjects' ? 'active' : ''}`} onClick={() => setActiveTab('subjects')}>
            <Book size={20} /> Danh mục môn học
          </button>
          <button className={`tab-btn flex items-center gap-4 ${activeTab === 'goals' ? 'active' : ''}`} onClick={() => setActiveTab('goals')}>
            <Target size={20} /> Mục tiêu tháng
          </button>
          <button className={`tab-btn flex items-center gap-4 ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>
            <PieChartIcon size={20} /> Thống kê
          </button>
        </div>

        {/* Content Area */}
        <div className="content-area" style={{ flex: 1 }}>
          
          {activeTab === 'subjects' && (
            <div>
              <h3>Danh mục môn học</h3>
              <form onSubmit={addSubject} className="form-row mb-4 mt-4">
                <input type="text" className="input-field" placeholder="Tên môn học mới" value={subjectName} onChange={e => setSubjectName(e.target.value)} />
                <button type="submit" className="btn btn-primary"><Plus size={16}/> Thêm</button>
              </form>
              <div className="grid gap-4">
                {subjects.map(s => (
                  <div key={s.id} className="list-item">
                    <span>{s.name}</span>
                    <button onClick={() => deleteSubject(s.id)} className="btn btn-danger" style={{padding: '0.5rem'}}><Trash2 size={16}/></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'progress' && (
            <div>
              <h3>Tiến độ học tập</h3>
              <form onSubmit={addSession} className="glass-card mb-4 mt-4" style={{ padding: '1.5rem' }}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="input-group">
                    <label>Môn học *</label>
                    <select className="input-field" value={sessionForm.subjectId} onChange={e => setSessionForm({...sessionForm, subjectId: e.target.value})}>
                      <option value="">-- Chọn môn học --</option>
                      {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Ngày học *</label>
                    <input type="date" className="input-field" value={sessionForm.date} onChange={e => setSessionForm({...sessionForm, date: e.target.value})} />
                  </div>
                </div>
                <div className="input-group">
                  <label>Thời lượng (phút) *</label>
                  <input type="number" className="input-field" value={sessionForm.duration} onChange={e => setSessionForm({...sessionForm, duration: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>Nội dung đã học</label>
                  <input type="text" className="input-field" value={sessionForm.content} onChange={e => setSessionForm({...sessionForm, content: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>Ghi chú</label>
                  <input type="text" className="input-field" value={sessionForm.notes} onChange={e => setSessionForm({...sessionForm, notes: e.target.value})} />
                </div>
                <button type="submit" className="btn btn-primary"><Plus size={16}/> Lưu buổi học</button>
              </form>

              <h4>Lịch sử học tập gần đây</h4>
              <div className="grid gap-4 mt-2">
                {sessions.map(s => {
                  const sub = subjects.find(x => x.id === s.subjectId);
                  return (
                    <div key={s.id} className="list-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <div className="flex justify-between items-center w-100" style={{ width: '100%' }}>
                        <strong>{sub ? sub.name : 'Môn đã xóa'} - {s.date}</strong>
                        <div className="flex items-center gap-4">
                          <span className="badge success">{s.duration} phút</span>
                          <button onClick={() => deleteSession(s.id)} className="btn btn-danger" style={{padding: '0.4rem'}}><Trash2 size={14}/></button>
                        </div>
                      </div>
                      <p style={{fontSize: '0.9rem', color: 'var(--text-muted)'}}>Nội dung: {s.content || 'N/A'}</p>
                      {s.notes && <p style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>Ghi chú: {s.notes}</p>}
                    </div>
                  );
                })}
                {sessions.length === 0 && <p className="text-muted">Chưa có dữ liệu.</p>}
              </div>
            </div>
          )}

          {activeTab === 'goals' && (
            <div>
              <h3>Mục tiêu học tập hàng tháng</h3>
              
              <form onSubmit={setGoal} className="glass-card mb-4 mt-4 form-row" style={{ padding: '1.5rem' }}>
                <div className="input-group mb-0">
                  <label>Tháng</label>
                  <input type="month" className="input-field" value={goalForm.month} onChange={e => setGoalForm({...goalForm, month: e.target.value})} />
                </div>
                <div className="input-group mb-0">
                  <label>Môn học</label>
                  <select className="input-field" value={goalForm.subjectId} onChange={e => setGoalForm({...goalForm, subjectId: e.target.value})}>
                    <option value="total">Tổng tất cả các môn</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="input-group mb-0" style={{ flex: 1 }}>
                  <label>Mục tiêu</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input type="number" step={goalForm.unit === 'hours' ? '0.5' : '1'} className="input-field" value={goalForm.targetValue} onChange={e => setGoalForm({...goalForm, targetValue: e.target.value})} style={{ minWidth: '80px' }} />
                    <select className="input-field" value={goalForm.unit} onChange={e => setGoalForm({...goalForm, unit: e.target.value})} style={{ width: 'auto' }}>
                      <option value="minutes">Phút</option>
                      <option value="hours">Giờ</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary mt-4">Thiết lập</button>
              </form>

              <h4>Tiến độ tháng {goalForm.month}</h4>
              <div className="grid gap-4 mt-4">
                {Object.keys(goals[goalForm.month] || {}).map(subId => {
                  const isTotal = subId === 'total';
                  const subName = isTotal ? 'Tổng tất cả các môn' : (subjects.find(s => s.id === subId)?.name || 'Môn đã xóa');
                  const { totalMinutes, targetMinutes, percentage } = calculateProgress(goalForm.month, subId);
                  const isCompleted = percentage >= 100;
                  
                  return (
                    <div key={subId} className="list-item" style={{ display: 'block' }}>
                      <div className="flex justify-between mb-2">
                        <strong>{subName}</strong>
                        <span className={`badge ${isCompleted ? 'success' : 'warning'}`}>
                          {isCompleted ? 'Đạt mục tiêu' : 'Chưa đạt'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Đã học: {totalMinutes} phút / {targetMinutes} phút
                      </div>
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${percentage}%`, background: isCompleted ? 'var(--success)' : 'var(--primary)' }}></div>
                      </div>
                    </div>
                  );
                })}
                {Object.keys(goals[goalForm.month] || {}).length === 0 && (
                  <p className="text-muted">Chưa có mục tiêu nào trong tháng này.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div>
              <h3>Thống kê thời gian học</h3>
              <div className="glass-card mb-4 mt-4" style={{ padding: '1.5rem' }}>
                <div className="input-group mb-4" style={{ maxWidth: '200px' }}>
                  <label>Chọn tháng</label>
                  <input type="month" className="input-field" value={statsMonth} onChange={e => setStatsMonth(e.target.value)} />
                </div>
                
                {statsData.length > 0 ? (
                  <div style={{ width: '100%', height: 350 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={statsData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {statsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value} phút`} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-muted">Chưa có dữ liệu học tập trong tháng này.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bai2;
