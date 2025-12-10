import React, { useState } from 'react';

const ClientForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    personalInfo: {
      name: '',
      email: '',
      dateOfBirth: '',
      country: 'Norway'
    },
    financialSituation: {
      annualIncome: '',
      netWorth: '',
      investableAssets: '',
      regularSavings: '',
      liabilities: '',
      dependents: 0,
      amountForAdvice: ''
    },
    knowledgeExperience: {
      yearsInvesting: 0,
      educationLevel: 'high_school',
      professionalBackground: '',
      instrumentKnowledge: [
        { instrument: 'Stocks', knowledge: 'none' },
        { instrument: 'Bonds', knowledge: 'none' },
        { instrument: 'ETFs', knowledge: 'none' },
        { instrument: 'Mutual Funds', knowledge: 'none' },
        { instrument: 'Options', knowledge: 'none' },
        { instrument: 'Futures', knowledge: 'none' },
        { instrument: 'Commodities', knowledge: 'none' },
        { instrument: 'Crypto', knowledge: 'none' }
      ],
      transactionFrequency: 'occasional',
      largestTransaction: ''
    },
    objectives: {
      primaryObjective: 'growth',
      timeHorizon: 'medium',
      liquidityNeeds: 'low',
      targetReturn: ''
    },
    riskTolerance: {
      level: 'moderate',
      maxDrawdown: '',
      reactionToLoss: 'hold'
    },
    sustainability: {
      importance: 'moderate',
      excludeSectors: [],
      preferredSectors: [],
      esgMinRating: 'none'
    }
  });

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleInstrumentKnowledge = (index, value) => {
    const newInstruments = [...formData.knowledgeExperience.instrumentKnowledge];
    newInstruments[index].knowledge = value;
    setFormData(prev => ({
      ...prev,
      knowledgeExperience: {
        ...prev.knowledgeExperience,
        instrumentKnowledge: newInstruments
      }
    }));
  };

  const handleSustainabilityArray = (field, value) => {
    const currentArray = formData.sustainability[field];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(v => v !== value)
      : [...currentArray, value];
    
    setFormData(prev => ({
      ...prev,
      sustainability: {
        ...prev.sustainability,
        [field]: newArray
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="client-form" onSubmit={handleSubmit}>
      <div className="form-section">
        <h2 className="section-title">
          <span className="section-number">01</span>
          Personal Information
        </h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              required
              value={formData.personalInfo.name}
              onChange={(e) => handleChange('personalInfo', 'name', e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              required
              value={formData.personalInfo.email}
              onChange={(e) => handleChange('personalInfo', 'email', e.target.value)}
              placeholder="john@example.com"
            />
          </div>
          <div className="form-group">
            <label>Date of Birth *</label>
            <input
              type="date"
              required
              value={formData.personalInfo.dateOfBirth}
              onChange={(e) => handleChange('personalInfo', 'dateOfBirth', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Country *</label>
            <input
              type="text"
              required
              value={formData.personalInfo.country}
              onChange={(e) => handleChange('personalInfo', 'country', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h2 className="section-title">
          <span className="section-number">02</span>
          Financial Situation
        </h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Annual Income (NOK) *</label>
            <input
              type="number"
              required
              value={formData.financialSituation.annualIncome}
              onChange={(e) => handleChange('financialSituation', 'annualIncome', e.target.value === '' ? '' : parseInt(e.target.value) || 0)}
              placeholder="500000"
            />
          </div>
          <div className="form-group">
            <label>Net Worth (NOK) *</label>
            <input
              type="number"
              required
              value={formData.financialSituation.netWorth}
              onChange={(e) => handleChange('financialSituation', 'netWorth', e.target.value === '' ? '' : parseInt(e.target.value) || 0)}
              placeholder="1000000"
            />
          </div>
          <div className="form-group">
            <label>Investable Assets (NOK) *</label>
            <input
              type="number"
              required
              value={formData.financialSituation.investableAssets}
              onChange={(e) => handleChange('financialSituation', 'investableAssets', e.target.value === '' ? '' : parseInt(e.target.value) || 0)}
              placeholder="300000"
            />
          </div>
          <div className="form-group">
            <label>Monthly Savings (NOK)</label>
            <input
              type="number"
              value={formData.financialSituation.regularSavings}
              onChange={(e) => handleChange('financialSituation', 'regularSavings', e.target.value === '' ? '' : parseInt(e.target.value) || 0)}
              placeholder="5000"
            />
          </div>
          <div className="form-group">
            <label>Total Liabilities (NOK)</label>
            <input
              type="number"
              value={formData.financialSituation.liabilities}
              onChange={(e) => handleChange('financialSituation', 'liabilities', e.target.value === '' ? '' : parseInt(e.target.value) || 0)}
              placeholder="2000000"
            />
          </div>
          <div className="form-group">
            <label>Number of Dependents</label>
            <input
              type="number"
              value={formData.financialSituation.dependents}
              onChange={(e) => handleChange('financialSituation', 'dependents', e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
              placeholder="0"
            />
          </div>
          <div className="form-group">
            <label>Amount for Advice (NOK) *</label>
            <input
              type="number"
              required
              value={formData.financialSituation.amountForAdvice}
              onChange={(e) => handleChange('financialSituation', 'amountForAdvice', e.target.value === '' ? '' : parseInt(e.target.value) || 0)}
              placeholder="100000"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h2 className="section-title">
          <span className="section-number">03</span>
          Knowledge & Experience
        </h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Years of Investment Experience *</label>
            <input
              type="number"
              required
              value={formData.knowledgeExperience.yearsInvesting}
              onChange={(e) => handleChange('knowledgeExperience', 'yearsInvesting', e.target.value === '' ? '' : parseInt(e.target.value) || 0)}
              placeholder="5"
            />
          </div>
          <div className="form-group">
            <label>Education Level *</label>
            <select
              required
              value={formData.knowledgeExperience.educationLevel}
              onChange={(e) => handleChange('knowledgeExperience', 'educationLevel', e.target.value)}
            >
              <option value="high_school">High School</option>
              <option value="university">University Degree</option>
              <option value="finance_degree">Finance/Economics Degree</option>
              <option value="professional">Financial Professional (CFA, etc.)</option>
            </select>
          </div>
          <div className="form-group full-width">
            <label>Professional Background</label>
            <input
              type="text"
              value={formData.knowledgeExperience.professionalBackground}
              onChange={(e) => handleChange('knowledgeExperience', 'professionalBackground', e.target.value)}
              placeholder="E.g., Banking, IT, Healthcare"
            />
          </div>
        </div>

        <div className="form-subsection">
          <h3>Investment Instrument Knowledge</h3>
          <div className="knowledge-grid">
            {formData.knowledgeExperience.instrumentKnowledge.map((item, index) => (
              <div key={index} className="knowledge-item">
                <label>{item.instrument}</label>
                <select
                  value={item.knowledge}
                  onChange={(e) => handleInstrumentKnowledge(index, e.target.value)}
                >
                  <option value="none">No Knowledge</option>
                  <option value="basic">Basic Understanding</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="experienced">Experienced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>Transaction Frequency</label>
            <select
              value={formData.knowledgeExperience.transactionFrequency}
              onChange={(e) => handleChange('knowledgeExperience', 'transactionFrequency', e.target.value)}
            >
              <option value="none">Never Traded</option>
              <option value="rare">Rarely (&lt; 5/year)</option>
              <option value="occasional">Occasionally (5-20/year)</option>
              <option value="regular">Regularly (20-100/year)</option>
              <option value="frequent">Frequently (&gt; 100/year)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Largest Transaction Size (NOK)</label>
            <input
              type="number"
              value={formData.knowledgeExperience.largestTransaction}
              onChange={(e) => handleChange('knowledgeExperience', 'largestTransaction', e.target.value === '' ? '' : parseInt(e.target.value) || 0)}
              placeholder="50000"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h2 className="section-title">
          <span className="section-number">04</span>
          Investment Objectives
        </h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Primary Investment Objective *</label>
            <select
              required
              value={formData.objectives.primaryObjective}
              onChange={(e) => handleChange('objectives', 'primaryObjective', e.target.value)}
            >
              <option value="capital_preservation">Capital Preservation</option>
              <option value="income">Income Generation</option>
              <option value="balanced">Balanced Growth & Income</option>
              <option value="growth">Growth</option>
              <option value="aggressive_growth">Aggressive Growth</option>
            </select>
          </div>
          <div className="form-group">
            <label>Investment Time Horizon *</label>
            <select
              required
              value={formData.objectives.timeHorizon}
              onChange={(e) => handleChange('objectives', 'timeHorizon', e.target.value)}
            >
              <option value="short">Short-term (&lt; 3 years)</option>
              <option value="medium">Medium-term (3-7 years)</option>
              <option value="long">Long-term (7+ years)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Liquidity Needs *</label>
            <select
              required
              value={formData.objectives.liquidityNeeds}
              onChange={(e) => handleChange('objectives', 'liquidityNeeds', e.target.value)}
            >
              <option value="high">High - Need access within days</option>
              <option value="moderate">Moderate - Access within weeks</option>
              <option value="low">Low - Can wait months/years</option>
            </select>
          </div>
          <div className="form-group">
            <label>Target Annual Return (%)</label>
            <input
              type="number"
              step="0.1"
              value={formData.objectives.targetReturn}
              onChange={(e) => handleChange('objectives', 'targetReturn', e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
              placeholder="8.0"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h2 className="section-title">
          <span className="section-number">05</span>
          Risk Tolerance
        </h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Risk Tolerance Level *</label>
            <select
              required
              value={formData.riskTolerance.level}
              onChange={(e) => handleChange('riskTolerance', 'level', e.target.value)}
            >
              <option value="very_conservative">Very Conservative</option>
              <option value="conservative">Conservative</option>
              <option value="moderate">Moderate</option>
              <option value="aggressive">Aggressive</option>
              <option value="very_aggressive">Very Aggressive</option>
            </select>
          </div>
          <div className="form-group">
            <label>Maximum Acceptable Drawdown (%)</label>
            <input
              type="number"
              value={formData.riskTolerance.maxDrawdown}
              onChange={(e) => handleChange('riskTolerance', 'maxDrawdown', e.target.value === '' ? '' : parseInt(e.target.value) || 0)}
              placeholder="20"
            />
          </div>
          <div className="form-group full-width">
            <label>Reaction to 20% Portfolio Loss *</label>
            <select
              required
              value={formData.riskTolerance.reactionToLoss}
              onChange={(e) => handleChange('riskTolerance', 'reactionToLoss', e.target.value)}
            >
              <option value="panic_sell">Sell everything immediately</option>
              <option value="sell_some">Sell some positions to reduce risk</option>
              <option value="hold">Hold and wait for recovery</option>
              <option value="buy_more">Buy more to average down</option>
            </select>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h2 className="section-title">
          <span className="section-number">06</span>
          Sustainability Preferences (MiFID II)
        </h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Importance of ESG Factors *</label>
            <select
              required
              value={formData.sustainability.importance}
              onChange={(e) => handleChange('sustainability', 'importance', e.target.value)}
            >
              <option value="not_important">Not Important</option>
              <option value="moderate">Moderately Important</option>
              <option value="important">Important</option>
              <option value="very_important">Very Important - ESG Priority</option>
            </select>
          </div>
          <div className="form-group">
            <label>Minimum ESG Rating</label>
            <select
              value={formData.sustainability.esgMinRating}
              onChange={(e) => handleChange('sustainability', 'esgMinRating', e.target.value)}
            >
              <option value="none">No Requirement</option>
              <option value="B">B or Higher</option>
              <option value="A">A or Higher</option>
              <option value="AA">AA or Higher</option>
              <option value="AAA">AAA Only</option>
            </select>
          </div>
        </div>

        <div className="form-subsection">
          <h3>Sectors to Exclude (Optional)</h3>
          <div className="checkbox-grid">
            {['Tobacco', 'Alcohol', 'Weapons', 'Gambling', 'Fossil Fuels', 'Nuclear Energy'].map(sector => (
              <label key={sector} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.sustainability.excludeSectors.includes(sector)}
                  onChange={() => handleSustainabilityArray('excludeSectors', sector)}
                />
                <span>{sector}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-subsection">
          <h3>Preferred Sectors (Optional)</h3>
          <div className="checkbox-grid">
            {['Renewable Energy', 'Healthcare', 'Education', 'Clean Technology', 'Sustainable Agriculture'].map(sector => (
              <label key={sector} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.sustainability.preferredSectors.includes(sector)}
                  onChange={() => handleSustainabilityArray('preferredSectors', sector)}
                />
                <span>{sector}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary btn-large">
          Calculate Risk Profile
        </button>
      </div>
    </form>
  );
};

export default ClientForm;
