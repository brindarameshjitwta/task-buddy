
import { auth, provider, signInWithPopup } from '../firebase';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      localStorage.setItem('user', JSON.stringify(result.user));
      navigate('/task-list'); // Redirect to task list
    } catch (error) {
      console.error('Google Sign-In Error:', error);
    }
  };

 return (
    <div className="h-screen bg-[#fff7f7] flex items-center justify-center relative overflow-hidden">
      
      {/* Desktop View */}
      <div className="absolute w-full h-full hidden md:flex items-center justify-end pr-16 pointer-events-none">
        {/* Concentric Circles in Background */}
        <div className="relative w-[600px] h-[600px] z-0">
          <div className="absolute w-full h-full border border-[#8a2be2] rounded-full"></div>
          <div className="absolute top-8 left-8 w-[80%] h-[80%] border border-[#8a2be2] rounded-full"></div>
          <div className="absolute top-16 left-16 w-[60%] h-[60%] border border-[#8a2be2] rounded-full"></div>
        </div>
        {/* Image Positioned on Desktop */}
        <img 
          src="/assets/images/task-list.png" 
          alt="Hero" 
          className="absolute md:top-[45%] md:right-[60px] md:w-[550px] md:h-[650px] md:object-contain md:transform md:-translate-y-1/2 md:z-10"
        />
      </div>

      {/* Mobile View with Circles and Logo */}
      <div className="absolute w-full h-full flex md:hidden items-center justify-center overflow-hidden pointer-events-none">
        <div className="relative w-full h-full">
          <div className="absolute top-[5%] left-[5%] w-[100px] h-[100px] border border-[#8a2be2] rounded-full"></div>
          <div className="absolute top-[5%] left-[5%] w-[80px] h-[80px] border border-[#8a2be2] rounded-full"></div>
          <div className="absolute top-[40%] right-[5%] w-[130px] h-[130px] border border-[#8a2be2] rounded-full"></div>
          <div className="absolute top-[40%] right-[5%] w-[110px] h-[110px] border border-[#8a2be2] rounded-full"></div>
          <div className="absolute bottom-[10%] left-[10%] w-[90px] h-[90px] border border-[#8a2be2] rounded-full"></div>
          <div className="absolute bottom-[10%] left-[10%] w-[70px] h-[70px] border border-[#8a2be2] rounded-full"></div>
        </div>
      </div>

      {/* Desktop Content */}
      <div className="hidden md:flex w-full h-full items-center justify-between px-16">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold text-[#8a2be2] flex items-center">
            <span className="mr-2">📋</span> TaskBuddy
          </h1>
          <p className="text-gray-600 mt-4">
            Streamline your workflow and track progress effortlessly with our all-in-one task management app.
          </p>
          <button
            onClick={handleGoogleSignIn}
            className="mt-8 bg-black text-white flex items-center py-3 px-6 rounded-lg cursor-pointer z-10"
          >
            <img 
              src="https://cdn1.iconfinder.com/data/icons/logos-brands-in-colors/544/Google__G__Logo-512.png"
              alt="Google Logo" 
              className="w-7 h-7 mr-3" 
            />
            Continue with Google
          </button>
        </div>
      </div>

      {/* Mobile Content */}
      <div className="flex flex-col items-center justify-center w-full md:hidden">
        <h1 className="text-4xl font-bold text-[#8a2be2] flex items-center">
          <span className="mr-2">📋</span> TaskBuddy
        </h1>
        <p className="text-gray-600 text-center mt-4 px-8">
          Streamline your workflow and track progress effortlessly with our all-in-one task management app.
        </p>
        <button
          onClick={handleGoogleSignIn}
          className="mt-8 bg-black text-white flex items-center py-3 px-6 rounded-lg cursor-pointer z-20"
        >
          <img 
            src="https://cdn1.iconfinder.com/data/icons/logos-brands-in-colors/544/Google__G__Logo-512.png"
            alt="Google Logo" 
            className="w-7 h-7 mr-3" 
          />
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
