import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { wordCountValidator } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useCreateCommentMutation } from '@/api/queryOptions';
import { cn } from '@/lib/utils';
import { LoaderCircle } from 'lucide-react';

const FormSchema = z.object({
  author: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters.' })
    .max(32, { message: 'Name must not be longer than 32 characters.' }),
  // comment: z
  //   .string()
  //   .min(10, {
  //     message: 'Comment must be at least 10 characters.',
  //   })
  //   .max(400, {
  //     message: 'Comment must not be longer than 400 characters.',
  //   }),
  comment: wordCountValidator(2, 30),
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
        onSuccess: () => {
          toast('Comment submitted successfully.');
          form.reset();
        },
        onError: () => toast('There was a problem sending your comment.'),
      },
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto w-full space-y-6 sm:w-3/5">
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
        <Button
          type="submit"
          disabled={createCommentMutation.isPending || disabled}
          className={cn('flex', { 'gap-2': createCommentMutation.isPending })}
        >
          <span>
            <LoaderCircle
              className={cn('invisible h-0 w-0', { 'visible h-4 w-4 animate-spin': createCommentMutation.isPending })}
            />
          </span>
          <span>{createCommentMutation.isPending ? 'Sending...' : 'Add Comment'}</span>
        </Button>
        {disabled && <FormMessage>Sending new comments are disabled for this article.</FormMessage>}
      </form>
    </Form>
  );
};

export default CommentForm;
