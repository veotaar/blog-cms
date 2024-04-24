import { createFileRoute, redirect } from '@tanstack/react-router';
import { useAuth } from '../lib/auth';
import { getArticle } from '@/api/getArticle';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { updateArticle } from '@/api/updateArticle';
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

export const Route = createFileRoute('/posts/$postId/edit')({
  component: EditComponent,
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
  loader: ({ params, context }) => getArticle(params.postId, context.auth.token as string),
});

function EditComponent() {
  const { postId } = Route.useParams();
  const refs = useRef<ReactCodeMirrorRef>({});
  const loaderData = Route.useLoaderData();
  const { title, content, published } = loaderData.data.post;

  const { isAuthenticated, token } = useAuth();

  const [markdownContent, setMarkdownContent] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [unsaved, setUnsaved] = useState(false);

  const { mutate: articleMutate, isPending } = useMutation({
    mutationFn: updateArticle,
    onSuccess: (_data) => setUnsaved(false),
    onError: (error) => {
      console.error(error);
    },
  });

  useEffect(() => {
    setMarkdownContent(content);
    setPostTitle(title);
    setIsPublished(published);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdate = () => {
    // articleMutate(postId, { title: postTitle, published: isPublished, content: markdownContent }, token as string);
    articleMutate({
      title: postTitle,
      published: isPublished,
      token: token as string,
      content: markdownContent,
      postId: postId,
    });
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

  // const handleChange = useCallback((val, viewUpdate) => {
  //   setMarkdownContent(val);
  // }, []);

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
      <div className="flex gap-2">
        <Input value={postTitle} onChange={(e) => handleTitleChange(e.target.value)} />
        <Switch checked={isPublished} onCheckedChange={(checked) => handlePublishedChange(checked)} />
        <Button disabled={isPending} type="button" onClick={handleUpdate}>
          Save Changes {unsaved ? '*' : ''}
        </Button>
      </div>
      <div className="flex min-w-full justify-center gap-2">
        <div className="w-[48vw] border">
          <CodeMirror
            ref={refs}
            value={markdownContent}
            extensions={[markdown({ base: markdownLanguage, codeLanguages: languages })]}
            theme={vscodeDark}
            minHeight="calc(100svh - 5rem)"
            onChange={(val, _view) => handleMarkdownChange(val)}
          />
        </div>
        <div className="mx-auto w-[48vw] border p-4">
          <Markdown
            rehypePlugins={[rehypeHighlight]}
            remarkPlugins={[remarkGfm]}
            className="prose max-w-none dark:prose-invert"
          >
            {markdownContent}
          </Markdown>
        </div>
      </div>
    </>
  );
}
