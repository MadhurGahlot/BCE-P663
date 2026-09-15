import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { AppProvider } from './store/AppContext';
import { router } from './routes';

export default function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          style: { borderRadius: '12px', fontSize: '13px' },
        }}
      />
    </AppProvider>
  );
}
