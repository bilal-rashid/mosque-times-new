import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MosqueList from './components/MosqueList';
import MosqueDetail from './components/MosqueDetail';
import AddMosque from './components/AddMosque';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4CAF50',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#dc3545',
                secondary: '#fff',
              },
            },
          }}
        />
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <h1>Never Miss a Prayer</h1>
            <p>Stay aligned with the prayer schedules of mosques near you.</p>
          </div>
        </section>

        {/* Mosques Section */}
        <Routes>
          <Route path="/" element={<MosqueList />} />
          <Route path="/mosque/:id" element={<MosqueDetail />} />
          <Route path="/add-mosque" element={<AddMosque />} />
        </Routes>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-content">
            <h2>"The first deed for which a person will be called to account on the Day of Judgment will be his prayer."</h2>
            <p>(Sunan Abu Dawood)</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-section">
              <h3>About Us</h3>
              <p>Connecting communities through accurate prayer times and mosque information.</p>
            </div>
            <div className="footer-section">
              <h3>Quick Links</h3>
              <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/add-mosque">Add Mosque</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>Contact</h3>
              <ul>
                <li>Email: bilalrashid1992@gmail.com</li>
                <li>Phone: +92 (334) 5505421</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Mosque Timetable. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
