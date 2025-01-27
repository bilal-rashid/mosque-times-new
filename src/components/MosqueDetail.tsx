import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
// import toast from 'react-hot-toast';
import '../styles/MosqueDetail.css';

interface MosqueTimings {
  fajar: string;
  zohr: string;
  asar: string;
  magrib: string;
  isha: string;
  juma: string;
}

interface Mosque {
  id: string;
  name: string;
  location: string;
  city: string;
  timings: MosqueTimings;
}

const convertTo12Hour = (time24: string): string => {
  const [hours, minutes] = time24.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

const MosqueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mosque, setMosque] = useState<Mosque | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTimings, setEditedTimings] = useState<MosqueTimings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    const fetchMosque = async () => {
      try {
        if (!id) return;
        const mosqueDoc = await getDoc(doc(db, 'mosques', id));
        if (mosqueDoc.exists()) {
          const mosqueData = mosqueDoc.data() as Omit<Mosque, 'id'>;
          setMosque({ id: mosqueDoc.id, ...mosqueData });
          setEditedTimings(mosqueData.timings);
        } else {
          setError('Mosque not found');
        }
      } catch (err) {
        setError('Error fetching mosque details');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMosque();
  }, [id]);

  // const handleEditClick = () => {
  //   setIsEditing(true);
  //   setEditedTimings(mosque?.timings || null);
  // };

  const handleTimingChange = (prayer: keyof MosqueTimings, value: string) => {
    if (editedTimings) {
      setEditedTimings({
        ...editedTimings,
        [prayer]: value
      });
    }
  };

  const handleSave = async () => {
    try {
      if (!id || !editedTimings) return;

      await updateDoc(doc(db, 'mosques', id), {
        ...mosque,timings: editedTimings, lastUpdated: new Date().toDateString()
      });

      setMosque(prev => prev ? { ...prev, timings: editedTimings } : null);
      setIsEditing(false);
      
    } catch (err) {
      console.error('Error updating mosque timings:', err);
      setError('Failed to update prayer timings');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTimings(mosque?.timings || null);
  };

  // const handleDelete = async () => {
  //   try {
  //     if (!id) return;
  //     await deleteDoc(doc(db, 'mosques', id));
  //     toast.success('Mosque deleted successfully');
  //     navigate('/');
  //   } catch (err) {
  //     console.error('Error deleting mosque:', err);
  //     toast.error('Failed to delete mosque');
  //   }
  // };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading mosque details...</p>
      </div>
    );
  }

  if (error || !mosque) {
    return (
      <div className="error-container">
        <h3>Error</h3>
        <p>{error || 'Mosque not found'}</p>
      </div>
    );
  }

  const prayerNames: { [K in keyof MosqueTimings]: string } = {
    fajar: 'Fajr',
    zohr: 'Zuhr',
    asar: 'Asr',
    magrib: 'Maghrib',
    isha: 'Isha',
    juma: 'Juma'
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const tempMosque = { ...mosque };
    if (name === 'name') {
      tempMosque.name = value;
      setMosque(tempMosque);
    } else if (name === 'location') {
      tempMosque.location = value;
      setMosque(tempMosque);
    } else if (name === 'city') {
      tempMosque.city = value;
      setMosque(tempMosque);
    }
  };

  return (
    <div className="mosque-detail-container">
      <div className="mosque-detail-card">
        <div className="mosque-detail-header">
          <button className="back-button" onClick={() => navigate('/')}>
            ← Back to Home
          </button>
          <div className="mosque-name-section">
            <h2>{mosque.name}</h2>
            <p className="mosque-address">{mosque.location}, {mosque.city}</p>
          </div>
          <div className="button-group">
            {!isEditing && (
              <>
                <button className="edit-button" onClick={() => setIsEditing(true)}>
                  Edit Prayer Times
                </button>
                {/* <button className="delete-button" onClick={() => setShowDeleteConfirm(true)}>
                  Delete Mosque
                </button> */}
              </>
            )}
          </div>
        </div>
        {isEditing &&
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
        }

    {isEditing &&
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
    }

{isEditing &&
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
}

        <div className="prayer-times-container">
          {Object.entries(prayerNames).map(([key, label]) => (
            <div key={key} className="prayer-time-row">
              <span className="prayer-label">{label}</span>
              {isEditing ? (
                <input
                  type="time"
                  value={editedTimings?.[key as keyof MosqueTimings] || ''}
                  onChange={(e) => handleTimingChange(key as keyof MosqueTimings, e.target.value)}
                  className="time-input"
                />
              ) : (
                <span className="prayer-time">
                  {convertTo12Hour(mosque.timings[key as keyof MosqueTimings])}
                </span>
              )}
            </div>
          ))}
        </div>

        {isEditing && (
          <div className="action-buttons">
            <button className="save-button" onClick={handleSave}>
              Save Changes
            </button>
            <button className="cancel-button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        )}

        {showDeleteConfirm && (
          <div className="delete-confirm-overlay">
            <div className="delete-confirm-modal">
              <h3>Confirm Delete</h3>
              <p>Are you sure you want to delete this mosque? This action cannot be undone.</p>
              <div className="delete-confirm-buttons">
                {/* <button className="confirm-delete-button" onClick={handleDelete}>
                  Yes, Delete
                </button> */}
                <button className="cancel-delete-button" onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MosqueDetail;
