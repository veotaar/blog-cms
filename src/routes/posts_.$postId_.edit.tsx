import { createFileRoute, redirect } from '@tanstack/react-router';
import { useAuth } from '../lib/auth';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useState } from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor/nohighlight';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { articleQueryOptions } from '@/api/queryOptions';
import { useUpdateArticleMutation } from '@/api/queryOptions';
import { z } from 'zod';
import { CodeBlock } from '@/components/CodeBlock';

const postsSearchSchema = z.object({
  page: z.number().catch(1),
});

export const Route = createFileRoute('/posts/$postId/edit')({
  component: EditComponent,
  validateSearch: postsSearchSchema,
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
  loader: async ({ params, context }) => {
    return await context.queryClient.ensureQueryData(articleQueryOptions(params.postId, context.auth.token as string));
  },
});

function EditComponent() {
  const { postId } = Route.useParams();
  const queryClient = Route.useRouteContext({ select: (context) => context.queryClient });
  const { page } = Route.useSearch();

  const loaderData = Route.useLoaderData();
  const { title, content, published } = loaderData.data.post;

  const { isAuthenticated, token } = useAuth();

  const [markdownContent, setMarkdownContent] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [unsaved, setUnsaved] = useState(false);

  const updateArticleMutation = useUpdateArticleMutation(postId);

  const markdownComponentOptions = {
    code: CodeBlock,
    pre: ({ ...props }) => <div className="not-prose">{props.children}</div>,
  };

  useEffect(() => {
    setMarkdownContent(content);
    setPostTitle(title);
    setIsPublished(published);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdate = async () => {
    await updateArticleMutation.mutateAsync(
      {
        title: postTitle,
        published: isPublished,
        token: token as string,
        content: markdownContent,
        postId: postId,
      },
      {
        onSuccess: () => setUnsaved(false),
      },
    );
    await queryClient.refetchQueries({ queryKey: ['articles', { page: page }] });
  };

  const handleMarkdownChange = (val: string) => {
    setMarkdownContent(val);
    setUnsaved(true);
  };

  const handleTitleChange = (val: string) => {
    setPostTitle(val);
    setUnsaved(true);
  };

  const handlePublishedChange = (val: boolean) => {
    setIsPublished(val);
    setUnsaved(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-screen-lg bg-background p-2">
        <h3>Login to view posts</h3>
      </div>
    );
  }

  if (!loaderData) {
    return <p>loading...</p>;
  }

  return (
    <>
      <div className="mx-auto flex max-w-screen-lg items-center gap-2">
        <p>Title:</p>
        <Input value={postTitle} onChange={(e) => handleTitleChange(e.target.value)} />
        <p>Publish:</p>
        <Switch checked={isPublished} onCheckedChange={(checked) => handlePublishedChange(checked)} />
        <Button disabled={updateArticleMutation.isPending || !unsaved} type="button" onClick={handleUpdate}>
          Save Changes {unsaved ? '*' : ''}
        </Button>
      </div>
      <div className="mt-2 flex min-w-full justify-center gap-2">
        <div className="w-[48vw] rounded border">
          <CodeEditor
            value={markdownContent}
            onChange={(e) => handleMarkdownChange(e.target.value)}
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
