import React, { useState } from 'react';

const ExistingPortfolioUpload = ({ clientId, onUploadComplete }) => {
  const [portfolioName, setPortfolioName] = useState('');
  const [holdings, setHoldings] = useState([
    { symbol: '', name: '', quantity: '', currentValue: '', type: 'stocks' }
  ]);
  const [uploading, setUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState('manual'); // 'manual' or 'json'
  const [jsonInput, setJsonInput] = useState('');

  const addHolding = () => {
    setHoldings([
      ...holdings,
      { symbol: '', name: '', quantity: '', currentValue: '', type: 'stocks' }
    ]);
  };

  const removeHolding = (index) => {
    setHoldings(holdings.filter((_, i) => i !== index));
  };

  const updateHolding = (index, field, value) => {
    const updated = [...holdings];
    updated[index][field] = value;
    setHoldings(updated);
  };

  const handleManualUpload = async () => {
    // Validate
    if (!portfolioName.trim()) {
      alert('Please enter a portfolio name');
      return;
    }

    const validHoldings = holdings.filter(h => h.symbol && h.quantity && h.currentValue);
    if (validHoldings.length === 0) {
      alert('Please add at least one valid holding');
      return;
    }

    // Convert to proper format
    const formattedHoldings = validHoldings.map(h => ({
      symbol: h.symbol.toUpperCase(),
      name: h.name || h.symbol.toUpperCase(),
      quantity: parseFloat(h.quantity),
      currentValue: parseFloat(h.currentValue),
      type: h.type
    }));

    await uploadPortfolio(portfolioName, formattedHoldings);
  };

  const handleJsonUpload = async () => {
    try {
      const data = JSON.parse(jsonInput);
      
      if (!data.name || !data.holdings || !Array.isArray(data.holdings)) {
        alert('Invalid JSON format. Must include "name" and "holdings" array');
        return;
      }

      await uploadPortfolio(data.name, data.holdings);
    } catch (error) {
      alert('Invalid JSON format: ' + error.message);
    }
  };

  const uploadPortfolio = async (name, holdingsData) => {
    setUploading(true);
    try {
      const response = await fetch(`http://localhost:5001/api/accounts/${clientId}/existing-portfolio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          holdings: holdingsData
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const result = await response.json();
      alert(`Portfolio uploaded successfully! Saved to: ${result.savedToFile}`);
      
      if (onUploadComplete) {
        onUploadComplete(result.portfolio);
      }

      // Reset form
      setPortfolioName('');
      setHoldings([{ symbol: '', name: '', quantity: '', currentValue: '', type: 'stocks' }]);
      setJsonInput('');
    } catch (error) {
      console.error('Error uploading portfolio:', error);
      alert('Error uploading portfolio: ' + error.message);
    }
    setUploading(false);
  };

  const totalValue = holdings.reduce((sum, h) => {
    const value = parseFloat(h.currentValue) || 0;
    return sum + value;
  }, 0);

  const exampleJson = {
    name: "My Current Portfolio",
    holdings: [
      {
        symbol: "AAPL",
        name: "Apple Inc.",
        quantity: 100,
        currentValue: 17500,
        type: "stocks"
      },
      {
        symbol: "MSFT",
        name: "Microsoft Corporation",
        quantity: 50,
        currentValue: 18500,
        type: "stocks"
      }
    ]
  };

  return (
    <div className="existing-portfolio-upload">
      <div className="upload-header">
        <h2>Upload Existing Portfolio</h2>
        <p>Add your client's current holdings to compare with proposed portfolios</p>
      </div>

      <div className="upload-mode-selector">
        <button
          className={`mode-btn ${uploadMode === 'manual' ? 'active' : ''}`}
          onClick={() => setUploadMode('manual')}
        >
          Manual Entry
        </button>
        <button
          className={`mode-btn ${uploadMode === 'json' ? 'active' : ''}`}
          onClick={() => setUploadMode('json')}
        >
          JSON Upload
        </button>
      </div>

      {uploadMode === 'manual' ? (
        <div className="manual-upload-section">
          <div className="form-group">
            <label>Portfolio Name *</label>
            <input
              type="text"
              placeholder="E.g., Current Holdings"
              value={portfolioName}
              onChange={(e) => setPortfolioName(e.target.value)}
              className="portfolio-name-input"
            />
          </div>

          <div className="holdings-section">
            <div className="holdings-header">
              <h3>Holdings</h3>
              <button className="btn btn-secondary btn-small" onClick={addHolding}>
                + Add Holding
              </button>
            </div>

            <div className="holdings-list">
              {holdings.map((holding, index) => (
                <div key={index} className="holding-row">
                  <div className="holding-fields">
                    <input
                      type="text"
                      placeholder="Symbol *"
                      value={holding.symbol}
                      onChange={(e) => updateHolding(index, 'symbol', e.target.value)}
                      className="holding-input symbol-input"
                    />
                    <input
                      type="text"
                      placeholder="Name (optional)"
                      value={holding.name}
                      onChange={(e) => updateHolding(index, 'name', e.target.value)}
                      className="holding-input name-input"
                    />
                    <input
                      type="number"
                      placeholder="Quantity *"
                      value={holding.quantity}
                      onChange={(e) => updateHolding(index, 'quantity', e.target.value)}
                      className="holding-input quantity-input"
                      step="0.01"
                    />
                    <input
                      type="number"
                      placeholder="Current Value *"
                      value={holding.currentValue}
                      onChange={(e) => updateHolding(index, 'currentValue', e.target.value)}
                      className="holding-input value-input"
                      step="0.01"
                    />
                    <select
                      value={holding.type}
                      onChange={(e) => updateHolding(index, 'type', e.target.value)}
                      className="holding-input type-select"
                    >
                      <option value="stocks">Stocks</option>
                      <option value="bonds">Bonds</option>
                      <option value="etfs">ETFs</option>
                      <option value="mutual_funds">Mutual Funds</option>
                      <option value="commodities">Commodities</option>
                      <option value="crypto">Crypto</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <button
                    className="btn-remove"
                    onClick={() => removeHolding(index)}
                    disabled={holdings.length === 1}
                    title="Remove holding"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="holdings-summary">
              <span className="summary-label">Total Portfolio Value:</span>
              <span className="summary-value">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>

          <div className="upload-actions">
            <button
              className="btn btn-primary btn-large"
              onClick={handleManualUpload}
              disabled={uploading || !portfolioName.trim()}
            >
              {uploading ? 'Uploading...' : 'Upload Portfolio'}
            </button>
          </div>
        </div>
      ) : (
        <div className="json-upload-section">
          <div className="json-example">
            <h4>JSON Format Example:</h4>
            <pre>{JSON.stringify(exampleJson, null, 2)}</pre>
          </div>

          <div className="form-group">
            <label>Paste JSON Data *</label>
            <textarea
              placeholder="Paste your portfolio JSON here..."
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="json-input"
              rows="15"
            />
          </div>

          <div className="upload-actions">
            <button
              className="btn btn-primary btn-large"
              onClick={handleJsonUpload}
              disabled={uploading || !jsonInput.trim()}
            >
              {uploading ? 'Uploading...' : 'Upload JSON Portfolio'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExistingPortfolioUpload;
