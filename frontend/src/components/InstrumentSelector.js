import React, { useState } from 'react';

const InstrumentSelector = ({ instruments, selectedInstruments, onSelect, riskLevel }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const instrumentTypes = [...new Set(instruments.map(i => i.type))];

  const filteredInstruments = instruments.filter(instrument => {
    const matchesType = filter === 'all' || instrument.type === filter;
    const matchesSearch = instrument.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         instrument.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const isSelected = (instrument) => {
    return selectedInstruments.some(i => i.symbol === instrument.symbol);
  };

  return (
    <div className="instrument-selector">
      <div className="selector-header">
        <h2>Available Investment Instruments</h2>
        <p className="selector-subtitle">
          Based on Risk Level {riskLevel} - {instruments.length} instruments available
        </p>
      </div>

      <div className="selector-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name or symbol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({instruments.length})
          </button>
          {instrumentTypes.map(type => (
            <button
              key={type}
              className={`filter-btn ${filter === type ? 'active' : ''}`}
              onClick={() => setFilter(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)} 
              ({instruments.filter(i => i.type === type).length})
            </button>
          ))}
        </div>
      </div>

      <div className="instruments-grid">
        {filteredInstruments.map(instrument => (
          <div
            key={instrument.symbol}
            className={`instrument-card ${isSelected(instrument) ? 'selected' : ''}`}
            onClick={() => onSelect(instrument)}
          >
            <div className="instrument-header">
              <div className="instrument-info">
                <span className="instrument-symbol">{instrument.symbol}</span>
                <span className="instrument-type">{instrument.type}</span>
              </div>
              <div className={`instrument-change ${parseFloat(instrument.change) >= 0 ? 'positive' : 'negative'}`}>
                {parseFloat(instrument.change) >= 0 ? '+' : ''}{instrument.change}%
              </div>
            </div>
            <div className="instrument-name">{instrument.name}</div>
            <div className="instrument-footer">
              <span className="instrument-price">
                {instrument.price.toFixed(2)} {instrument.currency}
              </span>
              <span className="instrument-exchange">{instrument.exchange}</span>
            </div>
            {isSelected(instrument) && (
              <div className="selected-indicator">✓ Selected</div>
            )}
          </div>
        ))}
      </div>

      {filteredInstruments.length === 0 && (
        <div className="no-results">
          <p>No instruments found matching your criteria.</p>
        </div>
      )}

      <div className="selection-summary">
        <p><strong>{selectedInstruments.length}</strong> instruments selected for portfolio</p>
      </div>
    </div>
  );
};

export default InstrumentSelector;
