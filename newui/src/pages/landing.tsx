import { Link } from 'react-router';
import { CheckCircle, BookOpenCheck, BarChart3, Users, Shield, Zap } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpenCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-xl text-gray-900">GradeBook</h1>
            </div>
          </div>
          <Link
            to="/login"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-6">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">Smart Grading & Plagiarism Detection</span>
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Grade Smarter,
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Detect Plagiarism Instantly
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            Streamline assignment grading with AI-powered similarity detection.
            Perfect for CSE, EE, ME, and ECE educators managing hundreds of submissions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all"
            >
              Get Started Free
            </Link>
            <a
              href="#features"
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-blue-600 hover:text-blue-600 transition-colors"
            >
              See Features
            </a>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="mt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none" />
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 max-w-5xl mx-auto">
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-left">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <BookOpenCheck className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Upload Assignments</h3>
                <p className="text-sm text-gray-600">PDF, DOCX, TXT & code files</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-left">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Detect Similarity</h3>
                <p className="text-sm text-gray-600">AI-powered plagiarism check</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-left">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Grade & Export</h3>
                <p className="text-sm text-gray-600">Rubric-based grading + reports</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need</h2>
          <p className="text-xl text-gray-600">Powerful features for modern educators</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<BookOpenCheck className="w-6 h-6" />}
            title="Assignment Management"
            description="Create assignments with titles, subjects, deadlines, and rubrics. Organize by department and track submissions in real-time."
            color="blue"
          />
          <FeatureCard
            icon={<Shield className="w-6 h-6" />}
            title="Plagiarism Detection"
            description="Advanced similarity checking between all student submissions. Identify copied text, code sections, and matched pairs instantly."
            color="purple"
          />
          <FeatureCard
            icon={<BarChart3 className="w-6 h-6" />}
            title="Detailed Reports"
            description="Visual dashboards showing similarity percentages, top matched pairs, and highlighted copied sections for easy review."
            color="green"
          />
          <FeatureCard
            icon={<CheckCircle className="w-6 h-6" />}
            title="Rubric-Based Grading"
            description="Define custom grading rubrics or grade manually. Provide detailed feedback and track grades across all assignments."
            color="orange"
          />
          <FeatureCard
            icon={<Users className="w-6 h-6" />}
            title="Student Portal"
            description="Students can submit assignments, view grades, and read feedback in a dedicated portal. Simple and intuitive interface."
            color="pink"
          />
          <FeatureCard
            icon={<Zap className="w-6 h-6" />}
            title="Export & Share"
            description="Export grades and reports to Excel or PDF. Share results with students or administrators with one click."
            color="indigo"
          />
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Built for Engineering Educators</h2>
            <p className="text-xl text-gray-600">Trusted by CSE, EE, ME, and ECE departments</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <UseCaseCard
              title="For Teachers"
              features={[
                'Create and manage unlimited assignments',
                'Upload student submissions in bulk',
                'Run similarity checks with one click',
                'Review detailed plagiarism reports',
                'Grade with custom rubrics',
                'Export results to Excel/PDF',
              ]}
              cta="Start Teaching"
            />
            <UseCaseCard
              title="For Students"
              features={[
                'View all assigned work in one place',
                'Submit assignments with ease',
                'Upload multiple file formats',
                'Track submission status',
                'View grades and feedback',
                'Download graded submissions',
              ]}
              cta="Start Learning"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Grading?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of educators using EduCheck Pro to save time and ensure academic integrity.
          </p>
          <Link
            to="/login"
            className="inline-block px-10 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-2xl transition-all"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>&copy; 2026 EduCheck Pro. Built with ❤️ for educators.</p>
        </div>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'blue' | 'purple' | 'green' | 'orange' | 'pink' | 'indigo';
}

function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    pink: 'bg-pink-100 text-pink-600',
    indigo: 'bg-indigo-100 text-indigo-600',
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className={`w-12 h-12 ${colorClasses[color]} rounded-lg flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="font-semibold text-lg text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

interface UseCaseCardProps {
  title: string;
  features: string[];
  cta: string;
}

function UseCaseCard({ title, features, cta }: UseCaseCardProps) {
  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">{title}</h3>
      <ul className="space-y-4 mb-8">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      <Link
        to="/login"
        className="block text-center px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
      >
        {cta}
      </Link>
    </div>
  );
}
