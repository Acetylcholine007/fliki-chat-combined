import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import MainPage from './pages/main.page';
import SignInPage from './pages/signin.page';
import RegisterPage from './pages/register.page';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Theme } from 'react-daisyui';
import JoinPrompt from './features/chat/components/join-prompt.component';
import ChatList from './features/chat/components/chat-list.component';
import ChatWelcome from './features/chat/components/chat-welcome.component';
import ErrorScreen from './common/widgets/error-screen.component';
import ParticipantsList from './features/chat/components/participants-list.component';

const router = createBrowserRouter([
  {
    path: '/sign-in',
    element: <SignInPage />,
    errorElement: <ErrorScreen />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
    errorElement: <ErrorScreen />,
  },
  {
    path: '/participants/:chatGroupId',
    element: <ParticipantsList />,
    errorElement: <ErrorScreen />,
  },
  {
    path: '/',
    element: <MainPage />,
    errorElement: <ErrorScreen />,
    children: [
      {
        path: '/',
        element: <ChatWelcome />,
        errorElement: <ErrorScreen />,
      },
      {
        path: '/join/:chatGroupId',
        element: <JoinPrompt />,
        errorElement: <ErrorScreen />,
      },
      {
        path: '/:chatGroupId',
        element: <ChatList />,
        errorElement: <ErrorScreen />,
      },
    ],
  },
]);

function App() {
  return (
    <Theme dataTheme="halloween">
      <div className="h-screen w-screen overflow-hidden bg-slate-800">
        <RouterProvider router={router} />
        <ToastContainer />
      </div>
    </Theme>
  );
}

export default App;
