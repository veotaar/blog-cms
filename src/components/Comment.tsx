import DeleteCommentButton from './DeleteCommentButton';
import { useDeleteCommentMutation } from '@/api/queryOptions';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

type CommentProps = {
  id: string;
  author: string;
  content: string;
  postId: string;
  page: number;
};

const Comment = ({ id, author, content, postId, page }: CommentProps) => {
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
    <div key={id} className="rounded-md border border-violet-300 p-2">
      <div>
        <p className="italic">{author} says:</p>
        <p>{content}</p>
      </div>
      <div>
        <DeleteCommentButton commentAuthor={author} commentContent={content} deleteFn={handleDelete} />
      </div>
    </div>
  );
};

export default Comment;
