import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import "./App.css"; // Import CSS file for class names

function App() {
  const [apiUrl, setApiUrl] = useState("");
  const [error, setError] = useState(null);
  const [manualJson, setManualJson] = useState("");
  const [renderFormat, setRenderFormat] = useState("html");
  const [renderedContent, setRenderedContent] = useState(null);

  const handleGetJson = async () => {
    try {
      if (!apiUrl) {
        return alert(" Please enter the API endpoint URL.");
      }
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();

      setError(null);
      setManualJson(JSON.stringify(data, null, 2)); // Set JSON data directly in textarea
      renderData(data);
    } catch (error) {
      alert("Error fetching data. Please check the API endpoint URL.");
    }
  };

  const showAlert = (message, duration = 3000, type = "error") => {
    setError(message);
    setTimeout(() => {
      setError(null);
    }, duration);
  };

  const handleManualJsonChange = (e) => {
    const jsonData = e.target.value;
    setManualJson(jsonData);
    try {
      const parsedData = JSON.parse(jsonData);
      setError(null);
      renderData(parsedData);
    } catch (error) {
      showAlert("Invalid JSON data format.");
      setRenderedContent(null); // Clear rendered content if JSON is invalid
    }
  };

  const renderData = (data) => {
    if (renderFormat === "html") {
      // Generate HTML markup
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>JSON to HTML</title>
        </head>
        <body>
          <ul>
            ${Object.entries(data)
              .map(([key, value]) => {
                return `<li><strong>${key}:</strong> ${
                  Array.isArray(value) ? JSON.stringify(value) : value
                }</li>`;
              })
              .join("")}
          </ul>
        </body>
        </html>
      `;
      setRenderedContent(htmlContent);
    } else if (renderFormat === "markdown") {
      // Render as Markdown
      const markdownContent = "```\n" + JSON.stringify(data, null, 2) + "\n```";
      setRenderedContent(markdownContent);
    }
  };

  return (
    <div className="main-container">
      <div className="api-section">
        <h4>API End point</h4>
        <div className="input-container">
          <input
            type="text"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="Enter API Endpoint URL"
          />
          <button onClick={handleGetJson}>GET</button>
        </div>
      </div>

      {/* content display section */}
      <div className="content-display-sections">
        <div className="left-section">
          <h3>JSON </h3>
          <textarea
            value={manualJson}
            onChange={handleManualJsonChange}
            placeholder="Enter or edit JSON data manually"
            rows={10}
            cols={50}
          />
        </div>

        <div className="right-section">
          <div className="button-section">
            <button onClick={() => setRenderFormat("html")}>HTML</button>
            <button onClick={() => setRenderFormat("markdown")}>
              Markdown
            </button>
          </div>
          <div className="rendered-content">
            {renderedContent && renderFormat === "markdown" ? (
              <ReactMarkdown>{renderedContent}</ReactMarkdown>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: renderedContent }} />
            )}
          </div>
        </div>
        {error && (
          <div className={`alert ${error.type === "success" ? "success" : ""}`}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
