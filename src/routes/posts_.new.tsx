import { Link, createFileRoute, redirect } from '@tanstack/react-router';
import { useAuth } from '../lib/auth';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import CodeEditor from '@uiw/react-textarea-code-editor/nohighlight';
import { useCreateArticleMutation } from '@/api/queryOptions';
import { CodeBlock } from '@/components/CodeBlock';

export const Route = createFileRoute('/posts/new')({
  component: NewArticleComponent,
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
});

function NewArticleComponent() {
  const queryClient = Route.useRouteContext({ select: (context) => context.queryClient });

  const { isAuthenticated, token } = useAuth();

  const [markdownContent, setMarkdownContent] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [newArticleId, setNewArticleId] = useState<null | string>(null);

  const createArticleMutation = useCreateArticleMutation();

  const markdownComponentOptions = {
    code: CodeBlock,
    pre: ({ ...props }) => <div className="not-prose">{props.children}</div>,
  };

  const handleUpdate = async () => {
    const created = await createArticleMutation.mutateAsync({
      title: postTitle,
      published: isPublished,
      token: token as string,
      content: markdownContent,
    });

    await queryClient.refetchQueries({ queryKey: ['articles', { page: 1 }] });

    setNewArticleId(created.data.post.id);
  };

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-screen-lg bg-background p-2">
        <h3>Login to view this page</h3>
      </div>
    );
  }

  if (createArticleMutation.status === 'success') {
    return (
      <div>
        <p>Article successfully created!</p>
        {newArticleId && (
          <Link to="/posts/$postId" search={{ page: 1 }} params={{ postId: newArticleId }}>
            Go to the article
          </Link>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto flex max-w-screen-lg items-center gap-2">
        <p>Title:</p>
        <Input value={postTitle} onChange={(e) => setPostTitle(e.target.value)} />
        <p>Publish:</p>
        <Switch checked={isPublished} onCheckedChange={(checked) => setIsPublished(checked)} />
        <Button disabled={createArticleMutation.status === 'pending'} type="button" onClick={handleUpdate}>
          Create Article
        </Button>
      </div>
      <div className="mt-2 flex min-w-full justify-center gap-2">
        <div className="w-[48vw] rounded border">
          <CodeEditor
            value={markdownContent}
            placeholder="Write your article here"
            onChange={(e) => setMarkdownContent(e.target.value)}
            language="md"
            padding={15}
            style={{
              fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
              fontSize: 16,
              backgroundColor: 'hsl(20 14.3% 4.1%)',
              minHeight: '85dvh',
            }}
          />
        </div>
        <div className="w-[48vw] rounded border p-4 px-8">
          <Markdown
            remarkPlugins={[remarkGfm]}
            className="prose max-w-screen-sm dark:prose-invert"
            components={markdownComponentOptions}
          >
            {markdownContent}
          </Markdown>
        </div>
      </div>
    </>
  );
}
