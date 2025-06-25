import React, { useState } from 'react';
import './Survey.css'; // create styling file if needed

const surveyQuestions = [
  {
    id: 'q1',
    type: 'text',
    label: 'What is your full name?',
    required: true,
  },
  {
    id: 'q2',
    type: 'textarea',
    label: 'Please share any suggestions you may have:',
    required: false,
  },
  {
    id: 'q3',
    type: 'radio',
    label: 'How did you find out about our app?',
    options: ['Friend/Family', 'Social Media', 'Google', 'Other'],
    required: true,
  },
  {
    id: 'q4',
    type: 'checkbox',
    label: 'Which app features do you use most?',
    options: ['Mosque List', 'Prayer Times', 'Add Mosque', 'Events', 'Notifications'],
    required: false,
  },
  {
    id: 'q5',
    type: 'select',
    label: 'How often do you visit a mosque?',
    options: ['Daily', 'Weekly', 'Occasionally', 'Rarely'],
    required: true,
  },
  {
    id: 'q6',
    type: 'multi-select',
    label: 'Select the devices you use to access the app:',
    options: ['Mobile', 'Desktop', 'Tablet', 'Other'],
    required: false,
  },
  {
    id: 'q7',
    type: 'number',
    label: 'How many mosques are in your area?',
    required: false,
  },
  {
    id: 'q8',
    type: 'email',
    label: 'What is your email address?',
    required: false,
  },
  {
    id: 'q9',
    type: 'radio',
    label: 'Would you recommend this app to others?',
    options: ['Yes', 'No', 'Maybe'],
    required: true,
  },
  {
    id: 'q10',
    type: 'date',
    label: 'What day did you first use this app?',
    required: false,
  },
];

const Survey = () => {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (id, value) => {
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handleCheckbox = (id, option) => {
    setForm(prev => {
      const current = prev[id] || [];
      if (current.includes(option)) {
        return { ...prev, [id]: current.filter(o => o !== option) };
      } else {
        return { ...prev, [id]: [...current, option] };
      }
    });
  };

  const handleMultiSelect = (id, selectedOptions) => {
    setForm(prev => ({ ...prev, [id]: selectedOptions }));
  };

  const validate = () => {
    const errs = {};
    for (const q of surveyQuestions) {
      if (q.required) {
        if (!form[q.id] || (Array.isArray(form[q.id]) && form[q.id].length === 0)) {
          errs[q.id] = 'This field is required.';
        }
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('Survey Submission:', form);
      alert('Survey submitted! Check console for output.');
      setForm({});
    }
  };

  return (
    <div className="survey-container">
      <h2>Feedback Survey</h2>
      <form onSubmit={handleSubmit}>
      {surveyQuestions.map(q => (
        <div className="survey-question" key={q.id}>
          <label>
            {q.label} {q.required && <span style={{color:'red'}}>*</span>}
          </label>
          {q.type === 'text' && (
            <input type="text" value={form[q.id]||''} onChange={e=>handleChange(q.id, e.target.value)} />
          )}
          {q.type === 'textarea' && (
            <textarea value={form[q.id]||''} onChange={e=>handleChange(q.id, e.target.value)} />
          )}
          {q.type === 'number' && (
            <input type="number" value={form[q.id]||''} onChange={e=>handleChange(q.id, e.target.value)} />
          )}
          {q.type === 'email' && (
            <input type="email" value={form[q.id]||''} onChange={e=>handleChange(q.id, e.target.value)} />
          )}
          {q.type === 'date' && (
            <input type="date" value={form[q.id]||''} onChange={e=>handleChange(q.id, e.target.value)} />
          )}
          {q.type === 'radio' && (
            q.options.map(option => (
              <div key={option}>
                <input
                  type="radio"
                  name={q.id}
                  value={option}
                  checked={form[q.id] === option}
                  onChange={()=>handleChange(q.id, option)}
                /> {option}
              </div>
            ))
          )}
          {q.type === 'checkbox' && (
            q.options.map(option => (
              <div key={option}>
                <input
                  type="checkbox"
                  name={q.id}
                  value={option}
                  checked={Array.isArray(form[q.id]) && form[q.id].includes(option)}
                  onChange={()=>handleCheckbox(q.id, option)}
                /> {option}
              </div>
            ))
          )}
          {q.type === 'select' && (
            <select value={form[q.id]||''} onChange={e=>handleChange(q.id, e.target.value)}>
              <option value="">Select...</option>
              {q.options.map(option=>(<option key={option} value={option}>{option}</option>))}
            </select>
          )}
          {q.type === 'multi-select' && (
            <select
              multiple
              value={form[q.id]||[]}
              onChange={e=>handleMultiSelect(q.id, Array.from(e.target.selectedOptions, o=>o.value))}
              style={{minHeight:'2.5em'}}
            >
              {q.options.map(option=>(<option key={option} value={option}>{option}</option>))}
            </select>
          )}
          {errors[q.id] && <div className="survey-error">{errors[q.id]}</div>}
        </div>
      ))}
      <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Survey;
