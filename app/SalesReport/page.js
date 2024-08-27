import SalesReport from '../../components/SalesReport';
import ErrorBoundary from '../../components/ErrorBoundary';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
     
     <ErrorBoundary>
      <SalesReport />
    </ErrorBoundary>
    </main>
  );
}