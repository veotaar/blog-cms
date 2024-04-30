import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useCreateCommentMutation } from '@/api/queryOptions';

const FormSchema = z.object({
  author: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters.' })
    .max(32, { message: 'Name must not be longer than 32 characters.' }),
  comment: z
    .string()
    .min(10, {
      message: 'Comment must be at least 10 characters.',
    })
    .max(400, {
      message: 'Comment must not be longer than 400 characters.',
    }),
});

type CommentFormProps = {
  postId: string;
  page: number;
  disabled: boolean;
};

const CommentForm = ({ postId, page, disabled }: CommentFormProps) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      author: '',
      comment: '',
    },
  });

  const createCommentMutation = useCreateCommentMutation(postId, page);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    createCommentMutation.mutate(
      {
        author: data.author,
        content: data.comment,
        postId: postId,
      },
      {
        onSuccess: () => toast('Comment submitted successfully.'),
        onError: () => toast('There was a problem sending your comment.'),
      },
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author</FormLabel>
              <FormControl>
                <Input disabled={disabled} placeholder="Write your name here" className="resize-none" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comment</FormLabel>
              <FormControl>
                <Textarea
                  disabled={disabled}
                  placeholder="What do you think about this article?"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={createCommentMutation.isPending || disabled}>
          {createCommentMutation.isPending ? 'Sending...' : 'Send'}
        </Button>
        {disabled && <FormMessage>Sending new comments are disabled for this article.</FormMessage>}
      </form>
    </Form>
  );
};

export default CommentForm;
