import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Notes from './components/Notes';
import Todos from './components/Todos';
import Reminders from './components/Reminders';
import Bookmarks from './components/Bookmarks';
import Texttools from './components/Texttools';
import Quotes from './components/Quotes';
import Timer from './components/Timer';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/todos" element={<Todos />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/texttools" element={<Texttools />} />
          <Route path="/quotes" element={<Quotes />} />
          <Route path="/timer" element={<Timer />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;