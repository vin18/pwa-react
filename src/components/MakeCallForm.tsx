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
import { SIP_URL } from '@/App';
import { useSIPProvider } from 'react-sipjs';
import { useMakeCallModal } from '@/hooks/useMakeCallModal';

function MakeCallForm() {
  const [loading, setLoading] = useState(false);
  const { dealer } = useAuth();
  const { sessionManager } = useSIPProvider();
  const { onClose } = useMakeCallModal();

  const form = useForm<z.infer<typeof makeCallSchema>>({
    resolver: zodResolver(makeCallSchema),
    defaultValues: {
      clientId: '',
      phoneNumber: '',
    },
  });

  async function onSubmit(values: z.infer<typeof makeCallSchema>) {
    const customHeaders = [
      `DI: ${dealer.dealerid}`,
      `DN: ${dealer.phonenumber}`,
      `CN: ${values.phoneNumber}`,
      `CI: ${values.clientId}`,
    ];

    console.log('Make a call custom headers', customHeaders);

    const inviterOptions = { extraHeaders: customHeaders };
    // await sessionManager?.call(`sip:9386@${SIP_URL}`, inviterOptions);
    setLoading(true);
    try {
      await sessionManager?.call(
        `sip:${dealer.phonenumber}@${SIP_URL}`,
        inviterOptions
      );
      toast.success(`Call initiated`);
      onClose();
    } catch (error) {
    } finally {
      setLoading(false);
    }

    // TODO: Make a call

    // try {
    //   setLoading(true);
    //   await updateClientRecordsApi(payload);
    //   const data = await getCallsApi();
    //   setCalls(data);
    //   toast.success(`Details updated successfully`);
    //   onClose();
    // } catch (error) {
    //   console.log(error);
    //   toast.error(error?.response?.data?.message ?? error?.message);
    // } finally {
    //   setLoading(false);
    // }
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
