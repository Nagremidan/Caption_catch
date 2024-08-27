import SalesReport from '../../components/SalesReport';
import ErrorBoundary from '../../components/ErrorBoundary';

export default function Home() {
  return (
    <div className='pt-16'> 
    <ErrorBoundary>
      <SalesReport />
    </ErrorBoundary>
    </div>

  );
}