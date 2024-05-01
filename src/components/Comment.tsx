import DeleteCommentButton from './DeleteCommentButton';
import { useDeleteCommentMutation } from '@/api/queryOptions';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { formatDistanceToNowStrict, format } from 'date-fns';
import { decode } from 'html-entities';
import { cn } from '@/lib/utils';

type CommentProps = {
  id: string;
  author: string;
  content: string;
  postId: string;
  page: number;
  createdAt: string;
};

const Comment = ({ id, author, content, postId, page, createdAt }: CommentProps) => {
  const { token } = useAuth();
  const deleteCommentMutation = useDeleteCommentMutation(postId, id, page);

  const handleDelete = () => {
    deleteCommentMutation.mutate(
      {
        commentId: id,
        token: token as string,
      },
      {
        onSuccess: () => toast('comment deleted'),
        onError: () => toast('there was an error'),
      },
    );
  };

  return (
    <div
      key={id}
      className={cn('group flex items-center justify-between gap-2 rounded-md border bg-card p-4 px-6', {
        'animate-pulse': deleteCommentMutation.isPending,
      })}
    >
      <div>
        <p>
          <span className="font-bold">{author}</span>{' '}
          <span className="text-muted-foreground">{formatDistanceToNowStrict(createdAt, { addSuffix: true })}</span>{' '}
          <span className="text-muted-foreground">{format(createdAt, 'yyyy.MM.dd  kk:mm:ss')}</span>
        </p>
        <p className="text-neutral-600 dark:text-neutral-300">{decode(content)}</p>
      </div>
      <div className="opacity-0 transition-opacity group-hover:opacity-100">
        <DeleteCommentButton commentAuthor={author} commentContent={content} deleteFn={handleDelete} />
      </div>
    </div>
  );
};

export default Comment;
