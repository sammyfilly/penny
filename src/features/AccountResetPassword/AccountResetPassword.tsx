import Alert from 'components/Alert/Alert';
import Button from 'components/Button/Button';
import FormInput from 'components/Form/Input/Input';
import { Logo } from 'components/Logo/Logo';
import RecaptchaBranding from 'components/RecaptchaBranding/RecaptchaBranding';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  ActivateAccountMutationResponse,
  ActivateAccountMutationVariables,
  ResetPasswordMutationResponse,
  ResetPasswordMutationVariables
} from 'types/storefront';
import { useStorefrontMutation } from 'utils/storefront';
import { ActivateAccountMutation, ResetPasswordMutation } from './queries.storefront';

export interface AccountResetPasswordForm {
  password: string;
  passwordConfirm: string;
}

export interface AccountResetPasswordProps {
  customerId: string;
  resetToken?: string;
  activationToken?: string;
}

export const AccountResetPassword = ({ customerId, resetToken, activationToken }: AccountResetPasswordProps) => {
  if (!activationToken && !resetToken) {
    throw new Error('One of `activationToken` or `resetToken` is required');
  }

  const { push } = useRouter();

  const { handleSubmit, formState, control, watch } = useForm<AccountResetPasswordForm>({ mode: 'onBlur' });

  const [setResetPasswordPayload, { data: resetPasswordData }] = useStorefrontMutation<
    ResetPasswordMutationResponse,
    ResetPasswordMutationVariables
  >(ResetPasswordMutation);

  const [setActivateAccountPayload, { data: activateAccountData }] = useStorefrontMutation<
    ActivateAccountMutationResponse,
    ActivateAccountMutationVariables
  >(ActivateAccountMutation);

  const onSubmit: SubmitHandler<AccountResetPasswordForm> = useCallback(
    async ({ password }) => {
      if (activationToken) {
        setActivateAccountPayload({ variables: { id: customerId, input: { password, activationToken } } });
      }

      if (resetToken) {
        setResetPasswordPayload({ variables: { id: customerId, input: { password, resetToken } } });
      }
    },
    [activationToken, customerId, resetToken, setActivateAccountPayload, setResetPasswordPayload]
  );

  const data = resetPasswordData ?? activateAccountData;
  const hasData = Boolean(data);
  const hasErrors = (data?.customer?.customerUserErrors?.length ?? 0) > 0;
  const watched = useRef({ password: '' });
  watched.current.password = watch('password', '');

  useEffect(() => {
    if (hasData && !hasErrors) {
      setTimeout(() => push('/auth/signin'), 5000);
    }
  }, [hasData, hasErrors, push]);

  return (
    <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Logo className="h-12 w-auto" />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-body-900">
          {activationToken ? 'Activate your account' : 'Reset your password'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-background py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {hasErrors && (
              <Alert
                status="error"
                primaryText="There was a problem with your submission"
                secondaryText={data?.customer?.customerUserErrors.map((e) => e.message)}
              />
            )}

            {hasData && !hasErrors && (
              <Alert
                status="success"
                primaryText={activateAccountData ? 'Account Activated' : 'Password Reset'}
                secondaryText="You can now sign in with your new password."
              />
            )}

            {!hasData && (
              <>
                <FormInput
                  className="col-span-4"
                  control={control}
                  name="password"
                  id="password"
                  label="New Password"
                  autoComplete="new-password"
                  defaultValue=""
                  type="password"
                  rules={{
                    required: 'This field is required',
                    pattern: {
                      value: /[^\r\n]{8,}/,
                      message: 'Password is too short'
                    }
                  }}
                />

                <FormInput
                  className="col-span-4"
                  control={control}
                  name="passwordConfirm"
                  id="passwordConfirm"
                  label="Confirm New Password"
                  autoComplete="new-password"
                  defaultValue=""
                  type="password"
                  rules={{
                    required: 'This field is required',
                    validate: (value) => value === watched.current.password || 'The passwords do not match'
                  }}
                />
                <div>
                  <Button disabled={formState.isSubmitting} type="submit" color="primary" className="w-full">
                    {activationToken ? 'Activate account' : 'Reset password'}
                  </Button>
                </div>
                <RecaptchaBranding />
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
