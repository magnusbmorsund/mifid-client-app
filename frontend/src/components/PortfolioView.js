import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PortfolioView = ({ clientId, existingPortfolio, proposedPortfolio }) => {
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState('comparison'); // 'comparison', 'existing', 'proposed'

  useEffect(() => {
    if (existingPortfolio && proposedPortfolio) {
      fetchComparison();
    }
  }, [existingPortfolio, proposedPortfolio]);

  const fetchComparison = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5001/api/portfolios/compare', {
        existingPortfolioId: existingPortfolio.id,
        proposedPortfolioId: proposedPortfolio.id
      });
      setComparison(response.data);
    } catch (error) {
      console.error('Error fetching comparison:', error);
    }
    setLoading(false);
  };

  const renderPortfolioCard = (portfolio, label, isExisting = false) => {
    if (!portfolio) return null;

    const totalValue = portfolio.totalValue || portfolio.holdings?.reduce((sum, h) => 
      sum + (h.currentValue || (h.allocation * h.price / 100) || 0), 0
    ) || 0;

    return (
      <div className={`portfolio-card ${isExisting ? 'existing' : 'proposed'}`}>
        <div className="portfolio-card-header">
          <h3>{label}</h3>
          <span className={`portfolio-badge ${isExisting ? 'badge-existing' : 'badge-proposed'}`}>
            {isExisting ? 'Current' : 'Proposed'}
          </span>
        </div>
        <div className="portfolio-card-body">
          <div className="portfolio-stat">
            <span className="stat-label">Portfolio Name</span>
            <span className="stat-value">{portfolio.name}</span>
          </div>
          <div className="portfolio-stat">
            <span className="stat-label">Total Value</span>
            <span className="stat-value">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="portfolio-stat">
            <span className="stat-label">Holdings</span>
            <span className="stat-value">{portfolio.holdings?.length || 0} instruments</span>
          </div>
        </div>
        <div className="portfolio-holdings">
          <h4>Holdings Breakdown</h4>
          <div className="holdings-list">
            {portfolio.holdings?.map((holding, index) => (
              <div key={index} className="holding-item">
                <div className="holding-info">
                  <span className="holding-symbol">{holding.symbol}</span>
                  <span className="holding-name">{holding.name}</span>
                </div>
                <div className="holding-value">
                  {isExisting ? (
                    <>
                      <span className="holding-quantity">{holding.quantity} shares</span>
                      <span className="holding-amount">${holding.currentValue?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                      <span className="holding-percentage">
                        {((holding.currentValue / totalValue) * 100).toFixed(2)}%
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="holding-allocation">{holding.allocation}%</span>
                      <span className="holding-price">${holding.price?.toFixed(2)}</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderComparisonView = () => {
    if (!comparison) return null;

    const valueChange = comparison.differences?.valueChange || 0;
    const valueChangePercent = comparison.differences?.valueChangePercent || 0;
    const isPositive = valueChange >= 0;

    return (
      <div className="comparison-view">
        <div className="comparison-header">
          <h2>Portfolio Comparison</h2>
          <p>Analyzing changes between current and proposed portfolios</p>
        </div>

        {/* Summary Cards */}
        <div className="comparison-summary">
          <div className="summary-card">
            <div className="summary-icon existing-icon">📊</div>
            <div className="summary-content">
              <span className="summary-label">Current Portfolio</span>
              <span className="summary-value">${comparison.existing?.totalValue?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              <span className="summary-detail">{comparison.existing?.holdingsCount} holdings</span>
            </div>
          </div>

          <div className="summary-card arrow-card">
            <div className="arrow-icon">→</div>
            <div className={`change-indicator ${isPositive ? 'positive' : 'negative'}`}>
              <span className="change-value">{isPositive ? '+' : ''}{valueChangePercent}%</span>
              <span className="change-amount">{isPositive ? '+' : ''}${Math.abs(valueChange).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon proposed-icon">🎯</div>
            <div className="summary-content">
              <span className="summary-label">Proposed Portfolio</span>
              <span className="summary-value">${comparison.proposed?.totalValue?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              <span className="summary-detail">{comparison.proposed?.holdingsCount} holdings</span>
            </div>
          </div>
        </div>

        {/* Key Changes */}
        <div className="key-changes">
          <h3>Key Changes</h3>
          <div className="changes-grid">
            <div className="change-item added">
              <span className="change-label">Added Holdings</span>
              <span className="change-count">{comparison.holdingsAnalysis?.addedCount || 0}</span>
            </div>
            <div className="change-item removed">
              <span className="change-label">Removed Holdings</span>
              <span className="change-count">{comparison.holdingsAnalysis?.removedCount || 0}</span>
            </div>
            <div className="change-item modified">
              <span className="change-label">Modified Holdings</span>
              <span className="change-count">{comparison.holdingsAnalysis?.commonCount || 0}</span>
            </div>
          </div>
        </div>

        {/* Holdings Analysis */}
        <div className="holdings-analysis">
          {/* Added Holdings */}
          {comparison.holdingsAnalysis?.added?.length > 0 && (
            <div className="analysis-section added-section">
              <h4>✅ Added Holdings ({comparison.holdingsAnalysis.added.length})</h4>
              <div className="analysis-table">
                {comparison.holdingsAnalysis.added.map((holding, index) => (
                  <div key={index} className="analysis-row">
                    <div className="row-symbol">{holding.symbol}</div>
                    <div className="row-name">{holding.name}</div>
                    <div className="row-value">{holding.allocation}%</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Removed Holdings */}
          {comparison.holdingsAnalysis?.removed?.length > 0 && (
            <div className="analysis-section removed-section">
              <h4>❌ Removed Holdings ({comparison.holdingsAnalysis.removed.length})</h4>
              <div className="analysis-table">
                {comparison.holdingsAnalysis.removed.map((holding, index) => (
                  <div key={index} className="analysis-row">
                    <div className="row-symbol">{holding.symbol}</div>
                    <div className="row-name">{holding.name}</div>
                    <div className="row-value">${holding.currentValue?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Allocation Changes */}
          {comparison.allocationChanges?.length > 0 && (
            <div className="analysis-section changes-section">
              <h4>🔄 Allocation Changes ({comparison.allocationChanges.length})</h4>
              <div className="analysis-table">
                {comparison.allocationChanges.map((change, index) => (
                  <div key={index} className="analysis-row">
                    <div className="row-symbol">{change.symbol}</div>
                    <div className="row-name">{change.name}</div>
                    <div className="row-allocation-change">
                      <span className="old-allocation">{change.existingAllocation}%</span>
                      <span className="arrow">→</span>
                      <span className="new-allocation">{change.proposedAllocation}%</span>
                      <span className={`change-badge ${parseFloat(change.allocationChange) >= 0 ? 'positive' : 'negative'}`}>
                        {parseFloat(change.allocationChange) >= 0 ? '+' : ''}{change.allocationChange}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="portfolio-view-loading">
        <div className="spinner"></div>
        <p>Loading portfolio comparison...</p>
      </div>
    );
  }

  return (
    <div className="portfolio-view">
      <div className="view-tabs">
        <button 
          className={`tab-button ${activeView === 'comparison' ? 'active' : ''}`}
          onClick={() => setActiveView('comparison')}
          disabled={!existingPortfolio || !proposedPortfolio}
        >
          📊 Comparison
        </button>
        <button 
          className={`tab-button ${activeView === 'existing' ? 'active' : ''}`}
          onClick={() => setActiveView('existing')}
          disabled={!existingPortfolio}
        >
          📁 Current Portfolio
        </button>
        <button 
          className={`tab-button ${activeView === 'proposed' ? 'active' : ''}`}
          onClick={() => setActiveView('proposed')}
          disabled={!proposedPortfolio}
        >
          🎯 Proposed Portfolio
        </button>
      </div>

      <div className="view-content">
        {activeView === 'comparison' && existingPortfolio && proposedPortfolio && (
          renderComparisonView()
        )}

        {activeView === 'existing' && existingPortfolio && (
          <div className="single-portfolio-view">
            {renderPortfolioCard(existingPortfolio, 'Current Portfolio', true)}
          </div>
        )}

        {activeView === 'proposed' && proposedPortfolio && (
          <div className="single-portfolio-view">
            {renderPortfolioCard(proposedPortfolio, 'Proposed Portfolio', false)}
          </div>
        )}

        {!existingPortfolio && !proposedPortfolio && (
          <div className="empty-state">
            <h3>No Portfolios Available</h3>
            <p>Upload an existing portfolio and create a proposed portfolio to see the comparison.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioView;
