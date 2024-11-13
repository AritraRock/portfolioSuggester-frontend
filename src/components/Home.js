import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();


  // Check for the auth token in localStorage
  const authTokens = JSON.parse(localStorage.getItem('authTokens')) || null;

  // Redirect to login page if not authenticated
  useEffect(() => {
    if (!authTokens) {
      navigate('/login');
    }
  }, [authTokens, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authTokens');
    navigate('/login');
  };

  const [investmentDetails, setInvestmentDetails] = useState({
    amount: '',
    timeHorizon: '',
    riskLevel: 'Moderate',
  });

  const [portfolio, setPortfolio] = useState({ equity: 0, debt: 0 });
  const [equityData, setEquityData] = useState([]);
  const [hybridData, setHybridData] = useState([]);
  const [debtData, setDebtData] = useState([]);

  const handleChange = (e) => {
    setInvestmentDetails({
      ...investmentDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const optimizedPortfolio = await optimizePortfolio(investmentDetails);
    setPortfolio(optimizedPortfolio);
  };

  const fetchFundData = async (amount, riskLevel, type, limit) => {
    try {
      console.log(`Sending ${amount} ${riskLevel} ${type} ${limit}`)
      const response = await axios.get('http://localhost:8000/api/v1/funds/getOptPortfolio', {
        params: {
          amount: amount,
          risk: riskLevel,
          assetType: type,
          limit: limit,
        },
      });
      console.log(response.data.data)
      return response.data.data;
    } catch (error) {
      console.error("Error fetching fund data:", error);
      return [];
    }
  };

  const optimizePortfolio = async (details) => {
    const { amount, riskLevel } = details;
    const parsedAmount = parseFloat(amount);
    let portfolio = { equity: 0, debt: 0 };
    
    let equityResponse = [], hybridResponse = [], debtResponse = [];

    if (riskLevel === 'Very High') {
      portfolio.equity = parsedAmount * 0.80;
      portfolio.debt = parsedAmount * 0.20;
      equityResponse = await fetchFundData(portfolio.equity, riskLevel, 'Equity', 2);
      hybridResponse = await fetchFundData(portfolio.debt, "High", 'Hybrid', 1);
    } else if (riskLevel === 'High') {
      portfolio.equity = parsedAmount * 0.70;
      portfolio.debt = parsedAmount * 0.30;
      equityResponse = await fetchFundData(portfolio.equity, "Very High", 'Equity', 2);
      debtResponse = await fetchFundData(portfolio.debt, "Moderate", 'Debt', 1);
    } else if (riskLevel === 'Moderate to High') {
      portfolio.equity = parsedAmount * 0.60;
      portfolio.debt = parsedAmount * 0.40;
      hybridResponse = await fetchFundData(portfolio.equity, riskLevel, 'Hybrid', 2);
      equityResponse = await fetchFundData(portfolio.debt / 2, "Very High", 'Equity', 1);
      debtResponse = await fetchFundData(portfolio.debt / 2, "Moderate", 'Debt', 1);
    } else if (riskLevel === 'Moderate') {
      portfolio.equity = parsedAmount * 0.30;
      portfolio.debt = parsedAmount * 0.70;
      debtResponse = await fetchFundData(portfolio.debt, riskLevel, 'Debt', 2);
      hybridResponse = await fetchFundData(portfolio.equity, riskLevel, 'Hybrid', 1);
    } else {
      portfolio.equity = parsedAmount * 0.20;
      portfolio.debt = parsedAmount * 0.80;
      debtResponse = await fetchFundData(portfolio.debt, riskLevel, 'Debt', 2);
      hybridResponse = await fetchFundData(portfolio.equity, "Moderate", 'Hybrid', 1);
    }

    setEquityData(equityResponse);
    setHybridData(hybridResponse);
    setDebtData(debtResponse);
    // setPortfolio(portfolioCurr);
    return portfolio;
  };

  const equityDebtChartData = {
    labels: ['Equity', 'Debt'],
    datasets: [
      {
        data: portfolio ? [portfolio.equity, portfolio.debt] : [0, 0],
        backgroundColor: ['#ff6384', '#36a2eb'],
      },
    ],
  };

  const createPieData = (data) => ({
    labels: data.length>1?data.map((fund) => fund.cap_Type): [data[0].cap_Type],
    datasets: [
      {
        data: data.length>1?data.map((fund) => fund.allocation):[data[0].allocation],
        backgroundColor: ['#4BC0C0', '#9966FF'],
        hoverOffset: 4,
      },
    ],
  });

  const options = (data)=>({
    responsive: true,
    plugins: {
        tooltip: {
            callbacks: {
                label: function (tooltipItem) {
                  console.log(data)
                  console.log(tooltipItem.dataIndex)
                    const fund = data[tooltipItem.dataIndex];
                    console.log(fund)
                    return `${fund.allocation} ${fund.fund_Name}`;
                },
              },
        },
    },
    rotation: 0,  // Start the chart from the top
    cutout: 0,    // Removes the center hole if there is one (making it a full pie)
    // maintainAspectRatio: false,  // Optional, depending on your layout
  })
  
  // const equityChartOptions = options(equityData);
  // const hybridChartOptions = options(hybridData);
  // const debtChartOptions = options(debtData);
  return (
    <div className="min-h-screen bg-gray-300 flex flex-col">
      {/* Navigation Bar */}
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div className="text-2xl font-bold">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">Portfolio Suggester</span>
        </div>
        {authTokens && (
          <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded-lg">
            Logout
          </button>
        )}
      </div>

      {/* Investment Form and Portfolio Results */}
      <div className="flex flex-col items-center py-6">
        <form className="bg-white p-6 rounded-lg shadow-lg w-[26rem]" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold mb-6 text-center">Investment Details</h2>

          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Investment Amount ($)</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={investmentDetails.amount}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="timeHorizon" className="block text-sm font-medium text-gray-700">Time Horizon (Years)</label>
            <input
              type="number"
              id="timeHorizon"
              name="timeHorizon"
              value={investmentDetails.timeHorizon}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="riskLevel" className="block text-sm font-medium text-gray-700">Risk Level</label>
            <select
              id="riskLevel"
              name="riskLevel"
              value={investmentDetails.riskLevel}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded"
            >
              <option value="Very High">Very High</option>
              <option value="High">High</option>
              <option value="Moderate to High">Moderate to High</option>
              <option value="Moderate">Moderate</option>
              <option value="Low to Moderate">Low to Moderate</option>
            </select>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg mb-6">
            Submit
          </button>
        </form>

        {/* Pie Chart */}
        {/* {portfolio && (
          <div className="mt-6 w-[26rem]">
            <h3 className="text-2xl font-bold mb-4">Suggested Portfolio Allocation</h3>
            <Pie data={equityDebtChartData} options={options}/>
            {
              (equityDebtChartData.datasets.data.portfolio)
            }
          </div>
        )} */}
        {portfolio && 
        (<div className="mt-6 w-[26rem]">
            <Pie data={equityDebtChartData} />
          </div>)
        }
      </div>

      <div className='flex justify-center items-center'>
      
        {equityData.length > 0 && (
          <div className="mt-6 w-[26rem]">
            <Pie data={createPieData(equityData)} options={options(equityData)} />
          </div>
        )}
        {hybridData.length > 0 && (
          <div className="mt-6 w-[26rem]">
            <Pie data={createPieData(hybridData)} options={options(hybridData)} />
          </div>
        )}
        {debtData.length > 0 && (
          <div className="mt-6 w-[26rem]">
            <Pie data={createPieData(debtData)} options={options(debtData)} />
          </div>
        )}

      </div>
    </div>
  );
};

export default Home;
