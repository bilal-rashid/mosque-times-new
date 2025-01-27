import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import '../styles/AddMosque.css';

const AddMosque = () => {
  const navigate = useNavigate();
  const [mosque, setMosque] = useState({
    name: '',
    location: '',
    city: '',
    timings: {
      fajar: '05:00',
      zohr: '13:00',
      asar: '16:00',
      magrib: '18:00',
      isha: '20:00'
    },
    lastUpdated: new Date().toDateString()
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes('timings.')) {
      const timing = name.split('.')[1];
      setMosque(prev => ({
        ...prev,
        timings: {
          ...prev.timings,
          [timing]: value
        }
      }));
    } else {
      setMosque(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mosque.name = mosque.name.replace(/\s/g, '');
    try {
      await addDoc(collection(db, 'mosques'), mosque);
      toast.success('Mosque added successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to add mosque');
      console.error('Error adding mosque:', error);
    }
  };

  return (
    <div className="add-mosque-container">
      <div className="add-mosque-card">
        <div className="header">
          <button className="back-button" onClick={() => navigate('/')}>
            ← Back to Home
          </button>
          <h2>Add New Mosque</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Mosque Name</label>
            <input
              type="text"
              name="name"
              value={mosque.name}
              onChange={handleInputChange}
              required
              placeholder="Enter mosque name"
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="location"
              value={mosque.location}
              onChange={handleInputChange}
              required
              placeholder="Enter address"
            />
          </div>

          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={mosque.city}
              onChange={handleInputChange}
              required
              placeholder="Enter city"
            />
          </div>

          <div className="prayer-times-section">
            <h3>Prayer Times</h3>
            <div className="prayer-times-grid">
              <div className="form-group">
                <label>Fajr</label>
                <input
                  type="time"
                  name="timings.fajar"
                  value={mosque.timings.fajar}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Zuhr</label>
                <input
                  type="time"
                  name="timings.zohr"
                  value={mosque.timings.zohr}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Asr</label>
                <input
                  type="time"
                  name="timings.asar"
                  value={mosque.timings.asar}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Maghrib</label>
                <input
                  type="time"
                  name="timings.magrib"
                  value={mosque.timings.magrib}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Isha</label>
                <input
                  type="time"
                  name="timings.isha"
                  value={mosque.timings.isha}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          <button type="submit" className="submit-button">
            Add Mosque
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMosque;
