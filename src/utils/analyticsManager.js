import Chart from 'chart.js/auto';

// Mock data generator for demo purposes
const generateMockData = (days) => {
  const data = [];
  const now = new Date();
  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.unshift({
      date: date.toISOString().split('T')[0],
      visits: Math.floor(Math.random() * 100),
      policies: Math.floor(Math.random() * 10),
      claims: Math.floor(Math.random() * 5),
      revenue: Math.floor(Math.random() * 10000)
    });
  }
  return data;
};

// Create line chart
export const createLineChart = (ctx, data, options = {}) => {
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map(d => d.date),
      datasets: [
        {
          label: options.label || 'Value',
          data: data.map(d => d[options.dataKey || 'value']),
          borderColor: options.color || '#882323',
          tension: 0.1
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: options.title || 'Chart'
        }
      }
    }
  });
};

// Create bar chart
export const createBarChart = (ctx, data, options = {}) => {
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(d => d.date),
      datasets: [
        {
          label: options.label || 'Value',
          data: data.map(d => d[options.dataKey || 'value']),
          backgroundColor: options.color || '#882323'
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: options.title || 'Chart'
        }
      }
    }
  });
};

// Create pie chart
export const createPieChart = (ctx, data, options = {}) => {
  return new Chart(ctx, {
    type: 'pie',
    data: {
      labels: data.map(d => d.label),
      datasets: [
        {
          data: data.map(d => d.value),
          backgroundColor: options.colors || [
            '#882323',
            '#A84B4B',
            '#C87373',
            '#E89B9B',
            '#F5C3C3'
          ]
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: options.title || 'Chart'
        }
      }
    }
  });
};

// Get analytics data
export const getAnalyticsData = (period = 30) => {
  // In a real application, this would fetch data from an API
  return generateMockData(period);
};

// Calculate summary statistics
export const calculateSummaryStats = (data) => {
  return {
    totalVisits: data.reduce((sum, d) => sum + d.visits, 0),
    totalPolicies: data.reduce((sum, d) => sum + d.policies, 0),
    totalClaims: data.reduce((sum, d) => sum + d.claims, 0),
    totalRevenue: data.reduce((sum, d) => sum + d.revenue, 0),
    avgDailyVisits: Math.round(data.reduce((sum, d) => sum + d.visits, 0) / data.length),
    avgDailyPolicies: Math.round(data.reduce((sum, d) => sum + d.policies, 0) / data.length * 10) / 10,
    avgDailyClaims: Math.round(data.reduce((sum, d) => sum + d.claims, 0) / data.length * 10) / 10,
    avgDailyRevenue: Math.round(data.reduce((sum, d) => sum + d.revenue, 0) / data.length)
  };
};

// Export data to CSV
export const exportToCSV = (data, filename = 'analytics.csv') => {
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => row[header]).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}; 