import { createFileRoute } from '@tanstack/react-router';
import { redirect } from '@tanstack/react-router';
import { settingsQueryOptions, useUpdateSettingsMutation } from '@/api/queryOptions';
import { useAuth } from '@/lib/auth';
import { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export const Route = createFileRoute('/settings')({
  component: Settings,
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
  loader: async ({ context }) => {
    return await context.queryClient.ensureQueryData(settingsQueryOptions(context.auth.token as string));
  },
});

function Settings() {
  const { isAuthenticated, token } = useAuth();

  const loaderData = Route.useLoaderData();
  const { allowComments, allowSignups } = loaderData.data.settings;

  const [commentStatus, setCommentStatus] = useState(false);
  const [signupStatus, setSignupStatus] = useState(false);
  const [unsaved, setUnsaved] = useState(false);

  const updateSettingsMutation = useUpdateSettingsMutation();

  useEffect(() => {
    setSignupStatus(allowSignups);
    setCommentStatus(allowComments);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdate = async () => {
    await updateSettingsMutation.mutateAsync(
      {
        token: token as string,
        allowSignups: signupStatus,
        allowComments: commentStatus,
      },
      {
        onSuccess: () => {
          setUnsaved(false);
          toast('settings saved');
        },
        onError: () => {
          toast('something went wrong');
        },
      },
    );
  };

  const handleSignupStatusChange = (val: boolean) => {
    setSignupStatus(val);
    setUnsaved(true);
  };

  const handleCommentStatusChange = (val: boolean) => {
    setCommentStatus(val);
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
    <div className="mx-auto flex max-w-screen-sm flex-col gap-2 p-4">
      <h1 className="text-lg">Settings</h1>
      <div className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-4">
        <Label htmlFor="comments">Allow New Comments</Label>
        <Switch
          id="comments"
          checked={commentStatus}
          onCheckedChange={(checked) => handleCommentStatusChange(checked)}
        />
      </div>
      <div className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-4">
        <Label htmlFor="signups">Allow Signups</Label>
        <Switch id="signups" checked={signupStatus} onCheckedChange={(checked) => handleSignupStatusChange(checked)} />
      </div>
      <Button disabled={updateSettingsMutation.isPending || !unsaved} type="button" onClick={handleUpdate}>
        Save Changes {unsaved ? '*' : ''}
      </Button>
    </div>
  );
}
