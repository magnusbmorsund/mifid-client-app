import React, { useState, useEffect } from 'react';
import PortfolioChart from './PortfolioChart';

const PortfolioBuilder = ({ selectedInstruments, setSelectedInstruments, onCreatePortfolio }) => {
  const [portfolioName, setPortfolioName] = useState('');
  const [totalAllocation, setTotalAllocation] = useState(0);

  useEffect(() => {
    const total = selectedInstruments.reduce((sum, inst) => sum + (inst.allocation || 0), 0);
    setTotalAllocation(total);
  }, [selectedInstruments]);

  const handleAllocationChange = (symbol, value) => {
    const newValue = Math.max(0, Math.min(100, parseFloat(value) || 0));
    const updated = selectedInstruments.map(inst =>
      inst.symbol === symbol ? { ...inst, allocation: newValue } : inst
    );
    setSelectedInstruments(updated);
  };

  const removeInstrument = (symbol) => {
    setSelectedInstruments(selectedInstruments.filter(inst => inst.symbol !== symbol));
  };

  const distributeEvenly = () => {
    const evenAllocation = selectedInstruments.length > 0 
      ? parseFloat((100 / selectedInstruments.length).toFixed(2))
      : 0;
    const updated = selectedInstruments.map(inst => ({
      ...inst,
      allocation: evenAllocation
    }));
    setSelectedInstruments(updated);
  };

  const handleSubmit = () => {
    if (selectedInstruments.length === 0) {
      alert('Please select at least one instrument');
      return;
    }

    if (Math.abs(totalAllocation - 100) > 0.1) {
      alert('Total allocation must equal 100%');
      return;
    }

    if (!portfolioName.trim()) {
      alert('Please enter a portfolio name');
      return;
    }

    const portfolio = {
      name: portfolioName,
      holdings: selectedInstruments.map(inst => ({
        symbol: inst.symbol,
        name: inst.name,
        allocation: inst.allocation,
        price: inst.price,
        type: inst.type
      })),
      totalValue: selectedInstruments.reduce((sum, inst) => 
        sum + (inst.allocation * inst.price / 100), 0
      )
    };

    onCreatePortfolio(portfolio);
  };

  const allocationColor = () => {
    if (Math.abs(totalAllocation - 100) < 0.1) return '#22c55e';
    if (totalAllocation > 100) return '#ef4444';
    return '#f97316';
  };

  if (selectedInstruments.length === 0) {
    return (
      <div className="portfolio-builder empty">
        <div className="empty-state">
          <h3>No Instruments Selected</h3>
          <p>Select instruments from the list above to start building your portfolio</p>
        </div>
      </div>
    );
  }

  return (
    <div className="portfolio-builder">
      <div className="builder-header">
        <h2>Portfolio Builder</h2>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={distributeEvenly}>
            Distribute Evenly
          </button>
        </div>
      </div>

      <div className="portfolio-name-input">
        <label>Portfolio Name</label>
        <input
          type="text"
          placeholder="E.g., Balanced Growth Portfolio"
          value={portfolioName}
          onChange={(e) => setPortfolioName(e.target.value)}
        />
      </div>

      <div className="allocation-summary">
        <div className="summary-item">
          <span className="summary-label">Total Allocation</span>
          <span className="summary-value" style={{ color: allocationColor() }}>
            {totalAllocation.toFixed(2)}%
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Instruments</span>
          <span className="summary-value">{selectedInstruments.length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Remaining</span>
          <span className="summary-value">
            {(100 - totalAllocation).toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="allocation-progress">
        <div 
          className="progress-fill" 
          style={{ 
            width: `${Math.min(totalAllocation, 100)}%`,
            backgroundColor: allocationColor()
          }}
        />
      </div>

      <div className="holdings-table">
        <div className="table-header">
          <div className="col-instrument">Instrument</div>
          <div className="col-price">Price</div>
          <div className="col-allocation">Allocation %</div>
          <div className="col-actions">Actions</div>
        </div>
        <div className="table-body">
          {selectedInstruments.map(instrument => (
            <div key={instrument.symbol} className="table-row">
              <div className="col-instrument">
                <div className="instrument-cell">
                  <span className="cell-symbol">{instrument.symbol}</span>
                  <span className="cell-name">{instrument.name}</span>
                  <span className="cell-type">{instrument.type}</span>
                </div>
              </div>
              <div className="col-price">
                {instrument.price.toFixed(2)} {instrument.currency}
              </div>
              <div className="col-allocation">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={instrument.allocation || 0}
                  onChange={(e) => handleAllocationChange(instrument.symbol, e.target.value)}
                  className="allocation-input"
                />
              </div>
              <div className="col-actions">
                <button
                  className="btn-remove"
                  onClick={() => removeInstrument(instrument.symbol)}
                  title="Remove from portfolio"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <PortfolioChart selectedInstruments={selectedInstruments} />

      <div className="builder-actions">
        {Math.abs(totalAllocation - 100) > 0.1 && (
          <p className="validation-message">
            {totalAllocation > 100 
              ? `Allocation exceeds 100% by ${(totalAllocation - 100).toFixed(2)}%`
              : `Allocation is ${(100 - totalAllocation).toFixed(2)}% short of 100%`
            }
          </p>
        )}
        <button
          className="btn btn-primary btn-large"
          onClick={handleSubmit}
          disabled={Math.abs(totalAllocation - 100) > 0.1 || !portfolioName.trim()}
        >
          Create Portfolio
        </button>
      </div>
    </div>
  );
};

export default PortfolioBuilder;
