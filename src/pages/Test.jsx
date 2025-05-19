import React from "react";

const StockChartView = () => {
  return (
    <div className="w-full h-screen p-4" style={{height : 3000}}>
      <h2 className="text-xl font-bold mb-2">Stock Chart</h2>
      <iframe
        src="https://stock-chart-view.streamlit.app/?embedded=true"
        width="100%"
        height="600px"
        style={{ border: "none" }}
        title="Stock Chart"
      />
    </div>
  );
};

export default StockChartView;
