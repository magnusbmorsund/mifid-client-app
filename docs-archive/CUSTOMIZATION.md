# Quick Customization Guide

## Adding New Input Fields - Step by Step

This guide shows you exactly where to add code to extend the system with new fields.

## Example 1: Adding "Marital Status" Field

### Step 1: Add to Backend Risk Calculation

File: `backend/server.js`

Location: Inside `calculateRiskProfile()` function, around line 50

```javascript
// Add after other personal info checks
const maritalStatus = clientData.personalInfo.maritalStatus;

if (maritalStatus === 'married') {
  riskScore += 2; // Married couples might have more stability
  factors.push('Married - shared financial responsibility');
} else if (maritalStatus === 'single') {
  riskScore += 1;
}
```

### Step 2: Add to Frontend Form State

File: `frontend/src/components/ClientForm.js`

Location: In `useState` initial state, around line 8

```javascript
personalInfo: {
  name: '',
  email: '',
  dateOfBirth: '',
  country: 'Norway',
  maritalStatus: 'single'  // ADD THIS LINE
}
```

### Step 3: Add Form Input

File: `frontend/src/components/ClientForm.js`

Location: In the "Personal Information" section JSX, around line 160

```javascript
<div className="form-group">
  <label>Marital Status *</label>
  <select
    required
    value={formData.personalInfo.maritalStatus}
    onChange={(e) => handleChange('personalInfo', 'maritalStatus', e.target.value)}
  >
    <option value="single">Single</option>
    <option value="married">Married</option>
    <option value="divorced">Divorced</option>
    <option value="widowed">Widowed</option>
  </select>
</div>
```

### Step 4: Display in Risk Profile (Optional)

File: `frontend/src/components/RiskProfile.js`

Location: In the financial grid section, around line 85

```javascript
<div className="financial-item">
  <span className="financial-label">Marital Status</span>
  <span className="financial-value">
    {clientData.personalInfo.maritalStatus}
  </span>
</div>
```

## Example 2: Adding "Investment Horizon" to Objectives

### Backend (server.js)

```javascript
// In calculateRiskProfile(), Investment Objectives section
const investmentHorizon = clientData.objectives?.investmentHorizon || 5;

if (investmentHorizon > 15) {
  riskScore += 8;
  factors.push('Very long investment horizon');
} else if (investmentHorizon > 10) {
  riskScore += 6;
} else if (investmentHorizon > 5) {
  riskScore += 4;
} else {
  riskScore += 2;
}
```

### Frontend Form State (ClientForm.js)

```javascript
objectives: {
  primaryObjective: 'growth',
  timeHorizon: 'medium',
  liquidityNeeds: 'low',
  targetReturn: '',
  investmentHorizon: 10  // ADD THIS
}
```

### Frontend Form Input (ClientForm.js)

```javascript
<div className="form-group">
  <label>Investment Horizon (Years) *</label>
  <input
    type="number"
    min="1"
    max="50"
    required
    value={formData.objectives.investmentHorizon}
    onChange={(e) => handleChange('objectives', 'investmentHorizon', parseInt(e.target.value))}
    placeholder="10"
  />
</div>
```

## Example 3: Adding Array Field - "Previous Investments"

### Backend (server.js)

```javascript
// In calculateRiskProfile()
const previousInvestments = clientData.knowledgeExperience.previousInvestments || [];

if (previousInvestments.includes('stocks') && previousInvestments.includes('bonds')) {
  riskScore += 5;
  factors.push('Diversified investment history');
}

riskScore += previousInvestments.length * 2; // 2 points per investment type
```

### Frontend Form State (ClientForm.js)

```javascript
knowledgeExperience: {
  yearsInvesting: 0,
  educationLevel: 'high_school',
  professionalBackground: '',
  previousInvestments: [],  // ADD THIS
  // ... other fields
}
```

### Frontend Form Input (ClientForm.js)

```javascript
<div className="form-subsection">
  <h3>Previous Investment Types</h3>
  <div className="checkbox-grid">
    {['stocks', 'bonds', 'real_estate', 'commodities', 'crypto', 'private_equity'].map(type => (
      <label key={type} className="checkbox-label">
        <input
          type="checkbox"
          checked={formData.knowledgeExperience.previousInvestments.includes(type)}
          onChange={() => {
            const current = formData.knowledgeExperience.previousInvestments;
            const updated = current.includes(type)
              ? current.filter(t => t !== type)
              : [...current, type];
            setFormData(prev => ({
              ...prev,
              knowledgeExperience: {
                ...prev.knowledgeExperience,
                previousInvestments: updated
              }
            }));
          }}
        />
        <span>{type.replace(/_/g, ' ').toUpperCase()}</span>
      </label>
    ))}
  </div>
</div>
```

