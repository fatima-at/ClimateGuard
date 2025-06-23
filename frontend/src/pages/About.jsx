// src/pages/About.jsx
export default function About() {
  return (
    <main className="bg-white w-[calc(100%-25rem)] mt-24 rounded-3xl shadow-xl p-8 dark:bg-darkmain min-h-screen transition text-gray-800 dark:text-white" style={{ marginLeft: '21rem' }}>
      <h1 className="text-4xl font-bold mb-6">About ClimateGuard</h1>
      <p className="text-lg leading-relaxed mb-4">
        <strong>ClimateGuard</strong> is a smart microclimate monitoring and early warning system
        built to empower communities with real-time, hyperlocal weather insights.
        From monitoring temperature and humidity to detecting solar radiation and wind shifts,
        ClimateGuard helps users adapt to climate change on a local scale.
      </p>

      <p className="text-lg leading-relaxed mb-4">
        Our system integrates:
        <ul className="list-disc pl-6 mt-2">
          <li>Industrial-grade sensors (LSI LASTEM DNB300)</li>
          <li>Edge computing with Rock Pi for efficient processing</li>
          <li>AI forecasting and anomaly detection models</li>
          <li>An intuitive web dashboard for real-time visualization</li>
        </ul>
      </p>

      <p className="text-lg leading-relaxed mb-4">
        Whether you're a farmer, city planner, or environmentalist,
        ClimateGuard delivers actionable insights that help you respond faster and plan smarter.
      </p>

      <p className="text-lg">The ClimateGuard Team – 2025.</p>
    </main>
  );
}
