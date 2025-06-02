"use client";

export default function ConnectYoutubePage() {
  return (
    <div className="min-h-screen flex flex-col p-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white-900 mb-2">
            No Channels found.
          </h1>
          <p className="text-gray-500 mb-6">
            To accelerate the growth of your YouTube channel at lightning speed,
            connect with our Tier 1 CMS today!
          </p>
          <button className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition">
            Add Channel
          </button>
        </div>
        <div className="p-4 text-left">
          <h2 className="text-lg font-bold mb-4 text-white-800">
            Eligibility Criteria for Your Channel:
          </h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span>
                <span className="font-semibold">Subscriber Count:</span> Your
                channel must have over 1,000 subscribers.
              </span>
            </li>
            <li className="flex items-start">
              <span>
                <span className="font-semibold">Monetization:</span>{" "}
                Monetization must be enabled on your channel.
              </span>
            </li>
            <li className="flex items-start">
              <span>
                <span className="font-semibold">Revenue:</span> The average
                revenue over the last 90 days must exceed $100.00
              </span>
            </li>
            <li className="flex items-start">
              <span>
                <span className="font-semibold">Channel Standing:</span> Your
                channel must maintain a good standing overall, including:
                <ul className="list-disc list-inside ml-6 text-sm mt-1 text-gray-600">
                  <li>Community Guidelines compliance</li>
                  <li>No copyright strikes</li>
                  <li>No content ID claims</li>
                </ul>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
