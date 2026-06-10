import { Suspense } from 'react';
import SuccessContent from './success-content';

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto px-6 py-20 text-center">Loading order details...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