## Field Type Templates

### Text Input

```javascript
<div className="form-group">
  <label>Field Name *</label>
  <input
    type="text"
    required
    value={formData.section.fieldName}
    onChange={(e) => handleChange('section', 'fieldName', e.target.value)}
    placeholder="Placeholder text"
  />
</div>
```

### Number Input

```javascript
<div className="form-group">
  <label>Field Name *</label>
  <input
    type="number"
    required
    value={formData.section.fieldName}
    onChange={(e) => handleChange('section', 'fieldName', parseInt(e.target.value))}
    placeholder="0"
  />
</div>
```

### Dropdown Select

```javascript
<div className="form-group">
  <label>Field Name *</label>
  <select
    required
    value={formData.section.fieldName}
    onChange={(e) => handleChange('section', 'fieldName', e.target.value)}
  >
    <option value="option1">Option 1</option>
    <option value="option2">Option 2</option>
    <option value="option3">Option 3</option>
  </select>
</div>
```

### Checkbox (Single)

```javascript
<label className="checkbox-label">
  <input
    type="checkbox"
    checked={formData.section.fieldName}
    onChange={(e) => handleChange('section', 'fieldName', e.target.checked)}
  />
  <span>Checkbox Label</span>
</label>
```

### Date Input

```javascript
<div className="form-group">
  <label>Date Field *</label>
  <input
    type="date"
    required
    value={formData.section.dateField}
    onChange={(e) => handleChange('section', 'dateField', e.target.value)}
  />
</div>
```

### Textarea

```javascript
<div className="form-group">
  <label>Notes</label>
  <textarea
    rows="4"
    value={formData.section.notes}
    onChange={(e) => handleChange('section', 'notes', e.target.value)}
    placeholder="Enter notes here..."
    style={{
      width: '100%',
      padding: '0.75rem 1rem',
      border: '2px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      fontSize: '1rem',
      fontFamily: 'inherit'
    }}
  />
</div>
```

## Creating a New Section

### 1. Add Section to Form State

```javascript
const [formData, setFormData] = useState({
  // ... existing sections
  newSection: {
    field1: '',
    field2: 0,
    field3: []
  }
});
```

### 2. Create Section in Form JSX

```javascript
<div className="form-section">
  <h2 className="section-title">
    <span className="section-number">07</span>
    New Section Name
  </h2>
  <div className="form-grid">
    {/* Add your fields here */}
  </div>
</div>
```

### 3. Add Logic to Backend

```javascript
function calculateRiskProfile(clientData) {
  // ... existing code
  
  // New section assessment
  const newSectionScore = assessNewSection(clientData.newSection);
  riskScore += newSectionScore;
  
  // ... rest of calculation
}

function assessNewSection(data) {
  let score = 0;
  // Your logic here
  return score;
}
```

### 4. Display in Risk Profile

```javascript
<div className="profile-section">
  <h3>New Section Information</h3>
  <div className="objectives-grid">
    <div className="objective-item">
      <span className="objective-label">Field 1</span>
      <span className="objective-value">{clientData.newSection.field1}</span>
    </div>
    {/* More fields */}
  </div>
</div>
```

## Common Patterns

### Conditional Display

```javascript
{formData.section.showField && (
  <div className="form-group">
    <label>Conditional Field</label>
    <input ... />
  </div>
)}
```

### Dynamic Options

```javascript
const options = ['Option A', 'Option B', 'Option C'];

<select value={formData.section.field} onChange={...}>
  {options.map(opt => (
    <option key={opt} value={opt}>{opt}</option>
  ))}
</select>
```

### Validation

```javascript
const isValid = formData.section.field.length > 0;

<button disabled={!isValid}>Submit</button>

{!isValid && <p className="error">This field is required</p>}
```

## Tips

1. **Always update both frontend and backend** when adding fields
2. **Use consistent naming** across frontend and backend
3. **Add to initial state** in ClientForm.js
4. **Consider impact on risk score** in server.js
5. **Test thoroughly** after adding new fields
6. **Add validation** for required fields
7. **Document your changes** for other developers

## Need Help?

- Check existing fields in the code for reference
- All form sections follow the same pattern
- Copy-paste and modify existing fields
- Test incrementally as you add fields
