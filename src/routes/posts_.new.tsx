import { Link, createFileRoute, redirect } from '@tanstack/react-router';
import { useAuth } from '../lib/auth';
// import { createArticle } from '@/api/createArticle';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { useState } from 'react';
// import { useMutation } from '@tanstack/react-query';
import CodeMirror, { ReactCodeMirrorRef, EditorView } from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { defaultHighlightStyle, syntaxHighlighting, HighlightStyle } from '@codemirror/language';
import { tags } from '@lezer/highlight';
import { useCreateArticleMutation } from '@/api/queryOptions';

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
  const refs = useRef<ReactCodeMirrorRef>({});

  const queryClient = Route.useRouteContext({ select: (context) => context.queryClient });

  const { isAuthenticated, token } = useAuth();

  const [markdownContent, setMarkdownContent] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [newArticleId, setNewArticleId] = useState<null | string>(null);

  // const { mutate: articleMutate, isPending } = useMutation({
  //   mutationFn: createArticle,
  //   onSuccess: (data) => {
  //     setIsCreated(true);
  //     setNewArticleId(data.data.post?.id as string);
  //   },
  //   onError: (error) => {
  //     console.error(error);
  //   },
  // });

  const createArticleMutation = useCreateArticleMutation();

  const handleUpdate = async () => {
    // articleMutate(postId, { title: postTitle, published: isPublished, content: markdownContent }, token as string);
    const created = await createArticleMutation.mutateAsync({
      title: postTitle,
      published: isPublished,
      token: token as string,
      content: markdownContent,
    });

    await queryClient.refetchQueries({ queryKey: ['articles', { page: 1 }] });

    setNewArticleId(created.data.post.id);
  };

  // const handleChange = useCallback((val, viewUpdate) => {
  //   setMarkdownContent(val);
  // }, []);

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
      <div className="flex gap-2">
        <Input value={postTitle} onChange={(e) => setPostTitle(e.target.value)} />
        <Switch checked={isPublished} onCheckedChange={(checked) => setIsPublished(checked)} />
        <Button disabled={createArticleMutation.status === 'pending'} type="button" onClick={handleUpdate}>
          Create Article
        </Button>
      </div>
      <div className="flex min-w-full justify-center gap-2">
        <div className="w-[48vw] border">
          <CodeMirror
            ref={refs}
            value={markdownContent}
            basicSetup={{
              lineNumbers: false,
            }}
            extensions={[
              markdown({ base: markdownLanguage, codeLanguages: languages }),
              EditorView.lineWrapping,
              syntaxHighlighting(defaultHighlightStyle),
              syntaxHighlighting(
                HighlightStyle.define([
                  { tag: tags.heading1, fontSize: '180%' },
                  { tag: tags.heading2, fontSize: '140%' },
                  { tag: tags.heading3, fontSize: '130%' },
                ]),
              ),
            ]}
            theme={vscodeDark}
            minHeight="calc(100svh - 5rem)"
            maxWidth="48vw"
            onChange={(val, _view) => setMarkdownContent(val)}
          />
        </div>
        <div className="mx-auto w-[48vw] border p-4">
          <Markdown rehypePlugins={[rehypeHighlight]} remarkPlugins={[remarkGfm]} className="prose dark:prose-invert">
            {markdownContent}
          </Markdown>
        </div>
      </div>
    </>
  );
}
