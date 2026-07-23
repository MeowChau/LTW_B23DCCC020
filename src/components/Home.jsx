import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, BookOpen } from 'lucide-react';

const Home = () => {
  return (
    <div className="glass-card" style={{ maxWidth: '600px', margin: '10vh auto', textAlign: 'center' }}>
      <h1>Web Mini-Apps</h1>
      <p className="mb-4" style={{ color: 'var(--text-muted)' }}>
        Chọn một ứng dụng để trải nghiệm thiết kế và tính năng hiện đại.
      </p>
      
      <div className="grid gap-4 mt-4" style={{ gridTemplateColumns: '1fr' }}>
        <Link to="/bai1" className="btn btn-primary" style={{ padding: '1.5rem', fontSize: '1.2rem', justifyContent: 'flex-start' }}>
          <Gamepad2 size={28} />
          Bài 1: Trò chơi Đoán Số
        </Link>
        <Link to="/bai2" className="btn btn-outline" style={{ padding: '1.5rem', fontSize: '1.2rem', justifyContent: 'flex-start' }}>
          <BookOpen size={28} />
          Bài 2: Quản lý Học Tập
        </Link>
      </div>
    </div>
  );
};

export default Home;
