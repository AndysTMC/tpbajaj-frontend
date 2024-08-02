import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, Alert, Dropdown, DropdownButton, Badge } from 'react-bootstrap';
import './App.css';

function App() {
  const [apiInput, setApiInput] = useState('');
  const [apiResponse, setApiResponse] = useState(null);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ numbers: true, alphabets: true, highestAlphabet: true });
  
  function handleApiInputChange(e) {
    setApiInput(e.target.value);
  }

  function handleSubmit() {
    try {
      JSON.parse(apiInput);
      fetch('http://localhost:4000/bfhl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(JSON.parse(apiInput))
      }).then(res => res.json())
        .then(data => {
          console.log(data);
          setApiResponse(data);
        })
        .catch((e) => {
          console.error("Error fetching data:", e);
          setError('Failed to fetch data');
        });
    } catch (e) {
      setError('Invalid JSON');
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  }

  function handleFilterChange(e) {
    const value = e;
    setFilters({ ...filters, [value]: !filters[value] });
  }

  function handleRemoveFilter(filter) {
    setFilters({ ...filters, [filter]: false });
  }

  function convertStyle(list) {
    if (list && list.length > 0) {
      return list.join(', ');
    }
    return 'No data available';
  }

  return (
    <div className="App container mt-5">
      <div className="main-content">
        <Form>
          <Form.Group controlId="api_input">
            <Form.Label>API Input</Form.Label>
            <Form.Control
              type="text"
              value={apiInput}
              onChange={handleApiInputChange}
              isInvalid={!!error}
            />
            {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
          </Form.Group>
          <Button variant="primary" onClick={handleSubmit} className="mt-2">
            Submit
          </Button>
        </Form>
        <Form.Group controlId="response-filter" className="mt-4">
          <Form.Label>Response Filter</Form.Label>
          <DropdownButton id="dropdown-basic-button" title="Select Filters">
            {!filters.numbers && <Dropdown.Item onClick={() => handleFilterChange("numbers")}>Numbers</Dropdown.Item>}
            {!filters.alphabets && <Dropdown.Item onClick={() => handleFilterChange("alphabets")}>Alphabets</Dropdown.Item>}
            {!filters.highestAlphabet && <Dropdown.Item onClick={() => handleFilterChange("highestAlphabet")}>Highest Alphabet</Dropdown.Item>}
          </DropdownButton>
        </Form.Group>
        <div className="selected-filters mt-2">
          {filters.numbers && <Badge pill variant="primary" className="m-1 btn" onClick={() => handleRemoveFilter("numbers")}>Numbers &times;</Badge>}
          {filters.alphabets && <Badge pill variant="primary" className="m-1 btn" onClick={() => handleRemoveFilter("alphabets")}>Alphabets &times;</Badge>}
          {filters.highestAlphabet && <Badge pill variant="primary" className="m-1 btn" onClick={() => handleRemoveFilter("highestAlphabet")}>Highest Alphabet &times;</Badge>}
        </div>
        {
          apiResponse && (
            <div className="response mt-4">
              <p>Filtered Response</p>
              {filters.numbers && <p>Numbers: {convertStyle(apiResponse.numbers)}</p>}
              {filters.alphabets && <p>Alphabets: {convertStyle(apiResponse.alphabets)}</p>}
              {filters.highestAlphabet && <p>Highest Alphabet: {convertStyle(apiResponse.highestAlphabet)}</p>}
            </div>
          )
        }
      </div>
    </div>
  );
}

export default App;
