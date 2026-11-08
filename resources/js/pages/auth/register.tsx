
import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TeamInvitationAlert from '@/components/team-invitation-alert';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';
import type { TeamInvitationContext } from '@/types';

type Props = {
    passwordRules: string;
    teamInvitation?: TeamInvitationContext | null;
};

export default function Register({
    passwordRules,
    teamInvitation,
}: Props) {
    return (
        <>
            <Head title="Create Account | Your Store" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-950 text-lg font-bold text-white">
                            Y
                        </div>
                        <span className="text-lg font-bold tracking-wide text-stone-900">
                            YOUR STORE
                        </span>
                    </div>

                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                        JOIN OUR STORE
                    </span>
                </div>

                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight text-stone-900">
                        Create your account
                    </h2>
                    <p className="text-sm leading-6 text-stone-500">
                        Sign up today and discover products you'll love.
                    </p>
                </div>

                <Form
                    {...store.form()}
                    resetOnSuccess={['password', 'password_confirmation']}
                    disableWhileProcessing
                    className="space-y-4"
                >
                    {({ processing, errors }) => (
                        <>
                            {teamInvitation && (
                                <TeamInvitationAlert
                                    invitation={teamInvitation}
                                    action="Register"
                                />
                            )}

                            <div className="space-y-2">
                                <Label
                                    htmlFor="name"
                                    className="text-sm font-semibold text-stone-700"
                                >
                                    Full name
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Enter your full name"
                                    className="h-12 rounded-xl border-stone-200 bg-stone-50 px-4 focus-visible:ring-emerald-800"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="email"
                                    className="text-sm font-semibold text-stone-700"
                                >
                                    Email address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    className="h-12 rounded-xl border-stone-200 bg-stone-50 px-4 focus-visible:ring-emerald-800"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="password"
                                    className="text-sm font-semibold text-stone-700"
                                >
                                    Password
                                </Label>
                                <PasswordInput
                                    id="password"
                                    required
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Create a password"
                                    passwordrules={passwordRules}
                                    className="h-12 rounded-xl border-stone-200 bg-stone-50"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="password_confirmation"
                                    className="text-sm font-semibold text-stone-700"
                                >
                                    Confirm password
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Enter your password again"
                                    passwordrules={passwordRules}
                                    className="h-12 rounded-xl border-stone-200 bg-stone-50"
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={processing}
                                className="mt-2 h-12 w-full rounded-xl bg-emerald-950 font-semibold text-white shadow-sm transition hover:bg-emerald-900"
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                {processing
                                    ? 'Creating account...'
                                    : 'Create my account'}
                            </Button>
                        </>
                    )}
                </Form>

                <div className="border-t border-stone-100 pt-5 text-center text-sm text-stone-500">
                    Already have an account?{' '}
                    <TextLink
                        href={
                            teamInvitation
                                ? login.url({
                                      query: {
                                          invitation: teamInvitation.code,
                                      },
                                  })
                                : login()
                        }
                        className="font-bold text-emerald-800 hover:text-emerald-950"
                        data-test="team-invitation-login-link"
                    >
                        Sign in
                    </TextLink>
                </div>

                <p className="text-center text-xs text-stone-400">
                    Thank you for choosing our store.
                </p>
            </div>
        </>
    );
}

Register.layout = {
    title: 'Join our store',
    description: 'Create an account to get started with shopping.',
};
