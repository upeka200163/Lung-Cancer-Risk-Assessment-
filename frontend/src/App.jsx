import QuestionnaireForm from './components/QuestionnaireForm';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="container mx-auto max-w-5xl">
        <header className="mb-8 text-center">
          <div className="mb-4 text-6xl">🏥</div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            Lung Cancer Risk Assessment
          </h1>
          <p className="text-lg text-gray-600">AI-Powered Early Detection & Analysis System</p>
          <p className="text-sm text-gray-500 mt-2">Based on clinical research and symptom analysis</p>
        </header>

        <main>
          <QuestionnaireForm />
        </main>
      </div>
    </div>
  );
}

export default App;
