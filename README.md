## Description

A simple app to fetch and filter Aiven's available cloud providers and sort them by closest distance to user.

## How to run the project

### Backend

1. Prerequisites
   - Python 3.8+
   - pip3 (Python package installer)

2. Install dependencies
   ```bash
   cd backend
   pip3 install -r requirements.txt
   ```

3. Start the backend server
   ```bash
   python3 -m uvicorn main:app --reload
   ```
   The backend will run on http://localhost:3000

### Frontend

1. Prerequisites
   - Node.js 16+
   - npm (Node package manager)

2. Install dependencies
   ```bash
   cd frontend
   npm ci
   ```

3. Start the frontend development server
   ```bash
   npm run start
   ```
   The frontend will run on http://localhost:3001 and automatically open in your default browser.

Both servers need to be running simultaneously for the application to work properly.


## How to test

### Backend

Run unit tests
   ```bash
   cd backend
   python3 -m pytest
   ```

### Frontend

1. Run unit tests
   ```bash
   cd frontend
   npm run test
   ```

2. Generate test coverage report
   ```bash
   npm run test -- --coverage
   ```

The test coverage reports will show which parts of the code are covered by tests and help identify areas that need additional testing.
