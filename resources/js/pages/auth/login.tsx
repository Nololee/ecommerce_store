import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TeamInvitationAlert from '@/components/team-invitation-alert';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import PasskeyVerify from '@/components/passkey-verify';
import type { TeamInvitationContext } from '@/types';

type Props = {
    status?: string;
    canResetPassword: boolean;
    teamInvitation?: TeamInvitationContext | null;
};

export default function Login({
    status,
    canResetPassword,
    teamInvitation,
}: Props) {
    return (
        <>
            <Head title="Login | Your Store" />

            {teamInvitation && (
                <TeamInvitationAlert
                    invitation={teamInvitation}
                    action="Log in"
                />
            )}

            {/* <PasskeyVerify /> */}

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-950 text-lg font-bold text-white">
                            A
                        </div>
                        <span className="text-lg font-bold tracking-wide text-stone-900">
                            ARENOLO STORE
                        </span>
                    </div>

                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                        WELCOME BACK
                    </span>
                </div>

                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight text-stone-900">
                        Sign in to your account
                    </h2>
                    <p className="text-sm leading-6 text-stone-500">
                        Welcome back! Enter your details to continue shopping.
                    </p>
                </div>

                {status && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-800">
                        {status}
                    </div>
                )}

                <Form
                    {...store.form()}
                    resetOnSuccess={['password']}
                    className="space-y-5"
                >
                    {({ processing, errors }) => (
                        <>
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
                                    name="email"
                                    required
                                    autoFocus
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    className="h-12 rounded-xl border-stone-200 bg-stone-50 px-4 focus-visible:ring-emerald-800"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label
                                        htmlFor="password"
                                        className="text-sm font-semibold text-stone-700"
                                    >
                                        Password
                                    </Label>

                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="text-sm font-semibold text-emerald-800 hover:text-emerald-950"
                                        >
                                            Forgot password?
                                        </TextLink>
                                    )}
                                </div>

                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    autoComplete="current-password"
                                    placeholder="Enter your password"
                                    className="h-12 rounded-xl border-stone-200 bg-stone-50"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center gap-3">
                                <Checkbox id="remember" name="remember" />
                                <Label
                                    htmlFor="remember"
                                    className="cursor-pointer text-sm text-stone-600"
                                >
                                    Remember me
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                disabled={processing}
                                className="h-12 w-full rounded-xl bg-emerald-950 font-semibold text-white shadow-sm transition hover:bg-emerald-900"
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                {processing ? 'Signing in...' : 'Sign in'}
                            </Button>
                        </>
                    )}
                </Form>

                <div className="border-t border-stone-100 pt-5 text-center text-sm text-stone-500">
                    Don't have an account?{' '}
                    <TextLink
                        href={register({
                            query: {
                                invitation: teamInvitation?.code,
                            },
                        })}
                        className="font-bold text-emerald-800 hover:text-emerald-950"
                        data-test="register-link"
                    >
                        Create an account
                    </TextLink>
                </div>

                <p className="text-center text-xs text-stone-400">
                    Secure shopping starts here.
                </p>
            </div>
        </>
    );
}

Login.layout = {
    title: 'Welcome back',
    description: 'Sign in to your account and continue shopping.',
};
