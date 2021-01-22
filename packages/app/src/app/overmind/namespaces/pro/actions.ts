import { Action, AsyncAction } from 'app/overmind';
import { withLoadApp } from 'app/overmind/factories';
import { Step, Plan, PaymentSummary, PaymentPreview } from './types';

export const pageMounted: AsyncAction = withLoadApp();

export const setStep: Action<Step> = ({ state }, step) => {
  state.pro.step = step;
};

export const updateSeats: Action<number> = ({ state }, seats) => {
  state.pro.seats = seats;
};

export const paddleInitialised: Action<number> = ({ state }) => {
  state.pro.isPaddleInitialised = true;
};

export const billingAmountLoaded: Action<number> = ({ state }) => {
  state.pro.isBillingAmountLoaded = true;
};

export const updateSelectedPlan: Action<Plan> = ({ state }, plan) => {
  state.pro.selectedPlan = plan;
};

export const previewUpdateSubscriptionBillingInterval: AsyncAction<{
  billingInterval: Plan['billingInterval'];
}> = async ({ state, actions, effects }, { billingInterval }) => {
  try {
    const previewSummary = await effects.gql.mutations.previewUpdateSubscriptionBillingInterval(
      {
        teamId: state.activeTeam,
        subscriptionId: state.activeTeamInfo.subscription.id,
        billingInterval: billingInterval,
      }
    );

    state.pro.paymentPreview =
      previewSummary.previewUpdateSubscriptionBillingInterval;
    state.pro.isBillingAmountLoaded = true;
  } catch {
    effects.notificationToast.error(
      'There was a problem getting your billing summary. Please email us at hello@codesandbox.io'
    );
  }
};

export const updateSummary: Action<PaymentSummary> = ({ state }, summary) => {
  state.pro.summary = summary;
};

export const updateSubscriptionBillingInterval: AsyncAction<{
  billingInterval: Plan['billingInterval'];
}> = async ({ state, actions, effects }, { billingInterval }) => {
  state.pro.updatingSubscription = true;
  try {
    await effects.gql.mutations.updateSubscriptionBillingInterval({
      teamId: state.activeTeam,
      subscriptionId: state.activeTeamInfo.subscription.id,
      billingInterval: billingInterval,
    });
    state.pro.updatingSubscription = false;
    location.href = '/pro/success';
  } catch {
    state.pro.updatingSubscription = false;
    effects.notificationToast.error(
      'There was a problem updating your billing interval. Please email us at hello@codesandbox.io'
    );
  }
};
