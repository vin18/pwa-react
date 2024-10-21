import { useState, useEffect } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { EyeIcon, EyeOffIcon, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import { loginFormSchema } from '@/schemas/user';
import { loginApi } from '@/services/apiAuth';
import { useAxiosWithAuth } from '@/utils/apiClient';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirectToPath = searchParams.get('redirectTo');
  useAxiosWithAuth();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      dealerId: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    const payload = {
      dealerId: values.dealerId.toUpperCase(),
      password: values.password,
    };

    try {
      setLoading(true);
      const data = await loginApi(payload);
      toast.success(`Logged in successfully`);
      navigate('/dashboard');
      login(data);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message ?? error?.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    console.log('isAuthenticated', isAuthenticated);
    console.log('redirectToPath', redirectToPath);
    if (isAuthenticated && redirectToPath) navigate(`/${redirectToPath}`);
    else if (isAuthenticated) navigate(`/dashboard`);
  }, [isAuthenticated, navigate, redirectToPath]);

  return (
    <div className="flex flex-col justify-between h-screen">
      <Card className="mx-8 lg:mx-auto max-w-sm mt-12 shadow-sm rounded-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-primary">
            Login
          </CardTitle>
          <CardDescription>
            Enter your credentials to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="dealerId"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Dealer ID</FormLabel>
                      <FormControl className="flex">
                        <>
                          <Input
                            {...field}
                            placeholder="Your dealer id"
                            value={field.value.toUpperCase()}
                          />
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            {showPassword ? (
                              <EyeIcon className="h-4 w-4" aria-hidden="true" />
                            ) : (
                              <EyeOffIcon
                                className="h-4 w-4"
                                aria-hidden="true"
                              />
                            )}
                            <span className="sr-only">
                              {showPassword ? 'Hide password' : 'Show password'}
                            </span>
                          </Button>
                        </div>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <Button disabled={loading} type="submit" className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Logging in..' : 'Login'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
