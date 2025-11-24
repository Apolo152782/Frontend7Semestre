import React from 'react';

const Dashboard = () => {
    return (
        <div
            style={{
                padding: '10px',
                marginTop: '10px',
                minHeight: 'calc(100vh - 100px)',
                backgroundColor: '#f8f9fa',
            }}
        >
            <div
                style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    padding: '20px',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                    border: '1px solid #e0e0e0',
                }}
            >
                <h2
                    style={{
                        color: '#333',
                        fontSize: '1.4rem',
                        marginBottom: '20px',
                        paddingBottom: '10px',
                        borderBottom: '2px solid #f0f0f0',
                    }}
                >
                    📊 Dashboard Power BI
                </h2>
                <iframe
                    title="Power BI Report"
                    width="100%"
                    height="800px"
                    src="https://app.powerbi.com/view?r=eyJrIjoiOWI3YjY1ZjQtZGUxNS00ZmI4LTg2ZjMtYzRiMzZjOWMyNTY4IiwidCI6IjlkMTJiZjNmLWU0ZjYtNDdhYi05MTJmLTFhMmYwZmM0OGFhNCIsImMiOjR9"
                    frameBorder="0"
                    allowFullScreen={true}
                ></iframe>
            </div>
        </div>
    );
};

export default Dashboard;
