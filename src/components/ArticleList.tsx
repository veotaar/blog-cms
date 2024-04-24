import { ArticleListResponse, PostPreview } from '@/api/getArticles';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Link } from '@tanstack/react-router';
import { useSearch } from '@tanstack/react-router';

type ArticeDetailProps = Omit<PostPreview, 'createdAt' | 'updatedAt'>;
type ArticleListProps = Omit<ArticleListResponse, 'status'>;

const ArticleDetail = ({ author, title, commentCount, published, id }: ArticeDetailProps) => {
  const { page } = useSearch({ from: '/posts' });

  return (
    <div className="rounded-md border px-4 py-2 transition-colors duration-200 hover:border-primary">
      <div className="flex items-center gap-1">
        <Link
          search={{ page: page }}
          from="/posts"
          to="/posts/$postId"
          params={{ postId: id }}
          className="text-lg font-bold tracking-wide"
        >
          {title}
        </Link>
        {published ? <Badge>Published</Badge> : <Badge variant="outline">Draft</Badge>}
      </div>
      <div className="flex items-center gap-2 text-sm">
        <p className="italic text-muted-foreground">by {author ? author.username : 'deleted user'}</p>
        <Separator orientation="vertical" className="h-3" />
        <p className="text-muted-foreground">
          {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
        </p>
      </div>
    </div>
  );
};

const ArticleList = ({ data }: ArticleListProps) => {
  return (
    <div className="flex flex-col gap-2 p-4">
      {data.posts.map((post) => {
        // const { author, title, commentCount, published, id } = post;

        return (
          // <ArticleDetail key={id} author={author} title={title} commentCount={commentCount} published={published} />
          <ArticleDetail key={post.id} {...post} />
        );
      })}
    </div>
  );
};

export default ArticleList;
