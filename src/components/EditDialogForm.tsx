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
import { callSchema } from '@/schemas/call';
import { updateClientRecordsApi } from '@/services/apiClientDetails';
import { getCallsApi } from '@/services/apiCalls';
import { useEditHistory } from '@/hooks/useEditCallHistory';
import { Textarea } from './ui/textarea';

function EditDialogForm({ clientDetailsData, setCalls }) {
  const [loading, setLoading] = useState(false);
  const { onClose } = useEditHistory();

  const form = useForm<z.infer<typeof callSchema>>({
    resolver: zodResolver(callSchema),
    defaultValues: {
      clientId: clientDetailsData?.clientid ?? '',
      remarks: clientDetailsData?.remarks ?? '',
    },
  });

  async function onSubmit(values: z.infer<typeof callSchema>) {
    const payload = {
      clientId: values.clientId,
      remarks: values.remarks,
      sessionId: clientDetailsData?.sessionid,
    };

    try {
      setLoading(true);
      await updateClientRecordsApi(payload);
      const data = await getCallsApi();
      setCalls(data);
      toast.success(`Details updated successfully`);
      onClose();
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message ?? error?.message);
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
                        placeholder="Your client id"
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
            name="remarks"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Remarks</FormLabel>
                  <FormControl className="flex">
                    <>
                      <Textarea {...field} value={field.value} />
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <Button disabled={loading} type="submit" className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Updating..' : 'Edit'}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default EditDialogForm;
