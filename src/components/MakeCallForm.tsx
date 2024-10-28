import { useState } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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
import { makeCallSchema } from '@/schemas/call';

import { Textarea } from './ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useMakeCallModal } from '@/hooks/useMakeCallModal';
import { Inviter, UserAgent } from 'sip.js';
import { useSIPProvider } from './SipProvider';

function MakeCallForm() {
  const [loading, setLoading] = useState(false);
  const { dealer, userAgent } = useAuth();
  const { sessionManager } = useSIPProvider();
  const { onClose } = useMakeCallModal();

  const form = useForm<z.infer<typeof makeCallSchema>>({
    resolver: zodResolver(makeCallSchema),
    defaultValues: {
      clientId: '',
      phoneNumber: '',
    },
  });

  const makeCall = (target, inviterOptions) => {
    // Create an Inviter instance to initiate the call
    const inviter = new Inviter(userAgent, target, inviterOptions);
    console.log('Inviter', inviter);

    inviter
      .invite()
      .then(() => {
        console.log('Call initiated');
        toast.success(`Call initiated`);
      })
      .catch((error) => {
        console.error('Error initiating call:', error);
      });
  };

  async function onSubmit(values: z.infer<typeof makeCallSchema>) {
    const SIP_URL = import.meta.env.VITE_SIP_IP;
    const customHeaders = [
      `DI: ${dealer.dealerid}`,
      `DN: ${dealer.phonenumber}`,
      `CN: ${values.phoneNumber}`,
      `CI: ${values.clientId}`,
    ];

    const inviterOptions = { extraHeaders: customHeaders };
    // await sessionManager?.call(`sip:9386@${SIP_URL}`, inviterOptions);
    setLoading(true);
    try {
      // await sessionManager?.call(
      //   `sip:${dealer.phonenumber}@${SIP_URL}`,
      //   inviterOptions
      // );
      makeCall(`sip:${dealer.phonenumber}@${SIP_URL}`, inviterOptions);
      onClose();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col justify-between">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Client ID</FormLabel>
                  <FormControl className="flex">
                    <>
                      <Input
                        {...field}
                        // placeholder="Your client id"
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
            name="phoneNumber"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Phone number</FormLabel>
                  <FormControl className="flex">
                    <>
                      <Input {...field} value={field.value.toUpperCase()} />
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <Button disabled={loading} type="submit" className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Calling..' : 'Call'}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default MakeCallForm;
