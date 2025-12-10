import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PortfolioComparison = ({ clientId, existingPortfolioId, proposedPortfolioId }) => {
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (existingPortfolioId && proposedPortfolioId) {
      loadComparison();
    }
  }, [existingPortfolioId, proposedPortfolioId]);

  const loadComparison = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:5001/api/portfolios/compare', {
        existingPortfolioId,
        proposedPortfolioId
      });
      setComparison(response.data);
    } catch (err) {
      console.error('Error loading comparison:', err);
      setError(err.response?.data?.error || 'Failed to load comparison');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="portfolio-comparison loading">
        <div className="loading-spinner"></div>
        <p>Loading comparison...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="portfolio-comparison error">
        <div className="error-message">
          <h3>Error Loading Comparison</h3>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadComparison}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!comparison) {
    return (
      <div className="portfolio-comparison empty">
        <p>Select portfolios to compare</p>
      </div>
    );
  }

  const { existing, proposed, differences, holdingsAnalysis, allocationChanges } = comparison;

  return (
    <div className="portfolio-comparison">
      <div className="comparison-header">
        <h2>Portfolio Comparison</h2>
        <p>Compare existing holdings with proposed portfolio</p>
      </div>

      {/* Summary Cards */}
      <div className="comparison-summary">
        <div className="summary-card existing">
          <div className="card-header">
            <h3>Existing Portfolio</h3>
            <span className="portfolio-name">{existing.name}</span>
          </div>
          <div className="card-body">
            <div className="stat">
              <span className="stat-label">Total Value</span>
              <span className="stat-value">${existing.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Holdings</span>
              <span className="stat-value">{existing.holdingsCount}</span>
            </div>
          </div>
        </div>

        <div className="summary-card arrow">
          <div className="arrow-icon">→</div>
        </div>

        <div className="summary-card proposed">
          <div className="card-header">
            <h3>Proposed Portfolio</h3>
            <span className="portfolio-name">{proposed.name}</span>
          </div>
          <div className="card-body">
            <div className="stat">
              <span className="stat-label">Total Value</span>
              <span className="stat-value">${proposed.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Holdings</span>
              <span className="stat-value">{proposed.holdingsCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Differences */}
      <div className="differences-section">
        <h3>Key Differences</h3>
        <div className="differences-grid">
          <div className="difference-card">
            <span className="difference-label">Value Change</span>
            <span className={`difference-value ${differences.valueChange >= 0 ? 'positive' : 'negative'}`}>
              {differences.valueChange >= 0 ? '+' : ''}${differences.valueChange.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="percentage">({differences.valueChangePercent}%)</span>
            </span>
          </div>
          <div className="difference-card">
            <span className="difference-label">Holdings Change</span>
            <span className={`difference-value ${differences.holdingsCountChange >= 0 ? 'positive' : 'negative'}`}>
              {differences.holdingsCountChange >= 0 ? '+' : ''}{differences.holdingsCountChange}
            </span>
          </div>
          <div className="difference-card">
            <span className="difference-label">Added Holdings</span>
            <span className="difference-value">{holdingsAnalysis.addedCount}</span>
          </div>
          <div className="difference-card">
            <span className="difference-label">Removed Holdings</span>
            <span className="difference-value">{holdingsAnalysis.removedCount}</span>
          </div>
        </div>
      </div>

      {/* Holdings Analysis */}
      <div className="holdings-analysis">
        <h3>Holdings Analysis</h3>

        {holdingsAnalysis.addedCount > 0 && (
          <div className="analysis-section added">
            <h4>Added Holdings ({holdingsAnalysis.addedCount})</h4>
            <div className="holdings-table">
              <div className="table-header">
                <div className="col-symbol">Symbol</div>
                <div className="col-name">Name</div>
                <div className="col-allocation">Allocation</div>
                <div className="col-type">Type</div>
              </div>
              <div className="table-body">
                {holdingsAnalysis.added.map((holding, index) => (
                  <div key={index} className="table-row">
                    <div className="col-symbol">{holding.symbol}</div>
                    <div className="col-name">{holding.name}</div>
                    <div className="col-allocation">{holding.allocation}%</div>
                    <div className="col-type">{holding.type}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {holdingsAnalysis.removedCount > 0 && (
          <div className="analysis-section removed">
            <h4>Removed Holdings ({holdingsAnalysis.removedCount})</h4>
            <div className="holdings-table">
              <div className="table-header">
                <div className="col-symbol">Symbol</div>
                <div className="col-name">Name</div>
                <div className="col-value">Value</div>
                <div className="col-type">Type</div>
              </div>
              <div className="table-body">
                {holdingsAnalysis.removed.map((holding, index) => (
                  <div key={index} className="table-row">
                    <div className="col-symbol">{holding.symbol}</div>
                    <div className="col-name">{holding.name}</div>
                    <div className="col-value">${holding.currentValue?.toLocaleString()}</div>
                    <div className="col-type">{holding.type}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {allocationChanges.length > 0 && (
          <div className="analysis-section allocation-changes">
            <h4>Allocation Changes ({allocationChanges.length})</h4>
            <div className="holdings-table">
              <div className="table-header">
                <div className="col-symbol">Symbol</div>
                <div className="col-name">Name</div>
                <div className="col-existing">Existing</div>
                <div className="col-proposed">Proposed</div>
                <div className="col-change">Change</div>
              </div>
              <div className="table-body">
                {allocationChanges.map((change, index) => (
                  <div key={index} className="table-row">
                    <div className="col-symbol">{change.symbol}</div>
                    <div className="col-name">{change.name}</div>
                    <div className="col-existing">{change.existingAllocation}%</div>
                    <div className="col-proposed">{change.proposedAllocation}%</div>
                    <div className={`col-change ${parseFloat(change.allocationChange) >= 0 ? 'positive' : 'negative'}`}>
                      {parseFloat(change.allocationChange) >= 0 ? '+' : ''}{change.allocationChange}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detailed Holdings Comparison */}
      <div className="detailed-comparison">
        <h3>Detailed Holdings Comparison</h3>
        <div className="comparison-tables">
          <div className="comparison-table-container">
            <h4>Existing Portfolio</h4>
            <div className="holdings-table">
              <div className="table-header">
                <div className="col-symbol">Symbol</div>
                <div className="col-name">Name</div>
                <div className="col-quantity">Quantity</div>
                <div className="col-value">Value</div>
              </div>
              <div className="table-body">
                {existing.holdings.map((holding, index) => (
                  <div key={index} className="table-row">
                    <div className="col-symbol">{holding.symbol}</div>
                    <div className="col-name">{holding.name}</div>
                    <div className="col-quantity">{holding.quantity}</div>
                    <div className="col-value">${holding.currentValue?.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="comparison-table-container">
            <h4>Proposed Portfolio</h4>
            <div className="holdings-table">
              <div className="table-header">
                <div className="col-symbol">Symbol</div>
                <div className="col-name">Name</div>
                <div className="col-allocation">Allocation</div>
                <div className="col-price">Price</div>
              </div>
              <div className="table-body">
                {proposed.holdings.map((holding, index) => (
                  <div key={index} className="table-row">
                    <div className="col-symbol">{holding.symbol}</div>
                    <div className="col-name">{holding.name}</div>
                    <div className="col-allocation">{holding.allocation}%</div>
                    <div className="col-price">${holding.price?.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioComparison;
