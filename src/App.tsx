import React, { useState } from "react";

const API_BASE_URL =
  "https://bul2u9q6ld.execute-api.ap-south-1.amazonaws.com/default/";

function Shortener() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copyStatus, setCopyStatus] = useState("Copy");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShortUrl("");
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ longUrl }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Response Error:", errorText);
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setShortUrl(data.shortUrl);
      setLongUrl("");
    } catch (err) {
      console.error(err);
      setError("Failed to shorten URL. Check the URL and API status.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (shortUrl) {
      navigator.clipboard
        .writeText(shortUrl)
        .then(() => {
          setCopyStatus("Copied!");
          setTimeout(() => setCopyStatus("Copy"), 2000);
        })
        .catch((err) => {
          console.error("Copy failed:", err);
          setCopyStatus("Failed");
        });
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 flex items-start pt-20 justify-center">
      <div className="bg-gray-700 p-8 rounded-xl shadow-2xl w-full max-w-lg">
        <h1 className="text-4xl font-bold text-white mb-8 flex items-center">
          Serverless URL Shortener
          <span className="ml-3 text-blue-400">🔗</span>
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="url"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="Enter the long URL (e.g., https://example.com)"
            required
            className="p-3 text-lg border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-600 text-white placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`
              p-3 text-xl font-semibold rounded-lg transition duration-200 
              ${
                isLoading
                  ? "bg-blue-500 cursor-not-allowed opacity-75"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }
            `}
          >
            {isLoading ? "Shortening..." : "Shorten URL"}
          </button>
        </form>

        {error && (
          <p className="text-red-400 mt-4 p-3 bg-gray-600 rounded-lg border-l-4 border-red-500">
            Error: {error}
          </p>
        )}

        {shortUrl && (
          <div className="mt-6 p-4 bg-gray-600 rounded-lg">
            <p className="text-gray-300 text-sm mb-2 font-medium">
              Your Short URL:
            </p>
            <div className="flex items-center gap-2">
              <span className="flex-grow p-2 text-blue-300 bg-gray-700 rounded-md truncate font-mono">
                {shortUrl}
              </span>
              <button
                onClick={copyToClipboard}
                className={`
                  p-2 w-24 rounded-lg font-medium transition duration-200 text-white
                  ${
                    copyStatus === "Copied!"
                      ? "bg-green-500"
                      : copyStatus === "Failed"
                        ? "bg-red-500"
                        : "bg-indigo-600 hover:bg-indigo-700"
                  }
                `}
              >
                {copyStatus}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Shortener;
