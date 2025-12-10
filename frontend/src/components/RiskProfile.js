import React from 'react';

const RiskProfile = ({ profile, clientData }) => {
  const getRiskColor = (level) => {
    const colors = {
      1: '#22c55e',
      2: '#84cc16',
      3: '#eab308',
      4: '#f97316',
      5: '#ef4444',
      6: '#dc2626',
      7: '#991b1b'
    };
    return colors[level] || '#6b7280';
  };

  return (
    <div className="risk-profile">
      <div className="profile-header">
        <div className="client-info">
          <h2>{clientData.personalInfo.name}</h2>
          <p className="client-email">{clientData.personalInfo.email}</p>
        </div>
      </div>

      <div className="risk-score-card">
        <div className="risk-score-visual">
          <div className="score-circle" style={{ borderColor: getRiskColor(profile.riskLevel) }}>
            <span className="score-number">{profile.riskLevel}</span>
            <span className="score-max">/7</span>
          </div>
          <div className="score-details">
            <h3 className="risk-category" style={{ color: getRiskColor(profile.riskLevel) }}>
              {profile.riskCategory}
            </h3>
            <p className="risk-score-label">Overall Risk Score: {profile.riskScore}/100</p>
          </div>
        </div>

        <div className="risk-bar-container">
          <div className="risk-bar">
            {[1, 2, 3, 4, 5, 6, 7].map(level => (
              <div
                key={level}
                className={`risk-segment ${profile.riskLevel >= level ? 'active' : ''}`}
                style={{
                  backgroundColor: profile.riskLevel >= level ? getRiskColor(level) : '#e5e7eb'
                }}
              />
            ))}
          </div>
          <div className="risk-labels">
            <span>Very Low</span>
            <span>High</span>
            <span>Very High</span>
          </div>
        </div>
      </div>

      <div className="profile-sections">
        <div className="profile-section">
          <h3>Key Contributing Factors</h3>
          <ul className="factors-list">
            {profile.factors.map((factor, index) => (
              <li key={index} className="factor-item">
                <span className="factor-icon">→</span>
                {factor}
              </li>
            ))}
          </ul>
        </div>

        <div className="profile-section">
          <h3>Allowed Investment Instruments</h3>
          <div className="instruments-tags">
            {profile.allowedInstruments.map((instrument, index) => (
              <span key={index} className="instrument-tag">
                {instrument.replace(/_/g, ' ').toUpperCase()}
              </span>
            ))}
          </div>
        </div>

        <div className="profile-section">
          <h3>Financial Overview</h3>
          <div className="financial-grid">
            <div className="financial-item">
              <span className="financial-label">Annual Income</span>
              <span className="financial-value">
                {clientData.financialSituation.annualIncome.toLocaleString('no-NO')} NOK
              </span>
            </div>
            <div className="financial-item">
              <span className="financial-label">Net Worth</span>
              <span className="financial-value">
                {clientData.financialSituation.netWorth.toLocaleString('no-NO')} NOK
              </span>
            </div>
            <div className="financial-item">
              <span className="financial-label">Investable Assets</span>
              <span className="financial-value">
                {clientData.financialSituation.investableAssets.toLocaleString('no-NO')} NOK
              </span>
            </div>
            <div className="financial-item">
              <span className="financial-label">Investment Experience</span>
              <span className="financial-value">
                {clientData.knowledgeExperience.yearsInvesting} years
              </span>
            </div>
            <div className="financial-item">
              <span className="financial-label">Amount for Advice</span>
              <span className="financial-value">
                {clientData.financialSituation.amountForAdvice.toLocaleString('no-NO')} NOK
              </span>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>Investment Objectives</h3>
          <div className="objectives-grid">
            <div className="objective-item">
              <span className="objective-label">Primary Goal</span>
              <span className="objective-value">
                {clientData.objectives.primaryObjective.replace(/_/g, ' ')}
              </span>
            </div>
            <div className="objective-item">
              <span className="objective-label">Time Horizon</span>
              <span className="objective-value">
                {clientData.objectives.timeHorizon}-term
              </span>
            </div>
            <div className="objective-item">
              <span className="objective-label">Risk Tolerance</span>
              <span className="objective-value">
                {clientData.riskTolerance.level.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        </div>

        {clientData.sustainability.importance !== 'not_important' && (
          <div className="profile-section">
            <h3>Sustainability Preferences</h3>
            <div className="sustainability-info">
              <p><strong>Importance:</strong> {clientData.sustainability.importance.replace(/_/g, ' ')}</p>
              {clientData.sustainability.excludeSectors.length > 0 && (
                <p><strong>Excluded Sectors:</strong> {clientData.sustainability.excludeSectors.join(', ')}</p>
              )}
              {clientData.sustainability.preferredSectors.length > 0 && (
                <p><strong>Preferred Sectors:</strong> {clientData.sustainability.preferredSectors.join(', ')}</p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="risk-disclaimer">
        <h4>MiFID II Compliance Notice</h4>
        <p>
          This risk profile has been calculated in accordance with MiFID II regulations. 
          The assessment is based on the information provided and should be reviewed 
          regularly or when circumstances change. Investment recommendations will be 
          limited to instruments suitable for this risk profile.
        </p>
      </div>
    </div>
  );
};

export default RiskProfile;
