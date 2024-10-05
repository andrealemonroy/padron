import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthImage from '../images/auth-image.jpg';
import { useAuth } from '../context/AuthProvider';
import Form from '../components/Form';
import FormInput from '../components/FormInput';
import Button from '../components/Button'; // Import the Button component


function Signin() {
  const navigate = useNavigate();
  const { login } = useAuth(); // Get the login function from Auth context

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    try {
      await login(data.email, data.password);

      navigate('/dashboard');
    } catch (error) {
      toast.error(
        'Ocurrió un error al iniciar sesión, por favor, revisa tus credenciales'
      );
      console.error('Sign-in error', error);
    }
  };

  return (
    <main className="bg-white dark:bg-gray-900">
      <div className="relative md:flex">
        {/* Content */}
        <div className="md:w-1/2">
          <div className="min-h-[100vh] h-full flex flex-col after:flex-1">
            {/* Header */}
            <div className="flex-1">
              <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link className="block" to="/">
                  <img src="/img/logo.png" alt="Logo" className="h-8" />
                </Link>
              </div>
            </div>

            <div className="max-w-sm mx-auto w-full px-4 py-8">
              <h1 className="text-3xl text-gray-800 dark:text-gray-100 font-bold mb-6">
                Inicio de sesión
              </h1>
              {/* Form */}
              <Form onSubmit={onSubmit}>
                <div className="space-y-4">
                  <FormInput
                    name="email"
                    label="Correo electrónico"
                    type="email"
                    validation={{ required: 'Correo electrónico es requerido' }}
                  />
                  <FormInput
                    name="password"
                    label="Contraseña"
                    type="password"
                    validation={{ required: 'Contraseña es requerida' }}
                  />
                </div>
                <div className="flex items-center justify-between mt-6">
                  <Button type="submit" variant="primary">
                    Iniciar sesión
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>

        {/* Image */}
        <div
          className="hidden md:block absolute top-0 bottom-0 right-0 md:w-1/2"
          aria-hidden="true"
        >
          <img
            className="object-cover object-center w-full h-full"
            src={AuthImage}
            width="760"
            height="1024"
            alt="Authentication"
          />
        </div>
      </div>
    </main>
  );
}

export default Signin;
