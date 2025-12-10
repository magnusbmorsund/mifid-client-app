import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/App.css';
import ClientForm from './components/ClientForm';
import RiskProfile from './components/RiskProfile';
import InstrumentSelector from './components/InstrumentSelector';
import PortfolioBuilder from './components/PortfolioBuilder';
import PortfolioChart from './components/PortfolioChart';
import ExistingPortfolioUpload from './components/ExistingPortfolioUpload';
import PortfolioComparison from './components/PortfolioComparison';
import PortfolioView from './components/PortfolioView';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
const API_KEY = process.env.REACT_APP_API_KEY;

// Configure axios defaults
if (API_KEY) {
  axios.defaults.headers.common['X-API-Key'] = API_KEY;
}

function App() {
  const [step, setStep] = useState(1);
  const [clientData, setClientData] = useState(null);
  const [riskProfile, setRiskProfile] = useState(null);
  const [availableInstruments, setAvailableInstruments] = useState([]);
  const [selectedInstruments, setSelectedInstruments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [existingPortfolio, setExistingPortfolio] = useState(null);
  const [proposedPortfolio, setProposedPortfolio] = useState(null);
  const [showComparison, setShowComparison] = useState(false);

  const handleClientSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/clients`, data);
      setClientData(response.data);
      setRiskProfile(response.data.riskProfile);
      setStep(2);
      
      // Fetch available instruments
      const instrumentsResponse = await axios.post(`${API_URL}/instruments/filter`, {
        riskLevel: response.data.riskProfile.riskLevel,
        allowedInstruments: response.data.riskProfile.allowedInstruments,
        sustainabilityPreferences: response.data.sustainability
      });
      setAvailableInstruments(instrumentsResponse.data.instruments);
    } catch (error) {
      console.error('Error submitting client data:', error);
      alert('Error submitting data. Please try again.');
    }
    setLoading(false);
  };

  const handleInstrumentSelection = (instrument) => {
    const exists = selectedInstruments.find(i => i.symbol === instrument.symbol);
    if (exists) {
      setSelectedInstruments(selectedInstruments.filter(i => i.symbol !== instrument.symbol));
    } else {
      setSelectedInstruments([...selectedInstruments, { ...instrument, allocation: 0 }]);
    }
  };

  const handleCreatePortfolio = async (portfolio) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/portfolios`, {
        clientId: clientData.id,
        clientName: clientData.personalInfo.name,
        name: portfolio.name,
        holdings: portfolio.holdings,
        totalValue: portfolio.totalValue,
        amountForAdvice: clientData.financialSituation.amountForAdvice
      });
      
      setProposedPortfolio(response.data);
      
      // If there's an existing portfolio, show comparison option
      if (existingPortfolio) {
        const showCompare = window.confirm(
          'Portfolio created successfully! Would you like to compare it with the existing portfolio?'
        );
        if (showCompare) {
          setShowComparison(true);
          setStep(5);
        } else {
          alert(`Portfolio created successfully! Saved to: ${response.data.savedToFile}`);
          setStep(4);
        }
      } else {
        alert(`Portfolio created successfully! Saved to: ${response.data.savedToFile}`);
        setStep(4);
      }
    } catch (error) {
      console.error('Error creating portfolio:', error);
      alert('Error creating portfolio. Please try again.');
    }
    setLoading(false);
  };

  const handleExistingPortfolioUpload = (portfolio) => {
    setExistingPortfolio(portfolio);
  };

  const resetFlow = () => {
    setStep(1);
    setClientData(null);
    setRiskProfile(null);
    setAvailableInstruments([]);
    setSelectedInstruments([]);
    setExistingPortfolio(null);
    setProposedPortfolio(null);
    setShowComparison(false);
  };

  return (
    <div className="App">
      <div className="app-container">
        <header className="app-header">
          <div className="header-content">
            <h1 className="app-title">
              <span className="title-accent">MiFID II</span>
              <span className="title-main">Client Profiling System</span>
            </h1>
            <div className="step-indicator">
              <div className={`step ${step >= 1 ? 'active' : ''}`}>
                <span className="step-number">01</span>
                <span className="step-label">Profile</span>
              </div>
              <div className="step-line"></div>
              <div className={`step ${step >= 2 ? 'active' : ''}`}>
                <span className="step-number">02</span>
                <span className="step-label">Risk</span>
              </div>
              <div className="step-line"></div>
              <div className={`step ${step >= 3 ? 'active' : ''}`}>
                <span className="step-number">03</span>
                <span className="step-label">Portfolio</span>
              </div>
              {existingPortfolio && proposedPortfolio && (
                <>
                  <div className="step-line"></div>
                  <div className={`step ${step >= 5 ? 'active' : ''}`}>
                    <span className="step-number">04</span>
                    <span className="step-label">Compare</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="app-main">
          {loading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
            </div>
          )}

          {step === 1 && (
            <div className="step-content fade-in">
              <ClientForm onSubmit={handleClientSubmit} />
            </div>
          )}

          {step === 2 && riskProfile && (
            <div className="step-content fade-in">
              <RiskProfile profile={riskProfile} clientData={clientData} />
              
              {/* Existing Portfolio Upload Section */}
              <div className="existing-portfolio-section">
                <div className="section-divider">
                  <span>Optional: Upload Existing Portfolio</span>
                </div>
                {existingPortfolio ? (
                  <div className="existing-portfolio-info">
                    <div className="info-card">
                      <h3>✓ Existing Portfolio Uploaded</h3>
                      <p><strong>Name:</strong> {existingPortfolio.name}</p>
                      <p><strong>Total Value:</strong> ${existingPortfolio.totalValue.toLocaleString()}</p>
                      <p><strong>Holdings:</strong> {existingPortfolio.holdings.length}</p>
                      <button 
                        className="btn btn-secondary btn-small" 
                        onClick={() => setExistingPortfolio(null)}
                      >
                        Remove & Upload Different
                      </button>
                    </div>
                  </div>
                ) : (
                  <ExistingPortfolioUpload 
                    clientId={clientData.id}
                    onUploadComplete={handleExistingPortfolioUpload}
                  />
                )}
              </div>
              
              <div className="step-actions">
                <button className="btn btn-secondary" onClick={resetFlow}>
                  Start Over
                </button>
                <button className="btn btn-primary" onClick={() => setStep(3)}>
                  Continue to Portfolio Builder
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="step-content fade-in">
              <InstrumentSelector 
                instruments={availableInstruments}
                selectedInstruments={selectedInstruments}
                onSelect={handleInstrumentSelection}
                riskLevel={riskProfile.riskLevel}
              />
              <PortfolioBuilder 
                selectedInstruments={selectedInstruments}
                setSelectedInstruments={setSelectedInstruments}
                onCreatePortfolio={handleCreatePortfolio}
              />
              <div className="step-actions">
                <button className="btn btn-secondary" onClick={() => setStep(2)}>
                  Back to Risk Profile
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="step-content fade-in success-screen">
              <div className="success-icon">✓</div>
              <h2>Portfolio Created Successfully</h2>
              <p>The client portfolio has been saved and is ready for review.</p>
              {existingPortfolio && proposedPortfolio && (
                <button 
                  className="btn btn-primary" 
                  onClick={() => {
                    setShowComparison(true);
                    setStep(5);
                  }}
                  style={{ marginRight: '10px' }}
                >
                  Compare with Existing Portfolio
                </button>
              )}
              <button className="btn btn-primary" onClick={resetFlow}>
                Create Another Client Profile
              </button>
            </div>
          )}

          {step === 5 && showComparison && (
            <div className="step-content fade-in">
              <PortfolioView 
                clientId={clientData?.id}
                existingPortfolio={existingPortfolio}
                proposedPortfolio={proposedPortfolio}
              />
              <div className="step-actions">
                <button className="btn btn-secondary" onClick={() => setStep(4)}>
                  Back to Summary
                </button>
                <button className="btn btn-primary" onClick={resetFlow}>
                  Create Another Client Profile
                </button>
              </div>
            </div>
          )}
        </main>

        <footer className="app-footer">
          <p>MiFID II Compliant Investment Advisory Platform</p>
          <p className="footer-note">Risk profiling based on EU MiFID II regulations</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
